import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: DO NOT REMOVE auth.getUser()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Check if user is trying to access protected admin routes
  const isAdminRoute = request.nextUrl.pathname.startsWith('/dpt-admin')
  const isAuthRoute = request.nextUrl.pathname.startsWith('/dpt-admin/auth')
  const isErrorRoute = request.nextUrl.pathname.startsWith('/error')

  // Redirect to login if:
  // - No user is logged in
  // - Trying to access admin routes
  // - NOT already on auth or error pages
  if (!user && isAdminRoute && !isAuthRoute && !isErrorRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/dpt-admin/auth/login'
    return NextResponse.redirect(url)
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  return supabaseResponse
}