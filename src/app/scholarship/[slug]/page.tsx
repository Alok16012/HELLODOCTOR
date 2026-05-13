import { notFound } from "next/navigation";
import Link from "next/link";
import { scholarships } from "@/data/scholarships";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  ArrowLeft, Award, IndianRupee, Calendar, Users, BookOpen,
  CheckCircle2, ChevronRight, Globe, Building2, GraduationCap, Star,
  FileText, TrendingUp, Landmark, RefreshCw, Phone, Clock,
  AlertCircle, ExternalLink, Shield,
} from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return scholarships.map((s) => ({ slug: s.slug }));
}

const providerIcons: Record<string, React.ReactNode> = {
  Government: <Landmark className="w-5 h-5 text-green-600" />,
  Private: <Building2 className="w-5 h-5 text-orange-500" />,
  International: <Globe className="w-5 h-5 text-blue-500" />,
  University: <GraduationCap className="w-5 h-5 text-purple-500" />,
};

const providerGradient: Record<string, string> = {
  Government: "from-green-600 to-emerald-700",
  Private: "from-orange-500 to-amber-600",
  International: "from-blue-600 to-indigo-700",
  University: "from-purple-600 to-violet-700",
};

const providerBg: Record<string, string> = {
  Government: "bg-green-50 border-green-200",
  Private: "bg-orange-50 border-orange-200",
  International: "bg-blue-50 border-blue-200",
  University: "bg-purple-50 border-purple-200",
};

const providerText: Record<string, string> = {
  Government: "text-green-700",
  Private: "text-orange-700",
  International: "text-blue-700",
  University: "text-purple-700",
};

