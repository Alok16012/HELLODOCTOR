export interface Scholarship {
  id: number;
  slug: string;
  name: string;
  shortName: string;
  provider: string;
  providerType: "Government" | "Private" | "International" | "University";
  amount: number; // per year in rupees
  amountDisplay: string;
  amountType: "Annual" | "One-time" | "Monthly" | "Full Tuition";
  category: string;
  streams: string[];
  level: ("Class 11-12" | "UG" | "PG" | "PhD" | "Diploma")[];
  eligibilityCriteria: string[];
  incomeLimit: number | null; // annual family income in rupees
  incomeLimitDisplay: string;
  minMarks: number; // percentage
  deadline: string; // month-year
  applicationMode: "Online" | "Offline" | "Both";
  applyUrl: string;
  description: string;
  benefits: string[];
  documents: string[];
  selectionProcess: string;
  renewalCriteria: string;
  featured: boolean;
  tags: string[];
  noOfAwards: string;
  establishedYear: number;
  contact: string;
}

export const scholarshipCategories = [
  { name: "All", slug: "all" },
  { name: "Government", slug: "government" },
  { name: "Private", slug: "private" },
  { name: "International", slug: "international" },
  { name: "University", slug: "university" },
];

export const scholarshipStreams = [
  "Engineering", "Medical", "Management", "Law", "Science",
  "Pharmacy", "Arts & Humanities", "Commerce", "Agriculture", "Any Stream",
];

export const scholarshipLevels = ["Class 11-12", "UG", "PG", "PhD", "Diploma"];
