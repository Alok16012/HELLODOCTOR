import Link from "next/link";
import { Phone, Bot, Users } from "lucide-react";

const features = [
  {
    icon: <Bot className="w-6 h-6 text-blue-600" />,
    title: "AI College Predictor",
    desc: "Enter your rank/percentile and get personalized college predictions with cutoff analysis.",
    cta: "Try Predictor",
    href: "/predictor",
    bg: "bg-blue-50",
  },
  {
    icon: <Phone className="w-6 h-6 text-green-600" />,
    title: "Expert Counselling",
    desc: "Talk to experienced counsellors who guide you through admissions at top colleges.",
    cta: "Book Session",
    href: "/counselling",
    bg: "bg-green-50",
  },
  {
    icon: <Users className="w-6 h-6 text-purple-600" />,
    title: "Talk to Alumni",
    desc: "Connect with students and alumni from your dream colleges for honest insights.",
    cta: "Connect Now",
    href: "/alumni",
    bg: "bg-purple-50",
  },
];

export default function CTASection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <p className="text-blue-600 text-sm font-semibold uppercase tracking-wider mb-2">Our Services</p>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Everything You Need for Admission</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            From AI-driven college predictions to expert counselling — we cover your entire admission journey.
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
