import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  createClient: vi.fn(),
  revalidatePath: vi.fn(),
  redirect: vi.fn((url: string): never => {
    // Next redirects throw, so code after a redirect must not continue.
    throw new Error(`NEXT_REDIRECT:${url}`);
  }),
  getURL: vi.fn(),
  auth: {
    signInWithPassword: vi.fn(),
    signUp: vi.fn(),
    signOut: vi.fn(),
    signInWithOAuth: vi.fn(),
  },
}));

vi.mock("@/utils/supabase/server", () => ({ createClient: mocks.createClient }));
vi.mock("next/cache", () => ({ revalidatePath: mocks.revalidatePath }));
vi.mock("next/navigation", () => ({ redirect: mocks.redirect }));
vi.mock("@/utils/helpers", () => ({ getURL: mocks.getURL }));

import { emailLogin, oAuthSignIn, signOut, signup } from "@/app/login/actions";

function credentials() {
  const form = new FormData();
  form.set("email", "researcher@example.com");
  form.set("password", "test-password-only");
  return form;
}

beforeEach(() => {
  // Promise-returning clients model the async Next.js cookies migration.
  mocks.createClient.mockResolvedValue({ auth: mocks.auth });
  mocks.getURL.mockReturnValue("https://dssp.example/auth/callback");
  mocks.auth.signInWithPassword.mockResolvedValue({ error: null });
  mocks.auth.signUp.mockResolvedValue({ error: null });
  mocks.auth.signOut.mockResolvedValue({ error: null });
  mocks.auth.signInWithOAuth.mockResolvedValue({
    data: { url: "https://accounts.example.com/authorize" },
    error: null,
  });
});

describe("existing email authentication workflow", () => {
  it("signs in with the submitted credentials, refreshes layout data, and opens the map", async () => {
    await expect(emailLogin(credentials())).rejects.toThrow("NEXT_REDIRECT:/map");
    expect(mocks.auth.signInWithPassword).toHaveBeenCalledWith({
      email: "researcher@example.com",
      password: "test-password-only",
    });
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/", "layout");
  });

  it("returns a rejected login to the existing error URL without refreshing data", async () => {
    mocks.auth.signInWithPassword.mockResolvedValue({ error: { message: "Invalid credentials" } });
    await expect(emailLogin(credentials())).rejects.toThrow(
      "NEXT_REDIRECT:/login?message=Could not authenticate user",
    );
    expect(mocks.revalidatePath).not.toHaveBeenCalled();
  });

  it("registers with the same fields and returns to login", async () => {
    await expect(signup(credentials())).rejects.toThrow("NEXT_REDIRECT:/login");
    expect(mocks.auth.signUp).toHaveBeenCalledWith({
      email: "researcher@example.com",
      password: "test-password-only",
    });
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/", "layout");
  });

  it("preserves the registration failure redirect", async () => {
    mocks.auth.signUp.mockResolvedValue({ error: { message: "Registration unavailable" } });
    await expect(signup(credentials())).rejects.toThrow(
      "NEXT_REDIRECT:/login?message=Error signing up",
    );
    expect(mocks.revalidatePath).not.toHaveBeenCalled();
  });

  it("signs out before returning to login", async () => {
    await expect(signOut()).rejects.toThrow("NEXT_REDIRECT:/login");
    expect(mocks.auth.signOut).toHaveBeenCalledOnce();
    expect(mocks.auth.signOut.mock.invocationCallOrder[0]).toBeLessThan(
      mocks.redirect.mock.invocationCallOrder[0],
    );
  });
});

describe("existing Google OAuth workflow", () => {
  it("rejects a missing provider before creating an auth client", async () => {
    await expect(oAuthSignIn(undefined as never)).rejects.toThrow(
      "NEXT_REDIRECT:/login?message=No provider selected",
    );
    expect(mocks.createClient).not.toHaveBeenCalled();
    expect(mocks.auth.signInWithOAuth).not.toHaveBeenCalled();
  });

  it("uses the configured callback and redirects to the provider URL", async () => {
    await expect(oAuthSignIn("google")).rejects.toThrow(
      "NEXT_REDIRECT:https://accounts.example.com/authorize",
    );
    expect(mocks.getURL).toHaveBeenCalledWith("/auth/callback");
    expect(mocks.auth.signInWithOAuth).toHaveBeenCalledWith({
      provider: "google",
      options: { redirectTo: "https://dssp.example/auth/callback" },
    });
  });

  it("returns OAuth errors to login", async () => {
    mocks.auth.signInWithOAuth.mockResolvedValue({
      data: { url: null },
      error: { message: "Provider unavailable" },
    });
    await expect(oAuthSignIn("google")).rejects.toThrow(
      "NEXT_REDIRECT:/login?message=Could not authenticate user",
    );
  });
});
