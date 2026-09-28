"use client";
import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import {
  TrendingUp, Award, Phone, ArrowLeft, ArrowRight, Loader2, ExternalLink, Building2, Info, RotateCcw,
} from "lucide-react";
import {
  CATEGORIES, MAX_SCORE, TOTAL_CANDIDATES, estimateRank, predictUgColleges, pgBandFor, ugAlternatives,
  type Category, type Chance, type CollegeMatch, type NeetType, type PgBand,
} from "@/data/neet-predictor";

type Step = 1 | 2 | 3;
type InputMode = "score" | "rank";

interface NewsLink {
  name: string;
  description: string;
  url: string;
}

interface Prediction {
  rank: number;
  rankIsEstimate: boolean;
  colleges: CollegeMatch[];
  pgBand: PgBand | null;
  alternatives: string[];
}

const chanceStyle: Record<Chance, string> = {
  Safe: "bg-green-100 text-green-700 border-green-200",
  Moderate: "bg-amber-100 text-amber-700 border-amber-200",
  Reach: "bg-rose-100 text-rose-700 border-rose-200",
};

const fmt = (n: number) => n.toLocaleString("en-IN");

export default function PredictorPage() {
  const [step, setStep] = useState<Step>(1);
  const [type, setType] = useState<NeetType>("ug");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [mode, setMode] = useState<InputMode>("score");
  const [value, setValue] = useState("");
  const [category, setCategory] = useState<Category>("general");
  const [includeDeemed, setIncludeDeemed] = useState(true);
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [news, setNews] = useState<NewsLink[]>([]);
  const [newsLoading, setNewsLoading] = useState(false);

  const mobileDigits = mobile.replace(/\D/g, "");
  const num = Number(value);
  const max = mode === "score" ? MAX_SCORE[type] : TOTAL_CANDIDATES[type];
  const valueValid = value !== "" && Number.isFinite(num) && num >= (mode === "score" ? 0 : 1) && num <= max;

  const saveLead = (p: Prediction) => {
    const categoryLabel = CATEGORIES.find((c) => c.value === category)?.label;
    const summary =
      type === "ug"
        ? `${mode === "score" ? `Score ${num}/720, ` : ""}AIR ${p.rankIsEstimate ? "~" : ""}${fmt(p.rank)}, ${categoryLabel}. ` +
          `${p.colleges.length} AIQ colleges matched${p.colleges[0] ? ` (e.g. ${p.colleges[0].name})` : ""}.`
        : `${mode === "score" ? `Score ${num}/800, ` : ""}AIR ${p.rankIsEstimate ? "~" : ""}${fmt(p.rank)}, ${categoryLabel}. ${p.pgBand?.title}.`;
    // Fire-and-forget: the prediction shows even if saving fails.
    supabase
      .from("enquiries")
      .insert({
        name: name.trim(),
        phone: mobileDigits,
        course: type === "ug" ? "NEET UG" : "NEET PG",
        source: `NEET ${type.toUpperCase()} Predictor`,
        message: summary,
      })
      .then(({ error }) => {
        if (error) console.error("Predictor lead save failed:", error.message);
      });
  };

  const loadNews = async (rank: number) => {
    setNewsLoading(true);
    try {
      const query =
        type === "ug"
          ? `NEET UG ${new Date().getFullYear()} MCC AIQ closing rank MBBS rank ${rank}`
          : `NEET PG ${new Date().getFullYear()} closing rank branch wise rank ${rank}`;
      const res = await fetch("/api/predictor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      setNews(Array.isArray(data.colleges) ? data.colleges.slice(0, 4) : []);
    } catch {
      setNews([]);
    } finally {
      setNewsLoading(false);
    }
  };

  const handlePredict = () => {
    if (!valueValid) return;
    const rankIsEstimate = mode === "score";
    const rank = rankIsEstimate ? estimateRank(type, num) : Math.round(num);
    const p: Prediction = {
      rank,
      rankIsEstimate,
      colleges: type === "ug" ? predictUgColleges(rank, category, includeDeemed) : [],
      pgBand: type === "pg" ? pgBandFor(rank, category) : null,
      alternatives: type === "ug" ? ugAlternatives(rank, category) : [],
    };
    setPrediction(p);
    setStep(3);
    saveLead(p);
    loadNews(rank);
  };

  const reset = () => {
    setPrediction(null);
    setNews([]);
    setValue("");
    setStep(2);
  };

  const govtMatches = prediction?.colleges.filter((c) => c.type === "Government") ?? [];
  const deemedMatches = prediction?.colleges.filter((c) => c.type === "Deemed") ?? [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-800 via-blue-700 to-green-700 py-12 md:py-16">
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
            <h1 className="text-3xl md:text-5xl font-black text-white mb-3">Predict Your NEET Rank &amp; College</h1>
            <p className="text-blue-100 max-w-xl mx-auto text-lg">
              Enter your NEET score or AIR and see which medical colleges match your rank and category
            </p>
          </div>
        </div>
      </div>

      {/* Steps Indicator */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 -mt-6">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 flex items-center justify-center gap-2 sm:gap-4">
          {[
            { num: 1, label: "Your Details" },
            { num: 2, label: "NEET Score" },
            { num: 3, label: "Result" },
          ].map((s, i) => (
            <div key={s.num} className="flex items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    step >= s.num ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {step > s.num ? "✓" : s.num}
                </div>
                <span className={`text-xs sm:text-sm font-medium ${step >= s.num ? "text-gray-900" : "text-gray-400"}`}>
                  {s.label}
                </span>
              </div>
              {i < 2 && <div className="w-4 sm:w-8 h-0.5 bg-gray-200" />}
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Step 1: Name + Mobile */}
          {step === 1 && (
            <div className="p-6 md:p-10">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Let&apos;s Get Started</h2>
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
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3.5 text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Mobile Number</label>
                  <input
                    type="tel"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="10-digit mobile number"
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3.5 text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  />
                </div>
                <button
                  onClick={() => setStep(2)}
                  disabled={!name.trim() || mobileDigits.length < 10}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-200 text-base"
                >
                  Continue
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Score / Rank */}
          {step === 2 && (
            <div className="p-6 md:p-10">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Enter Your NEET Result</h2>
                <p className="text-gray-500">Know your AIR? Enter it for the most accurate prediction.</p>
              </div>

              <div className="max-w-md mx-auto space-y-5">
                {/* UG / PG */}
                <div className="flex bg-gray-100 rounded-xl p-1">
                  {(["ug", "pg"] as NeetType[]).map((t) => (
                    <button
                      key={t}
                      onClick={() => { setType(t); setValue(""); }}
                      className={`flex-1 py-3 px-4 rounded-lg font-bold text-sm transition-all ${
                        type === t ? (t === "ug" ? "bg-green-600" : "bg-blue-600") + " text-white shadow-md" : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      NEET {t.toUpperCase()}
                    </button>
                  ))}
                </div>

                {/* Score / Rank */}
                <div>
                  <div className="flex gap-2 mb-2">
                    {(["score", "rank"] as InputMode[]).map((m) => (
                      <button
                        key={m}
                        onClick={() => { setMode(m); setValue(""); }}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
                          mode === m ? "bg-blue-50 border-blue-300 text-blue-700" : "border-gray-200 text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        {m === "score" ? "I know my score" : "I know my AIR"}
                      </button>
                    ))}
                  </div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {mode === "score"
                      ? `NEET ${type.toUpperCase()} Score (out of ${MAX_SCORE[type]})`
                      : `NEET ${type.toUpperCase()} All India Rank (CRL)`}
                  </label>
                  <input
                    type="number"
                    inputMode="numeric"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder={mode === "score" ? `0 - ${MAX_SCORE[type]}` : "e.g. 25000"}
                    min={mode === "score" ? 0 : 1}
                    max={max}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3.5 text-lg font-bold text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  />
                  {value !== "" && !valueValid && (
                    <p className="text-xs text-rose-600 mt-1.5">
                      Enter a value between {mode === "score" ? 0 : 1} and {fmt(max)}
                    </p>
                  )}
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                  <div className="grid grid-cols-5 gap-2">
                    {CATEGORIES.map((c) => (
                      <button
                        key={c.value}
                        onClick={() => setCategory(c.value)}
                        className={`py-2 rounded-lg text-xs sm:text-sm font-semibold border transition-colors ${
                          category === c.value ? "bg-blue-600 border-blue-600 text-white" : "border-gray-200 text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>

                {type === "ug" && (
                  <label className="flex items-center gap-2.5 text-sm text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeDeemed}
                      onChange={(e) => setIncludeDeemed(e.target.checked)}
                      className="w-4 h-4 accent-blue-600"
                    />
                    Include deemed universities (higher fees)
                  </label>
                )}

                <button
                  onClick={handlePredict}
                  disabled={!valueValid}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-200"
                >
                  <TrendingUp className="w-5 h-5" />
                  Predict My Colleges
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Result */}
          {step === 3 && prediction && (
            <div className="p-6 md:p-10">
              <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-5 md:p-6 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shrink-0">
                    <Award className="w-7 h-7 text-blue-700" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wide text-blue-700/70">
                      {prediction.rankIsEstimate ? "Estimated All India Rank" : "Your All India Rank"}
                    </div>
                    <div className="text-2xl font-black text-blue-800">
                      {prediction.rankIsEstimate ? "~" : ""}
                      {fmt(prediction.rank)}
                    </div>
                  </div>
                  <span className="ml-auto text-xs sm:text-sm font-bold px-3 py-1 rounded-full bg-white text-blue-700 border border-blue-200">
                    NEET {type.toUpperCase()} · {CATEGORIES.find((c) => c.value === category)?.label}
                  </span>
                </div>
                {prediction.rankIsEstimate && (
                  <p className="text-xs text-blue-800/80 mt-3">
                    Estimated from previous-year marks-vs-rank trends. Enter your actual AIR for a sharper prediction.
                  </p>
                )}
              </div>

              {/* UG colleges */}
              {type === "ug" && (
                <>
                  {prediction.colleges.length > 0 ? (
                    <div className="space-y-6 mb-6">
                      {[
                        { title: "Government Medical Colleges (AIQ 15%)", list: govtMatches },
                        { title: "Deemed Universities", list: deemedMatches },
                      ]
                        .filter((g) => g.list.length > 0)
                        .map((g) => (
                          <div key={g.title}>
                            <h3 className="text-lg font-bold text-gray-900 mb-3">{g.title}</h3>
                            <div className="space-y-2.5">
                              {g.list.slice(0, 10).map((c) => (
                                <div key={c.name} className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-xl p-3.5">
                                  <Building2 className="w-5 h-5 text-blue-600 shrink-0" />
                                  <div className="min-w-0 flex-1">
                                    <p className="font-semibold text-gray-900 text-sm">{c.name}</p>
                                    <p className="text-xs text-gray-500">
                                      {c.city}, {c.state} · Closing rank ~{fmt(c.adjustedClosingRank)} · {c.fee}
                                    </p>
                                  </div>
                                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full border shrink-0 ${chanceStyle[c.chance]}`}>
                                    {c.chance}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-5 mb-6">
                      <h3 className="font-bold text-gray-900 mb-1">Government MBBS via All India Quota looks difficult at this rank</h3>
                      <p className="text-sm text-gray-600">Good options are still open — see below.</p>
                    </div>
                  )}

                  <div className="bg-green-50 border border-green-200 rounded-2xl p-5 mb-6">
                    <h3 className="font-bold text-gray-900 mb-2">Other options to consider</h3>
                    <ul className="space-y-1.5 text-sm text-gray-700 list-disc pl-5">
                      {prediction.alternatives.map((a) => <li key={a}>{a}</li>)}
                    </ul>
                  </div>
                </>
              )}

              {/* PG guidance */}
              {type === "pg" && prediction.pgBand && (
                <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-5 md:p-6 mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">{prediction.pgBand.title}</h3>
                  <p className="text-sm text-gray-700 mb-2"><strong>Likely branches:</strong> {prediction.pgBand.branches}</p>
                  <p className="text-sm text-gray-700"><strong>Where:</strong> {prediction.pgBand.where}</p>
                </div>
              )}

              <div className="flex items-start gap-2 text-xs text-gray-500 mb-6">
                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                <p>
                  Based on previous-year MCC closing ranks. <strong>Safe</strong> = comfortably within last year&apos;s cutoff,{" "}
                  <strong>Moderate</strong> = close to it, <strong>Reach</strong> = possible in later rounds. Cutoffs change every year —
                  talk to a counsellor before choice filling.
                </p>
              </div>

              {/* Latest cutoff news (Google Custom Search) */}
              {(newsLoading || news.length > 0) && (
                <div className="mb-6">
                  <h3 className="text-sm font-bold text-gray-900 mb-2">Latest cutoff updates on the web</h3>
                  {newsLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                  ) : (
                    <div className="space-y-2">
                      {news.map((n) => (
                        <a
                          key={n.url}
                          href={n.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-start justify-between gap-2 bg-gray-50 hover:bg-blue-50 border border-gray-100 rounded-xl p-3 group"
                        >
                          <span className="text-xs font-semibold text-gray-800 group-hover:text-blue-700">{n.name}</span>
                          <ExternalLink className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="border-t border-gray-100 pt-6 text-center">
                <h3 className="text-lg font-bold text-gray-900 mb-1">Your prediction is saved</h3>
                <p className="text-gray-500 text-sm mb-4">
                  Our counsellors will call you within 24 hours with a detailed college list and choice-filling plan.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl"
                  >
                    Get Free Counselling <ArrowRight className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={reset}
                    className="inline-flex items-center justify-center gap-2 border border-gray-200 text-gray-700 font-semibold px-6 py-3 rounded-xl hover:bg-gray-50"
                  >
                    <RotateCcw className="w-4 h-4" /> Try another score
                  </button>
                </div>
              </div>
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
