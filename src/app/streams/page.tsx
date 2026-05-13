import Link from "next/link";
import { colleges, streams } from "@/data/colleges";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  GraduationCap, BookOpen, TrendingUp, Building2, ChevronRight, Users, Star,
} from "lucide-react";

const streamDetails: Record<string, {
  slug: string;
  description: string;
  topExams: string[];
  careerPaths: string[];
  avgSalary: string;
  duration: string;
  gradient: string;
  heroImage: string;
}> = {
  Engineering: {
    slug: "engineering",
    description: "Engineering programs equip students with technical and analytical skills to design, build, and innovate. From software to civil, engineering graduates are in high demand across all industries.",
    topExams: ["JEE Advanced", "JEE Main", "BITSAT", "VITEEE", "KCET", "MHT-CET"],
    careerPaths: ["Software Engineer", "Civil Engineer", "Mechanical Engineer", "Data Scientist", "Product Manager"],
    avgSalary: "₹6–12 LPA",
    duration: "4 Years (B.Tech/B.E.)",
    gradient: "from-blue-600 to-indigo-700",
    heroImage: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=1200&q=80",
  },
  Medical: {
    slug: "medical",
    description: "Medical programs train future doctors, surgeons, and healthcare professionals. MBBS and related programs are among the most respected degrees in India.",
    topExams: ["NEET UG", "AIIMS Entrance", "JIPMER"],
    careerPaths: ["Doctor (MBBS)", "Surgeon", "General Physician", "Specialist", "Medical Researcher"],
    avgSalary: "₹8–25 LPA",
    duration: "5.5 Years (MBBS with Internship)",
    gradient: "from-red-500 to-rose-600",
    heroImage: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&q=80",
  },
  Management: {
    slug: "management",
    description: "Management programs develop future business leaders and entrepreneurs. MBA from top IIMs can transform your career trajectory with access to India's top companies.",
    topExams: ["CAT", "XAT", "MAT", "GMAT", "CMAT", "SNAP"],
    careerPaths: ["Business Analyst", "Marketing Manager", "Finance Manager", "Consultant", "Entrepreneur"],
    avgSalary: "₹8–35 LPA",
    duration: "2 Years (MBA) / 5 Years (BBA+MBA)",
    gradient: "from-yellow-500 to-orange-600",
    heroImage: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=80",
  },
  Law: {
    slug: "law",
    description: "Law programs prepare students for careers in litigation, corporate law, judiciary, and policy. Top NLUs produce some of India's finest legal minds.",
    topExams: ["CLAT", "AILET", "LSAT India", "SLAT", "MH CET Law"],
    careerPaths: ["Corporate Lawyer", "Litigator", "Judge", "Legal Consultant", "Policy Analyst"],
    avgSalary: "₹6–25 LPA",
    duration: "5 Years (BA/BBA-LLB) / 3 Years (LLB)",
    gradient: "from-purple-600 to-violet-700",
    heroImage: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200&q=80",
  },
  Design: {
    slug: "design",
    description: "Design programs nurture creative professionals for careers in product design, fashion, communication design, and UX. NID and NIFT are India's top design schools.",
    topExams: ["NID DAT", "NIFT Entrance", "CEED", "UCEED", "Pearl Academy"],
    careerPaths: ["Product Designer", "UX Designer", "Fashion Designer", "Graphic Designer", "Art Director"],
    avgSalary: "₹5–18 LPA",
    duration: "4 Years (B.Des)",
    gradient: "from-pink-500 to-rose-600",
    heroImage: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&q=80",
  },
  Science: {
    slug: "science",
    description: "Pure science programs at IISc, IISERs, and top universities open paths to research, academia, and high-tech industries. B.Sc + M.Sc route is highly valued.",
    topExams: ["CUET", "IISER Aptitude Test", "IISc Entrance", "JEST", "TIFR GS"],
    careerPaths: ["Research Scientist", "Data Analyst", "Academician", "DRDO Scientist", "Biotech Researcher"],
    avgSalary: "₹5–15 LPA",
    duration: "3 Years (B.Sc) / 5 Years (B.S.)",
    gradient: "from-green-500 to-emerald-600",
    heroImage: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=1200&q=80",
  },
  Pharmacy: {
    slug: "pharmacy",
    description: "Pharmacy programs produce professionals for India's ₹4 lakh crore pharma industry. From production to research, pharmacy graduates are in demand globally.",
    topExams: ["GPAT", "NEET (some states)", "State Pharmacy CETs"],
    careerPaths: ["Pharmacist", "Drug Inspector", "QC Analyst", "Medical Representative", "R&D Scientist"],
    avgSalary: "₹3–10 LPA",
    duration: "4 Years (B.Pharma) / 2 Years (D.Pharma)",
    gradient: "from-teal-500 to-cyan-600",
    heroImage: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=1200&q=80",
  },
  Agriculture: {
    slug: "agriculture",
    description: "Agriculture programs train experts for one of India's largest sectors. From agritech startups to ICAR research, agriculture offers diverse career paths.",
    topExams: ["ICAR AIEEA", "CUET", "State Agriculture Entrance"],
    careerPaths: ["Agricultural Scientist", "Agritech Entrepreneur", "Farm Manager", "Food Technologist", "NABARD Officer"],
    avgSalary: "₹4–12 LPA",
    duration: "4 Years (B.Sc Agriculture)",
    gradient: "from-orange-500 to-amber-600",
    heroImage: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1200&q=80",
  },
  Architecture: {
    slug: "architecture",
    description: "Architecture programs blend creativity and technical skills to design the built environment. B.Arch graduates work in construction, urban planning, and interior design.",
    topExams: ["NATA", "JEE Paper 2 (B.Arch)", "CEPT Entrance"],
    careerPaths: ["Architect", "Urban Planner", "Interior Designer", "Project Manager", "BIM Specialist"],
    avgSalary: "₹4–15 LPA",
    duration: "5 Years (B.Arch)",
    gradient: "from-indigo-500 to-blue-700",
    heroImage: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200&q=80",
  },
  Research: {
    slug: "research",
    description: "Research programs at IITs, IISc, and IISERs produce world-class scientists and innovators. Integrated PhD and BS-MS programs are the gold standard for research careers.",
    topExams: ["GATE", "JEST", "CSIR NET", "UGC NET", "TIFR GS"],
    careerPaths: ["Research Scientist", "Professor", "DRDO/ISRO Scientist", "Industrial R&D", "Postdoctoral Researcher"],
    avgSalary: "₹6–20 LPA",
    duration: "2 Years (M.Sc) + 5 Years (Ph.D)",
    gradient: "from-cyan-500 to-teal-600",
    heroImage: "https://images.unsplash.com/photo-1532094349884-543559373b42?w=1200&q=80",
  },
};

