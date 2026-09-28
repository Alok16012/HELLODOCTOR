// NEET predictor reference data.
//
// All figures are INDICATIVE, based on previous-year NTA marks-vs-rank trends and
// MCC All-India-Quota (15%) closing ranks. Update them every counselling season
// (after NTA results and MCC final-round allotments) to keep predictions accurate.

export type NeetType = "ug" | "pg";
export type Category = "general" | "ews" | "obc" | "sc" | "st";

export const CATEGORIES: { value: Category; label: string }[] = [
  { value: "general", label: "General" },
  { value: "ews", label: "EWS" },
  { value: "obc", label: "OBC-NCL" },
  { value: "sc", label: "SC" },
  { value: "st", label: "ST" },
];

// Category closing ranks are roughly this many times the General closing rank.
export const CATEGORY_FACTOR: Record<Category, number> = {
  general: 1,
  ews: 1.15,
  obc: 1.2,
  sc: 5,
  st: 7,
};

export const MAX_SCORE: Record<NeetType, number> = { ug: 720, pg: 800 };
export const TOTAL_CANDIDATES: Record<NeetType, number> = { ug: 2200000, pg: 230000 };

// NEET UG qualifying marks (previous year) and roughly how many candidates qualified.
export const UG_QUALIFYING_MARKS: Record<Category, number> = { general: 144, ews: 144, obc: 113, sc: 113, st: 113 };
const UG_QUALIFIED_CANDIDATES = 1236000;

/** false when the result is below the NEET UG qualifying cutoff (PG is not checked). */
export function isUgQualified(mode: "score" | "rank", value: number, category: Category): boolean {
  return mode === "score" ? value >= UG_QUALIFYING_MARKS[category] : value <= UG_QUALIFIED_CANDIDATES;
}

// An estimate shouldn't look more precise than it is.
function roundRank(rank: number): number {
  if (rank < 100) return rank;
  const step = rank < 1000 ? 10 : rank < 10000 ? 100 : 1000;
  return Math.round(rank / step) * step;
}

// [marks, approx. AIR] — descending marks. Linear interpolation in between.
const MARKS_TO_RANK: Record<NeetType, [number, number][]> = {
  ug: [
    [720, 1], [686, 1], [650, 120], [620, 800], [600, 2000], [580, 4000], [550, 9500],
    [520, 18000], [500, 26000], [480, 36000], [450, 55000], [420, 80000], [400, 100000],
    [375, 130000], [350, 165000], [300, 260000], [250, 390000], [200, 580000],
    [144, 1200000], [0, 2200000],
  ],
  pg: [
    [800, 1], [750, 10], [700, 200], [650, 1000], [600, 3500], [550, 8000], [500, 15000],
    [450, 25000], [400, 38000], [350, 55000], [300, 75000], [250, 100000], [200, 130000],
    [0, 230000],
  ],
};

export function estimateRank(type: NeetType, marks: number): number {
  const table = MARKS_TO_RANK[type];
  const m = Math.max(0, Math.min(marks, MAX_SCORE[type]));
  for (let i = 0; i < table.length - 1; i++) {
    const [hiM, hiR] = table[i];
    const [loM, loR] = table[i + 1];
    if (m <= hiM && m >= loM) {
      if (hiM === loM) return hiR;
      return Math.max(1, roundRank(Math.round(hiR + ((hiM - m) / (hiM - loM)) * (loR - hiR))));
    }
  }
  return TOTAL_CANDIDATES[type];
}

export interface UgCollege {
  name: string;
  city: string;
  state: string;
  type: "Government" | "Deemed";
  /** Approx. previous-year AIQ MBBS closing rank, General category. */
  closingRank: number;
  /** Approx. annual tuition fee. */
  fee: string;
}

