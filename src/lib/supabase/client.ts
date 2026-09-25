import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database.types'

// Placeholder fallbacks keep `next build` working when env vars are absent
// (e.g. first deploy before env is configured). Real values MUST be set in
// the host's environment variables for the app to actually work.
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'
  )
}
