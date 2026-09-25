import { getScholarships } from "@/lib/content";
import ScholarshipClient from "./ScholarshipClient";

export const revalidate = 3600;

export default async function Page() {
  const scholarships = await getScholarships();
  return <ScholarshipClient scholarships={scholarships} />;
}
