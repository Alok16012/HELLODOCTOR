import Link from "next/link";
import type { Scholarship } from "@/data/scholarships";
import { ArrowRight, Award, IndianRupee, Users } from "lucide-react";

const providerColors: Record<string, string> = {
  Government: "bg-blue-50 text-blue-700 border-blue-100",
  University: "bg-green-50 text-green-700 border-green-100",
  Private: "bg-purple-50 text-purple-700 border-purple-100",
  International: "bg-orange-50 text-orange-700 border-orange-100",
};

const bgGradients: Record<string, string> = {
  Government: "from-blue-600 to-blue-700",
  University: "from-green-600 to-green-700",
  Private: "from-purple-600 to-purple-700",
  International: "from-orange-500 to-orange-600",
};

export default function ScholarshipPreview({ scholarships }: { scholarships: Scholarship[] }) {
  const featured = scholarships.filter((s) => s.featured).slice(0, 3);
  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="inline-flex items-center gap-2 bg-yellow-50 text-yellow-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-3 border border-yellow-100">
              <Award className="w-3.5 h-3.5" />
              Scholarships
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900">
              Fund Your Education
            </h2>
            <p className="text-gray-500 mt-1 text-sm">Discover scholarships for medical and other streams — across income groups & categories</p>
          </div>
          <Link
            href="/scholarship"
            className="hidden sm:flex items-center gap-1.5 text-blue-600 font-semibold text-sm hover:gap-2.5 transition-all"
          >
            View All Scholarships <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featured.map((sch) => {
            const grad = bgGradients[sch.providerType] ?? "from-blue-600 to-blue-700";
            const badge = providerColors[sch.providerType] ?? "bg-gray-50 text-gray-700 border-gray-100";
            return (
              <Link
                key={sch.slug}
                href={`/scholarship/${sch.slug}`}
                className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all flex flex-col"
              >
                {/* Colored top band */}
                <div className={`bg-gradient-to-r ${grad} px-5 pt-5 pb-8 relative`}>
                  <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full border ${badge} bg-white/90 mb-3`}>
                    {sch.providerType}
                  </span>
                  <h3 className="font-bold text-white text-sm leading-snug line-clamp-2">
                    {sch.name}
                  </h3>
                </div>

                {/* Content */}
                <div className="px-5 pt-4 pb-5 flex flex-col flex-1 -mt-3">
                  <div className="bg-white rounded-xl border border-gray-100 p-3 mb-4 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-1.5 text-green-600">
                      <IndianRupee className="w-4 h-4" />
                      <span className="font-bold text-sm">{sch.amountDisplay}</span>
                    </div>
                    {sch.noOfAwards && (
                      <div className="flex items-center gap-1.5 text-gray-500">
                        <Users className="w-3.5 h-3.5" />
                        <span className="text-xs">{sch.noOfAwards}</span>
                      </div>
                    )}
                  </div>

                  <p className="text-gray-500 text-xs leading-relaxed mb-4 line-clamp-2 flex-1">
                    {sch.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">
                      Deadline: <span className="text-gray-700 font-medium">{sch.deadline}</span>
                    </span>
                    <span className="text-xs text-blue-600 font-semibold group-hover:underline">
                      View Details →
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Stats strip */}
        <div className="mt-10 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-white text-center">
          {[
            { value: `${scholarships.length}+`, label: "Scholarships Listed" },
            { value: "Govt. & Private", label: "Both Covered" },
            { value: "Any Stream", label: "Including Medical" },
            { value: "Free", label: "Guidance from Hello Doctor" },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-xl font-black">{s.value}</div>
              <div className="text-blue-200 text-xs mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/scholarship"
            className="inline-flex items-center gap-2 bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl text-sm"
          >
            View All Scholarships <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
