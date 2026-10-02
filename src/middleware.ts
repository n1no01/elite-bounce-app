import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const athleteSession = request.cookies.get('athlete_session')
  const adminSession = request.cookies.get('admin_auth')

  // Zaštita za /exercises (potreban ili athlete ili admin cookie)
  if (pathname.startsWith('/exercises')) {
    if (!athleteSession && !adminSession) {
      return NextResponse.redirect(new URL('/login', request.nextUrl))
    }
  }

  // Zaštita za /admin rute (osim /admin/login)
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    if (!adminSession) {
      return NextResponse.redirect(new URL('/admin/login', request.nextUrl))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/exercises/:path*', '/admin/:path*'],
}