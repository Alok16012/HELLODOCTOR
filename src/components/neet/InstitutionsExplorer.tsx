"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Loader2, Search, X } from "lucide-react";
import MultiSelect from "@/components/neet/MultiSelect";
import { closingRank, expandYear, formatFee, type Institution, type InstitutionIndex, type InstitutionYear } from "@/lib/neet/institutions";

const BASE = "/data/neet/institutions";
const number = (value: number) => value.toLocaleString("en-IN");
const inputClass = "w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

type Field = "state" | "quota" | "category" | "course" | "tags";
type Filters = Record<Field, string[]>;
type SortKey = "college" | "state" | "course" | "category" | "quota" | "fee" | `round:${string}`;
const EMPTY: Filters = { state: [], quota: [], category: [], course: [], tags: [] };

export default function InstitutionsExplorer() {
  const [index, setIndex] = useState<InstitutionIndex | null>(null);
  const [loaded, setLoaded] = useState<Record<number, Institution[]>>({});
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [years, setYears] = useState<number[]>([]);
  const [query, setQuery] = useState("");
  const [counselling, setCounselling] = useState("");
  const [filters, setFilters] = useState<Filters>(EMPTY);
  const [rounds, setRounds] = useState<string[]>([]);
  const [rankInput, setRankInput] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [sort, setSort] = useState<{ key: SortKey; desc: boolean }>({ key: "college", desc: false });

  useEffect(() => {
    let active = true;
    fetch(`${BASE}/pg.json`)
      .then(r => { if (!r.ok) throw new Error(); return r.json() as Promise<InstitutionIndex>; })
      .then(result => { if (active) { setIndex(result); setError(false); setYears(y => y.length ? y : [result.years[0].year]); } })
      .catch(() => { if (active) setError(true); });
    return () => { active = false; };
  }, [attempt]);

  useEffect(() => {
    if (!index) return;
    const missing = years.filter(y => !loaded[y]);
    if (!missing.length) return;
    let active = true;
    Promise.all(missing.map(y => fetch(`${BASE}/pg-${y}.json`).then(r => { if (!r.ok) throw new Error(); return r.json() as Promise<InstitutionYear>; })))
      .then(results => { if (active) setLoaded(current => ({ ...current, ...Object.fromEntries(results.map(data => [data.year, expandYear(data, index)])) })); })
      .catch(() => { if (active) setError(true); });
    return () => { active = false; };
  }, [index, years, loaded]);

  const ready = years.length > 0 && years.every(y => loaded[y]);
  const rows = useMemo(() => (ready ? years.flatMap(y => loaded[y]) : []), [ready, years, loaded]);
  const availableRounds = useMemo(() => {
    const all = new Set(index?.years.filter(y => years.includes(y.year)).flatMap(y => y.rounds));
    return [...all].sort((a, b) => Number(a.slice(1)) - Number(b.slice(1)));
  }, [index, years]);
  const shownRounds = rounds.length ? availableRounds.filter(r => rounds.includes(r)) : availableRounds;

  const rank = rankInput ? Number(rankInput) : null;
  const validRank = rank === null || (Number.isSafeInteger(rank) && rank > 0);
  const needle = query.trim().toLowerCase();

  // Each filter's options come from rows matching every *other* filter, so choices never lead to empty results.
  const matches = (row: Institution, skip?: Field) => {
    if (counselling && row.counselling !== counselling) return false;
    if (needle && !row.college.toLowerCase().includes(needle)) return false;
    for (const field of ["state", "quota", "category", "course"] as const) {
      if (field !== skip && filters[field].length && !filters[field].includes(row[field])) return false;
    }
    if (skip !== "tags" && filters.tags.length && !filters.tags.some(t => row.tags.includes(t))) return false;
    return true;
  };

  const options = useMemo(() => {
    const collect = (field: Field) => {
      const set = new Set<string>();
      for (const row of rows) {
        if (!matches(row, field)) continue;
        if (field === "tags") row.tags.forEach(t => set.add(t));
        else set.add(row[field]);
      }
      for (const v of filters[field]) set.add(v);
      return [...set].sort((a, b) => a.localeCompare(b));
    };
    return { state: collect("state"), quota: collect("quota"), category: collect("category"), course: collect("course"), tags: collect("tags") };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, filters, counselling, needle]);

  const filtered = useMemo(() => {
    const value = (row: Institution, key: SortKey): string | number | null =>
      key.startsWith("round:") ? row.ranks[key.slice(6)] ?? null : key === "fee" ? (typeof row.fee === "number" ? row.fee : null) : row[key as Exclude<SortKey, "fee" | `round:${string}`>];
    return rows.filter(row => {
      if (!matches(row)) return false;
      const closing = closingRank(row, rounds);
      if (rounds.length && closing === null) return false;
      return rank === null || (validRank && closing !== null && rank <= closing);
    }).sort((a, b) => {
      const left = value(a, sort.key), right = value(b, sort.key);
      // Missing values stay last in either direction.
      if (left == null || right == null) return left == right ? 0 : left == null ? 1 : -1;
      const compared = typeof left === "number" && typeof right === "number" ? left - right : String(left).localeCompare(String(right));
      return (sort.desc ? -compared : compared) || a.college.localeCompare(b.college) || b.year - a.year;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, filters, counselling, needle, rounds, rank, validRank, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const visible = filtered.slice(start, start + pageSize);
  const multiYear = years.length > 1;

  const setFilter = (field: Field) => (next: string[]) => { setFilters(f => ({ ...f, [field]: next })); setPage(1); };
  const sortBy = (key: SortKey) => { setSort(current => ({ key, desc: current.key === key ? !current.desc : false })); setPage(1); };
  const sortIcon = (key: SortKey) => sort.key === key ? (sort.desc ? <ArrowDown size={13} /> : <ArrowUp size={13} />) : null;
  const reset = () => { setQuery(""); setCounselling(""); setFilters(EMPTY); setRounds([]); setRankInput(""); setPage(1); };
  const active = [
    ...(counselling ? [{ label: counselling === "STATE" ? "State counselling" : "All India (AIQ)", clear: () => setCounselling("") }] : []),
    ...(Object.keys(filters) as Field[]).flatMap(field => filters[field].map(v => ({ label: v, clear: () => setFilter(field)(filters[field].filter(x => x !== v)) }))),
  ];

  if (error) return <div role="alert" className="rounded-2xl bg-white border p-8 text-center"><p>Institution data could not be loaded.</p><button className="mt-4 text-blue-700 font-semibold" onClick={() => { setError(false); setAttempt(v => v + 1); }}>Try again</button></div>;
  if (!index) return <div role="status" className="flex items-center justify-center gap-3 py-20 text-slate-500"><Loader2 className="animate-spin" size={20} />Loading institutions…</div>;

  const header = (label: string, key: SortKey, className = "") => (
    <th key={key} scope="col" aria-sort={sort.key === key ? (sort.desc ? "descending" : "ascending") : "none"} className={`px-4 py-4 whitespace-nowrap ${className}`}>
      <button onClick={() => sortBy(key)} className="flex items-center gap-2 font-semibold">{label} {sortIcon(key)}</button>
    </th>
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div><h2 className="text-xl font-bold text-slate-900">Institutions</h2><p className="text-sm text-slate-500 mt-1">Browse all medical institutions with detailed cutoff data.</p></div>
        <Link href="/neet-pg/cutoffs" className="text-sm font-semibold text-blue-700 hover:underline">Explore official MCC cutoffs →</Link>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <label className="block text-sm font-medium text-slate-500">Search
            <div className="relative mt-2"><Search size={18} className="absolute left-3 top-3.5 text-slate-400" /><input className={`${inputClass} pl-10`} placeholder="Search college…" value={query} onChange={e => { setQuery(e.target.value); setPage(1); }} /></div>
          </label>
          <label className="block text-sm font-medium text-slate-500">Counselling
            <select className={`${inputClass} mt-2`} value={counselling} onChange={e => { setCounselling(e.target.value); setPage(1); }}>
              <option value="">All</option><option value="AIQ">All India (AIQ)</option><option value="STATE">State</option>
            </select>
          </label>
          <MultiSelect label="States" placeholder="All states" values={options.state} selected={filters.state} onChange={setFilter("state")} />
          <MultiSelect label="Quotas" placeholder="All quotas" values={options.quota} selected={filters.quota} onChange={setFilter("quota")} />
          <MultiSelect label="Categories" placeholder="All categories" values={options.category} selected={filters.category} onChange={setFilter("category")} />
          <MultiSelect label="Branch" placeholder="All branches" values={options.course} selected={filters.course} onChange={setFilter("course")} />
          <MultiSelect label={`Years (${years.length} selected)`} placeholder="Select a year" values={index.years.map(y => String(y.year))} selected={years.map(String)}
            onChange={next => { if (!next.length) return; setYears(next.map(Number).sort((a, b) => b - a)); setRounds([]); setPage(1); }} />
          <MultiSelect label="Rounds" placeholder="All rounds" values={availableRounds} selected={rounds} onChange={next => { setRounds(next); setPage(1); }} />
          <MultiSelect label="Reservation categories" placeholder="All categories" values={options.tags} selected={filters.tags} onChange={setFilter("tags")} />
          <label className="block text-sm font-medium text-slate-500">Your AIR <span className="font-normal">(optional)</span>
            <input type="number" min={1} step={1} aria-invalid={!validRank} aria-describedby="institution-rank-help" className={`${inputClass} mt-2`} placeholder="e.g. 30000" value={rankInput} onChange={e => { setRankInput(e.target.value); setPage(1); }} />
          </label>
        </div>
        {active.length > 0 && <div className="mt-4 flex flex-wrap gap-2">{active.map(chip => <button key={chip.label} onClick={() => { chip.clear(); setPage(1); }} className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-800 hover:bg-blue-100">{chip.label}<X size={12} /></button>)}</div>}
        <div className="mt-4 flex items-start justify-between gap-5">
          <p id="institution-rank-help" className={`text-xs leading-5 ${validRank ? "text-slate-500" : "text-red-700"}`}>{!validRank ? "Enter a positive whole-number rank." : rank !== null ? "Showing rows where your rank is within the recorded closing rank. Category, domicile and quota eligibility still apply; this is a historical comparison, not an admission guarantee." : "Fees are shown as listed; confirm the fee period and additional charges with the institution."}</p>
          <button onClick={reset} className="shrink-0 text-xs font-semibold text-blue-700 hover:underline">Reset filters</button>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        {!ready ? <div role="status" className="flex items-center justify-center gap-3 py-20 text-slate-500"><Loader2 className="animate-spin" size={20} />Loading {years.join(", ")} data…</div> : <>
          <div className="overflow-x-auto"><table className="w-full text-left text-sm min-w-[1100px]">
            <caption className="sr-only">NEET PG institutions, fees and round-wise closing ranks for {years.join(", ")}</caption>
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200"><tr>
              {header("College Name", "college", "min-w-[300px] px-5")}
              {multiYear && <th scope="col" className="px-4 py-4 font-semibold">Year</th>}
              {header("State", "state")}{header("Course", "course")}{header("Category", "category")}{header("Quota", "quota")}{header("Fee", "fee")}
              {shownRounds.map(r => header(`Round ${r.slice(1)}`, `round:${r}`))}
            </tr></thead>
            <tbody className="divide-y divide-slate-100">{visible.map(row => <tr key={row.key} className="hover:bg-blue-50/40">
              <th scope="row" className="px-5 py-4 font-semibold text-slate-900">{row.college}{row.tags.length > 0 && <span className="ml-2 inline-flex flex-wrap gap-1 align-middle">{row.tags.map(t => <span key={t} className="rounded bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold text-amber-800">{t}</span>)}</span>}</th>
              {multiYear && <td className="px-4 py-4 text-slate-500">{row.year}</td>}
              <td className="px-4 py-4 text-slate-500 whitespace-nowrap">{row.state}</td>
              <td className="px-4 py-4 text-slate-700 min-w-[180px]">{row.course}</td>
              <td className="px-4 py-4 text-slate-600 whitespace-nowrap">{row.category}</td>
              <td className="px-4 py-4 text-slate-600 min-w-[170px]"><span className={`mr-1.5 rounded px-1.5 py-0.5 text-[10px] font-bold ${row.counselling === "AIQ" ? "bg-blue-50 text-blue-800" : "bg-emerald-50 text-emerald-800"}`}>{row.counselling}</span>{row.quota}</td>
              <td className="px-4 py-4 text-slate-700 whitespace-nowrap">{formatFee(row.fee)}</td>
              {shownRounds.map(r => { const closing = row.ranks[r]; return <td key={r} className="px-4 py-4 font-semibold text-slate-800 tabular-nums">{typeof closing === "number" ? number(closing) : <span className="text-slate-400" aria-label="Not reported">–</span>}</td>; })}
            </tr>)}</tbody>
          </table></div>
          {!visible.length && <div className="px-6 py-14 text-center"><p className="font-semibold text-slate-700">No institutions found</p><button onClick={reset} className="mt-3 text-sm text-blue-700 font-semibold">Clear filters</button></div>}
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 px-5 py-4">
            <div className="flex items-center gap-3 text-sm text-slate-500"><label className="flex items-center gap-2">Rows per page<select value={pageSize} onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }} className="rounded-lg border border-slate-200 bg-white p-2 text-slate-700">{[10, 20, 50, 100].map(v => <option key={v}>{v}</option>)}</select></label><span>{number(filtered.length ? start + 1 : 0)}–{number(Math.min(start + pageSize, filtered.length))} of {number(filtered.length)}</span></div>
            <nav aria-label="Institution table pagination" className="flex items-center gap-1">
              {[{ label: "First page", target: 1, icon: ChevronsLeft, disabled: currentPage === 1 }, { label: "Previous page", target: currentPage - 1, icon: ChevronLeft, disabled: currentPage === 1 }]
                .map(item => <button key={item.label} aria-label={item.label} disabled={item.disabled} onClick={() => setPage(item.target)} className="rounded-lg p-2 hover:bg-slate-100 disabled:opacity-30"><item.icon size={18} /></button>)}
              <span className="px-3 py-2 text-sm font-semibold text-blue-900">{currentPage} / {number(totalPages)}</span>
              {[{ label: "Next page", target: currentPage + 1, icon: ChevronRight, disabled: currentPage === totalPages }, { label: "Last page", target: totalPages, icon: ChevronsRight, disabled: currentPage === totalPages }]
                .map(item => <button key={item.label} aria-label={item.label} disabled={item.disabled} onClick={() => setPage(item.target)} className="rounded-lg p-2 hover:bg-slate-100 disabled:opacity-30"><item.icon size={18} /></button>)}
            </nav>
          </div>
        </>}
      </div>
      <p className="text-xs text-slate-500 leading-5">Data as of {index.capturedAt}. “–” means no rank was reported. Historical cutoffs may differ from future counselling outcomes.</p>
    </div>
  );
}
