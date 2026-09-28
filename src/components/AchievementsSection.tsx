import { Building2, Globe2, GraduationCap, Headphones, ShieldCheck, Stethoscope } from "lucide-react";

// Update these figures as the consultancy grows.
const achievements = [
  { icon: Building2, value: "28+", label: "Colleges & Universities" },
  { icon: Globe2, value: "6", label: "Countries Covered" },
  { icon: Stethoscope, value: "10+", label: "UG & PG Programs" },
  { icon: GraduationCap, value: "Free", label: "Initial Counselling" },
  { icon: ShieldCheck, value: "100%", label: "NEET-Based Admission" },
  { icon: Headphones, value: "7 Days", label: "Support Availability" },
];

export default function AchievementsSection() {
  return (
    <section className="relative py-16 lg:py-20 bg-gradient-to-br from-blue-950 via-blue-800 to-green-700 overflow-hidden">
      <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-green-400/20 blur-3xl" />
      <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-sky-400/20 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 lg:mb-12">
          <p className="text-green-300 text-sm font-semibold uppercase tracking-wider mb-2">Our Achievements</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">Numbers That Speak for Us</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {achievements.map(({ icon: Icon, value, label }) => (
            <div
              key={label}
              className="rounded-2xl bg-white/10 border border-white/15 backdrop-blur p-5 text-center hover:bg-white/15 transition-colors"
            >
              <div className="mx-auto mb-3 w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center text-green-300">
                <Icon className="w-6 h-6" />
              </div>
              <p className="text-3xl font-black text-white">{value}</p>
              <p className="text-blue-100 text-xs sm:text-sm mt-1">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
