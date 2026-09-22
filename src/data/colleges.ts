export interface College {
  id: number;
  name: string;
  shortName: string;
  slug: string;
  location: string;
  city: string;
  state: string;
  fees: number; // annual fees in rupees
  feesDisplay: string;
  rating: number;
  reviewCount: number;
  streams: string[];
  ranking: number; // NIRF overall ranking (medical)
  nirfRank: string;
  established: number;
  type: "Government" | "Private" | "Deemed";
  accreditation: string;
  image: string;
  description: string;
  highlights: string[];
  exams: string[];
  placements: {
    avgPackage: number;
    highestPackage: number;
    companies: string[];
  };
  courses: string[];
  approvals: string[];
}


export const streams = [
  { name: "MBBS India", icon: "🇮🇳", color: "bg-blue-100 text-blue-700", bg: "from-blue-500 to-blue-600", image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&q=80" },
  { name: "MBBS Abroad", icon: "🌍", color: "bg-red-100 text-red-700", bg: "from-red-500 to-red-600", image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80" },
  { name: "BDS", icon: "🦷", color: "bg-purple-100 text-purple-700", bg: "from-purple-500 to-purple-600", image: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=600&q=80" },
  { name: "BAMS", icon: "🌿", color: "bg-indigo-100 text-indigo-700", bg: "from-indigo-500 to-indigo-600", image: "https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?w=600&q=80" },
  { name: "BHMS", icon: "💊", color: "bg-pink-100 text-pink-700", bg: "from-pink-500 to-pink-600", image: "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=600&q=80" },
  { name: "Nursing", icon: "👩‍⚕️", color: "bg-cyan-100 text-cyan-700", bg: "from-cyan-500 to-cyan-600", image: "https://images.unsplash.com/photo-1584515933487-779824d29309?w=600&q=80" },
];

export const stats = [
  { label: "Colleges & Universities", value: "28+", icon: "🏛️" },
  { label: "Countries Covered", value: "6", icon: "🌍" },
  { label: "NEET-Based Admission", value: "100%", icon: "✅" },
  { label: "Initial Counselling", value: "Free", icon: "🎓" },
  { label: "Support Availability", value: "7 Days", icon: "📞" },
  { label: "Medical Programs", value: "5", icon: "📚" },
];

export const feeRanges = [
  { label: "Under ₹50K/yr", min: 0, max: 50000 },
  { label: "₹50K – ₹3L/yr", min: 50001, max: 300000 },
  { label: "₹3L – ₹5L/yr", min: 300001, max: 500000 },
  { label: "₹5L – ₹10L/yr", min: 500001, max: 1000000 },
  { label: "₹10L+/yr", min: 1000001, max: Infinity },
];
