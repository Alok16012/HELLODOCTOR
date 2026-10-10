import type { Metadata } from "next";
import PredictorClient from "./PredictorClient";

export const metadata: Metadata = {
  title: "NEET College Predictor 2026 — UG & PG, Based on MCC Closing Ranks | Hello Doctor",
  description: "Free NEET UG & PG college predictor: enter your AIR, category and quota to see Safe, Moderate, Risky and Dream colleges from official MCC closing ranks.",
};

export default async function PredictorPage({ searchParams }: { searchParams: Promise<{ exam?: string }> }) {
  const { exam } = await searchParams;
  return <PredictorClient initialExam={exam === "pg" ? "pg" : "ug"} />;
}
