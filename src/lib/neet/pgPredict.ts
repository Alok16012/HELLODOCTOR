import { chanceFor, type Chance } from "@/lib/neet/meta";
import type { Institution } from "@/lib/neet/institutions";

export type Counselling = "AIQ" | "STATE";

export interface PgSelection {
  counselling: Counselling | "";
  /** Only used for state counselling. */
  states: string[];
  quota: string;
  category: string;
  /** Reservation tags the candidate holds (PWD, InService…); rows needing other tags are skipped. */
  tags: string[];
}

export const EMPTY_SELECTION: PgSelection = { counselling: "", states: [], quota: "", category: "", tags: [] };
export const DEFAULT_ROUNDS = ["R1", "R2", "R3"];

export interface PgMatch {
  row: Institution;
  /** Highest closing rank across the chosen rounds. */
  expected: number;
  previous: number | null;
  chance: Chance;
}

const sorted = (values: Iterable<string>) => [...new Set(values)].sort((a, b) => a.localeCompare(b));

function inScope(row: Institution, sel: PgSelection) {
  if (!sel.counselling || row.counselling !== sel.counselling) return false;
  return sel.counselling === "AIQ" || sel.states.length === 0 || sel.states.includes(row.state);
}

/** Choices available at each step, narrowed by the earlier steps (counselling → states → quota → category). */
export function selectionOptions(rows: Institution[], sel: PgSelection) {
  const states = sorted(rows.filter(r => r.counselling === "STATE").map(r => r.state));
  const scoped = rows.filter(r => inScope(r, sel));
  const quotas = sorted(scoped.map(r => r.quota));
  const categories = sel.quota ? sorted(scoped.filter(r => r.quota === sel.quota).map(r => r.category)) : [];
  const tags = sorted(scoped.flatMap(r => r.tags));
  return { states, quotas, categories, tags };
}

export function selectionComplete(sel: PgSelection) {
  return !!sel.counselling && !!sel.quota && !!sel.category && (sel.counselling === "AIQ" || sel.states.length > 0);
}

const OPEN = new Set(["GEN", "UR", "OPEN", "GM", "OC", "UR-GEN", "UR-Open"]);

function bestClosing(row: Institution, rounds: string[]) {
  const values = rounds.map(r => row.ranks[r]).filter((v): v is number => typeof v === "number");
  return values.length ? Math.max(...values) : null;
}

const keyOf = (r: Institution) => `${r.college}|${r.course}|${r.quota}|${r.category}|${r.counselling}`;

/**
 * Rows of the latest year in the chosen counselling/quota whose expected cutoff is within reach.
 * Reserved-category candidates also see open seats in the same quota, as they can be allotted those.
 */
export function predictPg(latest: Institution[], previous: Institution[], rank: number, sel: PgSelection, rounds = DEFAULT_ROUNDS): PgMatch[] {
  if (!selectionComplete(sel)) return [];
  const prev = new Map<string, number>();
  for (const r of previous) {
    const c = bestClosing(r, rounds);
    if (c !== null) prev.set(keyOf(r), Math.max(prev.get(keyOf(r)) ?? 0, c));
  }
  const out: PgMatch[] = [];
  for (const row of latest) {
    if (!inScope(row, sel) || row.quota !== sel.quota) continue;
    if (row.category !== sel.category && !OPEN.has(row.category)) continue;
    if (row.tags.some(t => !sel.tags.includes(t))) continue;
    const expected = bestClosing(row, rounds);
    if (expected === null) continue;
    const chance = chanceFor(rank, expected);
    if (!chance) continue;
    out.push({ row, expected, previous: prev.get(keyOf(row)) ?? null, chance });
  }
  return out;
}
