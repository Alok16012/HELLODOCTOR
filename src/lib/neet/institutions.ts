/** Compact row: dictionary indices, counselling (0 AIQ / 1 STATE), tag bitmask, fee, then closing ranks per round. */
export type InstitutionRow = [
  college: number, state: number, course: number, category: number, quota: number,
  counselling: 0 | 1, tags: number, fee: number | string | null, ...ranks: (number | null)[],
];

export interface InstitutionYear {
  year: number;
  rounds: string[];
  d: { college: string[]; state: string[]; course: string[]; category: string[]; quota: string[] };
  rows: InstitutionRow[];
}

export interface InstitutionIndex {
  source: string;
  capturedAt: string;
  exam: "pg";
  tags: string[];
  counselling: string[];
  years: { year: number; total: number; rounds: string[] }[];
}

/** A row resolved to display values, tagged with its year. */
export interface Institution {
  key: string;
  year: number;
  college: string;
  state: string;
  course: string;
  category: string;
  quota: string;
  counselling: string;
  tags: string[];
  fee: number | string | null;
  ranks: Record<string, number | null>;
}

export function expandYear(data: InstitutionYear, index: InstitutionIndex): Institution[] {
  return data.rows.map((row, i) => ({
    key: `${data.year}:${i}`,
    year: data.year,
    college: data.d.college[row[0]],
    state: data.d.state[row[1]],
    course: data.d.course[row[2]],
    category: data.d.category[row[3]],
    quota: data.d.quota[row[4]],
    counselling: index.counselling[row[5]],
    tags: index.tags.filter((_, bit) => (row[6] as number) & (1 << bit)),
    fee: row[7],
    ranks: Object.fromEntries(data.rounds.map((round, r) => [round, row[8 + r] as number | null])),
  }));
}

/** Highest closing rank across the chosen rounds (all rounds when none chosen). */
export function closingRank(row: Institution, rounds: string[]): number | null {
  const values = (rounds.length ? rounds : Object.keys(row.ranks)).map(r => row.ranks[r]).filter((v): v is number => typeof v === "number");
  return values.length ? Math.max(...values) : null;
}

export function formatFee(fee: Institution["fee"]): string {
  if (fee === null) return "–";
  if (typeof fee === "string") return fee;
  return `₹${fee.toLocaleString("en-IN")}`;
}
