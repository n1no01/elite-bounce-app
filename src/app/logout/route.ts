import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const cookieStore = await cookies()
  
  // Brišemo i novi i stari naziv kolačića za svaki slučaj
  cookieStore.set('athlete_session_id', '', { maxAge: 0, path: '/' })
  cookieStore.set('athlete_session', '', { maxAge: 0, path: '/' })
  cookieStore.set('admin_auth', '', { maxAge: 0, path: '/' })

  // Preusmjeravamo korisnika nazad na login stranicu
  return NextResponse.redirect(new URL('/login', request.url))
}