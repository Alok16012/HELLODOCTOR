import { Suspense } from "react";
import { getColleges } from "@/lib/content";
import CollegesClient from "./CollegesClient";

export const revalidate = 3600;

export default async function CollegesPage() {
  const colleges = await getColleges();
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    }>
      <CollegesClient colleges={colleges} />
    </Suspense>
  );
}
