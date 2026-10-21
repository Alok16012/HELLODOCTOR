"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ClipboardList, Flame, Search, ShieldCheck, Sparkles, Target } from "lucide-react";
import MultiSelect from "@/components/neet/MultiSelect";
import { expandYear, formatFee, type Institution, type InstitutionIndex, type InstitutionYear } from "@/lib/neet/institutions";
import { CHANCES, type Chance } from "@/lib/neet/meta";
import { DEFAULT_ROUNDS, predictPg, selectionOptions, type PgMatch, type PgSelection } from "@/lib/neet/pgPredict";

const BASE = "/data/neet/institutions";
const fmt = (n: number) => n.toLocaleString("en-IN");

export interface PgData {
  latestYear: number;
  latest: Institution[];
  previous: Institution[];
  rounds: string[];
}

/** Latest two years of NEET PG institution cutoffs. */
export function usePgData(enabled: boolean) {
  const [data, setData] = useState<PgData | null>(null);
  useEffect(() => {
    if (!enabled || data) return;
    let active = true;
    (async () => {
      const index: InstitutionIndex = await fetch(`${BASE}/pg.json`).then(r => r.json());
      const [latest, previous] = index.years.slice(0, 2);
      const load = (y?: { year: number }) => y ? fetch(`${BASE}/pg-${y.year}.json`).then(r => r.json() as Promise<InstitutionYear>).then(d => expandYear(d, index)) : Promise.resolve([]);
      const [a, b] = await Promise.all([load(latest), load(previous)]);
      if (active) setData({ latestYear: latest.year, latest: a, previous: b, rounds: latest.rounds });
    })().catch(err => console.error("PG data failed to load", err));
    return () => { active = false; };
  }, [enabled, data]);
  return data;
}

const selectClass = "w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm font-semibold text-gray-800 focus:border-blue-500 outline-none bg-white disabled:bg-gray-50 disabled:text-gray-400";
const label = "block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2";

