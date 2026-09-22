import Link from "next/link";
import { Phone, Stethoscope, Plane } from "lucide-react";

const features = [
  {
    icon: <Stethoscope className="w-6 h-6 text-blue-600" />,
    title: "NEET Counselling",
    desc: "Share your NEET UG rank and we'll help you understand realistic MBBS options in India and abroad.",
    cta: "Explore Colleges",
    href: "/colleges",
    bg: "bg-blue-50",
  },
  {
    icon: <Phone className="w-6 h-6 text-green-600" />,
    title: "Expert Counselling",
    desc: "Talk to experienced counsellors who guide you through MBBS admissions step by step.",
    cta: "Book Free Call",
    href: "/contact",
    bg: "bg-green-50",
  },
  {
    icon: <Plane className="w-6 h-6 text-purple-600" />,
    title: "Visa & Travel Support",
    desc: "For students going abroad, we help with visa guidance, travel and accommodation planning.",
    cta: "Know More",
    href: "/about",
    bg: "bg-purple-50",
  },
];

export default function CTASection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <p className="text-blue-600 text-sm font-semibold uppercase tracking-wider mb-2">Our Services</p>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Everything You Need for MBBS Admission</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            From NEET counselling to visa and travel support — we cover your entire MBBS admission journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f) => (
            <div key={f.title} className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-shadow">
              <div className={`w-12 h-12 ${f.bg} rounded-xl flex items-center justify-center mb-4`}>
                {f.icon}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-5">{f.desc}</p>
              <Link
                href={f.href}
                className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                {f.cta} →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
