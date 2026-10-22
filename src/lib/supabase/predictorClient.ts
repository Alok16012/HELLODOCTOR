import { createBrowserClient } from "@supabase/ssr";

// Untyped browser client for the public NEET predictor's own account/payment
// tables (predictor_orders, predictor_unlocks — see supabase/predictor_auth_setup.sql).
// Kept separate from the CRM's typed `Database` (src/types/database.types.ts) so this
// narrow feature doesn't need that file regenerated. It still shares the same Supabase
// project and auth cookies as the typed client, since @supabase/ssr keys storage by
// project URL.
export function createPredictorClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key"
  );
}