export default function StreamsPage() {
  return (
    <>
      <Navbar />
      <div className="bg-gray-50 min-h-screen">
        {/* Hero */}
        <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 py-16 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/15 text-white text-sm font-medium px-4 py-2 rounded-full mb-5">
              <BookOpen className="w-4 h-4" />
              10 Academic Streams
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold text-white mb-4">
              Explore Academic Streams
            </h1>
            <p className="text-blue-100 text-lg max-w-2xl mx-auto">
              Discover the right stream for your career goals. Compare entrance exams, career paths, and top colleges across all major academic disciplines.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-8 text-white/80 text-sm">
              <div className="flex items-center gap-1.5"><Building2 className="w-4 h-4" /> 88+ Top Colleges</div>
              <div className="flex items-center gap-1.5"><GraduationCap className="w-4 h-4" /> 10 Streams</div>
              <div className="flex items-center gap-1.5"><Users className="w-4 h-4" /> 1L+ Students Guided</div>
            </div>
          </div>
        </div>

        {/* Stream Cards */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {streams.map((stream) => {
              const detail = streamDetails[stream.name];
              const streamColleges = colleges.filter((c) => c.streams.includes(stream.name));
              const topCollege = streamColleges.sort((a, b) => a.ranking - b.ranking)[0];

              return (
                <Link key={stream.name} href={`/streams/${detail?.slug || stream.name.toLowerCase()}`}>
                  <div className="bg-white rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300 overflow-hidden group">
                    {/* Gradient Header */}
                    <div className={`bg-gradient-to-br ${detail?.gradient || "from-blue-600 to-indigo-700"} p-6`}>
                      <div className="flex items-center justify-between">
                        <span className="text-4xl">{stream.icon}</span>
                        <span className="bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full">
                          {streamColleges.length} Colleges
                        </span>
                      </div>
                      <h2 className="text-xl font-bold text-white mt-3">{stream.name}</h2>
                      <p className="text-white/75 text-sm mt-1 line-clamp-2">
                        {detail?.description?.slice(0, 90)}...
                      </p>
                    </div>

                    {/* Body */}
                    <div className="p-5">
                      {detail && (
                        <>
                          <div className="grid grid-cols-2 gap-3 mb-4">
                            <div>
                              <p className="text-xs text-gray-400 mb-0.5">Avg. Salary</p>
                              <p className="text-sm font-bold text-green-600">{detail.avgSalary}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-400 mb-0.5">Duration</p>
                              <p className="text-sm font-semibold text-gray-700">{detail.duration.split("(")[0].trim()}</p>
                            </div>
                          </div>

                          <div className="mb-4">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Top Entrance Exams</p>
                            <div className="flex flex-wrap gap-1.5">
                              {detail.topExams.slice(0, 3).map((exam) => (
                                <span key={exam} className="text-xs bg-purple-50 text-purple-700 border border-purple-100 px-2 py-0.5 rounded-full font-medium">
                                  {exam}
                                </span>
                              ))}
                              {detail.topExams.length > 3 && (
                                <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                                  +{detail.topExams.length - 3}
                                </span>
                              )}
                            </div>
                          </div>

                          {topCollege && (
                            <div className="bg-blue-50 rounded-xl p-3 flex items-center justify-between">
                              <div>
                                <p className="text-xs text-gray-500">Top College</p>
                                <p className="text-sm font-semibold text-blue-700">{topCollege.shortName}</p>
                              </div>
                              <div className="flex items-center gap-1">
                                <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                                <span className="text-sm font-bold text-gray-700">{topCollege.rating}</span>
                              </div>
                            </div>
                          )}
                        </>
                      )}

                      <div className="mt-4 flex items-center justify-between text-blue-600 text-sm font-semibold group-hover:gap-3 transition-all">
                        <span>Explore {stream.name}</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Stats Banner */}
        <div className="bg-blue-600 py-10 px-4 mt-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
              {[
                { label: "Academic Streams", value: "10+" },
                { label: "Top Colleges Listed", value: "88+" },
                { label: "Entrance Exams Covered", value: "20+" },
                { label: "Career Paths Mapped", value: "50+" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                  <p className="text-blue-200 text-sm mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stream Comparison Table */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Stream Comparison</h2>
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left px-6 py-4 font-semibold text-gray-700">Stream</th>
                    <th className="text-left px-6 py-4 font-semibold text-gray-700">Duration</th>
                    <th className="text-left px-6 py-4 font-semibold text-gray-700">Top Exam</th>
                    <th className="text-left px-6 py-4 font-semibold text-gray-700">Avg Salary</th>
                    <th className="text-left px-6 py-4 font-semibold text-gray-700">Colleges</th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {streams.map((stream, i) => {
                    const detail = streamDetails[stream.name];
                    const count = colleges.filter((c) => c.streams.includes(stream.name)).length;
                    return (
                      <tr key={stream.name} className={`border-b border-gray-50 hover:bg-blue-50/30 transition-colors ${i % 2 === 0 ? "" : "bg-gray-50/30"}`}>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <span className="text-xl">{stream.icon}</span>
                            <span className="font-semibold text-gray-900">{stream.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{detail?.duration?.split("(")[0].trim() || "—"}</td>
                        <td className="px-6 py-4">
                          <span className="bg-purple-50 text-purple-700 text-xs font-medium px-2 py-0.5 rounded-full">
                            {detail?.topExams[0] || "—"}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-semibold text-green-600">{detail?.avgSalary || "—"}</td>
                        <td className="px-6 py-4 text-gray-700 font-medium">{count}</td>
                        <td className="px-6 py-4">
                          <Link
                            href={`/streams/${detail?.slug || stream.name.toLowerCase()}`}
                            className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                          >
                            View <ChevronRight className="w-4 h-4" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 sm:p-12 text-center">
            <TrendingUp className="w-12 h-12 text-white/80 mx-auto mb-4" />
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Not Sure Which Stream to Choose?</h2>
            <p className="text-blue-100 mb-6 max-w-xl mx-auto">
              Talk to our expert counsellors for free. We help you match your interests and strengths to the right stream and college.
            </p>
            <Link
              href="/counselling"
              className="inline-flex items-center gap-2 bg-white text-blue-600 font-bold px-8 py-3.5 rounded-xl hover:bg-blue-50 transition-colors"
            >
              Book Free Counselling Session
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
