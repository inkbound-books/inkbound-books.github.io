import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const adminSession = request.cookies.get("admin_session")
  const isAuthenticated = adminSession?.value === "authenticated"

  // Protect admin routes - redirect to admin login if not authenticated
  if (
    request.nextUrl.pathname.startsWith('/admin') &&
    !request.nextUrl.pathname.startsWith('/admin/login') &&
    !isAuthenticated
  ) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin/login'
    return NextResponse.redirect(url)
  }

  // If authenticated and trying to access login page, redirect to admin dashboard
  if (request.nextUrl.pathname === '/admin/login' && isAuthenticated) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
  ],
}
