"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { scholarshipCategories, scholarshipStreams, scholarshipLevels, type Scholarship } from "@/data/scholarships";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Search, Filter, X, Award, IndianRupee, Calendar, Users, BookOpen,
  CheckCircle2, ChevronRight, Globe, Building2, GraduationCap, Star,
  Clock, FileText, TrendingUp, Landmark, RefreshCw,
} from "lucide-react";

const providerIcons: Record<string, React.ReactNode> = {
  Government: <Landmark className="w-4 h-4 text-green-600" />,
  Private: <Building2 className="w-4 h-4 text-orange-500" />,
  International: <Globe className="w-4 h-4 text-blue-500" />,
  University: <GraduationCap className="w-4 h-4 text-purple-500" />,
};

const providerColors: Record<string, string> = {
  Government: "bg-green-100 text-green-700 border-green-200",
  Private: "bg-orange-100 text-orange-700 border-orange-200",
  International: "bg-blue-100 text-blue-700 border-blue-200",
  University: "bg-purple-100 text-purple-700 border-purple-200",
};

const amountRanges = [
  { label: "All Amounts", min: 0, max: Infinity },
  { label: "Under ₹25,000", min: 0, max: 25000 },
  { label: "₹25,000–₹1 Lakh", min: 25000, max: 100000 },
  { label: "₹1 Lakh–₹5 Lakhs", min: 100000, max: 500000 },
  { label: "₹5 Lakhs+", min: 500000, max: Infinity },
];

