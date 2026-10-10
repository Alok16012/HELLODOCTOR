"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { Loader2, ListChecks, Copy, Printer, Check } from "lucide-react";
import {
  CATEGORY_LABEL, CHANCES, EXAM, MAIN_CATEGORIES, OPEN_QUOTAS, QUOTA_LABEL, fmtRank, predict,
  type Chance, type Exam, type Prediction,
} from "@/lib/neet/meta";
import { useColleges, useCutoffs } from "@/lib/neet/useNeetData";

const pill: Record<Chance, string> = {
  Safe: "bg-green-100 text-green-700 border-green-200",
  Moderate: "bg-blue-100 text-blue-700 border-blue-200",
  Risky: "bg-amber-100 text-amber-700 border-amber-200",
  Dream: "bg-rose-100 text-rose-700 border-rose-200",
};
// Choice lists go from most wanted to safest: dream picks first, safe seats last.
const ORDER: Chance[] = ["Dream", "Risky", "Moderate", "Safe"];

export default function ChoiceFilling({ exam }: { exam: Exam }) {
  const e = EXAM[exam];
  const { colleges } = useColleges(exam);
  const { rows, error } = useCutoffs(exam, [e.latestYear, e.latestYear - 1]);
  const [rankInput, setRankInput] = useState("");
  const [category, setCategory] = useState("GN");
  const [quotas, setQuotas] = useState<string[]>(OPEN_QUOTAS[exam]);
  const [courses, setCourses] = useState<string[]>(exam === "ug" ? ["MBBS"] : []);
  const [states, setStates] = useState<string[]>([]);
  const [include, setInclude] = useState<Chance[]>(["Dream", "Risky", "Moderate", "Safe"]);
  const [submitted, setSubmitted] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [limit, setLimit] = useState(100);

  const byId = useMemo(() => new Map((colleges ?? []).map((c) => [c.id, c])), [colleges]);
  const allCourses = useMemo(() => [...new Set((rows ?? []).map((r) => r.course))].sort(), [rows]);
  const allStates = useMemo(() => [...new Set((colleges ?? []).map((c) => c.state).filter(Boolean) as string[])].sort(), [colleges]);

  const list = useMemo(() => {
    if (!rows || !colleges || submitted === null) return [] as Prediction[];
    const preds = predict(exam, rows, {
      rank: submitted, category, quota: "aiq", year: e.latestYear,
      collegeState: new Map(colleges.map((c) => [c.id, c.state])),
    });
    return preds
      .filter((p) => quotas.includes(p.quota) && include.includes(p.chance))
      .filter((p) => !courses.length || courses.includes(p.course))
      .filter((p) => !states.length || states.includes(byId.get(p.college)?.state ?? ""))
      .sort((a, b) => ORDER.indexOf(a.chance) - ORDER.indexOf(b.chance) || a.closing - b.closing);
  }, [rows, colleges, submitted, category, quotas, include, courses, states, exam, e.latestYear, byId]);

  const rank = Number(rankInput);
  const valid = Number.isInteger(rank) && rank > 0;
  const toggle = <T,>(arr: T[], v: T, set: (x: T[]) => void) => set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  const text = () => list.map((p, i) => {
    const c = byId.get(p.college);
    return `${i + 1}. ${c?.name ?? p.college} — ${exam === "pg" ? `${p.course} (${p.degree})` : p.course} — ${QUOTA_LABEL[p.quota] ?? p.quota} — closing ${fmtRank(p.closing)} (${p.chance})`;
  }).join("\n");

  const chip = (on: boolean) => `px-3 py-1.5 rounded-full text-xs font-bold border ${on ? "bg-blue-600 border-blue-600 text-white" : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"}`;

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm h-fit lg:sticky lg:top-40 print:hidden">
        <h2 className="font-black text-gray-900 text-lg mb-4 flex items-center gap-2"><ListChecks className="w-5 h-5 text-blue-600" /> Your details</h2>
        <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">{e.label} AIR</label>
        <input type="number" inputMode="numeric" value={rankInput} onChange={(ev) => setRankInput(ev.target.value)} placeholder="e.g. 25000"
          className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-lg font-bold mb-4 focus:border-blue-500 outline-none" />

        <p className="text-xs font-bold text-gray-700 uppercase mb-1.5">Category</p>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {MAIN_CATEGORIES.map((c) => <button key={c} onClick={() => setCategory(c)} className={chip(category === c)}>{c === "GN" ? "UR" : c}</button>)}
        </div>

        <p className="text-xs font-bold text-gray-700 uppercase mb-1.5">Quotas</p>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {OPEN_QUOTAS[exam].map((q) => <button key={q} onClick={() => toggle(quotas, q, setQuotas)} className={chip(quotas.includes(q))}>{QUOTA_LABEL[q]}</button>)}
        </div>

        <p className="text-xs font-bold text-gray-700 uppercase mb-1.5">{exam === "ug" ? "Courses" : "Branches (none = all)"}</p>
        <div className="flex flex-wrap gap-1.5 mb-4 max-h-40 overflow-y-auto">
          {allCourses.map((c) => <button key={c} onClick={() => toggle(courses, c, setCourses)} className={chip(courses.includes(c))}>{c}</button>)}
        </div>

        <p className="text-xs font-bold text-gray-700 uppercase mb-1.5">Preferred states (none = all India)</p>
        <select value="" onChange={(ev) => ev.target.value && toggle(states, ev.target.value, setStates)}
          className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm bg-white mb-2">
          <option value="">Add a state…</option>
          {allStates.filter((s) => !states.includes(s)).map((s) => <option key={s}>{s}</option>)}
        </select>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {states.map((s) => <button key={s} onClick={() => toggle(states, s, setStates)} className={chip(true)}>{s} ×</button>)}
        </div>

        <p className="text-xs font-bold text-gray-700 uppercase mb-1.5">Include</p>
        <div className="flex flex-wrap gap-1.5 mb-5">
          {CHANCES.map((c) => <button key={c} onClick={() => toggle(include, c, setInclude)} className={chip(include.includes(c))}>{c}</button>)}
        </div>

        <button onClick={() => { setSubmitted(rank); setLimit(100); }} disabled={!valid || !rows}
          className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-300 text-white font-bold py-3 rounded-xl">
          {rows ? "Build My Choice List" : "Loading data…"}
        </button>
      </div>

      <div className="lg:col-span-2">
        {error && <p className="text-sm text-rose-600">Couldn&apos;t load cut-off data. Please refresh.</p>}
        {!rows && !error && <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>}
        {rows && submitted === null && (
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 text-sm text-gray-700">
            <h3 className="font-bold text-gray-900 text-lg mb-2">How the advisor works</h3>
            <ol className="list-decimal pl-5 space-y-1.5">
              <li>We take every college × {exam === "ug" ? "course" : "branch"} × quota from MCC&apos;s {e.latestYear} results (rounds 1–3).</li>
              <li>We compare your rank with the closing rank for open (UR) seats and your own category, whichever is higher.</li>
              <li>The list is ordered the way choices are usually filled: <b>Dream</b> picks first, then <b>Risky</b>, <b>Moderate</b> and finally <b>Safe</b> seats — best colleges first within each group.</li>
              <li>Reorder by your own preferences (fees, location, bond) before locking choices on the MCC portal.</li>
            </ol>
          </div>
        )}
        {rows && submitted !== null && (
          <>
            <div className="flex flex-wrap items-center gap-2 mb-3 print:hidden">
              <p className="text-sm text-gray-600 mr-auto">
                <b>{fmtRank(list.length)}</b> choices for AIR {fmtRank(submitted)} · {CATEGORY_LABEL[category]} · based on {e.latestYear}
              </p>
              <button onClick={async () => { await navigator.clipboard.writeText(text()); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                className="inline-flex items-center gap-1.5 text-sm font-semibold border border-gray-200 bg-white rounded-lg px-3 py-1.5 hover:bg-gray-50">
                {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />} {copied ? "Copied" : "Copy list"}
              </button>
              <button onClick={() => window.print()} className="inline-flex items-center gap-1.5 text-sm font-semibold border border-gray-200 bg-white rounded-lg px-3 py-1.5 hover:bg-gray-50">
                <Printer className="w-4 h-4" /> Print
              </button>
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
              {list.slice(0, limit).map((p, i) => {
                const c = byId.get(p.college);
                return (
                  <div key={`${p.college}|${p.quota}|${p.degree}|${p.course}`} className="flex items-center gap-3 px-4 py-3 border-t border-gray-100 first:border-t-0">
                    <span className="w-8 text-right text-sm font-black text-gray-400 shrink-0">{i + 1}</span>
                    <div className="min-w-0 flex-1">
                      {c ? <Link href={`/${e.slug}/colleges/${c.slug}`} className="font-semibold text-gray-900 text-sm hover:text-blue-700">{c.name}</Link> : "—"}
                      <p className="text-xs text-gray-500">
                        {exam === "pg" ? `${p.course} (${p.degree})` : p.course} · {QUOTA_LABEL[p.quota] ?? p.quota} · {c?.state ?? ""}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-black text-blue-800">{fmtRank(p.closing)}</p>
                      <p className="text-[10px] text-gray-400">{p.previous ? `${e.latestYear - 1}: ${fmtRank(p.previous)}` : CATEGORY_LABEL[p.category]}</p>
                    </div>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${pill[p.chance]}`}>{p.chance}</span>
                  </div>
                );
              })}
              {!list.length && <p className="px-4 py-10 text-center text-gray-500 text-sm">No colleges match. Try adding quotas, states or Dream picks — or talk to a counsellor about state quota and private seats.</p>}
            </div>
            {list.length > limit && (
              <button onClick={() => setLimit(limit + 100)} className="mt-4 w-full bg-white border border-blue-200 text-blue-700 font-semibold rounded-xl py-3 hover:bg-blue-50 print:hidden">
                Show more ({fmtRank(list.length - limit)} left)
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
