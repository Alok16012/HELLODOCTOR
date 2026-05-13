"use client";
import { useState } from "react";
import { Search, MapPin, BookOpen, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";

const streamOptions = ["Engineering", "Medical", "MBA", "Law", "Design", "Science", "Pharmacy", "Agriculture"];
const cityOptions = ["All India", "Delhi", "Mumbai", "Bengaluru", "Pune", "Hyderabad", "Chennai", "Kolkata"];
const examOptions = ["JEE Main", "JEE Advanced", "NEET UG", "CAT", "CLAT", "GATE", "CUET", "GMAT"];

export default function HeroSection() {
  const [stream, setStream] = useState("");
  const [city, setCity] = useState("");
  const [exam, setExam] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (stream) params.set("stream", stream);
    if (city) params.set("city", city);
    if (exam) params.set("exam", exam);
    if (searchQuery) params.set("q", searchQuery);
    router.push(`/colleges?${params.toString()}`);
  };

  return (
    <section className="relative overflow-hidden text-white"
      style={{ backgroundImage: "url('/hero-bg.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 lg:py-28">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/25 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            AI-Powered College Predictor 2026
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Find Your{" "}
            <span className="text-yellow-400">Dream College,</span>
            <br />
            Shape Your Future
          </h1>

          <p className="text-lg sm:text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            AI-driven predictions with cutoffs, seats, fees and admission insights for
            top colleges across India. Trusted by 1,000+ students.
          </p>

          {/* Search Bar */}
          <div className="bg-white rounded-2xl p-2 shadow-2xl max-w-3xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-2">
              {/* Search Input */}
              <div className="flex items-center gap-2 flex-1 px-4 py-2">
                <Search className="w-5 h-5 text-gray-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Search college name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="flex-1 text-gray-800 text-sm outline-none placeholder-gray-400"
                />
              </div>

              <div className="hidden sm:block w-px bg-gray-200 my-2" />

              {/* Stream Select */}
              <div className="flex items-center gap-2 px-4 py-2">
                <BookOpen className="w-4 h-4 text-gray-400 shrink-0" />
                <select
                  value={stream}
                  onChange={(e) => setStream(e.target.value)}
                  className="text-sm text-gray-700 outline-none bg-transparent cursor-pointer"
                >
                  <option value="">Stream</option>
                  {streamOptions.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="hidden sm:block w-px bg-gray-200 my-2" />

              {/* City Select */}
              <div className="flex items-center gap-2 px-4 py-2">
                <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="text-sm text-gray-700 outline-none bg-transparent cursor-pointer"
                >
                  <option value="">City</option>
                  {cityOptions.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleSearch}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-6 py-3 rounded-xl transition-colors whitespace-nowrap"
              >
                Search Colleges
              </button>
            </div>
          </div>

          {/* Quick Filter Tags */}
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {examOptions.map((exam) => (
              <button
                key={exam}
                onClick={() => { setExam(exam); router.push(`/colleges?exam=${exam}`); }}
                className="text-sm bg-white/15 hover:bg-white/25 border border-white/30 text-white px-4 py-1.5 rounded-full transition-colors"
              >
                {exam}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Wave Bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 60L48 50C96 40 192 20 288 15C384 10 480 20 576 25C672 30 768 30 864 25C960 20 1056 10 1152 10C1248 10 1344 20 1392 25L1440 30V60H0Z" fill="white" />
        </svg>
      </div>
    </section>
  );
}
