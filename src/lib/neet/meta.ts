// Shared NEET UG/PG metadata for the /neet-ug and /neet-pg hubs. Client-safe.
//
// Cut-off rows come from official MCC allotment results (see .mcc/ build scripts):
//   UG: [collegeId, year, round, quota, course, category, openingRank, closingRank, seats]
//   PG: [collegeId, year, round, quota, degree, branch, category, openingRank, closingRank, seats]
// Round 4 = stray vacancy round.

export type Exam = "ug" | "pg";
export type ExamSlug = "neet-ug" | "neet-pg";

export const EXAM_SLUGS: ExamSlug[] = ["neet-ug", "neet-pg"];
export const examFromSlug = (s: string): Exam | null => (s === "neet-ug" ? "ug" : s === "neet-pg" ? "pg" : null);

export interface UgCollege {
  id: number;
  slug: string;
  name: string;
  state: string | null;
  type: string;
  courses: string[];
  seats: Record<string, number>;
  code: string | null;
}

export interface PgCollege {
  id: number;
  slug: string;
  name: string;
  state: string | null;
  /** Only DNB (NBEMS) seats — usually a private/trust hospital. */
  dnb: boolean;
  branches: number;
}

export type UgRow = [number, number, number, string, string, string, number, number, number];
export type PgRow = [number, number, number, string, string, string, string, number, number, number];

/** A cut-off row in one shape for both exams: `course` is MBBS/BDS (UG) or the branch (PG). */
export interface Cutoff {
  college: number;
  year: number;
  round: number;
  quota: string;
  degree: string;
  course: string;
  category: string;
  opening: number;
  closing: number;
  seats: number;
}

export function toCutoff(exam: Exam, r: UgRow | PgRow): Cutoff {
  if (exam === "ug") {
    const [college, year, round, quota, course, category, opening, closing, seats] = r as UgRow;
    return { college, year, round, quota, degree: course, course, category, opening, closing, seats };
  }
  const [college, year, round, quota, degree, course, category, opening, closing, seats] = r as PgRow;
  return { college, year, round, quota, degree, course, category, opening, closing, seats };
}

export const EXAM = {
  ug: {
    slug: "neet-ug" as ExamSlug,
    label: "NEET UG",
    courses: "MBBS & BDS",
    years: [2026, 2025, 2024],
    latestYear: 2026,
    counselling: "MCC 15% All India Quota, AIIMS, JIPMER, Central & Deemed Universities",
  },
  pg: {
    slug: "neet-pg" as ExamSlug,
    label: "NEET PG",
    courses: "MD, MS, DNB & Diploma",
    years: [2025, 2024, 2023],
    latestYear: 2025,
    counselling: "MCC 50% All India Quota, Deemed & Central Universities and DNB (NBEMS) seats",
  },
} as const;

export const ROUND_LABEL: Record<number, string> = { 1: "Round 1", 2: "Round 2", 3: "Round 3", 4: "Stray Round" };

export const QUOTA_LABEL: Record<string, string> = {
  AI: "All India Quota",
  OS: "Open Seat (AIIMS / JIPMER)",
  DM: "Deemed / Paid Seats",
  DN: "DNB (NBEMS) Seats",
  IQ: "Central / Internal University Quota",
  ES: "ESI Insured Persons Quota",
  NR: "NRI Quota",
};

/** Quotas any candidate can compete for (no domicile / NRI / ESI eligibility needed). */
export const OPEN_QUOTAS: Record<Exam, string[]> = { ug: ["AI", "OS", "DM"], pg: ["AI", "DN", "DM"] };

export const CATEGORY_LABEL: Record<string, string> = {
  GN: "General (UR)",
  EWS: "EWS",
  OBC: "OBC-NCL",
  SC: "SC",
  ST: "ST",
  "GN-PwD": "UR-PwD",
  "EWS-PwD": "EWS-PwD",
  "OBC-PwD": "OBC-PwD",
  "SC-PwD": "SC-PwD",
  "ST-PwD": "ST-PwD",
};
export const MAIN_CATEGORIES = ["GN", "EWS", "OBC", "SC", "ST"];

