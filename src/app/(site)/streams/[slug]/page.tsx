import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getColleges } from "@/lib/content";
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
  "mbbs-india": {
    name: "MBBS India",
    slug: "mbbs-india",
    icon: "🇮🇳",
    description: "MBBS in India through NEET UG counselling — government, private and deemed medical colleges across the country.",
    longDescription: "MBBS in India remains the most recognised and preferred path to becoming a doctor for NEET-qualified students. Admission is entirely NEET UG merit-based, through all-India or state-quota counselling. Government colleges offer near-nil fees but very high cutoffs, while private and deemed colleges offer more seats at higher fees. Our counsellors help you understand realistic options based on your NEET rank, category and budget — including colleges close to Noida and Delhi-NCR.",
    topExams: ["NEET UG"],
    careerPaths: ["General Physician", "Surgeon", "Specialist Doctor (MD/MS)", "Medical Officer", "Hospital Administrator"],
    avgSalary: "₹6–15 LPA (starting, indicative)",
    duration: "5.5 Years (MBBS with Internship)",
    gradient: "from-blue-600 to-indigo-700",
    heroImage: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&q=80",
    color: "blue",
    highlights: ["NEET UG is the sole entrance exam", "Government college fees can be as low as a few thousand rupees/year", "NCR options like GIMS, Santosh & Sharda near Noida", "Strong postgraduate (MD/MS) pathway"],
    topRecruiters: ["AIIMS Network", "State Government Hospitals", "Apollo Hospitals", "Fortis", "Max Healthcare", "Medanta"],
  },
  "mbbs-abroad": {
    name: "MBBS Abroad",
    slug: "mbbs-abroad",
    icon: "🌍",
    description: "MBBS abroad at WHO-listed universities in Russia, Georgia, Uzbekistan, Kyrgyzstan and Nepal — direct admission for NEET-qualified students.",
    longDescription: "MBBS abroad is a popular route for NEET-qualified Indian students who want direct university admission, a lower overall program cost, or simply a different learning environment. Our recommended destinations — Russia, Georgia, Uzbekistan, Kyrgyzstan and Nepal — each offer public/state medical universities with English-medium teaching. As with any MBBS-abroad plan, we verify every university's WHO listing and NMC screening-test (FMGE/NExT) eligibility before recommending it, and help you compare countries side by side based on your budget and preferences.",
    topExams: ["NEET UG"],
    careerPaths: ["General Physician (after FMGE/NExT)", "Postgraduate Studies", "Clinical Practice Abroad"],
    avgSalary: "₹5–14 LPA (post-licensure, indicative)",
    duration: "5.5–6 Years (MBBS, incl. internship)",
    gradient: "from-red-500 to-rose-600",
    heroImage: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&q=80",
    color: "red",
    highlights: ["Direct university admission for NEET-qualified students", "Comparatively lower cost than private Indian colleges", "Choice of Russia, Georgia, Uzbekistan, Kyrgyzstan or Nepal", "Every recommended university is WHO-listed & NMC screening-test eligible"],
    topRecruiters: ["FMGE / NExT eligible on return to India", "Local teaching hospitals (during MBBS)"],
  },
  "mbbs-russia": {
    name: "MBBS Russia",
    slug: "mbbs-russia",
    icon: "🇷🇺",
    description: "MBBS in Russia at recognised public medical universities — a well-established, cost-effective option for NEET-qualified students.",
    longDescription: "Russia has long been a popular MBBS-abroad destination for Indian students, with several public state medical universities offering English-medium programs, direct admission (no separate entrance test beyond NEET UG eligibility), and comparatively lower tuition than private Indian colleges. Students should confirm a university's WHO listing and NMC screening-test eligibility before applying — our counsellors help verify this for every recommendation.",
    topExams: ["NEET UG"],
    careerPaths: ["General Physician (after FMGE/NExT)", "Postgraduate Studies", "Clinical Practice Abroad"],
    avgSalary: "₹6–14 LPA (post-licensure, indicative)",
    duration: "6 Years (MBBS, incl. internship)",
    gradient: "from-red-500 to-rose-600",
    heroImage: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&q=80",
    color: "red",
    highlights: ["Direct university admission, no entrance test", "Large existing Indian student community", "WHO-listed, NMC screening-test eligible universities", "Comparatively lower tuition than private Indian colleges"],
    topRecruiters: ["FMGE / NExT eligible on return to India", "Local teaching hospitals (during MBBS)"],
  },
  "mbbs-georgia": {
    name: "MBBS Georgia",
    slug: "mbbs-georgia",
    icon: "🇬🇪",
    description: "MBBS in Georgia at WHO-listed universities with a European-standard curriculum — a fast-growing choice among NEET-qualified students.",
    longDescription: "Georgia has become one of the most sought-after MBBS-abroad destinations in recent years, thanks to its European-standard medical curriculum, safe environment, and straightforward direct-admission process. Tbilisi, the capital, hosts several recognised medical universities with a growing Indian student community. As with any MBBS-abroad option, we help students verify WHO listing and NMC screening-test eligibility before enrolling.",
    topExams: ["NEET UG"],
    careerPaths: ["General Physician (after FMGE/NExT)", "Postgraduate Studies", "Clinical Practice Abroad"],
    avgSalary: "₹6–14 LPA (post-licensure, indicative)",
    duration: "6 Years (MBBS, incl. internship)",
    gradient: "from-yellow-500 to-orange-600",
    heroImage: "https://images.unsplash.com/photo-1580281658223-9b93f18ae9ae?w=1200&q=80",
    color: "yellow",
    highlights: ["European-standard medical curriculum", "Growing Indian student community in Tbilisi", "No entrance exam for admission", "WHO-listed, NMC screening-test eligible universities"],
    topRecruiters: ["FMGE / NExT eligible on return to India", "Local teaching hospitals (during MBBS)"],
  },
  "mbbs-uzbekistan": {
    name: "MBBS Uzbekistan",
    slug: "mbbs-uzbekistan",
    icon: "🇺🇿",
    description: "MBBS in Uzbekistan at established public medical universities — known for affordable tuition and living costs.",
    longDescription: "Uzbekistan is an increasingly popular MBBS-abroad option due to its lower overall program cost, established public medical universities in Tashkent and Samarkand, and a straightforward direct-admission process for NEET-qualified students. It's a good fit for budget-conscious families who still want a WHO-listed university with English-medium teaching.",
    topExams: ["NEET UG"],
    careerPaths: ["General Physician (after FMGE/NExT)", "Postgraduate Studies", "Clinical Practice Abroad"],
    avgSalary: "₹5–12 LPA (post-licensure, indicative)",
    duration: "5–6 Years (MBBS, incl. internship)",
    gradient: "from-teal-500 to-cyan-600",
    heroImage: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&q=80",
    color: "teal",
    highlights: ["Among the lower-cost MBBS-abroad options", "Established public medical universities", "Direct admission for NEET-qualified students", "Growing Indian student presence"],
    topRecruiters: ["FMGE / NExT eligible on return to India", "Local teaching hospitals (during MBBS)"],
  },
  "mbbs-kyrgyzstan": {
    name: "MBBS Kyrgyzstan",
    slug: "mbbs-kyrgyzstan",
    icon: "🇰🇬",
    description: "MBBS in Kyrgyzstan — among the most affordable MBBS-abroad options, with a large existing Indian student community.",
    longDescription: "Kyrgyzstan is frequently recommended to budget-conscious NEET-qualified students because of its comparatively low total program cost, simple direct-admission process, and a well-established Indian student community across its medical universities in Osh and Jalalabad.",
    topExams: ["NEET UG"],
    careerPaths: ["General Physician (after FMGE/NExT)", "Postgraduate Studies", "Clinical Practice Abroad"],
    avgSalary: "₹5–12 LPA (post-licensure, indicative)",
    duration: "5–6 Years (MBBS, incl. internship)",
    gradient: "from-green-500 to-emerald-600",
    heroImage: "https://images.unsplash.com/photo-1626315869436-d6781ba69d6e?w=1200&q=80",
    color: "green",
    highlights: ["Among the most affordable MBBS-abroad options", "Large existing Indian student community", "Simple direct-admission process", "Compact, manageable university campuses"],
    topRecruiters: ["FMGE / NExT eligible on return to India", "Local teaching hospitals (during MBBS)"],
  },
  "mbbs-nepal": {
    name: "MBBS Nepal",
    slug: "mbbs-nepal",
    icon: "🇳🇵",
    description: "MBBS in Nepal — geographically and culturally close to India, offering an easier transition for students and families.",
    longDescription: "Nepal offers Indian students the advantage of geographic and cultural proximity, making the transition abroad easier for both students and parents. Admission typically requires clearing NEET UG as well as the university's own entrance test. It's a strong option for families who want their child to be within relatively easy reach.",
    topExams: ["NEET UG", "MBBS Entrance Test (Nepal)"],
    careerPaths: ["General Physician (after FMGE/NExT)", "Postgraduate Studies", "Clinical Practice Abroad"],
    avgSalary: "₹6–13 LPA (post-licensure, indicative)",
    duration: "5.5 Years (MBBS, incl. internship)",
    gradient: "from-orange-500 to-amber-600",
    heroImage: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=1200&q=80",
    color: "orange",
    highlights: ["Geographically and culturally close to India", "Easier transition for students and families", "Recognised teaching hospitals", "Entrance-test based admission"],
    topRecruiters: ["FMGE / NExT eligible on return to India", "Local teaching hospitals (during MBBS)"],
  },
  bds: {
    name: "BDS",
    slug: "bds",
    icon: "🦷",
    description: "Bachelor of Dental Surgery (BDS) programs in India through NEET UG counselling.",
    longDescription: "BDS is a strong path into dentistry and oral healthcare, admitted through the same NEET UG counselling process as MBBS. India has a wide network of government and private dental colleges, with reputed options in Delhi and nearby NCR cities. Graduates can practise independently, pursue an MDS specialisation, or move into cosmetic and oral surgery.",
    topExams: ["NEET UG"],
    careerPaths: ["Dentist", "Oral Surgeon", "Orthodontist", "Dental Clinic Owner", "Postgraduate (MDS)"],
    avgSalary: "₹3.5–9 LPA (starting, indicative)",
    duration: "5 Years (BDS with Internship)",
    gradient: "from-purple-600 to-violet-700",
    heroImage: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=1200&q=80",
    color: "purple",
    highlights: ["NEET UG based admission, same as MBBS", "Strong network of govt. & private dental colleges", "Independent practice or clinic ownership possible", "MDS opens up specialisation options"],
    topRecruiters: ["Government Dental Hospitals", "Private Dental Chains", "Own Clinical Practice"],
  },
  bams: {
    name: "BAMS",
    slug: "bams",
    icon: "🌿",
    description: "Bachelor of Ayurvedic Medicine and Surgery (BAMS) — a NEET UG based program in traditional and integrative medicine.",
    longDescription: "BAMS trains students in traditional Ayurvedic medicine alongside modern medical science, admitted through NEET UG counselling. With growing interest in wellness and integrative healthcare in India and abroad, BAMS graduates have opportunities in clinical practice, panchakarma therapy, and wellness consulting.",
    topExams: ["NEET UG"],
    careerPaths: ["Ayurvedic Physician", "Panchakarma Specialist", "Wellness Consultant", "Postgraduate (MD Ayurveda)"],
    avgSalary: "₹3–7 LPA (starting, indicative)",
    duration: "5.5 Years (BAMS with Internship)",
    gradient: "from-indigo-500 to-blue-700",
    heroImage: "https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?w=1200&q=80",
    color: "indigo",
    highlights: ["NEET UG based admission", "Growing demand for wellness & integrative medicine", "Government fee structure at most colleges", "Path to MD (Ayurveda) postgraduate study"],
    topRecruiters: ["Government Ayurvedic Hospitals", "Wellness & Panchakarma Centres", "Own Clinical Practice"],
  },
  bhms: {
    name: "BHMS",
    slug: "bhms",
    icon: "💊",
    description: "Bachelor of Homeopathic Medicine and Surgery (BHMS) — a NEET UG based program for aspiring homeopathic practitioners.",
    longDescription: "BHMS prepares students for a career in homeopathic medicine, admitted through NEET UG counselling. Programs combine classroom study with clinical training at attached homeopathic hospitals, and graduates can go on to independent practice or pursue an MD in Homeopathy.",
    topExams: ["NEET UG"],
    careerPaths: ["Homeopathic Physician", "Clinic Owner", "Research Associate", "Postgraduate (MD Homeopathy)"],
    avgSalary: "₹3–7 LPA (starting, indicative)",
    duration: "5.5 Years (BHMS with Internship)",
    gradient: "from-pink-500 to-rose-600",
    heroImage: "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=1200&q=80",
    color: "pink",
    highlights: ["NEET UG based admission", "Clinical training at attached hospitals", "Independent practice after graduation", "Path to MD (Homeopathy) postgraduate study"],
    topRecruiters: ["Government Homeopathic Hospitals", "Own Clinical Practice"],
  },
  nursing: {
    name: "Nursing",
    slug: "nursing",
    icon: "👩‍⚕️",
    description: "B.Sc Nursing and GNM programs preparing students for a stable, in-demand healthcare career.",
    longDescription: "Nursing offers a stable and in-demand healthcare career path, both in India and internationally. B.Sc Nursing and GNM programs combine classroom learning with extensive hospital-based clinical training. With India's growing hospital sector and strong international demand for trained nurses, this is a practical option for students interested in patient care.",
    topExams: ["NEET UG", "State Nursing Entrance"],
    careerPaths: ["Staff Nurse", "ICU/OT Nurse", "Nurse Educator", "Nurse Practitioner (with further study)"],
    avgSalary: "₹2.5–6 LPA (starting, indicative)",
    duration: "4 Years (B.Sc Nursing) / 3 Years (GNM)",
    gradient: "from-cyan-500 to-teal-600",
    heroImage: "https://images.unsplash.com/photo-1584515933487-779824d29309?w=1200&q=80",
    color: "cyan",
    highlights: ["Stable, in-demand healthcare career", "Strong international demand for trained nurses", "Extensive hospital-based clinical training", "Multiple entry options: B.Sc or GNM"],
    topRecruiters: ["Delhi-NCR Hospitals", "Apollo Hospitals", "Fortis", "International Healthcare Employers"],
  },
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 3600;

export async function generateStaticParams() {
  return Object.keys(streamData).map((slug) => ({ slug }));
}

export default async function StreamDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const colleges = await getColleges();
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
                  <TrendingUp className="w-5 h-5 text-green-600" /> Where Graduates Work
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
                  href="/contact"
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
