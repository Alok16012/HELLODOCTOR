import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { streams } from "@/data/colleges";

export default function StreamSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-blue-600 text-sm font-semibold uppercase tracking-wider mb-2">Browse by Stream</p>
            <h2 className="text-3xl font-bold text-gray-900">Explore Academic Streams</h2>
            <p className="text-gray-500 mt-2">Find the perfect college based on your field of interest</p>
          </div>
          <Link href="/streams" className="hidden sm:flex items-center gap-1 text-blue-600 text-sm font-medium hover:gap-2 transition-all">
            View All Streams <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {streams.map((stream) => (
            <Link
              key={stream.name}
              href={`/colleges?stream=${stream.name}`}
              className="group bg-white rounded-2xl p-5 border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all duration-300 text-center"
            >
              <div className="text-4xl mb-3">{stream.icon}</div>
              <h3 className="font-semibold text-gray-800 text-sm mb-1 group-hover:text-blue-600 transition-colors">
                {stream.name}
              </h3>
              <p className="text-xs text-gray-400">{stream.count}+ Colleges</p>
              <div className={`mt-3 text-xs font-medium px-3 py-1 rounded-full inline-block ${stream.color}`}>
                Explore →
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
