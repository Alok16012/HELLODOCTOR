import type { Metadata } from "next";
import { EXAM, examFromSlug, type Exam } from "@/lib/neet/meta";
import PageHeader from "@/components/neet/PageHeader";
import ChoiceFilling from "@/components/neet/ChoiceFilling";

type Props = { params: Promise<{ exam: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const e = EXAM[examFromSlug((await params).exam) as Exam];
  return {
    title: `${e.label} Choice Filling Advisor — Ordered College List for Your Rank | Hello Doctor`,
    description: `Build a ${e.label} MCC choice list for your All India Rank: dream, risky, moderate and safe ${e.courses} options from official closing ranks.`,
  };
}

export default async function ChoiceFillingPage({ params }: Props) {
  const exam = examFromSlug((await params).exam) as Exam;
  const e = EXAM[exam];
  return (
    <>
      <PageHeader
        slug={e.slug}
        title={`${e.label} Choice Filling Advisor`}
        subtitle="Enter your rank and preferences — get a ready, ordered choice list built from last year's MCC closing ranks."
        crumbs={[{ href: `/${e.slug}/choice-filling`, label: "Choice Filling Advisor" }]}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <ChoiceFilling exam={exam} />
      </div>
    </>
  );
}
