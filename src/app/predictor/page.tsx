"use client";
import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { TrendingUp, Award, Phone, ArrowLeft, User, ArrowRight, Loader2, ExternalLink } from "lucide-react";

type Step = 1 | 2 | 3;
type PredictorType = "ug" | "pg";

interface CollegeResult {
  name: string;
  description: string;
  url: string;
}

const UG_BANDS: Record<string, { band: string; label: string; color: string; advice: string }> = {
  "700-720": { band: "AIR < 500", label: "Top Tier", color: "green", advice: "Excellent! You can aim for the country's premier medical institutes like AIIMS, JIPMER, CMC." },
  "650-699": { band: "AIR 500-5,000", label: "Excellent", color: "emerald", advice: "Great score! You can get into top government medical colleges across India." },
  "600-649": { band: "AIR 5,000-25,000", label: "Very Good", color: "blue", advice: "You have excellent options in both government and private medical colleges." },
  "550-599": { band: "AIR 25,000-75,000", label: "Good", color: "indigo", advice: "You can secure admission in good government and private medical colleges." },
  "500-549": { band: "AIR 75,000-1,50,000", label: "Fair", color: "orange", advice: "You have options in private and deemed universities. Consider budget planning." },
  "400-499": { band: "AIR 1,50,000+", label: "Above Average", color: "yellow", advice: "Consider private colleges or explore affordable MBBS abroad options." },
  "0-399": { band: "Below Cutoff", label: "Needs Attention", color: "red", advice: "Don't worry! Explore MBBS abroad, BDS, BAMS or other medical streams." },
};

const PG_BANDS: Record<string, { band: string; label: string; color: string; advice: string }> = {
  "750-800": { band: "AIR < 1,000", label: "Top Tier", color: "green", advice: "Outstanding! You can choose any specialty from the top institutes." },
  "700-749": { band: "AIR 1,000-5,000", label: "Excellent", color: "emerald", advice: "Excellent rank! You can get your preferred branch in top institutes." },
  "600-699": { band: "AIR 5,000-20,000", label: "Very Good", color: "blue", advice: "Good options available in both government and private institutions." },
  "500-599": { band: "AIR 20,000-50,000", label: "Good", color: "indigo", advice: "You can get good PG seats. Consider both MD/MS and DNB options." },
  "350-499": { band: "AIR 50,000+", label: "Fair", color: "orange", advice: "Consider DNB, diploma courses or reappear for better rank next year." },
};

