import type { Metadata } from "next";
import { EXAM, examFromSlug, type Exam } from "@/lib/neet/meta";
import PageHeader from "@/components/neet/PageHeader";
import CutoffExplorer from "@/components/neet/CutoffExplorer";

type Props = { params: Promise<{ exam: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const e = EXAM[examFromSlug((await params).exam) as Exam];
  return {
    title: `${e.label} Cut-off ${e.years[0]} — Final & Round-wise Closing Ranks | Hello Doctor`,
    description: `${e.label} final and round-wise opening and closing ranks for ${e.courses} by quota, category and state, ${e.years[e.years.length - 1]}–${e.years[0]}, from official MCC results.`,
  };
}

export default async function CutoffsPage({ params }: Props) {
  const exam = examFromSlug((await params).exam) as Exam;
  const e = EXAM[exam];
  return (
    <>
      <PageHeader
        slug={e.slug}
        title={`${e.label} Final & Yearly Cut-offs`}
        subtitle={`Opening and closing All India Ranks for every college and ${exam === "ug" ? "course" : "branch"} — pick a year, round, quota and category.`}
        crumbs={[{ href: `/${e.slug}/cutoffs`, label: "Cut-offs" }]}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <CutoffExplorer exam={exam} />
      </div>
    </>
  );
}
