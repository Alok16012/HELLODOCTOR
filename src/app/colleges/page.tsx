"use client";
import { useState, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CollegeCard from "@/components/CollegeCard";
import { colleges, streams, topCities, topExams, feeRanges } from "@/data/colleges";
import {
  Search, SlidersHorizontal, X, ChevronDown, ChevronUp,
  LayoutGrid, List, ArrowUpDown
} from "lucide-react";

function CollegesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [selectedStream, setSelectedStream] = useState(searchParams.get("stream") || "");
  const [selectedCity, setSelectedCity] = useState(searchParams.get("city") || "");
  const [selectedExam, setSelectedExam] = useState(searchParams.get("exam") || "");
  const [selectedType, setSelectedType] = useState(searchParams.get("type") || "");
  const [selectedFee, setSelectedFee] = useState("");
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState("ranking");
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filtered = useMemo(() => {
    let result = [...colleges];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.shortName.toLowerCase().includes(q) ||
          c.location.toLowerCase().includes(q) ||
          c.streams.some((s) => s.toLowerCase().includes(q))
      );
    }
    if (selectedStream) result = result.filter((c) => c.streams.includes(selectedStream));
    if (selectedCity) result = result.filter((c) => c.city === selectedCity);
    if (selectedExam) result = result.filter((c) => c.exams.includes(selectedExam));
    if (selectedType) result = result.filter((c) => c.type === selectedType);
    if (minRating > 0) result = result.filter((c) => c.rating >= minRating);
    if (selectedFee) {
      const range = feeRanges.find((r) => r.label === selectedFee);
      if (range) result = result.filter((c) => c.fees >= range.min && c.fees <= range.max);
    }

    result.sort((a, b) => {
      if (sortBy === "ranking") return a.ranking - b.ranking;
      if (sortBy === "fees_asc") return a.fees - b.fees;
      if (sortBy === "fees_desc") return b.fees - a.fees;
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "reviews") return b.reviewCount - a.reviewCount;
      return 0;
    });

    return result;
  }, [searchQuery, selectedStream, selectedCity, selectedExam, selectedType, selectedFee, minRating, sortBy]);

  const activeFilters = [
    selectedStream && { key: "stream", label: selectedStream, clear: () => setSelectedStream("") },
    selectedCity && { key: "city", label: selectedCity, clear: () => setSelectedCity("") },
    selectedExam && { key: "exam", label: selectedExam, clear: () => setSelectedExam("") },
    selectedType && { key: "type", label: selectedType, clear: () => setSelectedType("") },
    selectedFee && { key: "fee", label: selectedFee, clear: () => setSelectedFee("") },
    minRating > 0 && { key: "rating", label: `${minRating}★+`, clear: () => setMinRating(0) },
  ].filter(Boolean) as { key: string; label: string; clear: () => void }[];

  const clearAll = () => {
    setSearchQuery(""); setSelectedStream(""); setSelectedCity("");
    setSelectedExam(""); setSelectedType(""); setSelectedFee(""); setMinRating(0);
  };

  return (
    <>
      <Navbar />
      <div className="bg-gray-50 min-h-screen">
        {/* Page Header */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
            <h1 className="text-2xl font-bold text-gray-900">All Colleges in India</h1>
            <p className="text-gray-500 text-sm mt-1">
              Showing <span className="font-semibold text-blue-600">{filtered.length}</span> of {colleges.length} colleges
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex gap-6">
            {/* ── Sidebar Filters ── */}
            <aside className={`shrink-0 w-64 space-y-4 ${showFilters ? "block" : "hidden lg:block"}`}>
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                  <h2 className="font-bold text-gray-900">Filters</h2>
                  {activeFilters.length > 0 && (
                    <button onClick={clearAll} className="text-xs text-red-500 hover:text-red-600 font-medium">
                      Clear All
                    </button>
                  )}
                </div>

                {/* Stream */}
                <FilterSection title="Stream">
                  <div className="space-y-1">
                    {streams.map((s) => (
                      <label key={s.name} className="flex items-center gap-2.5 py-1 cursor-pointer group">
                        <input
                          type="radio"
                          name="stream"
                          checked={selectedStream === s.name}
                          onChange={() => setSelectedStream(selectedStream === s.name ? "" : s.name)}
                          className="accent-blue-600"
                        />
                        <span className="text-sm text-gray-700 group-hover:text-blue-600 flex-1">{s.icon} {s.name}</span>
                        <span className="text-xs text-gray-400">{s.count}+</span>
                      </label>
                    ))}
                  </div>
                </FilterSection>

                {/* College Type */}
                <FilterSection title="College Type">
                  <div className="space-y-1">
                    {["Government", "Private", "Deemed"].map((type) => (
                      <label key={type} className="flex items-center gap-2.5 py-1 cursor-pointer group">
                        <input
                          type="radio"
                          name="type"
                          checked={selectedType === type}
                          onChange={() => setSelectedType(selectedType === type ? "" : type)}
                          className="accent-blue-600"
                        />
                        <span className="text-sm text-gray-700 group-hover:text-blue-600">{type}</span>
                      </label>
                    ))}
                  </div>
                </FilterSection>

                {/* Annual Fees */}
                <FilterSection title="Annual Fees">
                  <div className="space-y-1">
                    {feeRanges.map((r) => (
                      <label key={r.label} className="flex items-center gap-2.5 py-1 cursor-pointer group">
                        <input
                          type="radio"
                          name="fee"
                          checked={selectedFee === r.label}
                          onChange={() => setSelectedFee(selectedFee === r.label ? "" : r.label)}
                          className="accent-blue-600"
                        />
                        <span className="text-sm text-gray-700 group-hover:text-blue-600">{r.label}</span>
                      </label>
                    ))}
                  </div>
                </FilterSection>

                {/* Minimum Rating */}
                <FilterSection title="Minimum Rating">
                  <div className="space-y-1">
                    {[4.5, 4.0, 3.5, 0].map((r) => (
                      <label key={r} className="flex items-center gap-2.5 py-1 cursor-pointer group">
                        <input
                          type="radio"
                          name="rating"
                          checked={minRating === r}
                          onChange={() => setMinRating(r)}
                          className="accent-blue-600"
                        />
                        <span className="text-sm text-gray-700 group-hover:text-blue-600">
                          {r === 0 ? "Any Rating" : `${r}★ & above`}
                        </span>
                      </label>
                    ))}
                  </div>
                </FilterSection>

                {/* City */}
                <FilterSection title="City">
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full text-sm px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none cursor-pointer"
                  >
                    <option value="">All Cities</option>
                    {topCities.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </FilterSection>

                {/* Entrance Exam */}
                <FilterSection title="Entrance Exam">
                  <select
                    value={selectedExam}
                    onChange={(e) => setSelectedExam(e.target.value)}
                    className="w-full text-sm px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none cursor-pointer"
                  >
                    <option value="">All Exams</option>
                    {topExams.map((e) => <option key={e} value={e}>{e}</option>)}
                  </select>
                </FilterSection>
              </div>
            </aside>

            {/* ── Main Content ── */}
            <div className="flex-1 min-w-0">
              {/* Search + Sort Bar */}
              <div className="flex gap-2 mb-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search college, city, stream..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                      <X className="w-4 h-4 text-gray-400" />
                    </button>
                  )}
                </div>

                {/* Mobile filter toggle */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`lg:hidden flex items-center gap-1.5 px-3 py-2.5 rounded-xl border text-sm font-medium transition-colors ${showFilters ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-200"}`}
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Filters
                  {activeFilters.length > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                      {activeFilters.length}
                    </span>
                  )}
                </button>

                <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-xl px-3 py-2.5">
                  <ArrowUpDown className="w-4 h-4 text-gray-400" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="text-sm text-gray-700 outline-none bg-transparent cursor-pointer"
                  >
                    <option value="ranking">By Ranking</option>
                    <option value="rating">By Rating</option>
                    <option value="fees_asc">Fees: Low to High</option>
                    <option value="fees_desc">Fees: High to Low</option>
                    <option value="reviews">By Reviews</option>
                  </select>
                </div>

                <div className="hidden sm:flex gap-1 bg-white border border-gray-200 rounded-xl p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-lg transition-colors ${viewMode === "grid" ? "bg-blue-600 text-white" : "text-gray-500 hover:bg-gray-100"}`}
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-lg transition-colors ${viewMode === "list" ? "bg-blue-600 text-white" : "text-gray-500 hover:bg-gray-100"}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Active Filter Chips */}
              {activeFilters.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {activeFilters.map((f) => (
                    <span
                      key={f.key}
                      className="flex items-center gap-1.5 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full"
                    >
                      {f.label}
                      <button onClick={f.clear} className="hover:text-blue-900">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  <button onClick={clearAll} className="text-xs text-red-500 font-medium px-2 hover:text-red-600">
                    Clear All ×
                  </button>
                </div>
              )}

              {/* Stream Quick Filter Chips */}
              <div className="flex gap-2 overflow-x-auto pb-1 mb-4 scrollbar-hide">
                <button
                  onClick={() => setSelectedStream("")}
                  className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-all shrink-0 ${!selectedStream ? "bg-blue-600 text-white" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"}`}
                >
                  All
                </button>
                {streams.map((s) => (
                  <button
                    key={s.name}
                    onClick={() => setSelectedStream(selectedStream === s.name ? "" : s.name)}
                    className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-all shrink-0 ${selectedStream === s.name ? "bg-blue-600 text-white" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"}`}
                  >
                    {s.icon} {s.name}
                  </button>
                ))}
              </div>

              {/* Results */}
              {filtered.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                  <p className="text-5xl mb-4">🔍</p>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">No colleges found</h3>
                  <p className="text-gray-500 mb-4">Try adjusting your filters or search query</p>
                  <button onClick={clearAll} className="text-blue-600 font-semibold underline">Clear all filters</button>
                </div>
              ) : viewMode === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filtered.map((college) => (
                    <CollegeCard key={college.id} college={college} />
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {filtered.map((college) => (
                    <CollegeListCard key={college.id} college={college} />
                  ))}
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

// ── Collapsible filter section ──
function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
      >
        {title}
        {open ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>
      {open && <div className="px-5 pb-4">{children}</div>}
    </div>
  );
}

// ── List view card ──
import Link from "next/link";
import Image from "next/image";
import { MapPin, Star } from "lucide-react";
import { College } from "@/data/colleges";

function CollegeListCard({ college }: { college: College }) {
  return (
    <Link href={`/colleges/${college.id}`}>
      <div className="bg-white rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all p-4 flex gap-4 cursor-pointer group">
        <div className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0">
          <Image src={college.image} alt={college.name} fill className="object-cover" sizes="96px" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{college.name}</h3>
              <div className="flex items-center gap-1.5 text-gray-500 text-xs mt-0.5">
                <MapPin className="w-3 h-3" />{college.location}
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span className="text-sm font-bold text-gray-800">{college.rating}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {college.streams.slice(0, 4).map((s) => (
              <span key={s} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{s}</span>
            ))}
          </div>
          <div className="flex gap-6 mt-2">
            <div>
              <p className="text-xs text-gray-400">Fees/yr</p>
              <p className="text-sm font-bold text-blue-600">{college.feesDisplay}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Avg Package</p>
              <p className="text-sm font-bold text-green-600">₹{(college.placements.avgPackage / 100000).toFixed(1)}L</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">NIRF Rank</p>
              <p className="text-sm font-semibold text-gray-700">{college.nirfRank.split(" ")[0]}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Type</p>
              <p className="text-sm font-semibold text-gray-700">{college.type}</p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function CollegesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    }>
      <CollegesContent />
    </Suspense>
  );
}
