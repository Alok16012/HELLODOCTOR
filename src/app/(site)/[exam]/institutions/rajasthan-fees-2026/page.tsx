import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHeader from "@/components/neet/PageHeader";
import RajasthanFeesExplorer, { type RajasthanFeesData } from "@/components/neet/RajasthanFeesExplorer";
import rajasthanFeesJson from "@/data/neet/pg-rajasthan-fees-2026.json";

const rajasthanFees = rajasthanFeesJson as RajasthanFeesData;

export const metadata: Metadata = {
  title: "Rajasthan NEET PG 2026 Fee Structure — College-wise Tuition, Hostel & Other Fees | Hello Doctor",
  description: "Official college-submitted NEET PG 2026 fee structure for Rajasthan private medical colleges — tuition fees by AI/State/Management quota, hostel and other academic fees.",
};

export default async function RajasthanFeesPage({ params }: { params: Promise<{ exam: string }> }) {
  if ((await params).exam !== "neet-pg") notFound();
  return (
    <>
      <PageHeader
        slug="neet-pg"
        title="Rajasthan NEET PG 2026 Fee Structure"
        subtitle="College-submitted tuition, hostel and other academic fees for the 2026 admission cycle — separate from the 2024–2025 closing-rank data on the Institutions page."
        crumbs={[{ href: "/neet-pg/institutions", label: "Institutions & Fees" }, { href: "/neet-pg/institutions/rajasthan-fees-2026", label: "Rajasthan 2026 Fees" }]}
      />
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-8">
        <RajasthanFeesExplorer data={rajasthanFees} />
      </div>
    </>
  );
}
