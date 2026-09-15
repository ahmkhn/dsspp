import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

type SessionCookie = {
  name: string;
  value: string;
  options?: { path?: string; httpOnly?: boolean };
};

type CookieAdapter = {
  get?: (name: string) => string | undefined;
  getAll?: () => { name: string; value: string }[];
  set?: (name: string, value: string, options: SessionCookie["options"]) => void;
  setAll?: (cookies: SessionCookie[], headers: Record<string, string>) => void;
};

const mocks = vi.hoisted(() => ({
  cookies: vi.fn(),
  createServerClient: vi.fn(),
  exchangeCodeForSession: vi.fn(),
}));

vi.mock("next/headers", () => ({ cookies: mocks.cookies }));
vi.mock("@supabase/ssr", () => ({ createServerClient: mocks.createServerClient }));

import { GET } from "@/app/auth/callback/route";

let cookieValues: Map<string, string>;
let observedVerifier: string | undefined;

beforeEach(() => {
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://supabase.example.com");
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "public-test-key");
  cookieValues = new Map([["sb-code-verifier", "pkce-verifier"]]);
  observedVerifier = undefined;
  mocks.cookies.mockResolvedValue({
    get: (name: string) => ({ name, value: cookieValues.get(name) }),
    getAll: () => Array.from(cookieValues, ([name, value]) => ({ name, value })),
    set: (cookieOrName: string | SessionCookie, value?: string) => {
      if (typeof cookieOrName === "string") cookieValues.set(cookieOrName, value!);
      else cookieValues.set(cookieOrName.name, cookieOrName.value);
    },
    delete: (cookie: { name: string }) => cookieValues.delete(cookie.name),
  });
  mocks.exchangeCodeForSession.mockResolvedValue({ error: null });
  mocks.createServerClient.mockImplementation(
    (_url: string, _key: string, { cookies }: { cookies: CookieAdapter }) => ({
      auth: {
        exchangeCodeForSession: async (code: string) => {
          // Exercise the adapter instead of bypassing the async cookie store.
          observedVerifier = cookies.getAll
            ? cookies.getAll().find((cookie) => cookie.name === "sb-code-verifier")?.value
            : cookies.get?.("sb-code-verifier");
          const result = await mocks.exchangeCodeForSession(code);
          if (!result.error) {
            const sessionCookie = {
              name: "sb-session",
              value: "test-session",
              options: { path: "/", httpOnly: true },
            };
            if (cookies.setAll) cookies.setAll([sessionCookie], { "cache-control": "private, no-store" });
            else cookies.set?.(sessionCookie.name, sessionCookie.value, sessionCookie.options);
          }
          return result;
        },
      },
    }),
  );
});

afterEach(() => vi.unstubAllEnvs());

describe("OAuth callback", () => {
  it("exchanges the code, reads the verifier cookie, stores the session, and opens the map", async () => {
    const response = await GET(new Request("https://dssp.example/auth/callback?code=test-code"));
    expect(mocks.exchangeCodeForSession).toHaveBeenCalledWith("test-code");
    expect(observedVerifier).toBe("pkce-verifier");
    expect(cookieValues.get("sb-session")).toBe("test-session");
    expect(response.headers.get("location")).toBe("https://dssp.example/map");
    expect(response.headers.get("cache-control")).toBe("private, no-store");
    expect(response.status).toBe(307);
  });

  it("keeps a requested local destination after successful sign-in", async () => {
    const response = await GET(
      new Request("https://dssp.example/auth/callback?code=test-code&next=%2Fabout"),
    );
    expect(response.headers.get("location")).toBe("https://dssp.example/about");
  });

  it.each([
    "https://evil.example/path",
    "@evil.example",
    ".evil.example",
    "//evil.example/path",
    "/\\evil.example/path",
    "\\evil.example/path",
  ])("falls back to the map for an unsafe callback destination: %s", async (next) => {
    const url = new URL("https://dssp.example/auth/callback");
    url.searchParams.set("code", "test-code");
    url.searchParams.set("next", next);
    const response = await GET(new Request(url));
    expect(mocks.exchangeCodeForSession).toHaveBeenCalledWith("test-code");
    expect(response.headers.get("location")).toBe("https://dssp.example/map");
  });

  it("returns a missing code to the existing login failure URL without contacting auth", async () => {
    const response = await GET(new Request("https://dssp.example/auth/callback"));
    const destination = new URL(response.headers.get("location")!);
    expect(destination.origin).toBe("https://dssp.example");
    expect(destination.pathname).toBe("/login");
    expect(destination.searchParams.get("message")).toBe("Could not login with provider");
    expect(mocks.exchangeCodeForSession).not.toHaveBeenCalled();
  });

  it("returns a rejected code to login without a new session cookie", async () => {
    mocks.exchangeCodeForSession.mockResolvedValue({ error: { message: "Expired code" } });
    const response = await GET(new Request("https://dssp.example/auth/callback?code=expired"));
    const destination = new URL(response.headers.get("location")!);
    expect(destination.pathname).toBe("/login");
    expect(destination.searchParams.get("message")).toBe("Could not login with provider");
    expect(cookieValues.has("sb-session")).toBe(false);
  });
});
