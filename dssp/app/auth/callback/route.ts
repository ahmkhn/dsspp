import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    // if "next" is in param, use it as the redirect URL
    const requestedNext = searchParams.get('next') ?? '/map'
    const next = requestedNext.startsWith('/') && !requestedNext.startsWith('//') && !requestedNext.includes('\\')
        ? requestedNext
        : '/map'
    const refreshHeaders = new Headers()

    if (code) {
        const cookieStore = await cookies()
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return cookieStore.getAll()
                    },
                    setAll(cookiesToSet, headers) {
                        cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
                        Object.entries(headers).forEach(([name, value]) => refreshHeaders.set(name, value))
                    },
                },
            }
        )
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (!error) {
            return NextResponse.redirect(`${origin}${next}`, { headers: refreshHeaders })
        }
    }

    // return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/login?message=Could not login with provider`, { headers: refreshHeaders })
}
