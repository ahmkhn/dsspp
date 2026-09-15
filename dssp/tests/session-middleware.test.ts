import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

type SessionCookie = { name: string; value: string; options: { path: string } };

type CookieAdapter = {
  get?: (name: string) => string | undefined;
  getAll?: () => { name: string; value: string }[];
  set?: (name: string, value: string, options: { path: string }) => void;
  setAll?: (cookies: SessionCookie[], headers: Record<string, string>) => void;
};

const mocks = vi.hoisted(() => ({ createServerClient: vi.fn(), getUser: vi.fn() }));

vi.mock("@supabase/ssr", () => ({ createServerClient: mocks.createServerClient }));

import { updateSession } from "@/supa/supabase/middleware";

let incomingSession: string | undefined;
let refreshBatches: { cookies: SessionCookie[]; headers: Record<string, string> }[];

beforeEach(() => {
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://supabase.example.com");
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "public-test-key");
  incomingSession = undefined;
  refreshBatches = [];
  mocks.getUser.mockResolvedValue({ data: { user: null }, error: null });
  mocks.createServerClient.mockImplementation(
    (_url: string, _key: string, { cookies }: { cookies: CookieAdapter }) => ({
      auth: {
        getUser: async () => {
          incomingSession = cookies.getAll
            ? cookies.getAll().find((cookie) => cookie.name === "sb-session")?.value
            : cookies.get?.("sb-session");
          for (const batch of refreshBatches) {
            if (cookies.setAll) cookies.setAll(batch.cookies, batch.headers);
            else batch.cookies.forEach((cookie) => cookies.set?.(cookie.name, cookie.value, cookie.options));
          }
          return mocks.getUser();
        },
      },
    }),
  );
});

afterEach(() => vi.unstubAllEnvs());

describe("existing middleware session workflow", () => {
  it("allows logged-out visitors to continue to the public map", async () => {
    const response = await updateSession(new NextRequest("https://dssp.example/map"));
    expect(mocks.getUser).toHaveBeenCalledOnce();
    expect(response.headers.get("location")).toBeNull();
    expect(response.headers.get("x-middleware-next")).toBe("1");
  });

  it("forwards a refreshed session to both the current request and browser response", async () => {
    refreshBatches = [{
      cookies: [{ name: "sb-session", value: "refreshed-session", options: { path: "/" } }],
      headers: { "cache-control": "private, no-store" },
    }];
    const request = new NextRequest("https://dssp.example/map", {
      headers: { cookie: "sb-session=old-session" },
    });
    const response = await updateSession(request);
    expect(incomingSession).toBe("old-session");
    expect(request.cookies.get("sb-session")?.value).toBe("refreshed-session");
    expect(response.cookies.get("sb-session")?.value).toBe("refreshed-session");
    expect(response.headers.get("x-middleware-request-cookie")).toContain(
      "sb-session=refreshed-session",
    );
  });

  it("keeps every cookie chunk and refresh cache header across multiple writes", async () => {
    refreshBatches = [
      {
        cookies: [
          { name: "sb-session.0", value: "first-version", options: { path: "/" } },
          { name: "sb-session.1", value: "second-chunk", options: { path: "/" } },
        ],
        headers: { "cache-control": "private, no-store", pragma: "no-cache" },
      },
      {
        cookies: [
          { name: "sb-session.0", value: "latest-version", options: { path: "/" } },
          { name: "sb-session.2", value: "third-chunk", options: { path: "/" } },
        ],
        headers: {},
      },
    ];

    const request = new NextRequest("https://dssp.example/map");
    const response = await updateSession(request);
    for (const [name, value] of [
      ["sb-session.0", "latest-version"],
      ["sb-session.1", "second-chunk"],
      ["sb-session.2", "third-chunk"],
    ]) {
      expect(request.cookies.get(name)?.value).toBe(value);
      expect(response.cookies.get(name)?.value).toBe(value);
      expect(response.headers.get("x-middleware-request-cookie")).toContain(`${name}=${value}`);
    }
    expect(response.cookies.getAll()).toHaveLength(3);
    expect(response.headers.get("cache-control")).toBe("private, no-store");
    expect(response.headers.get("pragma")).toBe("no-cache");
  });
});
