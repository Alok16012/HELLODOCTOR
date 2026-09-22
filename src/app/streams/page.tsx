import Link from "next/link";
import { streams } from "@/data/colleges";
import { getColleges } from "@/lib/content";
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
  "MBBS India": {
    slug: "mbbs-india",
    description: "MBBS in India through NEET UG counselling — government, private and deemed medical colleges. India's most recognised and preferred path to becoming a doctor.",
    topExams: ["NEET UG"],
    careerPaths: ["General Physician", "Surgeon", "Specialist Doctor", "Medical Officer", "Postgraduate (MD/MS)"],
    avgSalary: "₹6–15 LPA (starting)",
    duration: "5.5 Years (MBBS with Internship)",
    gradient: "from-blue-600 to-indigo-700",
    heroImage: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&q=80",
  },
  "MBBS Abroad": {
    slug: "mbbs-abroad",
    description: "MBBS abroad at WHO-listed universities in Russia, Georgia, Uzbekistan, Kyrgyzstan and Nepal — direct admission for NEET-qualified students at a comparatively lower cost.",
    topExams: ["NEET UG"],
    careerPaths: ["General Physician (after FMGE/NExT)", "Postgraduate Studies", "Clinical Practice Abroad"],
    avgSalary: "₹5–14 LPA (post-licensure, indicative)",
    duration: "5.5–6 Years (MBBS, incl. internship)",
    gradient: "from-red-500 to-rose-600",
    heroImage: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&q=80",
  },
  BDS: {
    slug: "bds",
    description: "Bachelor of Dental Surgery (BDS) programs in India through NEET UG counselling — a strong path into dentistry and oral healthcare.",
    topExams: ["NEET UG"],
    careerPaths: ["Dentist", "Oral Surgeon", "Orthodontist", "Dental Clinic Owner", "Postgraduate (MDS)"],
    avgSalary: "₹3.5–9 LPA (starting)",
    duration: "5 Years (BDS with Internship)",
    gradient: "from-purple-600 to-violet-700",
    heroImage: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=1200&q=80",
  },
  BAMS: {
    slug: "bams",
    description: "Bachelor of Ayurvedic Medicine and Surgery (BAMS) — a NEET UG based program for students interested in traditional and integrative medicine.",
    topExams: ["NEET UG"],
    careerPaths: ["Ayurvedic Physician", "Panchakarma Specialist", "Wellness Consultant", "Postgraduate (MD Ayurveda)"],
    avgSalary: "₹3–7 LPA (starting)",
    duration: "5.5 Years (BAMS with Internship)",
    gradient: "from-indigo-500 to-blue-700",
    heroImage: "https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?w=1200&q=80",
  },
  BHMS: {
    slug: "bhms",
    description: "Bachelor of Homeopathic Medicine and Surgery (BHMS) — a NEET UG based program for aspiring homeopathic practitioners.",
    topExams: ["NEET UG"],
    careerPaths: ["Homeopathic Physician", "Clinic Owner", "Research Associate", "Postgraduate (MD Homeopathy)"],
    avgSalary: "₹3–7 LPA (starting)",
    duration: "5.5 Years (BHMS with Internship)",
    gradient: "from-pink-500 to-rose-600",
    heroImage: "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=1200&q=80",
  },
  Nursing: {
    slug: "nursing",
    description: "B.Sc Nursing and GNM programs preparing students for a stable, in-demand healthcare career in India and abroad.",
    topExams: ["NEET UG", "State Nursing Entrance"],
    careerPaths: ["Staff Nurse", "ICU/OT Nurse", "Nurse Educator", "Nurse Practitioner (with further study)"],
    avgSalary: "₹2.5–6 LPA (starting)",
    duration: "4 Years (B.Sc Nursing) / 3 Years (GNM)",
    gradient: "from-cyan-500 to-teal-600",
    heroImage: "https://images.unsplash.com/photo-1584515933487-779824d29309?w=1200&q=80",
  },
};

export const revalidate = 3600;

export default async function StreamsPage() {
  const colleges = await getColleges();
  return (
    <>
      <Navbar />
      <div className="bg-gray-50 min-h-screen">
        {/* Hero */}
        <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 py-16 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/15 text-white text-sm font-medium px-4 py-2 rounded-full mb-5">
              <BookOpen className="w-4 h-4" />
              MBBS &amp; Medical Programs
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold text-white mb-4">
              Explore Medical Programs
            </h1>
            <p className="text-blue-100 text-lg max-w-2xl mx-auto">
              Compare MBBS options in India and abroad, along with BDS, BAMS, BHMS and Nursing — entrance exams, career paths and top colleges.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-8 text-white/80 text-sm">
              <div className="flex items-center gap-1.5"><Building2 className="w-4 h-4" /> 28+ Colleges &amp; Universities</div>
              <div className="flex items-center gap-1.5"><GraduationCap className="w-4 h-4" /> 6 Countries</div>
              <div className="flex items-center gap-1.5"><Users className="w-4 h-4" /> Free NEET Counselling</div>
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
                { label: "Medical Programs", value: "10" },
                { label: "Colleges & Universities Listed", value: "28+" },
                { label: "Countries Covered", value: "6" },
                { label: "Career Paths Mapped", value: "20+" },
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
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Not Sure Which Option to Choose?</h2>
            <p className="text-blue-100 mb-6 max-w-xl mx-auto">
              Talk to our NEET counsellors for free. We help you match your NEET score and budget to the right medical college.
            </p>
            <Link
              href="/contact"
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
