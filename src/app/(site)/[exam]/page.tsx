import Link from "next/link";
import type { Metadata } from "next";
import {
  TrendingUp, Building2, BarChart3, GitCompare, ListChecks, Map, CalendarDays, Crown, ShieldCheck, Database, ArrowRight, Phone,
} from "lucide-react";
import { EXAM, examFromSlug, fmtRank, type Exam } from "@/lib/neet/meta";
import { getStats } from "@/lib/neet/server";
import { SCHEDULE } from "@/lib/neet/schedule";
import EnquiryButton from "@/components/neet/EnquiryButton";

type Props = { params: Promise<{ exam: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const exam = examFromSlug((await params).exam) as Exam;
  const e = EXAM[exam];
  return {
    title: `${e.label} Counselling 2026 — College Predictor, Cut-offs & Choice Filling | Hello Doctor`,
    description: `${e.label} counselling guide for ${e.courses}: round-wise MCC cut-offs, college info, cut-off comparison, choice filling advisor and expert counselling from Hello Doctor.`,
  };
}

const FAQ: Record<Exam, { q: string; a: string }[]> = {
  ug: [
    { q: "Which seats does MCC counselling cover?", a: "MCC conducts counselling for 15% All India Quota seats in government medical and dental colleges, plus 100% seats of AIIMS, JIPMER, Central Universities, ESIC and Deemed Universities. The remaining 85% state quota seats are filled by each state's own counselling authority." },
    { q: "Where does your cut-off data come from?", a: "Every closing rank on this site is taken from MCC's official allotment results — Round 1, 2, 3 and the stray vacancy round — for 2024, 2025 and 2026. We record the opening and closing All India Rank for each college, course, quota and category." },
    { q: "Does a closing rank guarantee a seat next year?", a: "No. Cut-offs move every year with seat additions, exam difficulty and how candidates fill choices. Use our Safe / Moderate / Risky / Dream groups as a guide and keep a balanced choice list." },
    { q: "Can a reserved-category student get an open (UR) seat?", a: "Yes. Open seats are available to everyone on merit, so OBC, SC, ST and EWS candidates are considered for both open seats and their own reserved seats. Our predictor checks both." },
    { q: "Do I need to register for both MCC and state counselling?", a: "Usually yes — they are separate processes with separate registrations and fees. Our counsellors help you plan both so you don't miss a better seat." },
  ],
  pg: [
    { q: "Which PG seats does MCC counselling cover?", a: "MCC conducts counselling for 50% All India Quota MD/MS/Diploma seats in government colleges, 100% seats of Deemed and Central Universities (including DU, BHU, AMU internal quotas) and DNB / DNB Diploma seats of NBEMS-accredited hospitals." },
    { q: "Where does the PG cut-off data come from?", a: "All closing ranks are taken from MCC's official PG allotment results for 2023, 2024 and 2025 (Round 1, 2, 3 and stray). Each row shows the opening and closing rank for a college, degree, branch, quota and category." },
    { q: "What is the difference between MD/MS and DNB seats?", a: "MD/MS seats are in NMC-recognised medical colleges; DNB seats are run by NBEMS in accredited hospitals. Both are recognised postgraduate qualifications, and DNB seats often close at higher ranks in the same branch." },
    { q: "How should I balance branch vs college?", a: "Most candidates rank branches first and then colleges, but a strong government college in a slightly less preferred branch can be a better option than a weak private seat. Our choice filling advisor shows both views." },
    { q: "Are state quota PG cut-offs included?", a: "Not yet — MCC publishes only All India, Deemed, Central and DNB results. For state quota our predictor shows an estimate; our counsellors share state-specific data on call." },
  ],
};

export default async function ExamHub({ params }: Props) {
  const exam = examFromSlug((await params).exam) as Exam;
  const e = EXAM[exam];
  const stats = getStats(exam);
  const schedule = SCHEDULE[exam];
  const slug = e.slug;

  const tools = [
    { href: `/predictor?exam=${exam}`, icon: TrendingUp, title: "College Predictor", desc: "Enter your AIR, category and quota — get Safe, Moderate, Risky and Dream colleges." },
    { href: `/${slug}/colleges`, icon: Building2, title: "College Info", desc: `${fmtRank(stats.colleges)} ${exam === "ug" ? "medical & dental colleges" : "PG institutes & DNB hospitals"} with round-wise closing ranks.` },
    { href: `/${slug}/cutoffs`, icon: BarChart3, title: "Final & Yearly Cut-offs", desc: `Opening and closing ranks for every round, ${e.years[e.years.length - 1]}–${e.years[0]}.` },
    { href: `/${slug}/compare`, icon: GitCompare, title: "Cut-off Comparison", desc: "Compare up to 3 colleges side by side across years and rounds." },
    { href: `/${slug}/choice-filling`, icon: ListChecks, title: "Choice Filling Advisor", desc: "Get an ordered choice list for your rank — from dream picks to safe seats." },
    { href: `/${slug}/state-counselling`, icon: Map, title: "State Counselling", desc: "State-wise colleges, counselling authorities and how state quota works." },
    { href: `/${slug}/schedule`, icon: CalendarDays, title: "Schedule & Seat Matrix", desc: "Official MCC round dates and seat counts by state, type and category." },
    { href: `/${slug}/premium`, icon: Crown, title: "Premium Counselling", desc: "A dedicated senior counsellor from rank analysis to final admission." },
  ];

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-800 via-blue-700 to-green-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-16 grid lg:grid-cols-5 gap-10 items-center">
          <div className="lg:col-span-3">
            <div className="inline-flex items-center gap-2 bg-white/15 px-4 py-1.5 rounded-full text-sm font-semibold mb-5">
              <ShieldCheck className="w-4 h-4" /> Built on official MCC allotment results
            </div>
            <h1 className="text-3xl md:text-5xl font-black leading-tight mb-4">
              {e.label} Counselling 2026 <span className="block text-yellow-300">{e.courses}</span>
            </h1>
            <p className="text-blue-100 text-lg max-w-2xl mb-8">
              {`Plan your ${e.counselling} choices with real round-wise cut-offs, a rank-based college predictor and one-to-one guidance from Hello Doctor's counsellors.`}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href={`/predictor?exam=${exam}`} className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 font-bold px-6 py-3 rounded-xl shadow-lg">
                <TrendingUp className="w-5 h-5" /> Predict My College
              </Link>
              <Link href={`/${slug}/cutoffs`} className="inline-flex items-center gap-2 bg-white text-blue-800 hover:bg-blue-50 font-bold px-6 py-3 rounded-xl">
                <BarChart3 className="w-5 h-5" /> View Cut-offs
              </Link>
              <EnquiryButton className="inline-flex items-center gap-2 border border-white/40 hover:bg-white/10 font-bold px-6 py-3 rounded-xl" />
            </div>
          </div>
          <div className="lg:col-span-2 grid grid-cols-2 gap-3">
            {[
              { v: fmtRank(stats.colleges), l: exam === "ug" ? "Colleges (MBBS & BDS)" : "PG institutes & DNB hospitals" },
              { v: fmtRank(stats.cutoffRows), l: "Cut-off records" },
              { v: `${e.years[e.years.length - 1]}–${e.years[0]}`, l: "Years of MCC data" },
              stats.seats ? { v: fmtRank(stats.seats), l: "MCC seats (Round 1, 2026)" } : { v: `${stats.states}`, l: "States & UTs covered" },
            ].map((s) => (
              <div key={s.l} className="bg-white/10 border border-white/15 rounded-2xl p-5">
                <p className="text-2xl md:text-3xl font-black">{s.v}</p>
                <p className="text-xs md:text-sm text-blue-100 mt-1">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="text-center mb-8">
          <p className="text-sm font-bold text-blue-600 uppercase tracking-wide">Counselling tools</p>
          <h2 className="text-2xl md:text-3xl font-black text-gray-900">Everything for {e.label} counselling in one place</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {tools.map(({ href, icon: Icon, title, desc }) => (
            <Link key={href} href={href} className="group bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-lg hover:border-blue-200 transition-all">
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-gray-900 mb-1">{title}</h3>
              <p className="text-sm text-gray-500 mb-3">{desc}</p>
              <span className="text-sm font-semibold text-blue-600 inline-flex items-center gap-1">Open <ArrowRight className="w-4 h-4" /></span>
            </Link>
          ))}
        </div>
      </section>

      {/* Schedule + data note */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-12 grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3 mb-4">
            <h2 className="text-xl font-black text-gray-900">Counselling schedule 2026</h2>
            <Link href={`/${slug}/schedule`} className="text-sm font-semibold text-blue-600 hover:underline">Full schedule →</Link>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {schedule.rounds.map((r) => (
              <div key={r.round} className="border border-gray-100 rounded-xl p-4 bg-gray-50">
                <p className="font-bold text-gray-900 mb-1">{r.round}</p>
                {r.steps.slice(0, 2).map((s) => (
                  <p key={s.label} className="text-xs text-gray-600"><span className="font-semibold">{s.label}:</span> {s.date}</p>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
          <Database className="w-8 h-8 text-blue-600 mb-3" />
          <h2 className="text-lg font-black text-gray-900 mb-2">Data you can check</h2>
          <p className="text-sm text-gray-700 mb-3">
            Every closing rank comes from MCC&apos;s published allotment results ({e.years[e.years.length - 1]}–{e.years[0]}),
            covering all rounds, quotas and categories. No guesswork — and no paywall.
          </p>
          <p className="text-xs text-gray-500">State quota cut-offs are not published by MCC; our counsellors share them on call.</p>
        </div>
      </section>

      {/* Premium strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-12">
        <div className="bg-gradient-to-r from-blue-700 to-green-700 rounded-3xl p-6 md:p-10 flex flex-col md:flex-row items-center gap-6 text-white">
          <Crown className="w-12 h-12 text-yellow-300 shrink-0" />
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-black mb-1">Want an expert to handle your counselling?</h2>
            <p className="text-blue-100">Personal college list, round-by-round choice filling for AIQ + state quota, document checks and reporting support.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href={`/${slug}/premium`} className="bg-white text-blue-800 font-bold px-6 py-3 rounded-xl text-center hover:bg-blue-50">See Premium Plan</Link>
            <a href="tel:+919211607005" className="inline-flex items-center justify-center gap-2 border border-white/40 font-bold px-6 py-3 rounded-xl hover:bg-white/10">
              <Phone className="w-4 h-4" /> Call Now
            </a>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 pb-16">
        <h2 className="text-2xl font-black text-gray-900 text-center mb-6">{e.label} counselling — FAQs</h2>
        <div className="space-y-3">
          {FAQ[exam].map((f) => (
            <details key={f.q} className="group bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
              <summary className="font-semibold text-gray-900 cursor-pointer list-none flex justify-between gap-3">
                {f.q}<span className="text-blue-600 group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="text-sm text-gray-600 mt-3">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