export default async function ScholarshipDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const scholarship = scholarships.find((s) => s.slug === slug);
  if (!scholarship) notFound();

  const related = scholarships
    .filter((s) => s.id !== scholarship.id && (
      s.providerType === scholarship.providerType ||
      s.level.some((l) => scholarship.level.includes(l))
    ))
    .slice(0, 3);

  const s = scholarship;

  return (
    <>
      <Navbar />
      <div className="bg-gray-50 min-h-screen">

        {/* Hero Banner */}
        <div className={`bg-gradient-to-br ${providerGradient[s.providerType]} py-12 px-4 relative overflow-hidden`}>
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl" />
          </div>
          <div className="max-w-7xl mx-auto relative">
            <Link href="/scholarship" className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-sm mb-4 transition-colors">
              <ArrowLeft className="w-4 h-4" /> All Scholarships
            </Link>
            <div className="flex flex-col sm:flex-row sm:items-start gap-5">
              <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center shrink-0">
                {providerIcons[s.providerType]}
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full border border-white/20">
                    {s.providerType}
                  </span>
                  <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full border border-white/20">
                    {s.category}
                  </span>
                  {s.featured && (
                    <span className="bg-yellow-400/30 text-yellow-100 text-xs font-bold px-3 py-1 rounded-full border border-yellow-300/30 flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-300 text-yellow-300" /> Featured
                    </span>
                  )}
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight mb-1">{s.name}</h1>
                <p className="text-white/70 text-sm">{s.provider}</p>
              </div>
              <div className="bg-white/15 backdrop-blur border border-white/25 rounded-2xl px-6 py-4 text-center shrink-0">
                <p className="text-white/70 text-xs mb-1">Scholarship Value</p>
                <p className="text-2xl font-black text-yellow-300">{s.amountDisplay}</p>
                <p className="text-white/60 text-xs mt-1">{s.amountType}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Quick Stats */}
        <div className="bg-white border-b border-gray-100 sticky top-16 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-4 divide-x divide-gray-100">
              {[
                { label: "Deadline", value: s.deadline, urgent: s.deadline !== "Rolling (Apply Anytime)" },
                { label: "Awards/Year", value: s.noOfAwards },
                { label: "Min. Marks", value: s.minMarks > 0 ? `${s.minMarks}%` : "No Limit" },
                { label: "Income Limit", value: s.incomeLimitDisplay },
              ].map((stat) => (
                <div key={stat.label} className="py-3 px-3 sm:px-5 text-center">
                  <p className="text-xs text-gray-400 mb-0.5">{stat.label}</p>
                  <p className={`text-xs sm:text-sm font-bold ${stat.urgent ? "text-red-500" : "text-gray-800"}`}>{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-5">

              {/* About */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-600" /> About This Scholarship
                </h2>
                <p className="text-gray-600 leading-relaxed text-sm">{s.description}</p>
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { label: "Est. Year", value: String(s.establishedYear) },
                    { label: "Application Mode", value: s.applicationMode },
                    { label: "Award Type", value: s.amountType },
                  ].map((item) => (
                    <div key={item.label} className={`border rounded-xl p-3 ${providerBg[s.providerType]}`}>
                      <p className="text-xs text-gray-500 mb-0.5">{item.label}</p>
                      <p className={`text-sm font-bold ${providerText[s.providerType]}`}>{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Eligibility */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-600" /> Eligibility Criteria
                </h2>
                <div className="space-y-3">
                  {s.eligibilityCriteria.map((c, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700 leading-relaxed">{c}</span>
                    </div>
                  ))}
                </div>
                {/* Quick eligibility checklist */}
                <div className="mt-5 p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <p className="text-sm font-bold text-blue-800 mb-3 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" /> Quick Eligibility Check
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-xs text-gray-700 flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-blue-500" />
                      Min. Marks: <strong>{s.minMarks > 0 ? `${s.minMarks}%` : "No Limit"}</strong>
                    </div>
                    <div className="text-xs text-gray-700 flex items-center gap-1.5">
                      <IndianRupee className="w-3.5 h-3.5 text-blue-500" />
                      Income: <strong>{s.incomeLimitDisplay}</strong>
                    </div>
                    <div className="text-xs text-gray-700 flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-blue-500" />
                      Level: <strong>{s.level.join(", ")}</strong>
                    </div>
                    <div className="text-xs text-gray-700 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-blue-500" />
                      Stream: <strong>{s.streams.join(", ")}</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Benefits */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-500" /> What You'll Get
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {s.benefits.map((b, i) => (
                    <div key={i} className="flex items-start gap-2.5 bg-green-50 rounded-xl p-3 border border-green-100">
                      <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700 leading-snug">{b}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Documents Required */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" /> Documents Required
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {s.documents.map((doc, i) => (
                    <div key={i} className="flex items-center gap-2.5 py-2 border-b border-gray-50 last:border-0">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                        <span className="text-xs font-bold text-blue-600">{i + 1}</span>
                      </div>
                      <span className="text-sm text-gray-700">{doc}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-yellow-50 rounded-xl border border-yellow-100 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-yellow-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-yellow-800">Keep both physical and digital (PDF/JPEG) copies of all documents ready before starting your application.</p>
                </div>
              </div>

              {/* Selection Process */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" /> Selection Process
                </h2>
                <p className="text-sm text-gray-600 leading-relaxed">{s.selectionProcess}</p>
              </div>

              {/* Renewal */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <RefreshCw className="w-5 h-5 text-blue-600" /> Renewal Criteria
                </h2>
                <p className="text-sm text-gray-600 leading-relaxed">{s.renewalCriteria}</p>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-5">

              {/* Apply Now Card */}
              <div className={`rounded-2xl overflow-hidden border ${providerBg[s.providerType]}`}>
                <div className={`bg-gradient-to-br ${providerGradient[s.providerType]} p-5`}>
                  <h3 className="font-bold text-white text-lg mb-1">Apply Now</h3>
                  <p className="text-white/70 text-sm">{s.noOfAwards} scholarships available</p>
                </div>
                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-xs text-gray-500">Deadline</span>
                    <span className={`text-xs font-bold flex items-center gap-1 ${
                      s.deadline === "Rolling (Apply Anytime)" ? "text-green-600" : "text-red-500"
                    }`}>
                      <Calendar className="w-3.5 h-3.5" /> {s.deadline}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-xs text-gray-500">Mode</span>
                    <span className="text-xs font-bold text-gray-800">{s.applicationMode}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-xs text-gray-500">Value</span>
                    <span className={`text-sm font-black ${providerText[s.providerType]}`}>{s.amountDisplay}</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-xs text-gray-500">Est.</span>
                    <span className="text-xs font-bold text-gray-800">{s.establishedYear}</span>
                  </div>
                  <a
                    href={s.applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center justify-center gap-2 bg-gradient-to-r ${providerGradient[s.providerType]} text-white font-bold text-sm px-5 py-3.5 rounded-xl hover:opacity-90 transition-opacity w-full mt-2`}
                  >
                    Apply Now <ExternalLink className="w-4 h-4" />
                  </a>
                  <p className="text-xs text-center text-gray-400">Opens on official government/provider website</p>
                </div>
              </div>

              {/* Streams & Level */}
              <div className="bg-white rounded-2xl p-5 border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-3 text-sm">Eligible For</h3>
                <div className="mb-3">
                  <p className="text-xs text-gray-400 mb-2">Education Level</p>
                  <div className="flex flex-wrap gap-1.5">
                    {s.level.map((l) => (
                      <span key={l} className="text-xs bg-blue-50 text-blue-700 border border-blue-100 px-2.5 py-1 rounded-full font-medium">
                        {l}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-2">Streams</p>
                  <div className="flex flex-wrap gap-1.5">
                    {s.streams.map((st) => (
                      <span key={st} className="text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full">
                        {st}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="bg-white rounded-2xl p-5 border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-3 text-sm">Tags</h3>
                <div className="flex flex-wrap gap-1.5">
                  {s.tags.map((tag) => (
                    <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-default">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Contact */}
              <div className="bg-white rounded-2xl p-5 border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-3 text-sm flex items-center gap-2">
                  <Phone className="w-4 h-4 text-blue-600" /> Contact & Help
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">{s.contact}</p>
                <div className="mt-3 p-3 bg-blue-50 rounded-xl">
                  <p className="text-xs text-blue-700 flex items-start gap-1.5">
                    <Clock className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    For government schemes, also visit <strong>scholarships.gov.in</strong> helpdesk for assistance.
                  </p>
                </div>
              </div>

              {/* CTA */}
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-5 text-white">
                <h3 className="font-bold text-lg mb-1">Need Help Applying?</h3>
                <p className="text-blue-200 text-sm mb-4">Our counsellors help you with document preparation, application filling, and following up on status.</p>
                <Link
                  href="/counselling"
                  className="flex items-center justify-center gap-2 bg-white text-blue-600 font-bold text-sm px-5 py-3 rounded-xl hover:bg-blue-50 transition-colors w-full"
                >
                  <Phone className="w-4 h-4" /> Get Free Help
                </Link>
              </div>

              {/* Related Scholarships */}
              {related.length > 0 && (
                <div className="bg-white rounded-2xl p-5 border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-900 text-sm">Similar Scholarships</h3>
                    <Link href="/scholarship" className="text-xs text-blue-600 font-medium flex items-center gap-0.5">
                      View All <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                  <div className="space-y-3">
                    {related.map((r) => (
                      <Link key={r.id} href={`/scholarship/${r.slug}`} className="flex items-start gap-3 group">
                        <div className={`w-9 h-9 shrink-0 rounded-xl flex items-center justify-center ${
                          r.providerType === "Government" ? "bg-green-100" :
                          r.providerType === "International" ? "bg-blue-100" : "bg-orange-100"
                        }`}>
                          {providerIcons[r.providerType]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-gray-800 line-clamp-2 group-hover:text-blue-600 transition-colors leading-snug">{r.shortName}</p>
                          <p className="text-xs font-bold text-green-600 mt-0.5">{r.amountDisplay}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-600 shrink-0 mt-1" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
