import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/** The signed-in user for a /api/predictor/* route handler, read from the Supabase auth cookie. */
export async function getPredictorUser() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key",
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          } catch {
            // Route handlers can't always set cookies outside a response; harmless to skip.
          }
        },
      },
    }
  );
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}