export const UG_COLLEGES: UgCollege[] = [
  { name: "AIIMS New Delhi", city: "New Delhi", state: "Delhi", type: "Government", closingRank: 50, fee: "₹1,628/yr" },
  { name: "Maulana Azad Medical College", city: "New Delhi", state: "Delhi", type: "Government", closingRank: 120, fee: "₹4,500/yr" },
  { name: "VMMC & Safdarjung Hospital", city: "New Delhi", state: "Delhi", type: "Government", closingRank: 300, fee: "₹50,000/yr" },
  { name: "JIPMER Puducherry", city: "Puducherry", state: "Puducherry", type: "Government", closingRank: 350, fee: "₹12,000/yr" },
  { name: "University College of Medical Sciences", city: "New Delhi", state: "Delhi", type: "Government", closingRank: 700, fee: "₹10,000/yr" },
  { name: "Seth GS Medical College (KEM)", city: "Mumbai", state: "Maharashtra", type: "Government", closingRank: 800, fee: "₹1,00,000/yr" },
  { name: "AIIMS Jodhpur", city: "Jodhpur", state: "Rajasthan", type: "Government", closingRank: 800, fee: "₹1,628/yr" },
  { name: "AIIMS Bhubaneswar", city: "Bhubaneswar", state: "Odisha", type: "Government", closingRank: 1000, fee: "₹1,628/yr" },
  { name: "Government Medical College Chandigarh", city: "Chandigarh", state: "Chandigarh", type: "Government", closingRank: 1100, fee: "₹10,000/yr" },
  { name: "Lady Hardinge Medical College (girls)", city: "New Delhi", state: "Delhi", type: "Government", closingRank: 1300, fee: "₹6,000/yr" },
  { name: "IMS BHU Varanasi", city: "Varanasi", state: "Uttar Pradesh", type: "Government", closingRank: 1300, fee: "₹15,000/yr" },
  { name: "AIIMS Rishikesh", city: "Rishikesh", state: "Uttarakhand", type: "Government", closingRank: 1400, fee: "₹1,628/yr" },
  { name: "AIIMS Bhopal", city: "Bhopal", state: "Madhya Pradesh", type: "Government", closingRank: 1500, fee: "₹1,628/yr" },
  { name: "King George's Medical University", city: "Lucknow", state: "Uttar Pradesh", type: "Government", closingRank: 1600, fee: "₹54,000/yr" },
  { name: "BJ Medical College Pune", city: "Pune", state: "Maharashtra", type: "Government", closingRank: 2000, fee: "₹1,00,000/yr" },
  { name: "Bangalore Medical College", city: "Bengaluru", state: "Karnataka", type: "Government", closingRank: 2000, fee: "₹60,000/yr" },
  { name: "Madras Medical College", city: "Chennai", state: "Tamil Nadu", type: "Government", closingRank: 2200, fee: "₹14,000/yr" },
  { name: "AIIMS Patna", city: "Patna", state: "Bihar", type: "Government", closingRank: 2300, fee: "₹1,628/yr" },
  { name: "SMS Medical College Jaipur", city: "Jaipur", state: "Rajasthan", type: "Government", closingRank: 2300, fee: "₹50,000/yr" },
  { name: "Grant Medical College Mumbai", city: "Mumbai", state: "Maharashtra", type: "Government", closingRank: 2500, fee: "₹1,00,000/yr" },
  { name: "IPGMER & SSKM Kolkata", city: "Kolkata", state: "West Bengal", type: "Government", closingRank: 2600, fee: "₹10,000/yr" },
  { name: "BJ Medical College Ahmedabad", city: "Ahmedabad", state: "Gujarat", type: "Government", closingRank: 2600, fee: "₹25,000/yr" },
  { name: "AIIMS Raipur", city: "Raipur", state: "Chhattisgarh", type: "Government", closingRank: 2600, fee: "₹1,628/yr" },
  { name: "Osmania Medical College", city: "Hyderabad", state: "Telangana", type: "Government", closingRank: 2800, fee: "₹10,000/yr" },
  { name: "PGIMS Rohtak", city: "Rohtak", state: "Haryana", type: "Government", closingRank: 3000, fee: "₹80,000/yr" },
  { name: "AIIMS Nagpur", city: "Nagpur", state: "Maharashtra", type: "Government", closingRank: 3000, fee: "₹1,628/yr" },
  { name: "Medical College Kolkata", city: "Kolkata", state: "West Bengal", type: "Government", closingRank: 3000, fee: "₹10,000/yr" },
  { name: "Gandhi Medical College Hyderabad", city: "Hyderabad", state: "Telangana", type: "Government", closingRank: 3200, fee: "₹10,000/yr" },
  { name: "Dr. RML Institute of Medical Sciences", city: "Lucknow", state: "Uttar Pradesh", type: "Government", closingRank: 3500, fee: "₹80,000/yr" },
  { name: "Government Medical College Nagpur", city: "Nagpur", state: "Maharashtra", type: "Government", closingRank: 3500, fee: "₹1,00,000/yr" },
  { name: "AIIMS Gorakhpur", city: "Gorakhpur", state: "Uttar Pradesh", type: "Government", closingRank: 5000, fee: "₹1,628/yr" },
  { name: "MLN Medical College Prayagraj", city: "Prayagraj", state: "Uttar Pradesh", type: "Government", closingRank: 5000, fee: "₹55,000/yr" },
  { name: "GSVM Medical College Kanpur", city: "Kanpur", state: "Uttar Pradesh", type: "Government", closingRank: 5500, fee: "₹55,000/yr" },
  { name: "AIIMS Bathinda", city: "Bathinda", state: "Punjab", type: "Government", closingRank: 5500, fee: "₹1,628/yr" },
  { name: "Government Medical College Patiala", city: "Patiala", state: "Punjab", type: "Government", closingRank: 6000, fee: "₹1,60,000/yr" },
  { name: "SN Medical College Agra", city: "Agra", state: "Uttar Pradesh", type: "Government", closingRank: 6500, fee: "₹55,000/yr" },
  { name: "AIIMS Rae Bareli", city: "Rae Bareli", state: "Uttar Pradesh", type: "Government", closingRank: 6500, fee: "₹1,628/yr" },
  { name: "LLRM Medical College Meerut", city: "Meerut", state: "Uttar Pradesh", type: "Government", closingRank: 7000, fee: "₹55,000/yr" },
  { name: "RIMS Ranchi", city: "Ranchi", state: "Jharkhand", type: "Government", closingRank: 8000, fee: "₹50,000/yr" },
  { name: "ESIC Medical College Faridabad", city: "Faridabad", state: "Haryana", type: "Government", closingRank: 9000, fee: "₹30,000/yr" },
  { name: "Government Medical College Kota", city: "Kota", state: "Rajasthan", type: "Government", closingRank: 9000, fee: "₹50,000/yr" },
  { name: "Government Doon Medical College", city: "Dehradun", state: "Uttarakhand", type: "Government", closingRank: 12000, fee: "₹4,00,000/yr" },
  { name: "Government Medical College Srinagar", city: "Srinagar", state: "J&K", type: "Government", closingRank: 12000, fee: "₹20,000/yr" },
  { name: "Government Medical College Haldwani", city: "Haldwani", state: "Uttarakhand", type: "Government", closingRank: 15000, fee: "₹4,00,000/yr" },
  { name: "Autonomous State Medical Colleges (UP)", city: "Various", state: "Uttar Pradesh", type: "Government", closingRank: 22000, fee: "₹55,000/yr" },
  { name: "Newer Government Medical Colleges (AIQ)", city: "Various", state: "Various", type: "Government", closingRank: 25000, fee: "Low" },
  { name: "Kasturba Medical College Manipal", city: "Manipal", state: "Karnataka", type: "Deemed", closingRank: 12000, fee: "₹17,00,000/yr" },
  { name: "Kasturba Medical College Mangalore", city: "Mangalore", state: "Karnataka", type: "Deemed", closingRank: 18000, fee: "₹17,00,000/yr" },
  { name: "Sri Ramachandra Institute", city: "Chennai", state: "Tamil Nadu", type: "Deemed", closingRank: 25000, fee: "₹25,00,000/yr" },
  { name: "JSS Medical College Mysuru", city: "Mysuru", state: "Karnataka", type: "Deemed", closingRank: 40000, fee: "₹16,00,000/yr" },
  { name: "Dr. DY Patil Medical College Pune", city: "Pune", state: "Maharashtra", type: "Deemed", closingRank: 50000, fee: "₹28,00,000/yr" },
  { name: "Saveetha Medical College", city: "Chennai", state: "Tamil Nadu", type: "Deemed", closingRank: 60000, fee: "₹25,00,000/yr" },
  { name: "Datta Meghe Institute (JNMC) Wardha", city: "Wardha", state: "Maharashtra", type: "Deemed", closingRank: 90000, fee: "₹16,00,000/yr" },
  { name: "Santosh Medical College Ghaziabad", city: "Ghaziabad", state: "Uttar Pradesh", type: "Deemed", closingRank: 120000, fee: "₹23,00,000/yr" },
  { name: "Other Deemed Universities (stray rounds)", city: "Various", state: "Various", type: "Deemed", closingRank: 150000, fee: "₹15–30 L/yr" },
];

