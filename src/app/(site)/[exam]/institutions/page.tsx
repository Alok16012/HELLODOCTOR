import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHeader from "@/components/neet/PageHeader";
import InstitutionsExplorer from "@/components/neet/InstitutionsExplorer";

export const metadata: Metadata = {
  title: "NEET PG Institutions, Fees & Round-wise Cutoffs | Hello Doctor",
  description: "Explore NEET PG colleges, branches, fees, state quotas, categories and round-wise closing ranks.",
};

export default async function InstitutionsPage({ params }: { params: Promise<{ exam: string }> }) {
  if ((await params).exam !== "neet-pg") notFound();
  return (
    <>
      <PageHeader slug="neet-pg" title="Institutions & Fees" subtitle="Explore medical institutions, fees and round-wise closing ranks across All India and state counselling." crumbs={[{ href: "/neet-pg/institutions", label: "Institutions & Fees" }]} />
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-8"><InstitutionsExplorer /></div>
    </>
  );
}
