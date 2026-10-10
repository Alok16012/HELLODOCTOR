"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { Loader2, Search, ArrowUpDown } from "lucide-react";
import {
  CATEGORY_LABEL, EXAM, MAIN_CATEGORIES, QUOTA_LABEL, ROUND_LABEL, TYPE_LABEL, fmtRank,
  type Cutoff, type Exam, type PgCollege, type UgCollege,
} from "@/lib/neet/meta";
import { useColleges, useCutoffs } from "@/lib/neet/useNeetData";

const PAGE = 50;

export default function CutoffExplorer({ exam }: { exam: Exam }) {
  const e = EXAM[exam];
  const [year, setYear] = useState<number>(e.latestYear);
  const [round, setRound] = useState<string>("final");
  const [quota, setQuota] = useState("AI");
  const [category, setCategory] = useState("GN");
  const [course, setCourse] = useState(exam === "ug" ? "MBBS" : "");
  const [degree, setDegree] = useState("");
  const [state, setState] = useState("");
  const [type, setType] = useState("");
  const [q, setQ] = useState("");
  const [desc, setDesc] = useState(false);
  const [limit, setLimit] = useState(PAGE);

  const { colleges } = useColleges(exam);
  const { rows, error } = useCutoffs(exam, [year]);
  const byId = useMemo(() => new Map((colleges ?? []).map((c) => [c.id, c])), [colleges]);

  const options = useMemo(() => {
    const r = rows ?? [];
    return {
      // until data arrives, show the defaults so the selects aren't blank
      quotas: r.length ? [...new Set(r.map((x) => x.quota))] : ["AI"],
      courses: r.length ? [...new Set(r.map((x) => x.course))].sort() : exam === "ug" ? ["MBBS"] : [],
      degrees: [...new Set(r.map((x) => x.degree))].sort(),
      rounds: [...new Set(r.map((x) => x.round))].sort(),
      states: [...new Set((colleges ?? []).map((c) => c.state).filter(Boolean) as string[])].sort(),
      types: exam === "ug" ? [...new Set((colleges ?? []).map((c) => (c as UgCollege).type))].sort() : [],
    };
  }, [rows, colleges, exam]);

  const list = useMemo(() => {
    if (!rows) return [];
    const needle = q.trim().toLowerCase();
    const filtered = rows.filter((r) =>
      r.quota === quota && r.category === category &&
      (!course || r.course === course) && (!degree || r.degree === degree) &&
      (round === "final" ? r.round <= 4 : r.round === Number(round)));
    // "final" = the highest rank allotted in any round (with that round), lowest opening overall
    let out: Cutoff[] = filtered;
    if (round === "final") {
      const fin = new Map<string, Cutoff>();
      for (const r of filtered) {
        const k = `${r.college}|${r.degree}|${r.course}`;
        const cur = fin.get(k);
        if (!cur) fin.set(k, r);
        else fin.set(k, { ...(r.closing > cur.closing ? r : cur), opening: Math.min(r.opening, cur.opening) });
      }
      out = [...fin.values()];
    }
    out = out.filter((r) => {
      const c = byId.get(r.college);
      if (!c) return !needle && !state && !type;
      if (needle && !c.name.toLowerCase().includes(needle)) return false;
      if (state && c.state !== state) return false;
      if (type && (c as UgCollege).type !== type) return false;
      return true;
    });
    return out.sort((a, b) => (desc ? b.closing - a.closing : a.closing - b.closing));
  }, [rows, quota, category, course, degree, round, q, state, type, desc, byId]);

  const select = "border-2 border-gray-200 rounded-xl px-3 py-2 text-sm font-semibold text-gray-700 bg-white focus:border-blue-500 outline-none w-full";
  const reset = () => setLimit(PAGE);

  return (
    <div>
      <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm mb-5 space-y-3">
        <div className="flex flex-wrap gap-2">
          {e.years.map((y) => (
            <button key={y} onClick={() => { setYear(y); reset(); }}
              className={`px-4 py-2 rounded-xl text-sm font-bold border ${y === year ? "bg-blue-600 border-blue-600 text-white" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
              {y}
            </button>
          ))}
          <div className="flex flex-wrap gap-2 sm:ml-auto">
            {["final", ...options.rounds.map(String)].map((r) => (
              <button key={r} onClick={() => { setRound(r); reset(); }}
                className={`px-3 py-2 rounded-xl text-xs font-bold border ${r === round ? "bg-gray-900 border-gray-900 text-white" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
                {r === "final" ? "Final cut-off" : ROUND_LABEL[Number(r)]}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
          <select value={quota} onChange={(ev) => { setQuota(ev.target.value); reset(); }} className={select}>
            {options.quotas.map((x) => <option key={x} value={x}>{QUOTA_LABEL[x] ?? x}</option>)}
          </select>
          <select value={category} onChange={(ev) => { setCategory(ev.target.value); reset(); }} className={select}>
            {Object.keys(CATEGORY_LABEL).map((c) => <option key={c} value={c}>{CATEGORY_LABEL[c]}</option>)}
          </select>
          <select value={course} onChange={(ev) => { setCourse(ev.target.value); reset(); }} className={select}>
            {exam === "pg" && <option value="">All branches</option>}
            {options.courses.map((c) => <option key={c}>{c}</option>)}
          </select>
          {exam === "pg" ? (
            <select value={degree} onChange={(ev) => { setDegree(ev.target.value); reset(); }} className={select}>
              <option value="">MD, MS, DNB, Diploma</option>
              {options.degrees.map((d) => <option key={d}>{d}</option>)}
            </select>
          ) : (
            <select value={type} onChange={(ev) => { setType(ev.target.value); reset(); }} className={select}>
              <option value="">All college types</option>
              {options.types.map((t) => <option key={t} value={t}>{TYPE_LABEL[t] ?? t}</option>)}
            </select>
          )}
          <select value={state} onChange={(ev) => { setState(ev.target.value); reset(); }} className={select}>
            <option value="">All states</option>
            {options.states.map((s) => <option key={s}>{s}</option>)}
          </select>
          <label className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input value={q} onChange={(ev) => { setQ(ev.target.value); reset(); }} placeholder="College name"
              className="w-full border-2 border-gray-200 rounded-xl pl-9 pr-3 py-2 text-sm focus:border-blue-500 outline-none" />
          </label>
        </div>
      </div>

      {error && <p className="text-sm text-rose-600">Couldn&apos;t load cut-off data. Please refresh.</p>}
      {!rows && !error && <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>}

      {rows && (
        <>
          <p className="text-sm text-gray-500 mb-2">
            {fmtRank(list.length)} results · {QUOTA_LABEL[quota] ?? quota} · {CATEGORY_LABEL[category]} · {year} {round === "final" ? "final (all rounds)" : ROUND_LABEL[Number(round)]}
          </p>
          <div className="overflow-x-auto bg-white border border-gray-100 rounded-2xl shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                <tr>
                  <th className="text-left px-4 py-3">#</th>
                  <th className="text-left px-3 py-3">College</th>
                  <th className="text-left px-3 py-3">{exam === "ug" ? "Course" : "Branch"}</th>
                  {round === "final" && <th className="text-left px-3 py-3">Round</th>}
                  <th className="text-right px-3 py-3">Opening</th>
                  <th className="text-right px-4 py-3">
                    <button onClick={() => setDesc(!desc)} className="inline-flex items-center gap-1 uppercase">Closing <ArrowUpDown className="w-3 h-3" /></button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {list.slice(0, limit).map((r, i) => {
                  const c = byId.get(r.college) as UgCollege | PgCollege | undefined;
                  return (
                    <tr key={`${r.college}|${r.degree}|${r.course}|${r.round}`} className="border-t border-gray-100 hover:bg-blue-50/40">
                      <td className="px-4 py-2.5 text-gray-400">{i + 1}</td>
                      <td className="px-3 py-2.5">
                        {c ? (
                          <Link href={`/${e.slug}/colleges/${c.slug}`} className="font-semibold text-gray-900 hover:text-blue-700">{c.name}</Link>
                        ) : "—"}
                        <span className="block text-xs text-gray-400">{c?.state ?? ""}</span>
                      </td>
                      <td className="px-3 py-2.5 whitespace-nowrap">
                        {r.course}{exam === "pg" && <span className="ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700">{r.degree}</span>}
                      </td>
                      {round === "final" && <td className="px-3 py-2.5 text-xs text-gray-500 whitespace-nowrap">{ROUND_LABEL[r.round]}</td>}
                      <td className="px-3 py-2.5 text-right text-gray-500">{fmtRank(r.opening)}</td>
                      <td className="px-4 py-2.5 text-right font-black text-blue-800">{fmtRank(r.closing)}</td>
                    </tr>
                  );
                })}
                {!list.length && (
                  <tr><td colSpan={6} className="px-4 py-10 text-center text-gray-500">No allotments match these filters.</td></tr>
                )}
              </tbody>
            </table>
          </div>
          {list.length > limit && (
            <button onClick={() => setLimit(limit + PAGE * 2)} className="mt-4 w-full bg-white border border-blue-200 text-blue-700 font-semibold rounded-xl py-3 hover:bg-blue-50">
              Show more ({fmtRank(list.length - limit)} left)
            </button>
          )}
          <p className="text-xs text-gray-500 mt-3">
            Source: MCC {e.label} allotment results {year}. &quot;Final cut-off&quot; is the highest rank allotted in any round (including the stray round); the Round column shows where it happened.
            {MAIN_CATEGORIES.includes(category) ? "" : " PwD seats are few, so ranks vary a lot."}
          </p>
        </>
      )}
    </div>
  );
}
