import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

// Only the CRM (/crm/...) needs auth. The public Hello Doctor website is
// excluded by the matcher at the bottom of this file.
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Public short links (invoice PDFs shared on WhatsApp) — no auth
  if (pathname.startsWith('/crm/i/')) {
    return NextResponse.next()
  }

  // If Supabase is not configured yet, let requests through; CRM pages will
  // surface their own error.
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.next()
  }

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
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
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const isCrmEntry       = pathname === '/crm' || pathname === '/crm/'
  const isStudentRoute   = pathname.startsWith('/crm/student/') && pathname !== '/crm/student/login'
  const isStudentLogin   = pathname === '/crm/student/login'
  const isAdminLogin     = pathname === '/crm/login' || isCrmEntry
  const isAssociateRoute = pathname.startsWith('/crm/associate') && !pathname.startsWith('/crm/associates')
  const isAdminRoute     = !isStudentRoute && !isAssociateRoute && !isAdminLogin && !isStudentLogin

  const go = (path: string) => NextResponse.redirect(new URL(path, request.url))

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    let role = profile?.role

    // Fallback: if no profile row, check students table
    if (!role) {
      const { data: studentRecord } = await supabase
        .from('students')
        .select('id')
        .eq('portal_user_id', user.id)
        .maybeSingle()
      if (studentRecord) role = 'student'
    }

    // Logged in on Supabase but not a CRM user (e.g. a website-CMS-only admin)
    if (!role) {
      if (isAdminLogin || isStudentLogin) return response
      return go('/crm/login?error=no_profile')
    }

    // Student → always go to student portal
    if (role === 'student' && !isStudentRoute && !isStudentLogin) {
      return go('/crm/student/dashboard')
    }
    if (role !== 'student' && isStudentRoute) {
      return go(role === 'associate' ? '/crm/associate' : '/crm/dashboard')
    }

    // Associate → always go to /crm/associate, never admin area
    if (role === 'associate' && isAdminRoute) {
      return go('/crm/associate')
    }

    // Bounce logged-in users off login pages
    if (isAdminLogin) {
      if (role === 'student')   return go('/crm/student/dashboard')
      if (role === 'associate') return go('/crm/associate')
      return go('/crm/dashboard')
    }
    if (isStudentLogin && role === 'student') {
      return go('/crm/student/dashboard')
    }
  } else {
    // Unauthenticated
    if (isStudentRoute) {
      return go('/crm/student/login')
    }
    if (isCrmEntry) {
      return go('/crm/login')
    }
    if (!isAdminLogin && !isStudentLogin) {
      return go('/crm/login')
    }
  }

  return response
}

export const config = {
  matcher: ['/crm', '/crm/:path*'],
}
