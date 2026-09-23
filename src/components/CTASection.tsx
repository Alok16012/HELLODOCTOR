import Link from "next/link";
import Image from "next/image";
import { GraduationCap, BookOpen } from "lucide-react";

const programs = [
  {
    icon: <GraduationCap className="w-8 h-8" />,
    title: "NEET UG",
    subtitle: "MBBS / BDS / Other UG Medical Programs",
    href: "/streams",
    theme: "blue",
  },
  {
    icon: <BookOpen className="w-8 h-8" />,
    title: "NEET PG",
    subtitle: "MD / MS / Other PG Medical Programs",
    href: "/streams",
    theme: "green",
  },
];

export default function CTASection() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-blue-50/60 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 md:mb-16">
          <p className="text-blue-600 text-sm font-semibold uppercase tracking-wider mb-2">Your Medical Career Starts Here</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Choose Your Admission Path</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Get expert guidance, verified information and complete counselling support for your medical career.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
          {programs.map((p) => (
            <Link
              key={p.title}
              href={p.href}
              className="group relative bg-white rounded-3xl p-8 md:p-10 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              {/* colored accent ring */}
              <div
                className={`absolute -top-24 -right-24 w-56 h-56 rounded-full opacity-20 group-hover:scale-110 transition-transform duration-500 ${
                  p.theme === "blue" ? "bg-blue-100" : "bg-emerald-100"
                }`}
              />

              <div className="relative z-10 flex flex-col h-full">
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${
                    p.theme === "blue" ? "bg-blue-50 text-blue-600" : "bg-emerald-50 text-emerald-600"
                  }`}
                >
                  {p.icon}
                </div>

                <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
                  {p.title}
                </h3>

                <p className="text-gray-500 mb-8 leading-relaxed">{p.subtitle}</p>

                <span
                  className={`mt-auto inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide ${
                    p.theme === "blue" ? "text-blue-600" : "text-emerald-600"
                  }`}
                >
                  <span
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-white transition-transform group-hover:translate-x-1 ${
                      p.theme === "blue" ? "bg-blue-600" : "bg-emerald-600"
                    }`}
                  >
                    →
                  </span>
                  {p.theme === "blue" ? "Explore UG Programs" : "Explore PG Programs"}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