export const TYPE_LABEL: Record<string, string> = {
  Government: "Government",
  AIIMS: "AIIMS",
  JIPMER: "JIPMER",
  "Central University": "Central University",
  Deemed: "Deemed University",
  ESIC: "ESIC",
};

export const fmtRank = (n: number) => n.toLocaleString("en-IN");

// ── Prediction ───────────────────────────────────────────────────────────────

export type Chance = "Safe" | "Moderate" | "Risky" | "Dream";
export const CHANCES: Chance[] = ["Safe", "Moderate", "Risky", "Dream"];

/** Safe: well inside last year's closing rank · Moderate: close · Risky: just outside · Dream: far. */
export function chanceFor(rank: number, closing: number): Chance | null {
  const r = rank / closing;
  if (r <= 0.85) return "Safe";
  if (r <= 1) return "Moderate";
  if (r <= 1.25) return "Risky";
  if (r <= 1.6) return "Dream";
  return null;
}

/** Categories whose seats a candidate can get: open (UR) seats plus their own reserved seats. */
export function eligibleCategories(category: string): string[] {
  return category === "GN" ? ["GN"] : ["GN", category];
}

// State-quota (85% UG / 50% PG) closing ranks aren't published by MCC. Until state
// data is added, estimate them from the same college's AIQ closing rank.
export const STATE_QUOTA_FACTOR = 1.5;

export interface Prediction {
  college: number;
  quota: string;
  degree: string;
  course: string;
  /** Closing rank used for the chance (best of open/own category), latest year rounds 1–3. */
  closing: number;
  category: string;
  /** Same college/course/quota closing rank one year earlier, if any. */
  previous: number | null;
  chance: Chance;
  estimated: boolean;
}

interface PredictOptions {
  rank: number;
  category: string;
  quota: "aiq" | "state";
  state?: string;
  year: number;
  /** college id -> state, used for state-quota estimates */
  collegeState: Map<number, string | null>;
  collegeType?: Map<number, string>;
}

/**
 * Match a rank against the latest year's closing ranks (rounds 1–3; stray rounds are
 * too irregular to plan with). Returns one entry per college × course × quota.
 */
export function predict(exam: Exam, rows: Cutoff[], o: PredictOptions): Prediction[] {
  const cats = eligibleCategories(o.category);
  const best = new Map<string, { closing: number; category: string }>();
  const prev = new Map<string, number>();
  for (const r of rows) {
    if (r.round > 3 || !cats.includes(r.category)) continue;
    if (o.quota === "aiq" ? !OPEN_QUOTAS[exam].includes(r.quota) : r.quota !== "AI") continue;
    if (o.quota === "state") {
      if (o.collegeState.get(r.college) !== o.state) continue;
      if (o.collegeType && o.collegeType.get(r.college) !== "Government") continue;
    }
    const key = `${r.college}|${r.quota}|${r.degree}|${r.course}`;
    if (r.year === o.year) {
      const cur = best.get(key);
      if (!cur || r.closing > cur.closing) best.set(key, { closing: r.closing, category: r.category });
    } else if (r.year === o.year - 1) {
      prev.set(key, Math.max(prev.get(key) ?? 0, r.closing));
    }
  }
  const out: Prediction[] = [];
  for (const [key, b] of best) {
    const [college, quota, degree, course] = key.split("|");
    const closing = o.quota === "state" ? Math.round(b.closing * STATE_QUOTA_FACTOR) : b.closing;
    const chance = chanceFor(o.rank, closing);
    if (!chance) continue;
    out.push({
      college: Number(college), quota: o.quota === "state" ? "SQ" : quota, degree, course, closing,
      category: b.category, previous: prev.get(key) ?? null, chance, estimated: o.quota === "state",
    });
  }
  return out.sort((a, b) => CHANCES.indexOf(a.chance) - CHANCES.indexOf(b.chance) || a.closing - b.closing);
}