export interface PgBand {
  maxRank: number;
  title: string;
  branches: string;
  where: string;
}

// General-category AIR bands for NEET PG branch/college expectations.
export const PG_BANDS: PgBand[] = [
  { maxRank: 1000, title: "Top branches at top institutes", branches: "Radiology, Dermatology, General Medicine, Paediatrics, Orthopaedics", where: "Top government colleges (MAMC, VMMC, KEM, BHU, Madras MC)" },
  { maxRank: 5000, title: "Clinical branches in good government colleges", branches: "General Medicine, Radiology, Dermatology, Orthopaedics, General Surgery", where: "Good state & central government colleges" },
  { maxRank: 15000, title: "Clinical branches in government colleges", branches: "OBG, Paediatrics, General Surgery, ENT, Ophthalmology, Anaesthesia", where: "Government colleges; top branches in private/deemed" },
  { maxRank: 30000, title: "Mixed clinical & para-clinical", branches: "Anaesthesia, Pulmonary Medicine, Psychiatry, Pathology", where: "Government (para/non-core clinical); clinical in private/DNB" },
  { maxRank: 60000, title: "Para-clinical in govt, clinical in private", branches: "Pathology, Microbiology, Pharmacology, Community Medicine", where: "Government para-clinical; clinical in private, deemed or DNB" },
  { maxRank: Infinity, title: "Pre-clinical / DNB / management quota", branches: "Anatomy, Physiology, Biochemistry, Forensic Medicine", where: "Government pre-clinical; clinical via DNB, deemed or management quota" },
];

