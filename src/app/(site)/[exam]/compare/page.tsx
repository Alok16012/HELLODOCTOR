import type { Metadata } from "next";
import { EXAM, examFromSlug, type Exam } from "@/lib/neet/meta";
import PageHeader from "@/components/neet/PageHeader";
import CompareTool from "@/components/neet/CompareTool";

type Props = { params: Promise<{ exam: string }>; searchParams: Promise<{ c?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const e = EXAM[examFromSlug((await params).exam) as Exam];
  return {
    title: `${e.label} Cut-off Comparison — Compare College Closing Ranks | Hello Doctor`,
    description: `Compare ${e.label} closing ranks of up to 3 colleges across years and counselling rounds.`,
  };
}

export default async function ComparePage({ params, searchParams }: Props) {
  const exam = examFromSlug((await params).exam) as Exam;
  // ?c=<id>,<id> preselects colleges (link from a college page)
  const initial = ((await searchParams).c ?? "").split(",").map(Number).filter((n) => n > 0);
  const e = EXAM[exam];
  return (
    <>
      <PageHeader
        slug={e.slug}
        title={`${e.label} Cut-off Comparison`}
        subtitle="Put up to three colleges side by side and see how their closing ranks moved across years and rounds."
        crumbs={[{ href: `/${e.slug}/compare`, label: "Cut-off Comparison" }]}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <CompareTool exam={exam} initial={initial} />
      </div>
    </>
  );
}
