"use client";
import { useMemo, useState } from "react";
import { Loader2, Plus, Search, X } from "lucide-react";
import { CATEGORY_LABEL, EXAM, QUOTA_LABEL, ROUND_LABEL, fmtRank, type Exam } from "@/lib/neet/meta";
import { useColleges, useCutoffs } from "@/lib/neet/useNeetData";

const MAX = 3;

export default function CompareTool({ exam, initial = [] }: { exam: Exam; initial?: number[] }) {
  const e = EXAM[exam];
  const { colleges } = useColleges(exam);
  const { rows, error } = useCutoffs(exam, [...e.years]);
  const [picked, setPicked] = useState<number[]>(initial.slice(0, MAX));
  const [search, setSearch] = useState("");
  const [course, setCourse] = useState("");
  const [quota, setQuota] = useState("AI");
  const [category, setCategory] = useState("GN");

  const byId = useMemo(() => new Map((colleges ?? []).map((c) => [c.id, c])), [colleges]);
  const matches = useMemo(() => {
    const n = search.trim().toLowerCase();
    if (n.length < 2 || !colleges) return [];
    return colleges.filter((c) => c.name.toLowerCase().includes(n) && !picked.includes(c.id)).slice(0, 8);
  }, [search, colleges, picked]);

  const mine = useMemo(() => (rows ?? []).filter((r) => picked.includes(r.college)), [rows, picked]);
  const courses = [...new Set(mine.map((r) => `${r.degree}|${r.course}`))].sort();
  const quotas = [...new Set(mine.map((r) => r.quota))];
  const activeCourse = courses.includes(course) ? course : (courses.find((c) => c.endsWith("|MBBS")) ?? courses[0] ?? "");
  const activeQuota = quotas.includes(quota) ? quota : quotas[0] ?? "AI";

  const table = (() => {
    const [degree, crs] = activeCourse.split("|");
    const cells = new Map<string, number>();
    for (const r of mine) {
      if (r.degree !== degree || r.course !== crs || r.quota !== activeQuota || r.category !== category) continue;
      cells.set(`${r.year}|${r.round}|${r.college}`, r.closing);
    }
    const lines: { year: number; round: number }[] = [];
    for (const y of e.years) for (const rd of [1, 2, 3, 4]) {
      if (picked.some((id) => cells.has(`${y}|${rd}|${id}`))) lines.push({ year: y, round: rd });
    }
    return { cells, lines };
  })();

  const select = "border-2 border-gray-200 rounded-xl px-3 py-2 text-sm font-semibold text-gray-700 bg-white focus:border-blue-500 outline-none";

  return (
    <div className="space-y-5">
      <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
        <p className="text-sm font-bold text-gray-900 mb-3">Choose up to {MAX} colleges</p>
        <div className="flex flex-wrap gap-2 mb-3">
          {picked.map((id) => (
            <span key={id} className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-200 text-blue-800 text-sm font-semibold rounded-full pl-3 pr-1.5 py-1">
              {byId.get(id)?.name ?? `#${id}`}
              <button onClick={() => setPicked(picked.filter((x) => x !== id))} className="p-0.5 rounded-full hover:bg-blue-100" aria-label="Remove"><X className="w-3.5 h-3.5" /></button>
            </span>
          ))}
        </div>
        {picked.length < MAX && (
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <input value={search} onChange={(ev) => setSearch(ev.target.value)} placeholder="Type a college name…"
              className="w-full border-2 border-gray-200 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:border-blue-500 outline-none" />
            {matches.length > 0 && (
              <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                {matches.map((c) => (
                  <button key={c.id} onClick={() => { setPicked([...picked, c.id]); setSearch(""); }}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-blue-50 flex items-center gap-2">
                    <Plus className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span className="truncate">{c.name}</span>
                    <span className="ml-auto text-xs text-gray-400 shrink-0">{c.state}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {error && <p className="text-sm text-rose-600">Couldn&apos;t load cut-off data. Please refresh.</p>}
      {!rows && !error && <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>}

      {rows && picked.length > 0 && (
        <>
          <div className="flex flex-wrap gap-2">
            <select value={activeCourse} onChange={(ev) => setCourse(ev.target.value)} className={select}>
              {courses.map((c) => { const [d, n] = c.split("|"); return <option key={c} value={c}>{exam === "pg" ? `${n} (${d})` : n}</option>; })}
            </select>
            <select value={activeQuota} onChange={(ev) => setQuota(ev.target.value)} className={select}>
              {quotas.map((x) => <option key={x} value={x}>{QUOTA_LABEL[x] ?? x}</option>)}
            </select>
            <select value={category} onChange={(ev) => setCategory(ev.target.value)} className={select}>
              {Object.keys(CATEGORY_LABEL).map((c) => <option key={c} value={c}>{CATEGORY_LABEL[c]}</option>)}
            </select>
          </div>
          <div className="overflow-x-auto bg-white border border-gray-100 rounded-2xl shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                <tr>
                  <th className="text-left px-4 py-3">Year · Round</th>
                  {picked.map((id) => <th key={id} className="text-right px-4 py-3 normal-case text-gray-700 font-bold">{byId.get(id)?.name}</th>)}
                </tr>
              </thead>
              <tbody>
                {table.lines.map(({ year, round }) => (
                  <tr key={`${year}|${round}`} className="border-t border-gray-100">
                    <td className="px-4 py-2.5 font-semibold text-gray-900 whitespace-nowrap">{year} · {ROUND_LABEL[round]}</td>
                    {picked.map((id) => {
                      const v = table.cells.get(`${year}|${round}|${id}`);
                      return <td key={id} className="px-4 py-2.5 text-right font-black text-blue-800">{v ? fmtRank(v) : <span className="text-gray-300 font-normal">—</span>}</td>;
                    })}
                  </tr>
                ))}
                {!table.lines.length && (
                  <tr><td colSpan={picked.length + 1} className="px-4 py-10 text-center text-gray-500">No allotments for this course, quota and category.</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-500">Closing All India Rank per round from MCC allotment results. &quot;—&quot; means no seat was allotted in that round.</p>
        </>
      )}
    </div>
  );
}
