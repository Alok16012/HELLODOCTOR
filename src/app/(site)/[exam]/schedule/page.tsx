import type { Metadata } from "next";
import { CalendarDays, ExternalLink } from "lucide-react";
import { CATEGORY_LABEL, EXAM, QUOTA_LABEL, TYPE_LABEL, examFromSlug, fmtRank, type Exam, type PgRow } from "@/lib/neet/meta";
import { SCHEDULE } from "@/lib/neet/schedule";
import seatMatrix from "@/data/neet/ug-seat-matrix.json";
import pgRows from "@/data/neet/pg-cutoffs.json";
import PageHeader from "@/components/neet/PageHeader";

type Props = { params: Promise<{ exam: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const e = EXAM[examFromSlug((await params).exam) as Exam];
  return {
    title: `${e.label} Counselling Schedule 2026 & Seat Matrix | Hello Doctor`,
    description: `Official MCC ${e.label} 2026 round-wise counselling dates and seat distribution by state, college type, quota and category.`,
  };
}

type Counts = Record<string, Record<string, number>>;
const total = (o: Record<string, number>) => Object.values(o).reduce((a, b) => a + b, 0);

function SeatTable({ title, data, label, cols }: { title: string; data: Counts; label: (k: string) => string; cols: string[] }) {
  const rows = Object.entries(data).sort((a, b) => total(b[1]) - total(a[1]));
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
      <h3 className="font-bold text-gray-900 px-4 pt-4 pb-2">{title}</h3>
      <div className="overflow-x-auto max-h-[420px]">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase sticky top-0">
            <tr>
              <th className="text-left px-4 py-2"> </th>
              {cols.map((c) => <th key={c} className="text-right px-4 py-2">{c}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map(([k, v]) => (
              <tr key={k} className="border-t border-gray-100">
                <td className="px-4 py-2 text-gray-800">{label(k)}</td>
                {cols.map((c) => <td key={c} className="px-4 py-2 text-right font-semibold">{v[c] ? fmtRank(v[c]) : "—"}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default async function SchedulePage({ params }: Props) {
  const exam = examFromSlug((await params).exam) as Exam;
  const e = EXAM[exam];
  const s = SCHEDULE[exam];

  // PG: seats allotted per branch/degree in Round 1 of the latest year (MCC publishes no simple PG matrix).
  let pgBranches: Counts = {};
  if (exam === "pg") {
    for (const r of pgRows as PgRow[]) {
      if (r[1] !== e.latestYear || r[2] !== 1) continue;
      pgBranches[r[5]] ??= {};
      pgBranches[r[5]][r[4]] = (pgBranches[r[5]][r[4]] ?? 0) + r[9];
    }
    pgBranches = Object.fromEntries(Object.entries(pgBranches));
  }

  return (
    <>
      <PageHeader
        slug={e.slug}
        title={`${e.label} Schedule & Seat Matrix`}
        subtitle={s.title}
        crumbs={[{ href: `/${e.slug}/schedule`, label: "Schedule & Seats" }]}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        <div className="grid md:grid-cols-2 gap-4">
          {s.rounds.map((r) => (
            <div key={r.round} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <h2 className="font-black text-gray-900 text-lg mb-3 flex items-center gap-2"><CalendarDays className="w-5 h-5 text-blue-600" /> {r.round}</h2>
              <ol className="space-y-2">
                {r.steps.map((st) => (
                  <li key={st.label} className="flex gap-3 text-sm">
                    <span className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                    <span className="text-gray-600 flex-1">{st.label}</span>
                    <span className="font-semibold text-gray-900 text-right">{st.date}</span>
                  </li>
                ))}
              </ol>
              {r.state && <p className="text-xs text-green-700 bg-green-50 rounded-lg px-3 py-2 mt-3">{r.state}</p>}
            </div>
          ))}
        </div>
        <a href={s.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-blue-700 hover:underline">
          Source: {s.source} <ExternalLink className="w-3.5 h-3.5" />
        </a>

        <div>
          <h2 className="text-2xl font-black text-gray-900 mb-1">Seat matrix</h2>
          {exam === "ug" ? (
            <>
              <p className="text-sm text-gray-500 mb-4">{seatMatrix.source} — {fmtRank(Object.values(seatMatrix.byQuota as Counts).reduce((a, v) => a + total(v), 0))} seats.</p>
              <div className="grid lg:grid-cols-2 gap-4">
                <SeatTable title="By quota" data={seatMatrix.byQuota as Counts} label={(k) => QUOTA_LABEL[k] ?? "Other quotas"} cols={["MBBS", "BDS"]} />
                <SeatTable title="By college type" data={seatMatrix.byType as Counts} label={(k) => TYPE_LABEL[k] ?? k} cols={["MBBS", "BDS"]} />
                <SeatTable title="By category" data={seatMatrix.byCategory as Counts} label={(k) => CATEGORY_LABEL[k] ?? k} cols={["MBBS", "BDS"]} />
                <SeatTable title="By state" data={seatMatrix.byState as Counts} label={(k) => k} cols={["MBBS", "BDS"]} />
              </div>
            </>
          ) : (
            <>
              <p className="text-sm text-gray-500 mb-4">Seats allotted in MCC PG Round 1, {e.latestYear}, by branch and degree (all quotas).</p>
              <SeatTable title="By branch" data={pgBranches} label={(k) => k} cols={["MD", "MS", "DNB", "DNB Diploma", "Diploma"]} />
            </>
          )}
        </div>
      </div>
    </>
  );
}
