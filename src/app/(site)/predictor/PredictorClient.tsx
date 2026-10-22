"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import {
  TrendingUp, Phone, ArrowLeft, ArrowRight, Loader2, ExternalLink, Building2, Info, Pencil,
  ShieldCheck, Target, Flame, Sparkles, ClipboardList,
} from "lucide-react";
import {
  CATEGORIES, INDIAN_STATES, MAX_SCORE, TOTAL_CANDIDATES, UG_QUALIFYING_MARKS, estimateRank, isUgQualified,
  pgBandFor, ugAlternatives,
  type Category, type NeetType, type PgBand, type Quota,
} from "@/data/neet-predictor";
import {
  CHANCES, EXAM, QUOTA_LABEL, TYPE_LABEL, predict, type Chance, type Prediction, type UgCollege,
} from "@/lib/neet/meta";
import { useColleges, useCutoffs } from "@/lib/neet/useNeetData";
import { PgResults, PgSelectionFields, usePgData } from "@/components/neet/PgPredictor";
import { EMPTY_SELECTION, predictPg, selectionComplete, type PgSelection } from "@/lib/neet/pgPredict";
import { usePredictorAccess } from "@/lib/neet/usePredictorAccess";
import PredictorAccessGate from "@/components/neet/PredictorAccessGate";

type Step = 1 | 2 | 3;
type UgFilter = "all" | "govt" | "bds" | "deemed";

interface NewsLink {
  name: string;
  description: string;
  url: string;
}

interface Result {
  qualified: boolean;
  rank: number;
  rankIsEstimate: boolean;
  /** UG only: one entry per college × course × quota. PG results are computed by PgResults. */
  matches: Prediction[];
  pgBand: PgBand | null;
  /** PG: number of college-branch options at default filters (for the saved lead). */
  pgCount: number;
  alternatives: string[];
}

const CAT_CODE: Record<Category, string> = { general: "GN", ews: "EWS", obc: "OBC", sc: "SC", st: "ST" };

const chanceMeta: Record<Chance, { pill: string; tab: string; icon: typeof ShieldCheck; hint: string }> = {
  Safe: { pill: "bg-green-100 text-green-700 border-green-200", tab: "bg-green-600 border-green-600", icon: ShieldCheck, hint: "Well inside last year's cutoff" },
  Moderate: { pill: "bg-blue-100 text-blue-700 border-blue-200", tab: "bg-blue-600 border-blue-600", icon: Target, hint: "Close to last year's cutoff" },
  Risky: { pill: "bg-amber-100 text-amber-700 border-amber-200", tab: "bg-amber-500 border-amber-500", icon: Flame, hint: "Possible in later rounds" },
  Dream: { pill: "bg-rose-100 text-rose-700 border-rose-200", tab: "bg-rose-600 border-rose-600", icon: Sparkles, hint: "Needs cutoffs to move a lot" },
};

const ugFilters: { value: UgFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "govt", label: "Govt MBBS" },
  { value: "bds", label: "Govt BDS" },
  { value: "deemed", label: "Deemed MBBS" },
];

const fmt = (n: number) => n.toLocaleString("en-IN");
// Rough mapping of AIQ category labels to the band estimator used when nothing matches.
const PG_CATEGORY: Record<string, Category> = { GEN: "general", EWS: "ews", OBC: "obc", SC: "sc", ST: "st" };

// Store Indian numbers as 10 digits (matches the rest of the CRM), whatever the user typed.
function normalizeMobile(input: string): string {
  const d = input.replace(/\D/g, "");
  if (d.length === 12 && d.startsWith("91")) return d.slice(2);
  if (d.length === 11 && d.startsWith("0")) return d.slice(1);
  return d;
}

function matchesUgFilter(p: Prediction, type: string | undefined, f: UgFilter): boolean {
  if (f === "govt") return p.course === "MBBS" && type !== "Deemed";
  if (f === "bds") return p.course === "BDS";
  if (f === "deemed") return p.course === "MBBS" && type === "Deemed";
  return true;
}

