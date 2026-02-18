import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server' // your server.ts

export async function POST(req: Request) {
  const { name, email, subject, message } = await req.json()

  if (!name || !email || !message) {
    return NextResponse.json({ status: 'error', message: 'Missing required fields' }, { status: 400 })
  }

  const supabase = await createClient()

  const { error } = await supabase
    .from('contact_messages')
    .insert({ name, email, subject, message })

  if (error) {
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 })
  }

  return NextResponse.json({ status: 'success', message: 'Message sent!' })
}