/** Counselling → state(s) → quota → category, each list narrowed by the previous choice. */
export function PgSelectionFields({ data, value, onChange }: { data: PgData | null; value: PgSelection; onChange: (next: PgSelection) => void }) {
  const opts = useMemo(() => selectionOptions(data?.latest ?? [], value), [data, value]);
  const set = (patch: Partial<PgSelection>) => onChange({ ...value, ...patch });
  return (
    <div className="space-y-4 mb-6">
      <div>
        <label className={label}>Counselling Type</label>
        <div className="grid grid-cols-2 gap-2">
          {(["AIQ", "STATE"] as const).map(c => (
            <button key={c} type="button" onClick={() => onChange({ counselling: c, states: [], quota: "", category: "", tags: [] })}
              className={`py-2.5 rounded-lg text-sm font-bold border transition-colors ${value.counselling === c ? "bg-blue-600 border-blue-600 text-white" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
              {c === "AIQ" ? "All India (AIQ)" : "State"}
            </button>
          ))}
        </div>
      </div>
      {value.counselling === "STATE" && (
        <MultiSelect label="States" placeholder="Select state(s)" values={opts.states} selected={value.states} onChange={states => set({ states, quota: "", category: "" })} />
      )}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={label}>Quota</label>
          <select className={selectClass} value={value.quota} disabled={!data || !value.counselling || (value.counselling === "STATE" && !value.states.length)} onChange={e => set({ quota: e.target.value, category: "" })}>
            <option value="">{data ? "Select quota" : "Loading…"}</option>
            {opts.quotas.map(q => <option key={q} value={q}>{q}</option>)}
          </select>
        </div>
        <div>
          <label className={label}>Category</label>
          <select className={selectClass} value={value.category} disabled={!value.quota} onChange={e => set({ category: e.target.value })}>
            <option value="">{value.quota ? "Select category" : "Select quota first"}</option>
            {opts.categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>
      {opts.tags.length > 0 && value.quota && (
        <MultiSelect label="Reservation (optional)" placeholder="None / Standard" values={opts.tags} selected={value.tags} onChange={tags => set({ tags })} />
      )}
    </div>
  );
}

const chanceStyle: Record<Chance, { pill: string; tab: string; icon: typeof ShieldCheck; hint: string }> = {
  Safe: { pill: "bg-green-100 text-green-700 border-green-200", tab: "bg-green-600 border-green-600", icon: ShieldCheck, hint: "Well inside last year's cutoff" },
  Moderate: { pill: "bg-blue-100 text-blue-700 border-blue-200", tab: "bg-blue-600 border-blue-600", icon: Target, hint: "Close to last year's cutoff" },
  Risky: { pill: "bg-amber-100 text-amber-700 border-amber-200", tab: "bg-amber-500 border-amber-500", icon: Flame, hint: "Possible in later rounds" },
  Dream: { pill: "bg-rose-100 text-rose-700 border-rose-200", tab: "bg-rose-600 border-rose-600", icon: Sparkles, hint: "Needs cutoffs to move a lot" },
};

const BUDGETS: { label: string; max: number }[] = [
  { label: "Any budget", max: Infinity },
  { label: "Govt / under ₹1 L", max: 100000 },
  { label: "Under ₹5 L", max: 500000 },
  { label: "Under ₹10 L", max: 1000000 },
  { label: "Under ₹25 L", max: 2500000 },
  { label: "Under ₹50 L", max: 5000000 },
  { label: "Under ₹1 Cr", max: 10000000 },
];
type Sort = { key: "fee" | "expected" | "college" | `round:${string}`; desc: boolean };
const feeValue = (m: PgMatch) => (typeof m.row.fee === "number" ? m.row.fee : Infinity);

export function PgResults({ data, rank, selection }: { data: PgData; rank: number; selection: PgSelection }) {
  const [rounds, setRounds] = useState<string[]>(DEFAULT_ROUNDS.filter(r => data.rounds.includes(r)));
  const [tab, setTab] = useState<Chance | "all">("all");
  const [branches, setBranches] = useState<string[]>([]);
  const [budget, setBudget] = useState(0);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<Sort>({ key: "fee", desc: false });
  const [limit, setLimit] = useState(25);

  const matches = useMemo(() => predictPg(data.latest, data.previous, rank, selection, rounds.length ? rounds : data.rounds), [data, rank, selection, rounds]);
  const courses = useMemo(() => [...new Set(matches.map(m => m.row.course))].sort(), [matches]);
  const needle = query.trim().toLowerCase();
  const filtered = matches.filter(m =>
    (!branches.length || branches.includes(m.row.course)) && feeValue(m) <= BUDGETS[budget].max && (!needle || m.row.college.toLowerCase().includes(needle)));
  const counts = Object.fromEntries(CHANCES.map(c => [c, filtered.filter(m => m.chance === c).length])) as Record<Chance, number>;
  const value = (m: PgMatch): number | string | null =>
    sort.key === "fee" ? feeValue(m) : sort.key === "expected" ? m.expected : sort.key === "college" ? m.row.college : m.row.ranks[sort.key.slice(6)] ?? null;
  const shown = (tab === "all" ? filtered : filtered.filter(m => m.chance === tab)).sort((a, b) => {
    const l = value(a), r = value(b);
    if (l == null || r == null) return l == r ? 0 : l == null ? 1 : -1;
    const c = typeof l === "number" && typeof r === "number" ? l - r : String(l).localeCompare(String(r));
    return (sort.desc ? -c : c) || CHANCES.indexOf(a.chance) - CHANCES.indexOf(b.chance) || a.expected - b.expected;
  });
  const shownRounds = rounds.length ? data.rounds.filter(r => rounds.includes(r)) : data.rounds;
  const sortBy = (key: Sort["key"]) => setSort(s => ({ key, desc: s.key === key ? !s.desc : false }));
  const head = (text: string, key: Sort["key"]) => (
    <th key={key} scope="col" className="px-3 py-3 whitespace-nowrap">
      <button onClick={() => sortBy(key)} className="flex items-center gap-1 font-semibold">{text}{sort.key === key && (sort.desc ? <ArrowDown size={12} /> : <ArrowUp size={12} />)}</button>
    </th>
  );

  return (
    <div className="mb-6">
      <div className="flex flex-wrap items-end justify-between gap-3 mb-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900">Your Predicted Colleges</h2>
          <p className="text-sm text-gray-500">{fmt(filtered.length)} college–branch options · {selection.counselling === "AIQ" ? "All India" : selection.states.join(", ")} · {selection.quota} · {selection.category}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-4">
        <button onClick={() => { setTab("all"); setLimit(25); }} className={`rounded-xl border px-3 py-3 text-left ${tab === "all" ? "bg-gray-900 border-gray-900 text-white" : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"}`}>
          <ClipboardList className="w-4 h-4 mb-1" /><p className="text-sm font-bold">All ({fmt(filtered.length)})</p><p className={`text-[11px] ${tab === "all" ? "text-white/80" : "text-gray-500"}`}>Every match</p>
        </button>
        {CHANCES.map(c => {
          const Icon = chanceStyle[c].icon, on = tab === c;
          return <button key={c} onClick={() => { setTab(c); setLimit(25); }} className={`rounded-xl border px-3 py-3 text-left ${on ? `${chanceStyle[c].tab} text-white` : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"}`}>
            <Icon className="w-4 h-4 mb-1" /><p className="text-sm font-bold">{c} ({fmt(counts[c])})</p><p className={`text-[11px] ${on ? "text-white/80" : "text-gray-500"}`}>{chanceStyle[c].hint}</p>
          </button>;
        })}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <label className="block text-sm font-medium text-slate-500">Search
          <div className="relative mt-2"><Search size={18} className="absolute left-3 top-3.5 text-slate-400" /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search college…" className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 py-3 text-sm text-slate-700 outline-none focus:border-blue-500" /></div>
        </label>
        <MultiSelect label="Target branches" placeholder="All branches" values={courses} selected={branches} onChange={setBranches} />
        <label className="block text-sm font-medium text-slate-500">Max annual fee
          <select value={budget} onChange={e => setBudget(Number(e.target.value))} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700 outline-none focus:border-blue-500">
            {BUDGETS.map((b, i) => <option key={b.label} value={i}>{b.label}</option>)}
          </select>
        </label>
        <MultiSelect label="Rounds" placeholder="All rounds" values={data.rounds} selected={rounds} onChange={setRounds} />
      </div>

      {shown.length ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto"><table className="w-full text-left text-sm min-w-[1000px]">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200"><tr>
              {head("College", "college")}
              <th scope="col" className="px-3 py-3 font-semibold">Course</th>
              <th scope="col" className="px-3 py-3 font-semibold">Quota (Category)</th>
              {head("Fee", "fee")}
              {shownRounds.map(r => head(`${data.latestYear} ${r}`, `round:${r}`))}
              {head("Expected cutoff", "expected")}
              <th scope="col" className="px-3 py-3 font-semibold whitespace-nowrap">{data.latestYear - 1}</th>
              <th scope="col" className="px-3 py-3 font-semibold">Chance</th>
            </tr></thead>
            <tbody className="divide-y divide-slate-100">{shown.slice(0, limit).map(m => (
              <tr key={m.row.key} className="hover:bg-blue-50/40">
                <th scope="row" className="px-3 py-3 font-semibold text-slate-900 min-w-[260px]">{m.row.college}<span className="block text-xs font-normal text-slate-500">{m.row.state}</span></th>
                <td className="px-3 py-3 text-slate-700 min-w-[160px]">{m.row.course}</td>
                <td className="px-3 py-3 text-slate-600 min-w-[160px]">{m.row.quota} <span className="text-slate-400">({m.row.category})</span>{m.row.tags.length > 0 && <span className="block text-[10px] font-semibold text-amber-700">{m.row.tags.join(", ")}</span>}</td>
                <td className="px-3 py-3 text-slate-700 whitespace-nowrap">{formatFee(m.row.fee)}</td>
                {shownRounds.map(r => { const v = m.row.ranks[r]; return <td key={r} className="px-3 py-3 tabular-nums text-slate-700">{typeof v === "number" ? fmt(v) : <span className="text-slate-300">–</span>}</td>; })}
                <td className="px-3 py-3 tabular-nums font-bold text-slate-900">{fmt(m.expected)}</td>
                <td className="px-3 py-3 tabular-nums text-slate-500">{m.previous ? fmt(m.previous) : "–"}</td>
                <td className="px-3 py-3"><span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${chanceStyle[m.chance].pill}`}>{m.chance}</span></td>
              </tr>
            ))}</tbody>
          </table></div>
          {shown.length > limit && <button onClick={() => setLimit(l => l + 50)} className="w-full border-t border-slate-100 py-3 text-sm font-semibold text-blue-700 hover:bg-blue-50">Show more ({fmt(shown.length - limit)} left)</button>}
        </div>
      ) : (
        <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-5">
          <h3 className="font-bold text-gray-900 mb-1">{tab === "all" ? "No colleges matched at this rank" : `No ${tab} colleges at this rank`}</h3>
          <p className="text-sm text-gray-600">Try another quota, more rounds or a higher budget — or talk to our counsellors for state, private and management-quota options.</p>
        </div>
      )}
    </div>
  );
}
