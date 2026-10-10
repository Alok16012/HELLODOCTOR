import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HubNav from "@/components/neet/HubNav";
import { EXAM_SLUGS, examFromSlug, type ExamSlug } from "@/lib/neet/meta";

// Only /neet-ug and /neet-pg exist under this segment.
export const dynamicParams = false;
export function generateStaticParams() {
  return EXAM_SLUGS.map((exam) => ({ exam }));
}

export default async function ExamLayout({ children, params }: { children: React.ReactNode; params: Promise<{ exam: string }> }) {
  const { exam } = await params;
  if (!examFromSlug(exam)) notFound();
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <HubNav slug={exam as ExamSlug} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
