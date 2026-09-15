import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request: { headers: request.headers } });
  // A refresh may write several cookie chunks, or more than one batch.
  const pendingCookies = new Map<string, { value: string; options: CookieOptions }>();
  const refreshHeaders = new Headers();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            pendingCookies.set(name, { value, options });
          });
          Object.entries(headers).forEach(([name, value]) => refreshHeaders.set(name, value));
          response = NextResponse.next({ request: { headers: request.headers } });
          pendingCookies.forEach(({ value, options }, name) => {
            response.cookies.set(name, value, options);
          });
          refreshHeaders.forEach((value, name) => response.headers.set(name, value));
        },
      },
    },
  );

  // Keep the existing server-verified session refresh and public-route policy.
  await supabase.auth.getUser();
  return response;
}