export type Chance = "Safe" | "Moderate" | "Reach";

export interface CollegeMatch extends UgCollege {
  chance: Chance;
  adjustedClosingRank: number;
}

export function predictUgColleges(
  rank: number,
  category: Category,
  includeDeemed: boolean,
): CollegeMatch[] {
  const factor = CATEGORY_FACTOR[category];
  const matches: CollegeMatch[] = [];
  for (const c of UG_COLLEGES) {
    if (c.type === "Deemed" && !includeDeemed) continue;
    // Deemed seats have no category reservation.
    const adjusted = Math.round(c.closingRank * (c.type === "Deemed" ? 1 : factor));
    let chance: Chance | null = null;
    if (rank <= adjusted * 0.85) chance = "Safe";
    else if (rank <= adjusted * 1.1) chance = "Moderate";
    else if (rank <= adjusted * 1.35) chance = "Reach";
    if (chance) matches.push({ ...c, chance, adjustedClosingRank: adjusted });
  }
  const order: Record<Chance, number> = { Moderate: 0, Reach: 1, Safe: 2 };
  // Best-fit first: colleges closest to the student's rank, then safer picks.
  return matches.sort(
    (a, b) => order[a.chance] - order[b.chance] || a.adjustedClosingRank - b.adjustedClosingRank,
  );
}

export function pgBandFor(rank: number, category: Category): PgBand {
  const generalEquivalent = rank / CATEGORY_FACTOR[category];
  return PG_BANDS.find((b) => generalEquivalent <= b.maxRank) ?? PG_BANDS[PG_BANDS.length - 1];
}

/** Suggestions when government MBBS through AIQ is unlikely. */
export function ugAlternatives(rank: number, category: Category): string[] {
  const g = rank / CATEGORY_FACTOR[category];
  const out: string[] = [];
  if (g > 20000) out.push("State quota (85%) counselling in your home state — cutoffs are often lower than AIQ");
  if (g > 25000) out.push("Private medical colleges via state counselling (management quota)");
  if (g > 60000) out.push("BDS in government dental colleges");
  if (g > 100000) out.push("BAMS / BHMS through AACCC & state AYUSH counselling");
  out.push("MBBS abroad (Russia, Georgia, Uzbekistan, Kyrgyzstan, Nepal) — NEET qualification is enough");
  return out;
}
