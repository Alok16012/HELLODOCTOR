import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { colleges } from "@/data/colleges";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CollegeCard from "@/components/CollegeCard";
import {
  ArrowLeft, BookOpen, TrendingUp, GraduationCap, Briefcase,
  Clock, IndianRupee, ChevronRight, CheckCircle2, Star,
} from "lucide-react";

interface StreamDetail {
  name: string;
  slug: string;
  icon: string;
  description: string;
  longDescription: string;
  topExams: string[];
  careerPaths: string[];
  avgSalary: string;
  duration: string;
  gradient: string;
  heroImage: string;
  color: string;
  highlights: string[];
  topRecruiters: string[];
}

const streamData: Record<string, StreamDetail> = {
  engineering: {
    name: "Engineering",
    slug: "engineering",
    icon: "⚙️",
    description: "Engineering programs equip students with technical and analytical skills to design, build, and innovate solutions for real-world problems.",
    longDescription: "Engineering is the backbone of India's economic growth. From building smart cities to developing AI systems, engineers are at the forefront of every industry. A B.Tech degree from a top NIT or IIT opens doors to some of the highest-paying jobs in the world. India produces over 15 lakh engineers every year, making it critical to choose the right specialization and institution.",
    topExams: ["JEE Advanced", "JEE Main", "BITSAT", "VITEEE", "KCET", "MHT-CET", "COMEDK", "SRMJEEE"],
    careerPaths: ["Software Engineer", "Data Scientist", "Civil Engineer", "Mechanical Engineer", "Product Manager", "AI/ML Engineer", "Embedded Systems Engineer"],
    avgSalary: "₹6–12 LPA",
    duration: "4 Years (B.Tech/B.E.)",
    gradient: "from-blue-600 to-indigo-700",
    heroImage: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=1200&q=80",
    color: "blue",
    highlights: ["Largest employment sector in India", "Top CSE packages exceed ₹1 Crore", "IIT graduates hired by Google, Amazon, Microsoft", "Strong demand for AI/ML specialization"],
    topRecruiters: ["TCS", "Infosys", "Wipro", "Amazon", "Microsoft", "Google", "Deloitte", "L&T"],
  },
  medical: {
    name: "Medical",
    slug: "medical",
    icon: "⚕️",
    description: "Medical programs train future doctors, surgeons, and healthcare professionals. India's growing healthcare sector offers diverse career paths.",
    longDescription: "Medicine is one of the most noble and in-demand professions. With India's healthcare sector growing at 22% annually and a massive doctor shortage (India has 0.7 doctors per 1000 people vs WHO's recommended 1 per 1000), MBBS graduates have incredible opportunities. Specializations in cardiology, oncology, orthopedics, and neurosurgery command premium salaries.",
    topExams: ["NEET UG", "AIIMS Entrance", "JIPMER Entrance"],
    careerPaths: ["MBBS Doctor", "Surgeon", "Medical Specialist", "Psychiatrist", "Medical Researcher", "Hospital Administrator"],
    avgSalary: "₹8–25 LPA",
    duration: "5.5 Years (MBBS + Internship)",
    gradient: "from-red-500 to-rose-600",
    heroImage: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&q=80",
    color: "red",
    highlights: ["AIIMS MBBS doctors start at ₹1L+/month", "Growing specialty demand in metros", "Indian doctors in high demand globally (UK, USA, UAE)", "MD/MS opens doors to 2x–5x salary jumps"],
    topRecruiters: ["AIIMS", "Apollo Hospitals", "Fortis", "Medanta", "Max Healthcare", "Narayana Health"],
  },
  management: {
    name: "Management",
    slug: "management",
    icon: "💼",
    description: "Management programs develop business leaders and entrepreneurs. MBA from top IIMs can transform career trajectories with access to India's top companies.",
    longDescription: "Management education in India is world-class — IIM Ahmedabad regularly features in global Top 50 MBA rankings. A good MBA accelerates your career by 5–10 years, giving you frameworks, networks, and credentials to lead organizations. The rise of startups has also made entrepreneurship a viable post-MBA path, with IIM alumni funding some of India's biggest unicorns.",
    topExams: ["CAT", "XAT", "MAT", "GMAT", "CMAT", "SNAP", "NMAT", "IIFT"],
    careerPaths: ["Business Analyst", "Marketing Manager", "Investment Banker", "Management Consultant", "Finance Manager", "Entrepreneur", "Product Manager"],
    avgSalary: "₹8–35 LPA",
    duration: "2 Years (MBA) / 5 Years (BBA+MBA Integrated)",
    gradient: "from-yellow-500 to-orange-600",
    heroImage: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=80",
    color: "yellow",
    highlights: ["IIM-A avg package ₹35+ LPA", "McKinsey, BCG, Bain hire from top IIMs", "Entrepreneurship boom post-MBA", "Finance roles offer ₹50L+ for top graduates"],
    topRecruiters: ["McKinsey", "BCG", "Bain", "Goldman Sachs", "Deloitte", "Amazon", "Flipkart", "Paytm"],
  },
  law: {
    name: "Law",
    slug: "law",
    icon: "⚖️",
    description: "Law programs prepare students for careers in litigation, corporate law, judiciary, and policy. Top NLUs produce India's finest legal minds.",
    longDescription: "India's legal sector is transforming. Corporate law firms now offer ₹15–25 LPA packages to fresh NLU graduates, and the demand for specialized lawyers in areas like IP, cybersecurity, and M&A is growing rapidly. The Supreme Court of India has over 70,000 cases, creating demand for skilled litigators. LegalTech is an emerging field where law + tech skills command premium.",
    topExams: ["CLAT", "AILET", "LSAT India", "SLAT", "MH CET Law", "TS LAWCET"],
    careerPaths: ["Corporate Lawyer", "Litigation Lawyer", "IP Lawyer", "Cyber Law Specialist", "Arbitrator", "Policy Analyst", "Judiciary"],
    avgSalary: "₹6–25 LPA",
    duration: "5 Years (BA-LLB / BBA-LLB) / 3 Years (LLB)",
    gradient: "from-purple-600 to-violet-700",
    heroImage: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200&q=80",
    color: "purple",
    highlights: ["NLSIU Bengaluru grads placed at ₹18–22 LPA", "AZB, Cyril Amarchand hire from top NLUs", "Growing demand for IP and Cyber Law", "International arbitration is a premium niche"],
    topRecruiters: ["AZB Partners", "Cyril Amarchand", "Trilegal", "Khaitan & Co", "J. Sagar Associates", "Shardul Amarchand"],
  },
  design: {
    name: "Design",
    slug: "design",
    icon: "🎨",
    description: "Design programs nurture creative professionals for product design, fashion, UX, and communication design roles across global companies.",
    longDescription: "Design thinking is no longer just for creative agencies — every tech company needs UX designers, every startup needs brand designers, and every manufacturer needs product designers. NID Ahmedabad and NIFT Delhi are ranked among the world's top design schools. The rise of digital design (UX/UI) has dramatically increased design salaries in India, with senior UX designers at Swiggy, Flipkart, and startups earning ₹30–50 LPA.",
    topExams: ["NID DAT", "NIFT Entrance", "CEED", "UCEED", "Pearl Academy Entrance"],
    careerPaths: ["UX/UI Designer", "Product Designer", "Fashion Designer", "Graphic Designer", "Brand Designer", "Interaction Designer", "Art Director"],
    avgSalary: "₹5–18 LPA",
    duration: "4 Years (B.Des)",
    gradient: "from-pink-500 to-rose-600",
    heroImage: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&q=80",
    color: "pink",
    highlights: ["NID and NIFT in global top 20 design schools", "UX Design demand grew 5x in 5 years", "Apple, Google hire from NID graduates", "Fashion industry worth ₹7 lakh crore in India"],
    topRecruiters: ["Infosys Design", "Flipkart", "Swiggy", "Myntra", "Titan", "Tata Motors Design", "IDEO"],
  },
  science: {
    name: "Science",
    slug: "science",
    icon: "🔬",
    description: "Pure science programs at IISc, IISERs, and top universities open pathways to research, academia, and high-tech industries.",
    longDescription: "Pure science is having a renaissance. With India's science missions (Chandrayaan, ISRO missions) and the biotech/data science boom, BSc graduates with strong foundations can pivot into multiple high-value careers. IISc Bengaluru's BS Research program is arguably India's best undergraduate science degree. IISERs (Indian Institutes of Science Education and Research) offer integrated BS-MS programs that are gateway to PhDs at global universities.",
    topExams: ["CUET", "IISER Aptitude Test", "IISc Entrance", "JEST", "TIFR GS", "INAT"],
    careerPaths: ["Research Scientist", "Data Analyst", "Bioinformatician", "Academician", "DRDO/ISRO Scientist", "Biotech Researcher", "Quant Analyst"],
    avgSalary: "₹5–15 LPA",
    duration: "3 Years (B.Sc) / 5 Years (B.S. Research)",
    gradient: "from-green-500 to-emerald-600",
    heroImage: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=1200&q=80",
    color: "green",
    highlights: ["IISc rated #1 in India for research", "IISER graduates accepted at MIT, Stanford for PhD", "Govt. scientist roles growing with DRDO, DAE, DST", "Statistics + Data Science is the hottest combo"],
    topRecruiters: ["ISRO", "DRDO", "BARC", "Biocon", "Dr Reddy's", "TCS Research", "DE Shaw"],
  },
  pharmacy: {
    name: "Pharmacy",
    slug: "pharmacy",
    icon: "💊",
    description: "Pharmacy programs produce professionals for India's ₹4 lakh crore pharma industry — from drug production to clinical research.",
    longDescription: "India is the pharmacy of the world — exporting generic medicines to 200+ countries and supplying 20% of global generic drug demand. The pharma sector employs 3 million+ people, and this number is growing with new drug discoveries, biosimilars, and vaccine production. Pharma graduates can work in production, quality control, regulatory affairs, clinical trials, or sales — with global opportunities in the USA, UK, and Germany.",
    topExams: ["GPAT", "State Pharmacy CETs", "NEET (for some states)", "BITS Pharmacy Entrance"],
    careerPaths: ["Pharmacist", "QC/QA Analyst", "Drug Inspector", "Clinical Research Associate", "Medical Representative", "Regulatory Affairs Specialist", "R&D Scientist"],
    avgSalary: "₹3–10 LPA",
    duration: "4 Years (B.Pharma) / 2 Years (D.Pharma)",
    gradient: "from-teal-500 to-cyan-600",
    heroImage: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=1200&q=80",
    color: "teal",
    highlights: ["India exports pharma to 200+ countries", "Sun Pharma, Cipla, Dr Reddy's are global giants", "USA H1B demand for Indian pharmacists", "Clinical research growing at 20% CAGR"],
    topRecruiters: ["Sun Pharma", "Cipla", "Dr. Reddy's", "Lupin", "Biocon", "Serum Institute", "Glenmark"],
  },
  agriculture: {
    name: "Agriculture",
    slug: "agriculture",
    icon: "🌾",
    description: "Agriculture programs train experts for India's largest sector, from agritech startups to ICAR research.",
    longDescription: "Agriculture is India's largest employer, and it's being transformed by technology. Agritech startups raised ₹8,000+ crore in 2024. Precision farming, drone agriculture, food processing, and sustainable agriculture are creating new high-value careers. ICAR (Indian Council of Agricultural Research) and state agricultural universities train the next generation of agricultural scientists and innovators.",
    topExams: ["ICAR AIEEA", "CUET", "State Agriculture CETs", "BHU Agriculture Entrance"],
    careerPaths: ["Agricultural Scientist", "Agritech Entrepreneur", "Farm Manager", "Food Technologist", "NABARD Officer", "Soil Scientist", "Agricultural Extension Officer"],
    avgSalary: "₹4–12 LPA",
    duration: "4 Years (B.Sc Agriculture)",
    gradient: "from-orange-500 to-amber-600",
    heroImage: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1200&q=80",
    color: "orange",
    highlights: ["Agritech is one of India's hottest startup sectors", "NABARD and ICAR offer government careers", "Food processing industry growing at 11% annually", "Global demand for Indian food technologists"],
    topRecruiters: ["ITC Agri", "UPL", "Syngenta", "Bayer CropScience", "NABARD", "ICAR Institutes", "BigHaat"],
  },
  architecture: {
    name: "Architecture",
    slug: "architecture",
    icon: "🏛️",
    description: "Architecture programs blend creativity and technical skills to design buildings, urban spaces, and sustainable environments.",
    longDescription: "India is in the middle of its biggest construction boom. Smart Cities Mission, RERA reforms, and massive infrastructure projects (highways, metro, airports) are creating unprecedented demand for architects and urban planners. B.Arch from top schools like CEPT Ahmedabad, SPA Delhi, or IIT Kharagpur Architecture can lead to roles at global design firms like Zaha Hadid Architects, HOK, and Gensler.",
    topExams: ["NATA", "JEE Paper 2 (B.Arch)", "CEPT Entrance", "SPA Delhi Entrance"],
    careerPaths: ["Architect", "Urban Planner", "Interior Designer", "Landscape Architect", "BIM Specialist", "Project Manager", "Conservation Architect"],
    avgSalary: "₹4–15 LPA",
    duration: "5 Years (B.Arch)",
    gradient: "from-indigo-500 to-blue-700",
    heroImage: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200&q=80",
    color: "indigo",
    highlights: ["Smart Cities Mission creating massive demand", "Indian architects hired by Zaha Hadid, Gensler", "Interior design industry worth ₹1.3L crore", "Sustainable architecture is the future"],
    topRecruiters: ["L&T Construction", "Sobha Developers", "DLF", "Tata Housing", "HOK", "Hafeez Contractor"],
  },
  research: {
    name: "Research",
    slug: "research",
    icon: "🧪",
    description: "Research programs at IITs, IISc, and IISERs produce world-class scientists and innovators for academia and industry R&D.",
    longDescription: "India's research landscape is growing rapidly. With PM-USHA, NEP 2020, and ₹1 lakh crore National Research Foundation, research funding is at an all-time high. Integrated PhD programs at IITs and IISc give stipends of ₹30,000–60,000/month. Industrial R&D at pharma, defense, and tech companies offers ₹10–30 LPA for PhD holders. Postdoctoral research in the USA and Europe is a viable path to academia or industry.",
    topExams: ["GATE", "JEST", "CSIR NET", "UGC NET", "TIFR GS", "INAT", "JAM"],
    careerPaths: ["Research Scientist", "Professor / Academician", "DRDO Scientist", "ISRO Engineer", "Industrial R&D", "Postdoctoral Researcher", "Science Policy Analyst"],
    avgSalary: "₹6–20 LPA",
    duration: "5–7 Years (M.Sc/PhD / Integrated PhD)",
    gradient: "from-cyan-500 to-teal-600",
    heroImage: "https://images.unsplash.com/photo-1532094349884-543559373b42?w=1200&q=80",
    color: "cyan",
    highlights: ["PhD stipend at IITs: ₹30,000–60,000/month", "NRF committed ₹1 lakh crore over 5 years", "Indian researchers at MIT, Stanford, Oxford", "DRDO and ISRO offer prestigious research careers"],
    topRecruiters: ["ISRO", "DRDO", "BARC", "IIT Research Centers", "Biocon R&D", "TCS Research", "Samsung R&D"],
  },
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return Object.keys(streamData).map((slug) => ({ slug }));
}

