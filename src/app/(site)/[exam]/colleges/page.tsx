import type { Metadata } from "next";
import { EXAM, examFromSlug, type Exam } from "@/lib/neet/meta";
import { getDirectory } from "@/lib/neet/server";
import PageHeader from "@/components/neet/PageHeader";
import CollegeDirectory from "@/components/neet/CollegeDirectory";

type Props = { params: Promise<{ exam: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const e = EXAM[examFromSlug((await params).exam) as Exam];
  return {
    title: `${e.label} College Info — ${e.courses} Colleges, Seats & Closing Ranks | Hello Doctor`,
    description: `Browse ${e.label} colleges with state, type, MCC seats and round-wise closing ranks from official MCC results.`,
  };
}

export default async function CollegesPage({ params }: Props) {
  const exam = examFromSlug((await params).exam) as Exam;
  const e = EXAM[exam];
  return (
    <>
      <PageHeader
        slug={e.slug}
        title={`${e.label} College Info`}
        subtitle={exam === "ug"
          ? "Every MBBS and BDS college in MCC counselling — state, type, seats and last year's closing rank. Open a college for round-wise cut-offs."
          : "Every MD/MS college and DNB hospital in MCC PG counselling — open one for branch-wise, round-wise closing ranks."}
        crumbs={[{ href: `/${e.slug}/colleges`, label: "College Info" }]}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <CollegeDirectory exam={exam} slug={e.slug} entries={getDirectory(exam)} />
      </div>
    </>
  );
}
