import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { colleges } from "@/data/colleges";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CollegeCard from "@/components/CollegeCard";
import {
  MapPin, Star, GraduationCap, Building2, Award, TrendingUp,
  BookOpen, ArrowLeft, CheckCircle2, Phone, Calendar, Shield,
  Users, Briefcase, IndianRupee,
} from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return colleges.map((c) => ({ id: String(c.id) }));
}

export default async function CollegeDetailPage({ params }: PageProps) {
  const { id } = await params;
  const college = colleges.find((c) => c.id === Number(id));
  if (!college) notFound();

  const similar = colleges
    .filter((c) => c.id !== college.id && c.streams.some((s) => college.streams.includes(s)))
    .slice(0, 4);

  const typeColors: Record<string, string> = {
    Government: "bg-green-100 text-green-700 border-green-200",
    Private: "bg-orange-100 text-orange-700 border-orange-200",
    Deemed: "bg-blue-100 text-blue-700 border-blue-200",
  };

  const formatPkg = (n: number) => `₹${(n / 100000).toFixed(1)} LPA`;

  const quickStats = [
    { icon: <IndianRupee className="w-4 h-4" />, label: "Annual Fees", value: college.feesDisplay, color: "text-blue-600" },
    { icon: <TrendingUp className="w-4 h-4" />, label: "Avg Package", value: formatPkg(college.placements.avgPackage), color: "text-green-600" },
    { icon: <TrendingUp className="w-4 h-4" />, label: "Highest Pkg", value: formatPkg(college.placements.highestPackage), color: "text-purple-600" },
    { icon: <Users className="w-4 h-4" />, label: "Reviews", value: college.reviewCount.toLocaleString(), color: "text-gray-700" },
    { icon: <Calendar className="w-4 h-4" />, label: "Established", value: String(college.established), color: "text-gray-700" },
    { icon: <Shield className="w-4 h-4" />, label: "Accreditation", value: college.accreditation, color: "text-emerald-600" },
  ];

  return (
    <>
      <Navbar />
      <div className="bg-gray-50 min-h-screen">
        {/* Hero */}
        <div className="relative h-72 sm:h-96 w-full">
          <Image src={college.image} alt={college.name} fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-6">
            <div className="max-w-7xl mx-auto">
              <Link href="/colleges" className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-sm mb-3 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to Colleges
              </Link>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${typeColors[college.type]}`}>
                      {college.type}
                    </span>
                    <span className="text-xs font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full">
                      {college.accreditation}
                    </span>
                    <span className="text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-full">
                      {college.nirfRank}
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-4xl font-bold text-white mb-1">{college.name}</h1>
                  <div className="flex items-center gap-1.5 text-white/75 text-sm">
                    <MapPin className="w-4 h-4" />
                    {college.location} &nbsp;·&nbsp; Est. {college.established}
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/25 rounded-xl px-4 py-2.5 self-start sm:self-auto">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  <div>
                    <div className="text-white font-bold text-lg leading-none">{college.rating}/5</div>
                    <div className="text-white/60 text-xs">{college.reviewCount.toLocaleString()} reviews</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Bar */}
        <div className="bg-white border-b border-gray-100 sticky top-16 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-3 sm:grid-cols-6 divide-x divide-gray-100">
              {quickStats.map((s) => (
                <div key={s.label} className="py-3 px-3 text-center">
                  <p className="text-xs text-gray-400 mb-0.5">{s.label}</p>
                  <p className={`text-sm font-bold ${s.color}`}>{s.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main */}
            <div className="lg:col-span-2 space-y-5">
              {/* About */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-600" /> About {college.shortName}
                </h2>
                <p className="text-gray-600 leading-relaxed text-sm">{college.description}</p>
              </div>

              {/* Highlights */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-500" /> Key Highlights
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {college.highlights.map((h) => (
                    <div key={h} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Placements */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" /> Placement Statistics 2024
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-5">
                  <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-center">
                    <p className="text-xs text-gray-500 mb-1">Average Package</p>
                    <p className="text-2xl font-bold text-green-600">{formatPkg(college.placements.avgPackage)}</p>
                  </div>
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-center">
                    <p className="text-xs text-gray-500 mb-1">Highest Package</p>
                    <p className="text-2xl font-bold text-blue-600">{formatPkg(college.placements.highestPackage)}</p>
                  </div>
                  <div className="bg-purple-50 border border-purple-100 rounded-xl p-4 text-center col-span-2 sm:col-span-1">
                    <p className="text-xs text-gray-500 mb-1">Top Recruiters</p>
                    <p className="text-2xl font-bold text-purple-600">{college.placements.companies.length}+</p>
                  </div>
                </div>
                <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-gray-500" /> Top Recruiting Companies
                </h3>
                <div className="flex flex-wrap gap-2">
                  {college.placements.companies.map((co) => (
                    <span key={co} className="bg-gray-100 hover:bg-blue-50 text-gray-700 text-sm px-3 py-1.5 rounded-full transition-colors">
                      {co}
                    </span>
                  ))}
                </div>
              </div>

              {/* Courses */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-600" /> Programs Offered
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {college.courses.map((course) => (
                    <div key={course} className="bg-blue-50 border border-blue-100 text-blue-700 text-sm font-medium px-4 py-2.5 rounded-xl text-center">
                      {course}
                    </div>
                  ))}
                </div>
              </div>

              {/* Approvals */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-600" /> Approvals & Affiliations
                </h2>
                <div className="flex flex-wrap gap-2">
                  {college.approvals.map((a) => (
                    <span key={a} className="bg-gray-100 text-gray-700 border border-gray-200 text-sm font-medium px-3 py-1.5 rounded-full">
                      ✓ {a}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-5">
              {/* Quick Info */}
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="bg-blue-600 p-4">
                  <h3 className="font-bold text-white text-lg">{college.shortName}</h3>
                  <p className="text-blue-200 text-sm">{college.location}</p>
                </div>
                <div className="p-4 space-y-3">
                  {[
                    { label: "Annual Fees", value: college.feesDisplay, highlight: true },
                    { label: "NIRF Ranking", value: college.nirfRank },
                    { label: "Established", value: String(college.established) },
                    { label: "College Type", value: college.type },
                    { label: "Accreditation", value: college.accreditation },
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between items-center py-1.5 border-b border-gray-50 last:border-0">
                      <span className="text-sm text-gray-500">{item.label}</span>
                      <span className={`text-sm font-semibold ${item.highlight ? "text-blue-600" : "text-gray-800"}`}>
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Entrance Exams */}
              <div className="bg-white rounded-2xl p-5 border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2 text-sm">
                  <GraduationCap className="w-4 h-4 text-blue-600" /> Accepted Entrance Exams
                </h3>
                <div className="flex flex-wrap gap-2">
                  {college.exams.map((exam) => (
                    <span key={exam} className="bg-purple-50 border border-purple-200 text-purple-700 text-sm font-semibold px-3 py-1.5 rounded-lg">
                      {exam}
                    </span>
                  ))}
                </div>
              </div>

              {/* Streams */}
              <div className="bg-white rounded-2xl p-5 border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-3 text-sm flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-600" /> Academic Streams
                </h3>
                <div className="flex flex-wrap gap-2">
                  {college.streams.map((s) => (
                    <Link
                      key={s}
                      href={`/colleges?stream=${s}`}
                      className="bg-gray-100 hover:bg-blue-50 hover:text-blue-700 text-gray-700 text-sm px-3 py-1.5 rounded-full transition-colors"
                    >
                      {s}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Counselling CTA */}
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-5 text-white">
                <h3 className="font-bold text-lg mb-1">Need Admission Help?</h3>
                <p className="text-blue-200 text-sm mb-4">Talk to our expert counsellors for free guidance on admission to {college.shortName}.</p>
                <Link
                  href="/counselling"
                  className="flex items-center justify-center gap-2 bg-white text-blue-600 font-bold text-sm px-5 py-3 rounded-xl hover:bg-blue-50 transition-colors w-full"
                >
                  <Phone className="w-4 h-4" /> Book Free Counselling
                </Link>
              </div>
            </div>
          </div>

          {/* Similar Colleges */}
          {similar.length > 0 && (
            <div className="mt-10">
              <h2 className="text-xl font-bold text-gray-900 mb-5">Similar Colleges You May Like</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {similar.map((c) => (
                  <CollegeCard key={c.id} college={c} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