export default function PredictorClient({ initialExam }: { initialExam: NeetType }) {
  const [step, setStep] = useState<Step>(1);
  const [type, setType] = useState<NeetType>(initialExam);
  const [rankInput, setRankInput] = useState("");
  const [marksInput, setMarksInput] = useState("");
  const [useMarks, setUseMarks] = useState(false);
  const [category, setCategory] = useState<Category>("general");
  const [quota, setQuota] = useState<Quota>("aiq");
  const [state, setState] = useState("");
  const [pgSel, setPgSel] = useState<PgSelection>(EMPTY_SELECTION);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [prediction, setPrediction] = useState<Result | null>(null);
  const [tab, setTab] = useState<Chance | "all">("all");
  const [ugFilter, setUgFilter] = useState<UgFilter>("all");
  const [news, setNews] = useState<NewsLink[]>([]);
  const [newsLoading, setNewsLoading] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);
  // Full results stay behind a one-time Razorpay payment; everyone can still see the
  // rank/counts and the lead is still saved either way (see saveLead below).
  const { status: access, supabase: predictorSupabase, refresh: refreshAccess } = usePredictorAccess();

  // UG: official MCC closing ranks (latest year + the year before). PG: institution cutoffs incl. state quotas.
  const latestYear = EXAM[type].latestYear;
  const { colleges } = useColleges("ug");
  const { rows } = useCutoffs("ug", [EXAM.ug.latestYear, EXAM.ug.latestYear - 1]);
  const pgData = usePgData(type === "pg");
  const dataReady = type === "pg" ? !!pgData : !!rows && !!colleges;
  const collegeById = new Map((colleges ?? []).map((c) => [c.id, c]));
  const nameOf = (id: number) => collegeById.get(id)?.name ?? "College";

  const mobileDigits = normalizeMobile(mobile);
  const rankNum = Number(rankInput);
  const marksNum = Number(marksInput);
  const rankValid = rankInput !== "" && Number.isInteger(rankNum) && rankNum >= 1 && rankNum <= TOTAL_CANDIDATES[type];
  const marksValid = marksInput !== "" && Number.isFinite(marksNum) && marksNum >= 0 && marksNum <= MAX_SCORE[type];
  const inputValid = (useMarks ? marksValid : rankValid) && (type === "pg" ? selectionComplete(pgSel) : quota === "aiq" || state !== "");
  const categoryLabel = type === "pg" ? pgSel.category : CATEGORIES.find((c) => c.value === category)?.label;
  const quotaLabel = type === "pg"
    ? `${pgSel.counselling === "AIQ" ? "All India" : pgSel.states.join(", ")} · ${pgSel.quota}`
    : quota === "aiq" ? "All India Quota" : `${state} State Quota`;

  const saveLead = (p: Result) => {
    const input = useMarks ? `Score ${marksNum}/${MAX_SCORE[type]}, ` : "";
    const rankText = `AIR ${p.rankIsEstimate ? "~" : ""}${fmt(p.rank)}`;
    const summary = !p.qualified
      ? `${input}${rankText}, ${categoryLabel} — below NEET UG qualifying cutoff.`
      : type === "ug"
        ? `${input}${rankText}, ${categoryLabel}, ${quotaLabel}. ` +
          `${p.matches.length} colleges matched${p.matches[0] ? ` (e.g. ${nameOf(p.matches[0].college)} — ${p.matches[0].chance})` : ""}.`
        : `${input}${rankText}, ${categoryLabel}, ${quotaLabel}. ` +
          (p.pgCount ? `${p.pgCount} college-branch options matched.` : `${p.pgBand?.title}.`);
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
          ? `NEET UG ${new Date().getFullYear()} ${quota === "state" ? `${state} state quota` : "MCC AIQ"} closing rank MBBS rank ${rank}`
          : `NEET PG ${new Date().getFullYear()} ${pgSel.counselling === "STATE" ? `${pgSel.states[0]} state quota` : ""} closing rank branch wise rank ${rank}`;
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

  const detailsValid = name.trim() !== "" && mobileDigits.length === 10;

  const handlePredict = () => {
    if (!inputValid || !detailsValid || !dataReady) return;
    const rankIsEstimate = useMarks;
    const rank = rankIsEstimate ? estimateRank(type, marksNum) : rankNum;
    const qualified = type === "pg" || (useMarks ? isUgQualified("score", marksNum, category) : isUgQualified("rank", rankNum, category));
    const matches = qualified && type === "ug" && rows && colleges
      ? predict(type, rows, {
          rank, category: CAT_CODE[category], quota, state, year: latestYear,
          collegeState: new Map(colleges.map((c) => [c.id, c.state])),
          collegeType: type === "ug" ? new Map(colleges.map((c) => [c.id, (c as UgCollege).type])) : undefined,
        })
      : [];
    const p: Result = {
      qualified,
      rank,
      rankIsEstimate,
      matches,
      pgBand: type === "pg" ? pgBandFor(rank, PG_CATEGORY[pgSel.category] ?? "general") : null,
      pgCount: type === "pg" && pgData ? predictPg(pgData.latest, pgData.previous, rank, pgSel).length : 0,
      alternatives: type === "ug" && qualified ? ugAlternatives(rank, category) : [],
    };
    setPrediction(p);
    setTab("all");
    setUgFilter("all");
    setShowAll(false);
    setStep(3);
    saveLead(p);
    loadNews(rank);
    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 150);
  };

  const editInputs = () => {
    setNews([]);
    setStep(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ── Result lists ───────────────────────────────────────────────────────
  const typeOf = (id: number) => (collegeById.get(id) as UgCollege | undefined)?.type;
  const ugFiltered = type === "ug" ? (prediction?.matches ?? []).filter((m) => matchesUgFilter(m, typeOf(m.college), ugFilter)) : [];
  const ugCounts = Object.fromEntries(CHANCES.map((ch) => [ch, ugFiltered.filter((c) => c.chance === ch).length])) as Record<Chance, number>;
  // MBBS before BDS; within each, the predictor's Safe → Dream order.
  const ugShown = (tab === "all" ? ugFiltered : ugFiltered.filter((c) => c.chance === tab))
    .slice().sort((a, b) => Number(a.course === "BDS") - Number(b.course === "BDS"));

  const counts = ugCounts;
  const totalCount = ugFiltered.length;
  const anyMatch = prediction?.matches.length ?? 0;
  const listLimit = showAll ? Infinity : 12;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero + predictor card */}
      <section className="bg-gradient-to-br from-blue-800 via-blue-700 to-green-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-16 grid lg:grid-cols-2 gap-10 items-center">
          <div className="text-white">
            <Link href="/" className="flex w-fit items-center gap-2 text-white/80 hover:text-white text-sm font-medium mb-6">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
            <div className="inline-flex items-center gap-2 bg-white/15 px-4 py-2 rounded-full text-sm font-semibold mb-5">
              <TrendingUp className="w-4 h-4" />
              Free NEET UG &amp; PG College Predictor
            </div>
            <h1 className="text-3xl md:text-5xl font-black leading-tight mb-4">
              Know Your Colleges <span className="text-yellow-300">Before Counselling Begins</span>
            </h1>
            <p className="text-blue-100 text-lg max-w-xl mb-8">
              Enter your rank, category and quota — we map you to medical colleges using previous-year closing ranks,
              sorted into Safe, Moderate, Risky and Dream picks.
            </p>
            <div className="grid sm:grid-cols-3 gap-3 max-w-xl">
              {[
                { n: 1, title: "Enter Your Rank", desc: "AIR, category & quota" },
                { n: 2, title: "Personalised Colleges", desc: "Safe to Dream list" },
                { n: 3, title: "Get Admission", desc: "Free expert counselling" },
              ].map((s) => (
                <div key={s.n} className="bg-white/10 border border-white/15 rounded-xl p-3">
                  <div className="w-7 h-7 rounded-full bg-yellow-300 text-blue-900 text-sm font-black flex items-center justify-center mb-2">{s.n}</div>
                  <p className="text-sm font-bold">{s.title}</p>
                  <p className="text-xs text-blue-100">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Card */}
          <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 w-full max-w-lg mx-auto">
            {step !== 2 ? (
              <>
                <h2 className="text-xl font-black text-gray-900 mb-1">NEET {new Date().getFullYear()} College Predictor</h2>
                <p className="text-sm text-gray-500 mb-5">Find colleges you can get at your rank</p>

                {/* UG / PG */}
                <div className="flex bg-gray-100 rounded-xl p-1 mb-5">
                  {(["ug", "pg"] as NeetType[]).map((t) => (
                    <button
                      key={t}
                      onClick={() => { setType(t); setRankInput(""); setMarksInput(""); }}
                      className={`flex-1 py-2.5 rounded-lg font-bold text-sm transition-all ${
                        type === t ? "bg-blue-600 text-white shadow-md" : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      NEET {t.toUpperCase()}
                      <span className="block text-[10px] font-medium opacity-80">{t === "ug" ? "MBBS & BDS" : "MD / MS"}</span>
                    </button>
                  ))}
                </div>

                {/* Rank (or marks) */}
                <div className="mb-5">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                      {useMarks ? `NEET ${type.toUpperCase()} Marks (out of ${MAX_SCORE[type]})` : `NEET ${type.toUpperCase()} AIR Rank`}
                    </label>
                    <button
                      type="button"
                      onClick={() => setUseMarks(!useMarks)}
                      className="text-xs font-semibold text-blue-600 hover:underline"
                    >
                      {useMarks ? "I know my rank" : "Don't know rank? Use marks"}
                    </button>
                  </div>
                  <input
                    type="number"
                    inputMode="numeric"
                    value={useMarks ? marksInput : rankInput}
                    onChange={(e) => (useMarks ? setMarksInput(e.target.value) : setRankInput(e.target.value))}
                    placeholder={useMarks ? `0 – ${MAX_SCORE[type]}` : type === "ug" ? "e.g. 45000" : "e.g. 12000"}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-lg font-bold text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                  />
                  {useMarks && marksValid && (
                    <p className="text-xs text-gray-500 mt-1.5">Estimated AIR ~{fmt(estimateRank(type, marksNum))} (from previous-year trends)</p>
                  )}
                  {!useMarks && rankInput !== "" && !rankValid && (
                    <p className="text-xs text-rose-600 mt-1.5">Enter a rank between 1 and {fmt(TOTAL_CANDIDATES[type])}</p>
                  )}
                  {useMarks && marksInput !== "" && !marksValid && (
                    <p className="text-xs text-rose-600 mt-1.5">Enter marks between 0 and {MAX_SCORE[type]}</p>
                  )}
                </div>

                {type === "pg" ? (
                  <PgSelectionFields data={pgData} value={pgSel} onChange={setPgSel} />
                ) : (
                  <>
                {/* Category */}
                <div className="mb-5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Category</label>
                  <div className="grid grid-cols-5 gap-2">
                    {CATEGORIES.map((c) => (
                      <button
                        key={c.value}
                        onClick={() => setCategory(c.value)}
                        className={`py-2 rounded-lg text-xs font-bold border transition-colors ${
                          category === c.value ? "bg-blue-600 border-blue-600 text-white" : "border-gray-200 text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {c.value === "general" ? "UR" : c.value === "obc" ? "OBC" : c.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quota */}
                <div className="mb-6">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Quota</label>
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    {(["aiq", "state"] as Quota[]).map((q) => (
                      <button
                        key={q}
                        onClick={() => setQuota(q)}
                        className={`py-2.5 rounded-lg text-sm font-bold border transition-colors ${
                          quota === q ? "bg-blue-600 border-blue-600 text-white" : "border-gray-200 text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {q === "aiq" ? `All India (${type === "ug" ? "15%" : "50%"})` : `State (${type === "ug" ? "85%" : "50%"})`}
                      </button>
                    ))}
                  </div>
                  {quota === "state" && (
                    <select
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm font-semibold text-gray-800 focus:border-blue-500 outline-none bg-white"
                    >
                      <option value="">Select your domicile state</option>
                      {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  )}
                </div>

                  </>
                )}

                <button
                  // Details are asked once; later predictions go straight to results.
                  onClick={() => (detailsValid ? handlePredict() : setStep(2))}
                  disabled={!inputValid || (detailsValid && !dataReady)}
                  className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg"
                >
                  <TrendingUp className="w-5 h-5" />
                  Predict My {type === "ug" ? "MBBS / BDS" : "MD / MS"} Colleges
                </button>
                <p className="text-[11px] text-gray-400 text-center mt-3">100% free · {type === "ug" ? "Official MCC 2024–2026 closing ranks" : "AIQ & state counselling closing ranks 2024–2025"}</p>
              </>
            ) : (
              <>
                <button onClick={() => setStep(1)} className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-4">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <h2 className="text-xl font-black text-gray-900 mb-1">Almost there!</h2>
                <p className="text-sm text-gray-500 mb-5">Where should we send your personalised college list?</p>
                <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 mb-5 text-sm text-blue-900">
                  NEET {type.toUpperCase()} · {useMarks ? `${marksNum} marks` : `AIR ${fmt(rankNum)}`} · {categoryLabel} · {quotaLabel}
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Mobile Number</label>
                    <input
                      type="tel"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      placeholder="10-digit mobile number"
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                    />
                  </div>
                  <button
                    onClick={handlePredict}
                    disabled={!detailsValid || !dataReady}
                    className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg"
                  >
                    {dataReady ? <>Show My Colleges <ArrowRight className="w-5 h-5" /></> : <><Loader2 className="w-5 h-5 animate-spin" /> Loading college data…</>}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Results */}
      {step === 3 && prediction && (
        <section ref={resultsRef} className="max-w-6xl mx-auto px-4 sm:px-6 py-10 scroll-mt-28">
          {/* Summary */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-wrap items-center gap-x-8 gap-y-3 mb-6">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                {prediction.rankIsEstimate ? "Estimated AIR" : "Your AIR"}
              </p>
              <p className="text-2xl font-black text-blue-800">{prediction.rankIsEstimate ? "~" : ""}{fmt(prediction.rank)}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Exam</p>
              <p className="font-bold text-gray-900">NEET {type.toUpperCase()}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Category</p>
              <p className="font-bold text-gray-900">{categoryLabel}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Quota</p>
              <p className="font-bold text-gray-900">{quotaLabel}</p>
            </div>
            <button
              onClick={editInputs}
              className="ml-auto inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 border border-blue-200 rounded-lg px-4 py-2 hover:bg-blue-50"
            >
              <Pencil className="w-4 h-4" /> Change
            </button>
          </div>

          {!prediction.qualified ? (
            <div className="bg-rose-50 border-2 border-rose-200 rounded-2xl p-6 mb-6">
              <h3 className="font-bold text-gray-900 mb-1">This result is below the NEET UG qualifying cutoff</h3>
              <p className="text-sm text-gray-700 mb-3">
                Last year&apos;s qualifying marks were {UG_QUALIFYING_MARKS.general} for General/EWS and{" "}
                {UG_QUALIFYING_MARKS.obc} for OBC/SC/ST. MBBS, BDS, AYUSH and MBBS abroad all need a qualifying NEET score.
              </p>
              <ul className="space-y-1.5 text-sm text-gray-700 list-disc pl-5">
                <li>Prepare for the next NEET attempt — our counsellors can suggest a plan</li>
                <li>B.Sc Nursing, Physiotherapy or allied health courses that admit without NEET in many states</li>
              </ul>
            </div>
          ) : type === "pg" ? (
            pgData && (access === "unlocked" ? (
              <PgResults data={pgData} rank={prediction.rank} selection={pgSel} />
            ) : (
              <PredictorAccessGate
                status={access}
                supabase={predictorSupabase}
                exam="pg"
                onUnlocked={refreshAccess}
                teaser={`${prediction.pgCount} college-branch option${prediction.pgCount === 1 ? "" : "s"} found for your rank`}
              />
            ))
          ) : (
            <>
              <div className="flex flex-wrap items-end justify-between gap-3 mb-4">
                <div>
                  <h2 className="text-2xl font-black text-gray-900">Your Predicted Colleges</h2>
                  <p className="text-sm text-gray-500">{totalCount} {totalCount === 1 ? "college" : "colleges"} found for your rank</p>
                </div>
                {type === "ug" && quota === "aiq" && anyMatch > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {ugFilters.map((f) => (
                      <button
                        key={f.value}
                        onClick={() => { setUgFilter(f.value); setShowAll(false); }}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${
                          ugFilter === f.value ? "bg-gray-900 border-gray-900 text-white" : "border-gray-200 text-gray-600 bg-white hover:bg-gray-50"
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Chance tabs */}
              {anyMatch > 0 && <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-6">
                <button
                  onClick={() => { setTab("all"); setShowAll(false); }}
                  className={`rounded-xl border px-3 py-3 text-left transition-colors ${
                    tab === "all" ? "bg-gray-900 border-gray-900 text-white" : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <ClipboardList className="w-4 h-4 mb-1" />
                  <p className="text-sm font-bold">All ({totalCount})</p>
                  <p className={`text-[11px] ${tab === "all" ? "text-white/80" : "text-gray-500"}`}>Every match</p>
                </button>
                {CHANCES.map((ch) => {
                  const Icon = chanceMeta[ch].icon;
                  const active = tab === ch;
                  return (
                    <button
                      key={ch}
                      onClick={() => { setTab(ch); setShowAll(false); }}
                      className={`rounded-xl border px-3 py-3 text-left transition-colors ${
                        active ? `${chanceMeta[ch].tab} text-white` : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <Icon className="w-4 h-4 mb-1" />
                      <p className="text-sm font-bold">{ch} ({counts[ch]})</p>
                      <p className={`text-[11px] ${active ? "text-white/80" : "text-gray-500"}`}>{chanceMeta[ch].hint}</p>
                    </button>
                  );
                })}
              </div>}

              {/* UG list — gated behind sign-up + one-time payment once there's something to unlock */}
              {type === "ug" && access !== "unlocked" && totalCount > 0 ? (
                <PredictorAccessGate
                  status={access}
                  supabase={predictorSupabase}
                  exam="ug"
                  onUnlocked={refreshAccess}
                  teaser={`${totalCount} college${totalCount === 1 ? "" : "s"} found for your rank`}
                />
              ) : type === "ug" && (
                ugShown.length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-3 mb-4">
                    {ugShown.slice(0, listLimit).map((c) => (
                      <div key={`${c.college}|${c.course}|${c.quota}`} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex flex-col gap-3">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                            <Building2 className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <Link href={`/neet-ug/colleges/${collegeById.get(c.college)?.slug ?? ""}`} className="font-bold text-gray-900 text-sm leading-snug hover:text-blue-700">{nameOf(c.college)}</Link>
                            <p className="text-xs text-gray-500">{collegeById.get(c.college)?.state ?? ""} · {QUOTA_LABEL[c.quota] ?? `${state} State Quota (est.)`}</p>
                          </div>
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-full border shrink-0 ${chanceMeta[c.chance].pill}`}>{c.chance}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div className="bg-gray-50 rounded-lg py-2">
                            <p className="text-[10px] text-gray-500 uppercase">Course</p>
                            <p className="text-xs font-bold text-gray-900">{c.course} · {TYPE_LABEL[typeOf(c.college) ?? ""] ?? "Govt"}</p>
                          </div>
                          <div className="bg-gray-50 rounded-lg py-2">
                            <p className="text-[10px] text-gray-500 uppercase">Closing {latestYear}</p>
                            <p className="text-xs font-bold text-gray-900">{c.estimated ? "~" : ""}{fmt(c.closing)}</p>
                          </div>
                          <div className="bg-gray-50 rounded-lg py-2">
                            <p className="text-[10px] text-gray-500 uppercase">Closing {latestYear - 1}</p>
                            <p className="text-xs font-bold text-gray-900">{c.previous ? fmt(c.previous) : "—"}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-5 mb-6">
                    <h3 className="font-bold text-gray-900 mb-1">
                      {quota === "state" && prediction.matches.length === 0
                        ? `No ${state} state-quota matches in our list at this rank yet`
                        : tab === "all" ? "No colleges matched at this rank" : `No ${tab} colleges at this rank`}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {tab !== "all" && totalCount > 0
                        ? "Check the other tabs, or see the options below."
                        : "Our counsellors can check state, private and management-quota seats for you — good options are still open."}
                    </p>
                  </div>
                )
              )}

              {access === "unlocked" && !showAll && ugShown.length > 12 && (
                <button
                  onClick={() => setShowAll(true)}
                  className="mb-6 w-full text-sm font-semibold text-blue-700 border border-blue-200 bg-white rounded-xl py-2.5 hover:bg-blue-50"
                >
                  Show all {ugShown.length} colleges
                </button>
              )}

              {type === "ug" && prediction.alternatives.length > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-2xl p-5 mb-6">
                  <h3 className="font-bold text-gray-900 mb-2">More options at your rank</h3>
                  <ul className="space-y-1.5 text-sm text-gray-700 list-disc pl-5">
                    {prediction.alternatives.map((a) => <li key={a}>{a}</li>)}
                  </ul>
                </div>
              )}
            </>
          )}

          <div className="flex items-start gap-2 text-xs text-gray-500 mb-8">
            <Info className="w-4 h-4 shrink-0 mt-0.5" />
            <p>
              {type === "pg"
                ? <>Based on {pgData?.latestYear} AIQ and state counselling closing ranks for your quota and category (rounds you pick, R1–R3 by default); reserved categories also see open seats.{" "}</>
                : <>Based on official MCC {latestYear} closing ranks (rounds 1–3) for open seats and your category{quota === "state" ? "; state-quota ranks are estimated from the same colleges' AIQ closing ranks" : ""}.{" "}</>}
              <strong>Safe</strong> = well inside last year&apos;s cutoff, <strong>Moderate</strong> = close to it,{" "}
              <strong>Risky</strong> = possible in later rounds, <strong>Dream</strong> = needs cutoffs to move a lot.
              Talk to a counsellor before choice filling.
            </p>
          </div>

          {/* Latest cutoff news (Google Custom Search) */}
          {(newsLoading || news.length > 0) && (
            <div className="mb-8">
              <h3 className="text-sm font-bold text-gray-900 mb-2">Latest cutoff updates on the web</h3>
              {newsLoading ? (
                <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
              ) : (
                <div className="grid sm:grid-cols-2 gap-2">
                  {news.map((n) => (
                    <a
                      key={n.url}
                      href={n.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start justify-between gap-2 bg-white hover:bg-blue-50 border border-gray-100 rounded-xl p-3 group"
                    >
                      <span className="text-xs font-semibold text-gray-800 group-hover:text-blue-700">{n.name}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Counselling CTA */}
          <div className="bg-blue-600 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-5">
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-xl font-bold text-white mb-1">Get your complete choice-filling list</h3>
              <p className="text-blue-100 text-sm">
                Your prediction is saved. Our counsellors will call you within 24 hours with state, private and deemed options
                for your rank.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="tel:+919211607005"
                className="inline-flex items-center justify-center gap-2 bg-white text-blue-700 font-bold px-5 py-3 rounded-xl hover:bg-blue-50"
              >
                <Phone className="w-4 h-4" /> +91 92116 07005
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 border border-white/40 text-white font-bold px-5 py-3 rounded-xl hover:bg-white/10"
              >
                Free Counselling <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
