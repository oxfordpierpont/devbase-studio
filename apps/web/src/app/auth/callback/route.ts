import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

/**
 * GET /auth/callback
 * Handle OAuth callback and email confirmations
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') || '/dashboard'

  if (code) {
    try {
      const { error } = await supabase.auth.exchangeCodeForSession(code)

      if (error) {
        console.error('Auth callback error:', error)
        return NextResponse.redirect(
          new URL(`/auth/login?error=${encodeURIComponent(error.message)}`, request.url)
        )
      }

      // Successful authentication, redirect to dashboard or requested page
      return NextResponse.redirect(new URL(next, request.url))
    } catch (error: any) {
      console.error('Auth callback error:', error)
      return NextResponse.redirect(
        new URL(`/auth/login?error=${encodeURIComponent('Authentication failed')}`, request.url)
      )
    }
  }

  // No code present, redirect to login
  return NextResponse.redirect(new URL('/auth/login', request.url))
}
