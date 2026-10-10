import ugColleges from "@/data/neet/ug-colleges.json";
import pgColleges from "@/data/neet/pg-colleges.json";
import ugRows from "@/data/neet/ug-cutoffs.json";
import pgRows from "@/data/neet/pg-cutoffs.json";
import { toCutoff, type Cutoff, type Exam, type PgCollege, type PgRow, type UgCollege, type UgRow } from "./meta";

export function getColleges(exam: Exam): (UgCollege | PgCollege)[] {
  return (exam === "ug" ? ugColleges : pgColleges) as (UgCollege | PgCollege)[];
}

export function getCollege(exam: Exam, slug: string) {
  return getColleges(exam).find((c) => c.slug === slug) ?? null;
}

export function getCollegeCutoffs(exam: Exam, id: number): Cutoff[] {
  const rows = (exam === "ug" ? ugRows : pgRows) as (UgRow | PgRow)[];
  return rows.filter((r) => r[0] === id).map((r) => toCutoff(exam, r));
}

/** Counts for the hub landing page. */
export function getStats(exam: Exam) {
  const cols = getColleges(exam);
  const rows = (exam === "ug" ? ugRows : pgRows) as unknown[][];
  const states = new Set(cols.map((c) => c.state).filter(Boolean));
  const seats = exam === "ug" ? (cols as UgCollege[]).reduce((s, c) => s + Object.values(c.seats).reduce((a, b) => a + b, 0), 0) : null;
  return { colleges: cols.length, cutoffRows: rows.length, states: states.size, seats };
}

/** College list with one headline closing rank each (latest year, rounds 1–3, UR, open quotas). */
export function getDirectory(exam: Exam) {
  const latest = exam === "ug" ? 2026 : 2025;
  const rows = (exam === "ug" ? ugRows : pgRows) as (UgRow | PgRow)[];
  const open = exam === "ug" ? ["AI", "OS", "DM"] : ["AI", "DN", "DM"];
  const best = new Map<string, number>();   // `${college}|${course}` -> closing
  for (const raw of rows) {
    const r = toCutoff(exam, raw);
    if (r.year !== latest || r.round > 3 || r.category !== "GN" || !open.includes(r.quota)) continue;
    const k = `${r.college}|${r.course}`;
    best.set(k, Math.max(best.get(k) ?? 0, r.closing));
  }
  return getColleges(exam).map((college) => {
    let headline: { label: string; rank: number } | null = null;
    if (exam === "ug") {
      for (const course of ["MBBS", "BDS"]) {
        const v = best.get(`${college.id}|${course}`);
        if (v) { headline = { label: `UR ${course} ${latest}`, rank: v }; break; }
      }
    } else {
      // best (lowest) closing rank among this institute's branches
      let min = Infinity;
      for (const [k, v] of best) if (k.startsWith(`${college.id}|`) && v < min) min = v;
      if (min < Infinity) headline = { label: `Top branch UR ${latest}`, rank: min };
    }
    return { college, headline };
  });
}
