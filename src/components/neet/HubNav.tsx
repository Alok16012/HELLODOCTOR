"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ExamSlug } from "@/lib/neet/meta";

export const hubLinks = (slug: ExamSlug) => [
  { href: `/${slug}`, label: "Overview" },
  { href: `/predictor?exam=${slug === "neet-ug" ? "ug" : "pg"}`, label: "College Predictor" },
  { href: `/${slug}/colleges`, label: "College Info" },
  { href: `/${slug}/cutoffs`, label: "Cut-offs" },
  { href: `/${slug}/compare`, label: "Cut-off Comparison" },
  { href: `/${slug}/choice-filling`, label: "Choice Filling Advisor" },
  { href: `/${slug}/state-counselling`, label: "State Counselling" },
  { href: `/${slug}/schedule`, label: "Schedule & Seats" },
  { href: `/${slug}/premium`, label: "Premium Counselling" },
];

export default function HubNav({ slug }: { slug: ExamSlug }) {
  const pathname = usePathname();
  return (
    <div className="bg-blue-900 text-white sticky top-[96px] z-40 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-3">
        <div className="flex bg-white/10 rounded-lg p-0.5 shrink-0 my-2">
          {(["neet-ug", "neet-pg"] as ExamSlug[]).map((s) => (
            <Link
              key={s}
              href={pathname.replace(`/${slug}`, `/${s}`)}
              className={`px-3 py-1.5 rounded-md text-xs font-bold ${s === slug ? "bg-white text-blue-900" : "text-white/80 hover:text-white"}`}
            >
              {s === "neet-ug" ? "NEET UG" : "NEET PG"}
            </Link>
          ))}
        </div>
        <nav className="flex-1 overflow-x-auto scrollbar-hide">
          <div className="flex items-center gap-1 whitespace-nowrap">
            {hubLinks(slug).map((l) => {
              const path = l.href.split("?")[0];
              const active = path === `/${slug}` ? pathname === path : pathname.startsWith(path);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`px-3 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors ${
                    active ? "border-yellow-300 text-white" : "border-transparent text-blue-100 hover:text-white"
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}
