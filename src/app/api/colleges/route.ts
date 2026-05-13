import { NextResponse } from 'next/server'
import { supabase, mapCollege } from '@/lib/supabase'

export async function GET() {
  const { data, error } = await supabase
    .from('colleges')
    .select('*')
    .order('nirf', { ascending: true, nullsFirst: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const colleges = (data || []).map(mapCollege)
  return NextResponse.json(colleges)
}