const colorMap: Record<string, { bg: string; border: string; text: string; badge: string }> = {
  green: { bg: "bg-green-50", border: "border-green-200", text: "text-green-700", badge: "bg-green-100 text-green-700" },
  emerald: { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700", badge: "bg-emerald-100 text-emerald-700" },
  blue: { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700", badge: "bg-blue-100 text-blue-700" },
  indigo: { bg: "bg-indigo-50", border: "border-indigo-200", text: "text-indigo-700", badge: "bg-indigo-100 text-indigo-700" },
  orange: { bg: "bg-orange-50", border: "border-orange-200", text: "text-orange-700", badge: "bg-orange-100 text-orange-700" },
  yellow: { bg: "bg-yellow-50", border: "border-yellow-200", text: "text-yellow-700", badge: "bg-yellow-100 text-yellow-700" },
  red: { bg: "bg-red-50", border: "border-red-200", text: "text-red-700", badge: "bg-red-100 text-red-700" },
};

function getBand(type: PredictorType, score: number): { band: string; label: string; color: string; advice: string } | null {
  const bands = type === "ug" ? UG_BANDS : PG_BANDS;
  for (const [range, pred] of Object.entries(bands)) {
    const [min, max] = range.split("-").map(Number);
    if (score >= min && score <= max) return pred;
  }
  return null;
}

export default function PredictorPage() {
  const [step, setStep] = useState<Step>(1);
  const [type, setType] = useState<PredictorType>("ug");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [score, setScore] = useState("");
  const [result, setResult] = useState<{ band: string; label: string; color: string; advice: string } | null>(null);
  const [colleges, setColleges] = useState<CollegeResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleStep1 = () => {
    if (name.trim() && mobile.trim().length >= 10) {
      setStep(2);
    }
  };

  const handlePredict = async () => {
    const s = parseInt(score);
    if (isNaN(s) || s < 0) return;

    const maxScore = type === "ug" ? 720 : 800;
    const clamped = Math.min(s, maxScore);
    const pred = getBand(type, clamped);
    if (!pred) return;

    setResult(pred);
    setLoading(true);
    setStep(3);

    try {
      const searchQuery = type === "ug"
        ? `NEET UG rank ${s} which medical college can I get admission India`
        : `NEET PG rank ${s} which MD MS college can I get admission India`;

      const res = await fetch("/api/predictor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery }),
      });

      const data = await res.json();
      if (data.colleges) {
        setColleges(data.colleges.slice(0, 6));
      }
    } catch {
      // Silently fail - local prediction still shows
    } finally {
      setLoading(false);
    }
  };

  const handleSaveLead = async () => {
    setSaving(true);
    try {
      const { createClient } = await import("@supabase/supabase-js");
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      await supabase.from("leads").insert({
        name,
        phone: mobile,
        source: `NEET ${type.toUpperCase()} Predictor`,
        neet_score: parseInt(score),
        neet_type: type,
        prediction_band: result?.band,
        prediction_label: result?.label,
      });
    } catch {
      // Silent fail
    } finally {
      setSaving(false);
      setSubmitted(true);
    }
  };

  const colors = result ? colorMap[result.color] : colorMap.blue;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero */}
      <div className="bg-gradient-to-br from-red-600 via-red-600 to-rose-700 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <Link href="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm font-medium mb-6">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/15 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <TrendingUp className="w-4 h-4" />
              Free NEET Predictor Tool
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white mb-3">
              Predict Your NEET Rank & College
            </h1>
            <p className="text-red-100 max-w-xl mx-auto text-lg">
              Enter your NEET score and instantly find out which medical colleges you can get into
            </p>
          </div>
        </div>
      </div>

      {/* Steps Indicator */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 -mt-6">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 flex items-center justify-center gap-4">
          {[
            { num: 1, label: "Your Details" },
            { num: 2, label: "NEET Score" },
            { num: 3, label: "Result" },
          ].map((s, i) => (
            <div key={s.num} className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  step >= s.num ? "bg-red-600 text-white" : "bg-gray-100 text-gray-400"
                }`}>
                  {step > s.num ? "✓" : s.num}
                </div>
                <span className={`text-sm font-medium ${step >= s.num ? "text-gray-900" : "text-gray-400"}`}>
                  {s.label}
                </span>
              </div>
              {i < 2 && <div className="w-8 h-0.5 bg-gray-200 mx-1" />}
            </div>
          ))}
        </div>
      </div>

      {/* Predictor Card */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">

          {/* Step 1: Name + Mobile */}
          {step === 1 && (
            <div className="p-6 md:p-10">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Let's Get Started</h2>
                <p className="text-gray-500">Enter your details to get personalised college predictions</p>
              </div>
              <div className="max-w-md mx-auto space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Your Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3.5 text-base focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Mobile Number</label>
                  <input
                    type="tel"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="Enter your mobile number"
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3.5 text-base focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all"
                  />
                </div>
                <button
                  onClick={handleStep1}
                  disabled={!name.trim() || mobile.trim().length < 10}
                  className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-red-200 text-base"
                >
                  Continue
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Score Input */}
          {step === 2 && (
            <div className="p-6 md:p-10">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Enter Your NEET Score</h2>
                <p className="text-gray-500">We'll predict your rank and eligible colleges</p>
              </div>

              {/* Type Toggle */}
              <div className="flex bg-gray-100 rounded-xl p-1 mb-6 max-w-md mx-auto">
                <button
                  onClick={() => { setType("ug"); setScore(""); }}
                  className={`flex-1 py-3 px-4 rounded-lg font-bold text-sm transition-all ${
                    type === "ug" ? "bg-blue-600 text-white shadow-md" : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  NEET UG
                </button>
                <button
                  onClick={() => { setType("pg"); setScore(""); }}
                  className={`flex-1 py-3 px-4 rounded-lg font-bold text-sm transition-all ${
                    type === "pg" ? "bg-green-600 text-white shadow-md" : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  NEET PG
                </button>
              </div>

              <div className="max-w-md mx-auto">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  NEET {type.toUpperCase()} Score (out of {type === "ug" ? 720 : 800})
                </label>
                <div className="flex gap-3">
                  <input
                    type="number"
                    value={score}
                    onChange={(e) => setScore(e.target.value)}
                    placeholder={`0 - ${type === "ug" ? 720 : 800}`}
                    min="0"
                    max={type === "ug" ? 720 : 800}
                    className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-3.5 text-lg font-bold text-gray-900 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all"
                  />
                  <button
                    onClick={handlePredict}
                    disabled={!score || parseInt(score) < 0}
                    className="bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold px-6 md:px-8 rounded-xl text-sm md:text-base transition-colors flex items-center gap-2 shadow-lg shadow-red-200"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <TrendingUp className="w-5 h-5" />}
                    Predict
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Result */}
          {step === 3 && result && (
            <div className="p-6 md:p-10">
              {/* Success Header */}
              <div className={`${colors.bg} ${colors.border} border-2 rounded-2xl p-5 md:p-6 mb-6`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                    <Award className={`w-7 h-7 ${colors.text}`} />
                  </div>
                  <div>
                    <div className={`text-xs font-semibold uppercase tracking-wide ${colors.text} opacity-70`}>Your Predicted Rank</div>
                    <div className={`text-2xl font-black ${colors.text}`}>{result.band}</div>
                  </div>
                  <span className={`ml-auto text-sm font-bold px-3 py-1 rounded-full ${colors.badge}`}>
                    {result.label}
                  </span>
                </div>
                <p className={`text-sm md:text-base font-medium ${colors.text} opacity-90`}>{result.advice}</p>
              </div>

              {/* Colleges from Google API */}
              {loading ? (
                <div className="text-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-red-600 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">Fetching college suggestions...</p>
                </div>
              ) : colleges.length > 0 ? (
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Suggested Colleges for You</h3>
                  <div className="space-y-3">
                    {colleges.map((college, i) => (
                      <a
                        key={i}
                        href={college.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block bg-gray-50 hover:bg-blue-50 border border-gray-100 hover:border-blue-200 rounded-xl p-4 transition-colors group"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-bold text-gray-900 group-hover:text-blue-700 text-sm">{college.name}</h4>
                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{college.description}</p>
                          </div>
                          <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600 shrink-0 ml-2 mt-0.5" />
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              ) : (
                <div className={`${colors.bg} ${colors.border} border-2 rounded-2xl p-5 mb-6`}>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Based on your score, you can explore:</h3>
                  <p className="text-gray-600 text-sm mb-3">{result.advice}</p>
                  <p className="text-gray-500 text-xs">Contact our counsellors for a detailed, personalised college list.</p>
                </div>
              )}

              {/* Lead Capture / Save */}
              {!submitted ? (
                <div className="border-t border-gray-100 pt-6">
                  <div className="text-center mb-4">
                    <h3 className="text-lg font-bold text-gray-900">Want a Detailed Report?</h3>
                    <p className="text-gray-500 text-sm">Save your prediction and our counsellors will send you a personalised college list</p>
                  </div>
                  <button
                    onClick={handleSaveLead}
                    disabled={saving}
                    className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-300 text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-red-200"
                  >
                    {saving ? (
                      <><Loader2 className="w-5 h-5 animate-spin" /> Saving...</>
                    ) : (
                      "Save My Prediction & Get Free Counselling"
                    )}
                  </button>
                </div>
              ) : (
                <div className="border-t border-gray-100 pt-6 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Prediction Saved!</h3>
                  <p className="text-gray-500 mb-4">
                    Our counsellors will reach out to you within 24 hours with a detailed college prediction report.
                  </p>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 text-red-600 font-bold text-sm hover:underline"
                  >
                    Need more help? Talk to us directly
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Contact CTA */}
        <div className="mt-8 bg-blue-600 rounded-2xl p-6 md:p-8 text-center">
          <Phone className="w-10 h-10 text-white/80 mx-auto mb-3" />
          <h3 className="text-xl font-bold text-white mb-2">Need Immediate Help?</h3>
          <p className="text-blue-200 mb-4">Call our NEET counsellors now for instant guidance</p>
          <a
            href="tel:+919211607005"
            className="inline-flex items-center gap-2 bg-white text-blue-600 font-bold px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors"
          >
            <Phone className="w-5 h-5" />
            +91 9211607005
          </a>
        </div>
      </div>

      <Footer />
    </div>
  );
}
