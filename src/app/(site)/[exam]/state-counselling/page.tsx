import type { Metadata } from "next";
import Link from "next/link";
import { Landmark, Building2, Info } from "lucide-react";
import { EXAM, TYPE_LABEL, examFromSlug, fmtRank, type Exam, type PgCollege, type UgCollege } from "@/lib/neet/meta";
import { getDirectory } from "@/lib/neet/server";
import { STATE_AUTHORITIES } from "@/lib/neet/schedule";
import PageHeader from "@/components/neet/PageHeader";
import EnquiryButton from "@/components/neet/EnquiryButton";

type Props = { params: Promise<{ exam: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const e = EXAM[examFromSlug((await params).exam) as Exam];
  return {
    title: `${e.label} State Counselling 2026 — State Quota Authorities & Colleges | Hello Doctor`,
    description: `State-wise ${e.label} counselling: state quota rules, official counselling authorities and the colleges in each state with MCC closing ranks.`,
  };
}

export default async function StateCounsellingPage({ params }: Props) {
  const exam = examFromSlug((await params).exam) as Exam;
  const e = EXAM[exam];
  const entries = getDirectory(exam).filter((d) => d.college.state);
  const byState = new Map<string, typeof entries>();
  for (const d of entries) {
    const s = d.college.state as string;
    if (!byState.has(s)) byState.set(s, []);
    byState.get(s)!.push(d);
  }
  const states = [...byState.keys()].sort();

  return (
    <>
      <PageHeader
        slug={e.slug}
        title={`${e.label} State Counselling`}
        subtitle={exam === "ug"
          ? "85% of government MBBS/BDS seats (and all private college seats) are filled through state counselling. Find your state's authority and colleges."
          : "50% of government MD/MS seats and private college seats are filled through state counselling. Find your state's authority and colleges."}
        crumbs={[{ href: `/${e.slug}/state-counselling`, label: "State Counselling" }]}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { t: "Domicile matters", d: exam === "ug" ? "State quota seats are usually reserved for candidates domiciled in that state (rules differ — e.g. schooling years, parents' residence)." : "State quota PG seats usually require MBBS from that state or state domicile; in-service quotas also apply in many states." },
            { t: "Separate registration", d: "Each state runs its own registration, fee, merit list and choice filling — independent of MCC. You can take part in both." },
            { t: "Private colleges", d: exam === "ug" ? "Government-quota and management/NRI seats of private colleges in the state are filled through state counselling, often open to all-India candidates." : "Private college PG seats (government & management quota) are allotted by the state authority." },
          ].map((x) => (
            <div key={x.t} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <Info className="w-5 h-5 text-blue-600 mb-2" />
              <h2 className="font-bold text-gray-900 mb-1">{x.t}</h2>
              <p className="text-sm text-gray-600">{x.d}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {states.map((s) => (
            <a key={s} href={`#${s.toLowerCase().replace(/[^a-z]+/g, "-")}`} className="text-xs font-semibold px-3 py-1.5 rounded-full bg-white border border-gray-200 text-gray-700 hover:border-blue-400 hover:text-blue-700">
              {s} <span className="text-gray-400">({byState.get(s)!.length})</span>
            </a>
          ))}
        </div>

        <div className="space-y-3">
          {states.map((s) => {
            const list = byState.get(s)!.sort((a, b) => (a.headline?.rank ?? 1e9) - (b.headline?.rank ?? 1e9));
            const authority = STATE_AUTHORITIES[s]?.[exam];
            return (
              <details key={s} id={s.toLowerCase().replace(/[^a-z]+/g, "-")} className="group bg-white border border-gray-100 rounded-2xl shadow-sm scroll-mt-40">
                <summary className="cursor-pointer list-none p-5 flex flex-wrap items-center gap-3">
                  <Landmark className="w-5 h-5 text-blue-600" />
                  <span className="font-black text-gray-900">{s}</span>
                  <span className="text-xs text-gray-500">{list.length} {exam === "ug" ? "MCC colleges" : "PG institutes"}</span>
                  {authority && <span className="text-xs text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">State authority: {authority}</span>}
                  <span className="ml-auto text-blue-600 text-sm font-semibold group-open:hidden">Show colleges</span>
                  <span className="ml-auto text-blue-600 text-sm font-semibold hidden group-open:inline">Hide</span>
                </summary>
                <div className="px-5 pb-5 grid sm:grid-cols-2 gap-2">
                  {list.map(({ college: c, headline }) => (
                    <Link key={c.id} href={`/${e.slug}/colleges/${c.slug}`} className="flex items-center gap-2 border border-gray-100 rounded-xl px-3 py-2 hover:bg-blue-50">
                      <Building2 className="w-4 h-4 text-blue-600 shrink-0" />
                      <span className="text-sm text-gray-900 truncate flex-1">{c.name}</span>
                      <span className="text-[10px] text-gray-400 shrink-0">
                        {exam === "ug" ? TYPE_LABEL[(c as UgCollege).type] : (c as PgCollege).dnb ? "DNB" : "MD/MS"}
                      </span>
                      {headline && <span className="text-xs font-bold text-blue-800 shrink-0">{fmtRank(headline.rank)}</span>}
                    </Link>
                  ))}
                </div>
              </details>
            );
          })}
        </div>

        <div className="bg-blue-600 text-white rounded-2xl p-6 flex flex-col md:flex-row items-center gap-4">
          <div className="flex-1">
            <h2 className="text-xl font-black">Need state quota cut-offs for your state?</h2>
            <p className="text-blue-100 text-sm">Our counsellors share previous-year state merit and closing ranks and plan AIQ + state choices together.</p>
          </div>
          <EnquiryButton className="inline-flex items-center gap-2 bg-white text-blue-700 font-bold px-6 py-3 rounded-xl" />
        </div>
        <p className="text-xs text-gray-500">
          Closing ranks shown are MCC {e.latestYear} UR ranks (AIQ / open quotas), not state quota ranks. Authority names are for reference — always follow the official state notice for dates and eligibility.
        </p>
      </div>
    </>
  );
}
