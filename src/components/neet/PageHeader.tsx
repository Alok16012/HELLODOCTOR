import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { ExamSlug } from "@/lib/neet/meta";

export default function PageHeader({ slug, title, subtitle, crumbs = [] }: {
  slug: ExamSlug;
  title: string;
  subtitle?: string;
  crumbs?: { href: string; label: string }[];
}) {
  return (
    <section className="bg-gradient-to-br from-blue-800 via-blue-700 to-green-700 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-10">
        <nav className="flex items-center flex-wrap gap-1 text-xs text-blue-100 mb-3">
          <Link href="/" className="hover:text-white">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href={`/${slug}`} className="hover:text-white">{slug === "neet-ug" ? "NEET UG" : "NEET PG"}</Link>
          {crumbs.map((c) => (
            <span key={c.href} className="flex items-center gap-1">
              <ChevronRight className="w-3 h-3" />
              <Link href={c.href} className="hover:text-white">{c.label}</Link>
            </span>
          ))}
        </nav>
        <h1 className="text-2xl md:text-4xl font-black leading-tight">{title}</h1>
        {subtitle && <p className="text-blue-100 mt-2 max-w-3xl">{subtitle}</p>}
      </div>
    </section>
  );
}