export default async function StreamDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const stream = streamData[slug];
  if (!stream) notFound();

  const streamColleges = colleges
    .filter((c) => c.streams.includes(stream.name))
    .sort((a, b) => a.ranking - b.ranking);

  const avgFees = streamColleges.length
    ? Math.round(streamColleges.reduce((sum, c) => sum + c.fees, 0) / streamColleges.length)
    : 0;

  const govtCount = streamColleges.filter((c) => c.type === "Government").length;
  const privateCount = streamColleges.filter((c) => c.type === "Private").length;
  const deemedCount = streamColleges.filter((c) => c.type === "Deemed").length;

  return (
    <>
      <Navbar />
      <div className="bg-gray-50 min-h-screen">
        {/* Hero */}
        <div className="relative h-72 sm:h-80 w-full">
          <Image src={stream.heroImage} alt={stream.name} fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-6">
            <div className="max-w-7xl mx-auto">
              <Link href="/streams" className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-sm mb-3 transition-colors">
                <ArrowLeft className="w-4 h-4" /> All Streams
              </Link>
              <div className="flex items-center gap-4">
                <span className="text-5xl">{stream.icon}</span>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-white">{stream.name}</h1>
                  <p className="text-white/70 text-sm mt-1">{stream.description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Bar */}
        <div className="bg-white border-b border-gray-100 sticky top-16 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-4 divide-x divide-gray-100">
              {[
                { label: "Colleges", value: String(streamColleges.length) },
                { label: "Avg Salary", value: stream.avgSalary },
                { label: "Duration", value: stream.duration.split("(")[0].trim() },
                { label: "Top Exam", value: stream.topExams[0] },
              ].map((s) => (
                <div key={s.label} className="py-3 px-4 text-center">
                  <p className="text-xs text-gray-400 mb-0.5">{s.label}</p>
                  <p className="text-sm font-bold text-gray-800">{s.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* About */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-600" /> About {stream.name}
                </h2>
                <p className="text-gray-600 leading-relaxed text-sm">{stream.longDescription}</p>
              </div>

              {/* Highlights */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" /> Key Highlights
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {stream.highlights.map((h) => (
                    <div key={h} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Career Paths */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-blue-600" /> Career Paths
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {stream.careerPaths.map((c) => (
                    <div key={c} className="bg-blue-50 border border-blue-100 text-blue-700 text-sm font-medium px-4 py-2.5 rounded-xl text-center">
                      {c}
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Recruiters */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" /> Top Recruiters
                </h2>
                <div className="flex flex-wrap gap-2">
                  {stream.topRecruiters.map((r) => (
                    <span key={r} className="bg-gray-100 text-gray-700 text-sm px-3 py-1.5 rounded-full hover:bg-blue-50 hover:text-blue-700 transition-colors">
                      {r}
                    </span>
                  ))}
                </div>
              </div>

              {/* Colleges */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">
                    Top {stream.name} Colleges ({streamColleges.length})
                  </h2>
                  <Link href={`/colleges?stream=${stream.name}`} className="text-sm text-blue-600 font-medium flex items-center gap-1 hover:gap-2 transition-all">
                    View All <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {streamColleges.slice(0, 8).map((c) => (
                    <CollegeCard key={c.id} college={c} />
                  ))}
                </div>
                {streamColleges.length > 8 && (
                  <div className="mt-4 text-center">
                    <Link
                      href={`/colleges?stream=${stream.name}`}
                      className="inline-flex items-center gap-2 bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors"
                    >
                      View All {streamColleges.length} Colleges <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-5">
              {/* Exam Info */}
              <div className="bg-white rounded-2xl p-5 border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-blue-600" /> Entrance Exams
                </h3>
                <div className="space-y-2">
                  {stream.topExams.map((exam) => (
                    <div key={exam} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                      <span className="text-sm font-medium text-purple-700 bg-purple-50 px-3 py-1 rounded-full">{exam}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Duration & Salary */}
              <div className="bg-white rounded-2xl p-5 border border-gray-100 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Clock className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Duration</p>
                    <p className="text-sm font-bold text-gray-800">{stream.duration}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <IndianRupee className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Average Starting Salary</p>
                    <p className="text-sm font-bold text-green-600">{stream.avgSalary}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Avg. Annual Fees</p>
                    <p className="text-sm font-bold text-purple-600">
                      ₹{(avgFees / 100000).toFixed(1)}L/yr
                    </p>
                  </div>
                </div>
              </div>

              {/* College Type Breakdown */}
              <div className="bg-white rounded-2xl p-5 border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-3 text-sm">College Types</h3>
                <div className="space-y-2">
                  {[
                    { label: "Government", count: govtCount, color: "bg-green-500" },
                    { label: "Private", count: privateCount, color: "bg-orange-500" },
                    { label: "Deemed", count: deemedCount, color: "bg-blue-500" },
                  ].map((t) => (
                    <div key={t.label} className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${t.color}`} />
                      <span className="text-sm text-gray-700 flex-1">{t.label}</span>
                      <span className="text-sm font-bold text-gray-800">{t.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-5 text-white">
                <h3 className="font-bold text-lg mb-1">Confused About {stream.name}?</h3>
                <p className="text-blue-200 text-sm mb-4">Get free guidance from our experts on the best colleges and career paths for {stream.name}.</p>
                <Link
                  href="/counselling"
                  className="flex items-center justify-center gap-2 bg-white text-blue-600 font-bold text-sm px-5 py-3 rounded-xl hover:bg-blue-50 transition-colors w-full"
                >
                  Book Free Counselling
                </Link>
              </div>

              {/* Other Streams */}
              <div className="bg-white rounded-2xl p-5 border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-3 text-sm">Explore Other Streams</h3>
                <div className="space-y-1">
                  {Object.values(streamData)
                    .filter((s) => s.slug !== slug)
                    .slice(0, 5)
                    .map((s) => (
                      <Link
                        key={s.slug}
                        href={`/streams/${s.slug}`}
                        className="flex items-center gap-2 py-2 text-sm text-gray-700 hover:text-blue-600 transition-colors group"
                      >
                        <span>{s.icon}</span>
                        <span className="flex-1">{s.name}</span>
                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
                      </Link>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
