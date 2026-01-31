import { NextRequest, NextResponse } from 'next/server'
import { updateSession } from './lib/supabase/proxy' 

export const middleware = async (request: NextRequest) => {
  // Make sure env vars exist
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error('Supabase URL or anon key missing in environment variables')
  }

  return await updateSession(request)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}