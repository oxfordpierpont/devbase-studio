import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Middleware - Authentication and Security
 * Protects routes and adds security headers
 */

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Add security headers to all responses
  const response = NextResponse.next()

  // Security headers
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=()'
  )

  // Content Security Policy
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://*.supabase.co;"
  )

  // Protected routes that require authentication
  const protectedRoutes = ['/dashboard', '/builder']
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))

  if (isProtectedRoute) {
    // Check for auth token in cookies
    const token = request.cookies.get('sb-access-token')

    if (!token) {
      // Redirect to login if not authenticated
      const loginUrl = new URL('/auth/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Validate token format (basic check)
    if (token.value.length < 20) {
      const loginUrl = new URL('/auth/login', request.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  // Rate limiting headers (informational)
  response.headers.set('X-RateLimit-Limit', '100')
  response.headers.set('X-RateLimit-Remaining', '99')

  return response
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
