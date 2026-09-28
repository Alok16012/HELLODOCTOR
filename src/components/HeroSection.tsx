import Link from "next/link";
import Image from "next/image";
import { GraduationCap, ChevronRight } from "lucide-react";

const paths = [
  {
    label: "NEET UG",
    href: "/streams?tab=ug",
    className:
      "from-lime-500 via-green-600 to-green-700 shadow-green-600/30 hover:shadow-green-600/40",
  },
  {
    label: "NEET PG",
    href: "/streams?tab=pg",
    className:
      "from-blue-500 via-blue-600 to-blue-800 shadow-blue-600/30 hover:shadow-blue-600/40",
  },
];

function Plus({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`absolute pointer-events-none ${className}`} fill="currentColor" aria-hidden>
      <path d="M9 2h6v7h7v6h-7v7H9v-7H2V9h7z" />
    </svg>
  );
}

function Dots({ className }: { className: string }) {
  return (
    <div
      className={`absolute pointer-events-none grid grid-cols-5 gap-2.5 ${className}`}
      aria-hidden
    >
      {Array.from({ length: 25 }).map((_, i) => (
        <span key={i} className="w-1.5 h-1.5 rounded-full bg-current" />
      ))}
    </div>
  );
}

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-sky-50 min-h-[560px] lg:min-h-[clamp(580px,44vw,720px)]">
      {/* Background image */}
      <div className="absolute inset-y-0 right-0 w-full lg:w-[68%]">
        <Image
          src="/hero-bg.png"
          alt="Medical college campus"
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 68vw"
          className="object-cover object-[70%_40%]"
        />
        <div className="hidden lg:block absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-white to-transparent" />
      </div>
      {/* Wash on the left so the headline stays readable */}
      <div className="absolute inset-0 bg-gradient-to-r from-white via-white/85 via-40% to-white/10 lg:from-white lg:via-white/80 lg:via-35% lg:to-transparent lg:to-65%" />
      <div className="absolute inset-0 bg-gradient-to-b from-sky-100/40 via-transparent to-transparent" />

      {/* Decorations */}
      <Plus className="top-6 left-6 w-14 h-14 text-sky-200/70" />
      <Plus className="hidden lg:block top-[22%] right-[20%] w-16 h-16 text-sky-300/50" />
      <Plus className="hidden lg:block top-[48%] left-[58%] w-12 h-12 text-sky-300/50" />
      <Dots className="hidden md:grid top-6 right-6 text-sky-300/70" />
      <Dots className="hidden md:grid top-[34%] left-2 text-sky-200" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-40 sm:pt-16 lg:pt-20 lg:pb-52">
        <div className="inline-flex items-center rounded-full border-2 border-green-400/70 bg-white/80 backdrop-blur px-5 sm:px-8 py-1.5 sm:py-2 shadow-sm">
          <span className="text-2xl sm:text-4xl lg:text-[2.75rem] font-extrabold tracking-tight text-blue-950">
            Get <span className="text-blue-800">Admission</span> on the
          </span>
        </div>

        <h1 className="mt-3 text-[3.25rem] leading-none sm:text-7xl lg:text-[6.5rem] font-black tracking-tight">
          <span className="text-blue-950">Medical </span>
          <span className="bg-gradient-to-r from-green-600 via-green-600 to-emerald-700 bg-clip-text text-transparent">
            Path
          </span>
        </h1>
        <div className="mt-3 h-1.5 w-40 rounded-full bg-gradient-to-r from-green-600 to-blue-700" />

        <p className="mt-5 text-lg sm:text-2xl text-gray-700 leading-snug max-w-xl">
          Expert guidance for <strong className="font-bold text-green-700">NEET UG</strong>{" "}
          <strong className="font-bold text-green-700">&amp;</strong>{" "}
          <strong className="font-bold text-blue-700">NEET PG</strong> admission in top medical colleges across
          India.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-4 sm:gap-5">
          {paths.map((p) => (
            <Link
              key={p.label}
              href={p.href}
              className={`group inline-flex items-center justify-between sm:justify-start gap-5 rounded-2xl bg-gradient-to-r ${p.className} px-6 sm:px-8 py-4 sm:py-5 text-white shadow-xl ring-1 ring-white/30 transition-all hover:-translate-y-0.5 sm:min-w-[19rem]`}
            >
              <GraduationCap className="w-9 h-9 sm:w-10 sm:h-10 shrink-0" />
              <span className="h-10 w-px bg-white/40" />
              <span className="flex-1 text-2xl sm:text-3xl font-extrabold tracking-tight">{p.label}</span>
              <ChevronRight className="w-7 h-7 transition-transform group-hover:translate-x-1" />
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom waves */}
      <svg
        viewBox="0 0 1440 260"
        preserveAspectRatio="none"
        className="absolute bottom-0 left-0 w-full h-36 sm:h-44 lg:h-56 pointer-events-none"
        aria-hidden
      >
        <defs>
          <linearGradient id="hero-wave-green" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#8ccf4d" />
            <stop offset="1" stopColor="#3d8f2f" />
          </linearGradient>
          <linearGradient id="hero-wave-blue" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#0a2e3b" />
            <stop offset="0.6" stopColor="#0f7690" />
            <stop offset="1" stopColor="#2a9db3" />
          </linearGradient>
        </defs>
        <path d="M0 40 C 260 120, 520 200, 820 210 C 1080 218, 1280 170, 1440 110 L1440 260 L0 260 Z" fill="url(#hero-wave-green)" opacity="0.9" />
        <path d="M0 90 C 280 170, 560 230, 860 232 C 1100 234, 1300 190, 1440 150 L1440 260 L0 260 Z" fill="url(#hero-wave-blue)" />
        <path d="M0 170 C 320 220, 640 250, 940 248 C 1160 246, 1320 222, 1440 200 L1440 260 L0 260 Z" fill="url(#hero-wave-green)" opacity="0.85" />
        <path d="M0 215 C 360 250, 720 262, 1040 256 C 1220 252, 1360 240, 1440 232 L1440 260 L0 260 Z" fill="#ffffff" />
      </svg>
    </section>
  );
}
