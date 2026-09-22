import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { createClient } from '@supabase/supabase-js'

// Called by the admin panel after every content change so the public site refreshes immediately.
export async function POST(req: Request) {
  const token = req.headers.get('authorization')?.replace(/^Bearer /, '')
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { global: { headers: { Authorization: `Bearer ${token}` } } }
  )
  const { data: isAdmin, error } = await supabase.rpc('is_admin')
  if (error || !isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  revalidatePath('/', 'layout')
  return NextResponse.json({ ok: true })
}
