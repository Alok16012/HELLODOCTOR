"use client";

import { useMemo, useState } from "react";
import { ChevronDown, Search } from "lucide-react";

interface Course {
  course: string;
  ai: number | null;
  state: number | null;
  mgmt: number | null;
}

interface OtherFees {
  cautionMoney: [number | null, number | null];
  admissionFees: [number | null, number | null];
  otherYearlyFees: [number | null, number | null];
  anyOtherFees: [number | null, number | null];
  remarks: string | null;
}

interface HostelFees {
  cautionMoney: [number | null, number | null];
  otherHostelFee: [number | null, number | null];
  accommodation: { type: string; fee: number }[];
  remarks: string | null;
}

interface College {
  name: string;
  address: string;
  courses: Course[];
  otherFees: OtherFees;
  hostelFees: HostelFees;
}

export interface RajasthanFeesData {
  source: string;
  capturedAt: string;
  note: string;
  colleges: College[];
}
type Data = RajasthanFeesData;

const fmt = (v: number | null) => (v === null ? "–" : `₹${v.toLocaleString("en-IN")}`);
const inputClass = "w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

function CollegeCard({ college, courseFilter }: { college: College; courseFilter: string }) {
  const [open, setOpen] = useState(false);
  const needle = courseFilter.trim().toLowerCase();
  const rows = college.courses.filter((c) => !needle || c.course.toLowerCase().includes(needle));
  const hasAnyFee = rows.some((r) => r.ai !== null || r.state !== null || r.mgmt !== null);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <button onClick={() => setOpen((o) => !o)} className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left hover:bg-blue-50/40">
        <div>
          <h3 className="font-bold text-slate-900">{college.name}</h3>
          <p className="text-xs text-slate-500 mt-0.5">{college.address}</p>
        </div>
        <ChevronDown className={`w-5 h-5 text-slate-400 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="border-t border-slate-100">
          {!hasAnyFee ? (
            <p className="px-5 py-6 text-sm text-slate-500">No courses match this branch filter for this college.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm min-w-[560px]">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                  <tr>
                    <th scope="col" className="px-5 py-3 font-semibold">Course</th>
                    <th scope="col" className="px-4 py-3 font-semibold whitespace-nowrap">All India Nature (yearly)</th>
                    <th scope="col" className="px-4 py-3 font-semibold whitespace-nowrap">State Nature (yearly)</th>
                    <th scope="col" className="px-4 py-3 font-semibold whitespace-nowrap">Management (yearly)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {rows.map((c) => (
                    <tr key={c.course} className="hover:bg-blue-50/30">
                      <th scope="row" className="px-5 py-3 font-semibold text-slate-900">{c.course}</th>
                      <td className="px-4 py-3 tabular-nums text-slate-700">{fmt(c.ai)}</td>
                      <td className="px-4 py-3 tabular-nums text-slate-700">{fmt(c.state)}</td>
                      <td className="px-4 py-3 tabular-nums text-slate-700">{fmt(c.mgmt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-4 p-5 border-t border-slate-100 bg-slate-50/60">
            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Other academic fees (one-time / yearly)</h4>
              <dl className="space-y-1.5 text-sm">
                <div className="flex justify-between"><dt className="text-slate-500">Caution money (refundable)</dt><dd className="font-semibold text-slate-800">{fmt(college.otherFees.cautionMoney[0])} <span className="text-slate-400 font-normal">/ Mgmt {fmt(college.otherFees.cautionMoney[1])}</span></dd></div>
                <div className="flex justify-between"><dt className="text-slate-500">Admission fee (one-time)</dt><dd className="font-semibold text-slate-800">{fmt(college.otherFees.admissionFees[0])} <span className="text-slate-400 font-normal">/ Mgmt {fmt(college.otherFees.admissionFees[1])}</span></dd></div>
                <div className="flex justify-between"><dt className="text-slate-500">Other fees (yearly)</dt><dd className="font-semibold text-slate-800">{fmt(college.otherFees.otherYearlyFees[0])} <span className="text-slate-400 font-normal">/ Mgmt {fmt(college.otherFees.otherYearlyFees[1])}</span></dd></div>
                {(college.otherFees.anyOtherFees[0] !== null || college.otherFees.anyOtherFees[1] !== null) && (
                  <div className="flex justify-between"><dt className="text-slate-500">Any other fees</dt><dd className="font-semibold text-slate-800">{fmt(college.otherFees.anyOtherFees[0])} <span className="text-slate-400 font-normal">/ Mgmt {fmt(college.otherFees.anyOtherFees[1])}</span></dd></div>
                )}
              </dl>
              {college.otherFees.remarks && <p className="text-xs text-slate-500 mt-3 leading-5">{college.otherFees.remarks}</p>}
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Hostel fees</h4>
              <dl className="space-y-1.5 text-sm">
                {(college.hostelFees.cautionMoney[0] !== null || college.hostelFees.cautionMoney[1] !== null) && (
                  <div className="flex justify-between"><dt className="text-slate-500">Caution money</dt><dd className="font-semibold text-slate-800">{fmt(college.hostelFees.cautionMoney[0])} <span className="text-slate-400 font-normal">/ Mgmt {fmt(college.hostelFees.cautionMoney[1])}</span></dd></div>
                )}
                {college.hostelFees.accommodation.map((a) => (
                  <div key={a.type} className="flex justify-between"><dt className="text-slate-500">{a.type} (yearly)</dt><dd className="font-semibold text-slate-800">{fmt(a.fee)}</dd></div>
                ))}
              </dl>
              {college.hostelFees.remarks && <p className="text-xs text-slate-500 mt-3 leading-5">{college.hostelFees.remarks}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function RajasthanFeesExplorer({ data }: { data: Data }) {
  const [query, setQuery] = useState("");
  const [courseFilter, setCourseFilter] = useState("");

  const courses = useMemo(() => [...new Set(data.colleges.flatMap((c) => c.courses.map((x) => x.course)))].sort(), [data]);
  const needle = query.trim().toLowerCase();
  const colleges = data.colleges.filter((c) => !needle || c.name.toLowerCase().includes(needle));

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">{data.colleges.length} Rajasthan colleges</h2>
          <p className="text-sm text-slate-500 mt-1">{data.note}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm grid sm:grid-cols-2 gap-4">
        <label className="block text-sm font-medium text-slate-500">Search college
          <div className="relative mt-2"><Search size={18} className="absolute left-3 top-3.5 text-slate-400" /><input className={`${inputClass} pl-10`} placeholder="Search college…" value={query} onChange={(e) => setQuery(e.target.value)} /></div>
        </label>
        <label className="block text-sm font-medium text-slate-500">Branch
          <select className={`${inputClass} mt-2`} value={courseFilter} onChange={(e) => setCourseFilter(e.target.value)}>
            <option value="">All branches</option>
            {courses.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>
      </div>

      <div className="space-y-3">
        {colleges.map((c) => <CollegeCard key={c.name} college={c} courseFilter={courseFilter} />)}
        {!colleges.length && <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500">No colleges match this search.</div>}
      </div>

      <p className="text-xs text-slate-500 leading-5">Source: {data.source} · Captured {data.capturedAt}. Fees shown are as submitted by colleges for the 2026 admission cycle and may be subject to final approval by the Fee Regulatory Committee. Confirm the latest figures with the institution before admission.</p>
    </div>
  );
}
