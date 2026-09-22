import Link from "next/link";
import Image from "next/image";
import { Caveat } from "next/font/google";
import { GraduationCap, Globe2, ShieldCheck, ArrowRight } from "lucide-react";

const caveat = Caveat({ subsets: ["latin"], weight: ["600", "700"] });

const features = [
  { icon: <GraduationCap className="w-5 h-5" />, label: "Top Ranked Universities" },
  { icon: <Globe2 className="w-5 h-5" />, label: "Expert Counselling" },
  { icon: <ShieldCheck className="w-5 h-5" />, label: "100% Genuine Guidance" },
];

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden lg:h-[clamp(480px,36vw,640px)]">
      {/* Background image */}
      <Image
        src="/hero.png"
        alt="Medical student ready for MBBS"
        fill
        className="object-cover object-[75%_center] lg:object-[70%_30%]"
        priority
        sizes="100vw"
      />
      {/* Light wash on the left so text stays readable over the sky */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/85 via-white/55 via-45% to-transparent to-75% lg:from-blue-50/90 lg:via-blue-50/50 lg:via-40% lg:to-transparent lg:to-60%" />

      {/* Handwritten decorative text */}
      <div
        className={`${caveat.className} hidden lg:block absolute top-[10%] left-[55%] text-blue-700 text-4xl xl:text-5xl leading-[1.05] -rotate-12 select-none [text-shadow:0_1px_10px_rgba(255,255,255,0.9)]`}
      >
        <div>Better</div>
        <div className="pl-2">Education</div>
        <div className="pl-7">Brighter</div>
        <div className="pl-14">Future</div>
        <svg viewBox="0 0 200 30" className="ml-10 -mt-1 w-40 h-6" fill="none">
          <path d="M4 24 C 60 10, 120 6, 196 4" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
        </svg>
      </div>

      {/* Plane + dotted trail */}
      <svg
        viewBox="0 0 160 120"
        className="hidden lg:block absolute top-[6%] right-[10%] w-28 h-24 text-blue-500 overflow-visible"
        fill="none"
      >
        <path
          d="M10 110 C 50 90, 70 60, 110 20"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray="5 6"
          strokeLinecap="round"
        />
        <g transform="translate(100,10) rotate(40)">
          <path d="M0 8 L18 0 L0 -8 L4 0 Z" fill="currentColor" />
        </g>
      </svg>

      {/* Content */}
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 py-14 lg:py-0 flex flex-col justify-center">
        <div className="self-start inline-flex items-center bg-blue-100/80 text-blue-700 px-4 py-1.5 rounded-2xl sm:rounded-full text-xs font-bold tracking-wide uppercase mb-5 max-w-[16rem] sm:max-w-none">
          Your Global Medical Career Starts Here
        </div>

        <h1 className="text-[1.75rem] sm:text-5xl lg:text-[2rem] xl:text-[2.5rem] font-black leading-[1.15] text-gray-900 mb-4 max-w-[20rem] sm:max-w-none lg:whitespace-nowrap">
          Explore <br className="lg:hidden" />
          <span className="text-blue-600">MBBS &amp; Medical Programs</span>
        </h1>

        <p className="text-sm sm:text-lg text-gray-600 mb-7 lg:mb-8 max-w-[16rem] sm:max-w-none">
          Find the right medical college or university — in India or abroad
        </p>

        {/* Feature row */}
        <div className="grid grid-cols-3 gap-3 max-w-sm sm:max-w-md lg:flex lg:max-w-none lg:gap-x-8 lg:gap-y-4 mb-7 lg:mb-9">
          {features.map((f) => (
            <div key={f.label} className="flex flex-col items-start gap-2 lg:flex-row lg:items-center lg:gap-2.5">
              <div className="w-11 h-11 lg:w-10 lg:h-10 rounded-full bg-white shadow-md lg:shadow-sm border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                {f.icon}
              </div>
              <span className="text-xs sm:text-sm font-medium text-gray-800 lg:text-gray-700 lg:max-w-[7rem] leading-snug [text-shadow:0_0_6px_rgba(255,255,255,1),0_0_2px_rgba(255,255,255,1)] lg:[text-shadow:none]">{f.label}</span>
            </div>
          ))}
        </div>

        <Link
          href="/streams"
          className="self-start inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-7 py-3.5 rounded-xl shadow-lg shadow-blue-200 transition-colors"
        >
          Explore Programs <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
