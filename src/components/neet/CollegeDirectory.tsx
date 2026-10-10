"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, Building2, ChevronRight } from "lucide-react";
import { TYPE_LABEL, fmtRank, type Exam, type ExamSlug, type PgCollege, type UgCollege } from "@/lib/neet/meta";

export interface DirectoryEntry {
  college: UgCollege | PgCollege;
  /** Latest-year closing rank shown on the card (UG: UR MBBS/BDS, PG: best UR branch). */
  headline: { label: string; rank: number } | null;
}

const PAGE = 30;

export default function CollegeDirectory({ exam, slug, entries }: { exam: Exam; slug: ExamSlug; entries: DirectoryEntry[] }) {
  const [q, setQ] = useState("");
  const [state, setState] = useState("");
  const [type, setType] = useState("");
  const [course, setCourse] = useState("");
  const [limit, setLimit] = useState(PAGE);

  const states = useMemo(() => [...new Set(entries.map((e) => e.college.state).filter(Boolean) as string[])].sort(), [entries]);
  const types = useMemo(
    () => (exam === "ug" ? [...new Set(entries.map((e) => (e.college as UgCollege).type))].sort() : ["MD/MS colleges", "DNB hospitals"]),
    [entries, exam],
  );

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return entries.filter(({ college: c }) => {
      if (needle && !c.name.toLowerCase().includes(needle)) return false;
      if (state && c.state !== state) return false;
      if (exam === "ug") {
        const u = c as UgCollege;
        if (type && u.type !== type) return false;
        if (course && !u.courses.includes(course)) return false;
      } else if (type) {
        const isDnb = (c as PgCollege).dnb;
        if ((type === "DNB hospitals") !== isDnb) return false;
      }
      return true;
    });
  }, [entries, q, state, type, course, exam]);

  const select = "border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm font-semibold text-gray-700 bg-white focus:border-blue-500 outline-none";

  return (
    <div>
      <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <label className="relative sm:col-span-2 lg:col-span-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={q}
            onChange={(e) => { setQ(e.target.value); setLimit(PAGE); }}
            placeholder="Search college name"
            className="w-full border-2 border-gray-200 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:border-blue-500 outline-none"
          />
        </label>
        <select value={state} onChange={(e) => { setState(e.target.value); setLimit(PAGE); }} className={select}>
          <option value="">All states</option>
          {states.map((s) => <option key={s}>{s}</option>)}
        </select>
        <select value={type} onChange={(e) => { setType(e.target.value); setLimit(PAGE); }} className={select}>
          <option value="">All types</option>
          {types.map((t) => <option key={t} value={t}>{TYPE_LABEL[t] ?? t}</option>)}
        </select>
        {exam === "ug" ? (
          <select value={course} onChange={(e) => { setCourse(e.target.value); setLimit(PAGE); }} className={select}>
            <option value="">MBBS & BDS</option>
            <option value="MBBS">MBBS</option>
            <option value="BDS">BDS</option>
          </select>
        ) : <div className="hidden lg:block" />}
      </div>

      <p className="text-sm text-gray-500 mb-3">{fmtRank(list.length)} {list.length === 1 ? "college" : "colleges"}</p>

      <div className="grid md:grid-cols-2 gap-3">
        {list.slice(0, limit).map(({ college: c, headline }) => (
          <Link
            key={c.id}
            href={`/${slug}/colleges/${c.slug}`}
            className="group bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-blue-200 transition-all flex items-center gap-3"
          >
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-bold text-gray-900 text-sm leading-snug group-hover:text-blue-700">{c.name}</p>
              <p className="text-xs text-gray-500 mt-0.5">
                {c.state ?? "—"} ·{" "}
                {exam === "ug"
                  ? `${TYPE_LABEL[(c as UgCollege).type] ?? (c as UgCollege).type} · ${(c as UgCollege).courses.join(", ")}`
                  : `${(c as PgCollege).dnb ? "DNB hospital" : "Medical college"} · ${(c as PgCollege).branches} branches`}
                {exam === "ug" && Object.keys((c as UgCollege).seats).length > 0 &&
                  ` · ${Object.entries((c as UgCollege).seats).map(([k, v]) => `${v} ${k}`).join(", ")} MCC seats`}
              </p>
            </div>
            {headline && (
              <div className="text-right shrink-0">
                <p className="text-[10px] uppercase text-gray-400 font-semibold">{headline.label}</p>
                <p className="text-sm font-black text-blue-800">{fmtRank(headline.rank)}</p>
              </div>
            )}
            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-600 shrink-0" />
          </Link>
        ))}
      </div>

      {list.length > limit && (
        <button
          onClick={() => setLimit(limit + PAGE * 2)}
          className="mt-5 w-full bg-white border border-blue-200 text-blue-700 font-semibold rounded-xl py-3 hover:bg-blue-50"
        >
          Show more ({fmtRank(list.length - limit)} left)
        </button>
      )}
    </div>
  );
}
