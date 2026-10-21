The NEET PG Institutions & Fees page (`/neet-pg/institutions`) reads compact per-year files from `public/data/neet/institutions/`:

- `pg.json` — index: years, row totals, rounds per year, reservation tags.
- `pg-<year>.json` — dictionaries (college, state, course, category, quota) plus rows of
  `[college, state, course, category, quota, counselling (0 AIQ / 1 STATE), tagBitmask, fee, ...closing ranks]`.

Source: Predico's institutions API (`api.predico.co.in/api/v1/institutions?exam_type=pg&year=<y>&page=<n>&limit=1000`), fetched from inside a logged-in session on 2026-10-21. The raw export lives in `.predico/raw/predico-pg.json` (git-ignored) with rows
`[college_id, college, state, course, category, tags[], quota, counselling_type, fee, fee_display, ...ranks]`.

Coverage: 2025 (42,043 rows, R1–R5) and 2024 (36,974 rows, R1–R6), both complete. 2023 (34,435 rows, R1–R7) not captured. UG is not available from the account used.

Rebuild after a new export:

```sh
npm run import:predico
node --test scripts/import-predico.test.mjs
```

The importer refuses a year whose captured row count differs from the source total.