export default function ScholarshipClient({ scholarships }: { scholarships: Scholarship[] }) {
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedStream, setSelectedStream] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [selectedAmount, setSelectedAmount] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    return scholarships.filter((s) => {
      const matchSearch =
        !search ||
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.provider.toLowerCase().includes(search.toLowerCase()) ||
        s.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));

      const matchType =
        selectedType === "all" ||
        s.providerType.toLowerCase() === selectedType;

      const matchStream =
        selectedStream === "all" ||
        s.streams.includes(selectedStream) ||
        s.streams.includes("Any Stream");

      const matchLevel =
        selectedLevel === "all" ||
        s.level.includes(selectedLevel as "Class 11-12" | "UG" | "PG" | "PhD" | "Diploma");

      const range = amountRanges[selectedAmount];
      const matchAmount = s.amount >= range.min && s.amount <= range.max;

      return matchSearch && matchType && matchStream && matchLevel && matchAmount;
    });
  }, [scholarships, search, selectedType, selectedStream, selectedLevel, selectedAmount]);

  const featured = scholarships.filter((s) => s.featured);
  const activeFilters = [
    selectedType !== "all" && selectedType,
    selectedStream !== "all" && selectedStream,
    selectedLevel !== "all" && selectedLevel,
    selectedAmount !== 0 && amountRanges[selectedAmount].label,
  ].filter(Boolean) as string[];

  const clearAll = () => {
    setSearch("");
    setSelectedType("all");
    setSelectedStream("all");
    setSelectedLevel("all");
    setSelectedAmount(0);
  };

  const stats = [
    { label: "Total Scholarships", value: `${scholarships.length}+`, icon: <Award className="w-5 h-5" />, color: "text-blue-600" },
    { label: "Government Schemes", value: `${scholarships.filter(s => s.providerType === "Government").length}`, icon: <Landmark className="w-5 h-5" />, color: "text-green-600" },
    { label: "Private Scholarships", value: `${scholarships.filter(s => s.providerType === "Private").length}`, icon: <Building2 className="w-5 h-5" />, color: "text-orange-500" },
    { label: "Study Abroad", value: `${scholarships.filter(s => s.providerType === "International").length}`, icon: <Globe className="w-5 h-5" />, color: "text-indigo-600" },
  ];

  return (
    <>
      <Navbar />
      <div className="bg-gray-50 min-h-screen">

        {/* Hero */}
        <div className="bg-gradient-to-br from-indigo-800 via-blue-700 to-blue-600 py-16 px-4 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-8 left-10 w-64 h-64 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-4 right-10 w-96 h-96 bg-yellow-300 rounded-full blur-3xl" />
          </div>
          <div className="max-w-7xl mx-auto relative">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 bg-white/15 text-white text-sm font-medium px-4 py-2 rounded-full mb-5 border border-white/20">
                <Award className="w-4 h-4 text-yellow-300" />
                India's Most Complete Scholarship Guide 2025
              </div>
              <h1 className="text-3xl sm:text-5xl font-bold text-white mb-4 leading-tight">
                Find Scholarships Worth<br />
                <span className="text-yellow-300">Crores of Rupees</span>
              </h1>
              <p className="text-blue-100 text-lg max-w-2xl mx-auto mb-8">
                Government schemes, corporate CSR, international fellowships — discover every scholarship you're eligible for and never miss a deadline.
              </p>
            </div>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, provider, category (e.g. 'GATE', 'SC', 'Study Abroad')..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl text-sm bg-white shadow-lg border border-white/20 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                {search && (
                  <button onClick={() => setSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-10">
              {stats.map((s) => (
                <div key={s.label} className="bg-white/10 backdrop-blur border border-white/15 rounded-2xl p-4 text-center">
                  <div className={`flex justify-center mb-1 ${s.color} opacity-90`}>{s.icon}</div>
                  <p className="text-2xl font-bold text-white">{s.value}</p>
                  <p className="text-blue-200 text-xs mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Important Notice */}
        <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-3">
          <div className="max-w-7xl mx-auto flex items-center gap-2 text-yellow-800 text-sm">
            <Clock className="w-4 h-4 shrink-0 text-yellow-600" />
            <span><strong>Pro Tip:</strong> Apply to the National Scholarship Portal (NSP) first — it covers 50+ government schemes in one application.</span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col lg:flex-row gap-6">

            {/* Sidebar Filters */}
            <aside className="lg:w-72 shrink-0">
              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden w-full flex items-center justify-between bg-white border border-gray-200 rounded-xl px-4 py-3 mb-3 text-sm font-semibold text-gray-700"
              >
                <span className="flex items-center gap-2"><Filter className="w-4 h-4 text-blue-600" /> Filters {activeFilters.length > 0 && <span className="bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded-full">{activeFilters.length}</span>}</span>
                <ChevronRight className={`w-4 h-4 transition-transform ${showFilters ? "rotate-90" : ""}`} />
              </button>

              <div className={`space-y-4 ${showFilters ? "block" : "hidden lg:block"}`}>
                {/* Scholarship Type */}
                <div className="bg-white rounded-2xl p-5 border border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-3 text-sm flex items-center gap-2">
                    <Award className="w-4 h-4 text-blue-600" /> Scholarship Type
                  </h3>
                  <div className="space-y-2">
                    {scholarshipCategories.map((cat) => (
                      <label key={cat.slug} className="flex items-center gap-2.5 cursor-pointer group">
                        <input
                          type="radio"
                          name="type"
                          value={cat.slug}
                          checked={selectedType === cat.slug}
                          onChange={() => setSelectedType(cat.slug)}
                          className="accent-blue-600"
                        />
                        <span className={`text-sm transition-colors ${selectedType === cat.slug ? "text-blue-600 font-semibold" : "text-gray-700 group-hover:text-blue-600"}`}>
                          {cat.name}
                        </span>
                        <span className="ml-auto text-xs text-gray-400">
                          {cat.slug === "all" ? scholarships.length : scholarships.filter(s => s.providerType.toLowerCase() === cat.slug).length}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Level */}
                <div className="bg-white rounded-2xl p-5 border border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-3 text-sm flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-blue-600" /> Education Level
                  </h3>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2.5 cursor-pointer group">
                      <input type="radio" name="level" value="all" checked={selectedLevel === "all"} onChange={() => setSelectedLevel("all")} className="accent-blue-600" />
                      <span className={`text-sm ${selectedLevel === "all" ? "text-blue-600 font-semibold" : "text-gray-700"}`}>All Levels</span>
                    </label>
                    {scholarshipLevels.map((l) => (
                      <label key={l} className="flex items-center gap-2.5 cursor-pointer group">
                        <input type="radio" name="level" value={l} checked={selectedLevel === l} onChange={() => setSelectedLevel(l)} className="accent-blue-600" />
                        <span className={`text-sm transition-colors ${selectedLevel === l ? "text-blue-600 font-semibold" : "text-gray-700 group-hover:text-blue-600"}`}>{l}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Stream */}
                <div className="bg-white rounded-2xl p-5 border border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-3 text-sm flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-blue-600" /> Stream
                  </h3>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input type="radio" name="stream" value="all" checked={selectedStream === "all"} onChange={() => setSelectedStream("all")} className="accent-blue-600" />
                      <span className={`text-sm ${selectedStream === "all" ? "text-blue-600 font-semibold" : "text-gray-700"}`}>All Streams</span>
                    </label>
                    {scholarshipStreams.filter(s => s !== "Any Stream").map((s) => (
                      <label key={s} className="flex items-center gap-2.5 cursor-pointer group">
                        <input type="radio" name="stream" value={s} checked={selectedStream === s} onChange={() => setSelectedStream(s)} className="accent-blue-600" />
                        <span className={`text-sm transition-colors ${selectedStream === s ? "text-blue-600 font-semibold" : "text-gray-700 group-hover:text-blue-600"}`}>{s}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Amount Range */}
                <div className="bg-white rounded-2xl p-5 border border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-3 text-sm flex items-center gap-2">
                    <IndianRupee className="w-4 h-4 text-blue-600" /> Scholarship Amount
                  </h3>
                  <div className="space-y-2">
                    {amountRanges.map((range, i) => (
                      <label key={i} className="flex items-center gap-2.5 cursor-pointer group">
                        <input type="radio" name="amount" value={i} checked={selectedAmount === i} onChange={() => setSelectedAmount(i)} className="accent-blue-600" />
                        <span className={`text-sm transition-colors ${selectedAmount === i ? "text-blue-600 font-semibold" : "text-gray-700 group-hover:text-blue-600"}`}>{range.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {activeFilters.length > 0 && (
                  <button onClick={clearAll} className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 border border-red-100 py-2.5 rounded-xl text-sm font-semibold hover:bg-red-100 transition-colors">
                    <RefreshCw className="w-4 h-4" /> Clear All Filters
                  </button>
                )}
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 min-w-0">

              {/* Featured Scholarships */}
              {!search && selectedType === "all" && selectedStream === "all" && selectedLevel === "all" && selectedAmount === 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" /> Featured Scholarships
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {featured.map((s) => (
                      <Link key={s.id} href={`/scholarship/${s.slug}`}>
                        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-5 text-white hover:shadow-xl transition-all duration-300 group cursor-pointer">
                          <div className="flex items-start justify-between mb-3">
                            <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                              s.providerType === "Government" ? "bg-green-500/20 text-green-200 border-green-400/30" :
                              s.providerType === "International" ? "bg-blue-300/20 text-blue-100 border-blue-300/30" :
                              "bg-orange-400/20 text-orange-100 border-orange-300/30"
                            }`}>
                              {s.providerType}
                            </span>
                            <span className="text-yellow-300 text-lg font-black">{s.amountDisplay}</span>
                          </div>
                          <h3 className="font-bold text-white text-sm leading-snug mb-1 group-hover:text-blue-100 transition-colors line-clamp-2">
                            {s.name}
                          </h3>
                          <p className="text-blue-200 text-xs mb-3 line-clamp-2">{s.description.slice(0, 100)}...</p>
                          <div className="flex items-center justify-between text-xs text-blue-200">
                            <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {s.noOfAwards}</span>
                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {s.deadline}</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Active Filter Chips */}
              {(activeFilters.length > 0 || search) && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {search && (
                    <span className="flex items-center gap-1.5 bg-blue-50 text-blue-700 border border-blue-200 text-xs px-3 py-1.5 rounded-full font-medium">
                      Search: "{search}"
                      <button onClick={() => setSearch("")}><X className="w-3 h-3" /></button>
                    </span>
                  )}
                  {activeFilters.map((f) => (
                    <span key={f} className="flex items-center gap-1.5 bg-blue-50 text-blue-700 border border-blue-200 text-xs px-3 py-1.5 rounded-full font-medium">
                      {f}
                      <button onClick={clearAll}><X className="w-3 h-3" /></button>
                    </span>
                  ))}
                </div>
              )}

              {/* Results Header */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">
                  {search || activeFilters.length > 0 ? "Search Results" : "All Scholarships"}
                  <span className="text-gray-400 font-normal text-sm ml-2">({filtered.length} found)</span>
                </h2>
              </div>

              {/* Scholarship Cards */}
              <div className="space-y-4">
                {filtered.map((s) => (
                  <Link key={s.id} href={`/scholarship/${s.slug}`}>
                    <div className="bg-white rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all duration-300 p-5 group cursor-pointer">
                      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                        {/* Left: Icon */}
                        <div className={`w-12 h-12 shrink-0 rounded-xl flex items-center justify-center ${
                          s.providerType === "Government" ? "bg-green-100" :
                          s.providerType === "International" ? "bg-blue-100" :
                          s.providerType === "University" ? "bg-purple-100" : "bg-orange-100"
                        }`}>
                          {providerIcons[s.providerType]}
                        </div>

                        {/* Center: Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1.5">
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${providerColors[s.providerType]}`}>
                              {s.providerType}
                            </span>
                            {s.featured && (
                              <span className="text-xs font-bold bg-yellow-50 text-yellow-700 border border-yellow-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                                <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" /> Featured
                              </span>
                            )}
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{s.category}</span>
                          </div>

                          <h3 className="font-bold text-gray-900 text-base leading-snug mb-1 group-hover:text-blue-600 transition-colors">
                            {s.name}
                          </h3>
                          <p className="text-xs text-gray-500 mb-2">{s.provider}</p>
                          <p className="text-sm text-gray-600 line-clamp-2 mb-3">{s.description.slice(0, 150)}...</p>

                          {/* Tags row */}
                          <div className="flex flex-wrap gap-1.5 mb-3">
                            {s.level.slice(0, 3).map((l) => (
                              <span key={l} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">{l}</span>
                            ))}
                            {s.streams.slice(0, 2).map((st) => (
                              <span key={st} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{st}</span>
                            ))}
                          </div>

                          {/* Criteria quick info */}
                          <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                            {s.minMarks > 0 && (
                              <span className="flex items-center gap-1">
                                <TrendingUp className="w-3.5 h-3.5 text-blue-500" />
                                Min {s.minMarks}% marks
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <IndianRupee className="w-3.5 h-3.5 text-gray-400" />
                              {s.incomeLimitDisplay}
                            </span>
                            <span className="flex items-center gap-1">
                              <FileText className="w-3.5 h-3.5 text-gray-400" />
                              {s.applicationMode} Application
                            </span>
                          </div>
                        </div>

                        {/* Right: Amount + Deadline */}
                        <div className="sm:text-right shrink-0 flex sm:flex-col flex-row items-center sm:items-end gap-3 sm:gap-2">
                          <div>
                            <p className="text-xs text-gray-400 sm:text-right">Scholarship Value</p>
                            <p className="text-base font-black text-blue-600">{s.amountDisplay}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400 sm:text-right">Deadline</p>
                            <p className={`text-xs font-bold flex items-center gap-1 ${
                              s.deadline === "Rolling (Apply Anytime)" ? "text-green-600" : "text-red-500"
                            }`}>
                              <Calendar className="w-3 h-3" />
                              {s.deadline}
                            </p>
                          </div>
                          <div className="sm:mt-2">
                            <span className="inline-flex items-center gap-1 bg-blue-600 text-white text-xs font-bold px-3 py-2 rounded-xl hover:bg-blue-700 transition-colors">
                              View Details <ChevronRight className="w-3.5 h-3.5" />
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}

                {filtered.length === 0 && (
                  <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                    <Award className="w-12 h-12 mx-auto mb-3 text-gray-200" />
                    <p className="text-gray-500 text-lg font-medium">No scholarships match your filters</p>
                    <p className="text-gray-400 text-sm mt-1">Try adjusting your search criteria</p>
                    <button onClick={clearAll} className="mt-4 text-blue-600 text-sm font-semibold hover:underline">
                      Clear all filters
                    </button>
                  </div>
                )}
              </div>

              {/* How to Apply Section */}
              <div className="mt-10 bg-white rounded-2xl border border-gray-100 p-6 sm:p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" /> How to Apply for Scholarships
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {[
                    { step: "01", title: "Check Eligibility", desc: "Review income limit, marks requirement, caste/category criteria, and education level", color: "bg-blue-600" },
                    { step: "02", title: "Gather Documents", desc: "Collect income certificate, marksheets, Aadhaar, admission proof, and bank details", color: "bg-green-600" },
                    { step: "03", title: "Apply Online", desc: "Register on NSP (scholarships.gov.in) for government schemes or company websites for private", color: "bg-purple-600" },
                    { step: "04", title: "Track & Renew", desc: "Check application status regularly, renew before deadline each year with updated documents", color: "bg-orange-500" },
                  ].map((s) => (
                    <div key={s.step} className="relative">
                      <div className={`${s.color} text-white text-xs font-black w-8 h-8 rounded-full flex items-center justify-center mb-3`}>
                        {s.step}
                      </div>
                      <h3 className="font-bold text-gray-900 text-sm mb-1">{s.title}</h3>
                      <p className="text-xs text-gray-500 leading-relaxed">{s.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Important Portals */}
          <div className="mt-10 bg-white rounded-2xl border border-gray-100 p-6 sm:p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-5">Important Scholarship Portals</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: "National Scholarship Portal (NSP)", url: "scholarships.gov.in", desc: "Official Govt. portal — 50+ central schemes", color: "border-green-200 bg-green-50", textColor: "text-green-700", badge: "Government" },
                { name: "Buddy4Study", url: "buddy4study.com", desc: "India's largest private scholarship platform", color: "border-blue-200 bg-blue-50", textColor: "text-blue-700", badge: "Private" },
                { name: "Vidyasaarathi", url: "vidyasaarathi.co.in", desc: "NSE Foundation — corporate scholarships", color: "border-purple-200 bg-purple-50", textColor: "text-purple-700", badge: "Corporate" },
                { name: "AICTE Scholarships", url: "aicte-india.org", desc: "PG GATE stipend & technical scholarships", color: "border-orange-200 bg-orange-50", textColor: "text-orange-700", badge: "Technical" },
                { name: "INSPIRE — DST", url: "online-inspire.gov.in", desc: "Science scholarship for top 1% students", color: "border-teal-200 bg-teal-50", textColor: "text-teal-700", badge: "Science" },
                { name: "DAAD India", url: "daad.in", desc: "Germany scholarships for Masters & PhD", color: "border-indigo-200 bg-indigo-50", textColor: "text-indigo-700", badge: "International" },
              ].map((portal) => (
                <div key={portal.name} className={`border rounded-xl p-4 ${portal.color}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full bg-white/70 ${portal.textColor}`}>{portal.badge}</span>
                    <Globe className={`w-4 h-4 ${portal.textColor} opacity-60`} />
                  </div>
                  <h3 className={`font-bold text-sm ${portal.textColor} mb-1`}>{portal.name}</h3>
                  <p className="text-xs text-gray-600 mb-2">{portal.desc}</p>
                  <p className="text-xs font-mono text-gray-500">{portal.url}</p>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-8 bg-white rounded-2xl border border-gray-100 p-6 sm:p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-5">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {[
                {
                  q: "Can I apply for multiple scholarships simultaneously?",
                  a: "Yes, you can apply for multiple scholarships. However, some government schemes restrict you from receiving more than one Central Government scholarship at the same time. Private scholarships generally have no such restriction. Always read the terms carefully.",
                },
                {
                  q: "What documents are most commonly required?",
                  a: "Almost every scholarship requires: Aadhaar card, income certificate from competent authority, previous exam marksheet, current admission and fee receipt, bank account details (linked with Aadhaar for DBT), and passport size photograph. Keep digital and physical copies ready.",
                },
                {
                  q: "What is the NSP (National Scholarship Portal)?",
                  a: "The National Scholarship Portal (scholarships.gov.in) is the official Government of India portal that hosts 50+ central government scholarship schemes. A single registration gives you access to multiple schemes. All central government scholarships are now disbursed through Direct Benefit Transfer (DBT) via NSP.",
                },
                {
                  q: "How do I get income certificate for scholarship?",
                  a: "Income certificate is issued by the Tehsildar/SDM/Circle Officer in your district. Visit your local government office with proof of family income (salary slips, ITR, or declaration). It typically takes 7–15 working days. Some states issue it online through their e-district portals.",
                },
                {
                  q: "When should I start applying for scholarships?",
                  a: "Start applying as soon as you get your admission letter. Most scholarship deadlines fall between August–November. Government portals typically open in July-August. Private scholarships have varying deadlines. Set reminders 30 days before each deadline.",
                },
              ].map((faq, i) => (
                <details key={i} className="group border border-gray-100 rounded-xl overflow-hidden">
                  <summary className="flex items-center justify-between p-4 cursor-pointer font-semibold text-sm text-gray-800 hover:bg-gray-50 list-none">
                    {faq.q}
                    <ChevronRight className="w-4 h-4 text-gray-400 group-open:rotate-90 transition-transform shrink-0 ml-2" />
                  </summary>
                  <div className="px-4 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-8 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 sm:p-12 text-center">
            <Award className="w-12 h-12 text-yellow-300 mx-auto mb-4" />
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Need Help Finding the Right Scholarship?</h2>
            <p className="text-blue-100 mb-6 max-w-xl mx-auto">
              Our counsellors help you identify all scholarships you're eligible for, prepare documents, and submit applications on time.
            </p>
            <Link
              href="/counselling"
              className="inline-flex items-center gap-2 bg-white text-blue-600 font-bold px-8 py-3.5 rounded-xl hover:bg-blue-50 transition-colors"
            >
              Get Free Scholarship Guidance
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
