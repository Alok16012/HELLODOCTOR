# Environment variables

No `.env` file is committed to this repo (see `.gitignore`). Create a local
`.env.local` with these names for `npm run dev`, and set the same names in
your host's environment variables (Netlify/Vercel) for deploys.

```bash
# ── Supabase (shared by the public site and the CRM) ───────────────────────
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
# Server-only — never exposed to the browser. Used by /api/admin/*,
# /api/students/*, and the NEET predictor's /api/predictor/* payment routes.
SUPABASE_SERVICE_ROLE_KEY=

# ── NEET predictor "latest cutoff news" panel (Google Custom Search) ───────
GOOGLE_API_KEY=
GOOGLE_CSE_CX=

# ── NEET predictor payment unlock (Razorpay) ────────────────────────────────
# From the Razorpay Dashboard → Settings → API Keys. Use the Test Mode keys
# while developing; switch to Live Mode keys only once you're ready to accept
# real payments.
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
# Price to unlock the full predictor report, in paise. Optional — defaults
# to 4900 (₹49) if unset.
PREDICTOR_UNLOCK_AMOUNT_PAISE=4900
```

Also run `supabase/predictor_auth_setup.sql` once against the Supabase
project (SQL editor or `psql`) before the Razorpay unlock feature works —
it creates the `predictor_orders` and `predictor_unlocks` tables.
