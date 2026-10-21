import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve, join } from "node:path";

// Converts a raw Predico institutions export into compact per-year files.
// Raw row: [college_id, college, state, course, category, tags[], quota, counselling_type, fee, fee_display, ...ranks]
const input = resolve(process.argv[2] || ".predico/raw/predico-pg.json");
const outDir = resolve(process.argv[3] || "public/data/neet/institutions");
const raw = JSON.parse(readFileSync(input, "utf8"));
if (raw.exam !== "pg" || raw.source !== "https://app.predico.co.in/institutions") throw new Error("Unexpected source or exam");

const COUNSELLING = ["AIQ", "STATE"];
const tags = [...new Set(Object.values(raw.years).flatMap(y => y.rows.flatMap(r => r[5])))].sort();
if (tags.length > 30) throw new Error("Too many tags for bitmask");
const rank = value => {
  if (value === null || value === undefined) return null;
  if (!Number.isSafeInteger(value) || value < 1) throw new Error(`Invalid closing rank: ${value}`);
  return value;
};

mkdirSync(outDir, { recursive: true });
const index = { source: raw.source, capturedAt: raw.capturedAt, exam: "pg", tags, counselling: COUNSELLING, years: [] };
for (const year of Object.keys(raw.years).map(Number).sort((a, b) => b - a)) {
  const { rows, rounds, total } = raw.years[year];
  if (rows.length !== total) throw new Error(`${year}: captured ${rows.length} of ${total}`);
  const dicts = { college: new Map(), state: new Map(), course: new Map(), category: new Map(), quota: new Map() };
  const id = (name, value) => {
    if (typeof value !== "string" || !value.trim()) throw new Error(`Empty ${name} in ${year}`);
    const map = dicts[name];
    if (!map.has(value)) map.set(value, map.size);
    return map.get(value);
  };
  const out = rows.map(row => {
    const [, college, state, course, category, rowTags, quota, counselling, fee, feeDisplay, ...ranks] = row;
    if (ranks.length !== rounds.length) throw new Error(`${year}: round count mismatch`);
    const ct = COUNSELLING.indexOf(counselling);
    if (ct < 0) throw new Error(`Unknown counselling type ${counselling}`);
    const mask = rowTags.reduce((m, t) => m | (1 << tags.indexOf(t)), 0);
    return [id("college", college), id("state", state), id("course", course), id("category", category), id("quota", quota), ct, mask,
      feeDisplay || (typeof fee === "number" ? fee : null), ...ranks.map(rank)];
  });
  const d = Object.fromEntries(Object.entries(dicts).map(([k, m]) => [k, [...m.keys()]]));
  writeFileSync(join(outDir, `pg-${year}.json`), JSON.stringify({ year, rounds, d, rows: out }));
  index.years.push({ year, total, rounds });
}
writeFileSync(join(outDir, "pg.json"), JSON.stringify(index));
console.log(JSON.stringify(index.years));
