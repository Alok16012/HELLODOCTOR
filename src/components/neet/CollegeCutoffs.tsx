"use client";
import { useMemo, useState } from "react";
import { CATEGORY_LABEL, QUOTA_LABEL, ROUND_LABEL, fmtRank, type Cutoff, type Exam } from "@/lib/neet/meta";

/** Round-wise opening/closing ranks for one college. */
export default function CollegeCutoffs({ exam, rows }: { exam: Exam; rows: Cutoff[] }) {
  const years = useMemo(() => [...new Set(rows.map((r) => r.year))].sort((a, b) => b - a), [rows]);
  const [year, setYear] = useState(years[0]);
  const quotas = useMemo(() => [...new Set(rows.filter((r) => r.year === year).map((r) => r.quota))], [rows, year]);
  const [quota, setQuota] = useState(quotas.includes("AI") ? "AI" : quotas[0]);
  const q = quotas.includes(quota) ? quota : quotas[0];
  const [category, setCategory] = useState("all");

  const view = rows.filter((r) => r.year === year && r.quota === q && (category === "all" || r.category === category));
  const rounds = [...new Set(view.map((r) => r.round))].sort();
  const groups = (() => {
    const m = new Map<string, { course: string; degree: string; category: string; byRound: Map<number, Cutoff> }>();
    for (const r of view) {
      const k = `${r.degree}|${r.course}|${r.category}`;
      if (!m.has(k)) m.set(k, { course: r.course, degree: r.degree, category: r.category, byRound: new Map() });
      m.get(k)!.byRound.set(r.round, r);
    }
    const catOrder = ["GN", "EWS", "OBC", "SC", "ST"];
    return [...m.values()].sort((a, b) =>
      a.course.localeCompare(b.course) || a.degree.localeCompare(b.degree) ||
      Number(a.category.endsWith("PwD")) - Number(b.category.endsWith("PwD")) ||
      catOrder.indexOf(a.category.replace("-PwD", "")) - catOrder.indexOf(b.category.replace("-PwD", "")));
  })();
  const cats = [...new Set(rows.filter((r) => r.year === year && r.quota === q).map((r) => r.category))];

  if (!rows.length) return <p className="text-sm text-gray-500">No MCC allotments recorded for this college yet.</p>;

  const chip = (active: boolean) =>
    `px-3 py-1.5 rounded-full text-xs font-bold border ${active ? "bg-blue-600 border-blue-600 text-white" : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"}`;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 mb-3">
        {years.map((y) => <button key={y} onClick={() => setYear(y)} className={chip(y === year)}>{y}</button>)}
        <select value={q} onChange={(e) => setQuota(e.target.value)} className="ml-auto border-2 border-gray-200 rounded-lg px-2 py-1.5 text-xs font-semibold bg-white">
          {quotas.map((x) => <option key={x} value={x}>{QUOTA_LABEL[x] ?? x}</option>)}
        </select>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="border-2 border-gray-200 rounded-lg px-2 py-1.5 text-xs font-semibold bg-white">
          <option value="all">All categories</option>
          {cats.map((c) => <option key={c} value={c}>{CATEGORY_LABEL[c] ?? c}</option>)}
        </select>
      </div>
      <div className="overflow-x-auto bg-white border border-gray-100 rounded-2xl shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              <th className="text-left px-4 py-3">{exam === "ug" ? "Course" : "Branch"}</th>
              <th className="text-left px-3 py-3">Category</th>
              {rounds.map((r) => <th key={r} className="text-right px-3 py-3 whitespace-nowrap">{ROUND_LABEL[r]}</th>)}
            </tr>
          </thead>
          <tbody>
            {groups.map((g) => (
              <tr key={`${g.degree}|${g.course}|${g.category}`} className="border-t border-gray-100">
                <td className="px-4 py-2.5 font-semibold text-gray-900">
                  {g.course}{exam === "pg" && <span className="ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700">{g.degree}</span>}
                </td>
                <td className="px-3 py-2.5 text-gray-600 whitespace-nowrap">{CATEGORY_LABEL[g.category] ?? g.category}</td>
                {rounds.map((r) => {
                  const c = g.byRound.get(r);
                  return (
                    <td key={r} className="px-3 py-2.5 text-right whitespace-nowrap">
                      {c ? (
                        <>
                          <span className="font-bold text-gray-900">{fmtRank(c.closing)}</span>
                          <span className="block text-[10px] text-gray-400">from {fmtRank(c.opening)} · {c.seats} seat{c.seats > 1 ? "s" : ""}</span>
                        </>
                      ) : <span className="text-gray-300">—</span>}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-gray-500 mt-2">
        Bold = closing rank (last All India Rank allotted in that round); &quot;from&quot; = opening rank; seats = allotments listed in that round&apos;s result. Source: MCC allotment results {year}.
      </p>
    </div>
  );
}
