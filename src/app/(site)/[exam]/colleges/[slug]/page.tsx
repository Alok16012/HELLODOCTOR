import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, Building2, Users, GitCompare, TrendingUp } from "lucide-react";
import { EXAM, TYPE_LABEL, examFromSlug, type Exam, type PgCollege, type UgCollege } from "@/lib/neet/meta";
import { getCollege, getCollegeCutoffs } from "@/lib/neet/server";
import PageHeader from "@/components/neet/PageHeader";
import CollegeCutoffs from "@/components/neet/CollegeCutoffs";
import EnquiryButton from "@/components/neet/EnquiryButton";

type Props = { params: Promise<{ exam: string; slug: string }> };

// Rendered on first visit, then cached.
export const dynamicParams = true;
export const revalidate = 86400;
export function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { exam: ex, slug } = await params;
  const exam = examFromSlug(ex) as Exam;
  const c = getCollege(exam, slug);
  if (!c) return {};
  return {
    title: `${c.name} — ${EXAM[exam].label} Cut-off, Closing Rank & Seats | Hello Doctor`,
    description: `Round-wise ${EXAM[exam].label} opening and closing ranks for ${c.name}${c.state ? `, ${c.state}` : ""} by quota and category, from official MCC results.`,
  };
}

export default async function CollegePage({ params }: Props) {
  const { exam: ex, slug } = await params;
  const exam = examFromSlug(ex) as Exam;
  const e = EXAM[exam];
  const college = getCollege(exam, slug);
  if (!college) notFound();
  const rows = getCollegeCutoffs(exam, college.id);
  const ug = exam === "ug" ? (college as UgCollege) : null;
  const pg = exam === "pg" ? (college as PgCollege) : null;

  const facts = [
    { icon: MapPin, label: "State", value: college.state ?? "—" },
    { icon: Building2, label: "Type", value: ug ? TYPE_LABEL[ug.type] ?? ug.type : pg?.dnb ? "DNB (NBEMS) hospital" : "Medical college" },
    ug
      ? { icon: Users, label: "MCC seats (R1 2026)", value: Object.keys(ug.seats).length ? Object.entries(ug.seats).map(([k, v]) => `${v} ${k}`).join(" · ") : "—" }
      : { icon: Users, label: "Branches allotted", value: String(pg?.branches ?? 0) },
  ];

  return (
    <>
      <PageHeader
        slug={e.slug}
        title={college.name}
        subtitle={`${e.label} round-wise cut-offs from official MCC allotment results${ug?.code ? ` · MCC institute code ${ug.code}` : ""}`}
        crumbs={[{ href: `/${e.slug}/colleges`, label: "College Info" }, { href: `/${e.slug}/colleges/${slug}`, label: college.name }]}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 grid lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <div className="grid sm:grid-cols-3 gap-3">
            {facts.map(({ icon: Icon, label, value }) => (
              <div key={label} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0"><Icon className="w-5 h-5" /></div>
                <div className="min-w-0">
                  <p className="text-[11px] uppercase font-semibold text-gray-400">{label}</p>
                  <p className="text-sm font-bold text-gray-900">{value}</p>
                </div>
              </div>
            ))}
          </div>
          <div>
            <h2 className="text-xl font-black text-gray-900 mb-3">Round-wise cut-off</h2>
            <CollegeCutoffs exam={exam} rows={rows} />
          </div>
        </div>
        <aside className="space-y-4">
          <div className="bg-blue-600 text-white rounded-2xl p-5">
            <h3 className="font-bold text-lg mb-1">Can you get this college?</h3>
            <p className="text-sm text-blue-100 mb-4">Check your chances with your AIR, category and quota.</p>
            <Link href={`/predictor?exam=${exam}`} className="flex items-center justify-center gap-2 bg-white text-blue-700 font-bold rounded-xl py-2.5 mb-2">
              <TrendingUp className="w-4 h-4" /> College Predictor
            </Link>
            <Link href={`/${e.slug}/compare?c=${college.id}`} className="flex items-center justify-center gap-2 border border-white/40 font-bold rounded-xl py-2.5">
              <GitCompare className="w-4 h-4" /> Compare with others
            </Link>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-1">Talk to a counsellor</h3>
            <p className="text-sm text-gray-500 mb-3">Fees, bond, hostel and choice-filling advice for this college.</p>
            <EnquiryButton className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl py-2.5" />
          </div>
        </aside>
      </div>
    </>
  );
}
