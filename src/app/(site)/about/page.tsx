import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Award, Building2, GraduationCap, Target, Heart,
  Star, CheckCircle2, Globe, BookOpen, Phone,
  ChevronRight, Shield, Stethoscope, FileCheck, Plane,
} from "lucide-react";

const stats = [
  { value: "6", label: "Countries for MBBS", icon: <Globe className="w-6 h-6" />, color: "text-blue-600", bg: "bg-blue-50" },
  { value: "4", label: "Medical Programs", icon: <Stethoscope className="w-6 h-6" />, color: "text-green-600", bg: "bg-green-50" },
  { value: "Free", label: "Initial NEET Counselling", icon: <GraduationCap className="w-6 h-6" />, color: "text-purple-600", bg: "bg-purple-50" },
  { value: "1-on-1", label: "Personalised Guidance", icon: <Award className="w-6 h-6" />, color: "text-orange-600", bg: "bg-orange-50" },
  { value: "100%", label: "NMC-Aware Guidance", icon: <Shield className="w-6 h-6" />, color: "text-yellow-600", bg: "bg-yellow-50" },
  { value: "7 Days", label: "Support Availability", icon: <Building2 className="w-6 h-6" />, color: "text-indigo-600", bg: "bg-indigo-50" },
];

const values = [
  {
    icon: <Shield className="w-7 h-7 text-blue-600" />,
    title: "Integrity",
    desc: "We give honest, unbiased guidance based on your NEET score, budget, and goals — not on which university pays the highest commission. Every recommendation is built on transparency.",
  },
  {
    icon: <Star className="w-7 h-7 text-yellow-500" />,
    title: "Excellence",
    desc: "We hold ourselves to high standards in counselling quality, documentation accuracy, and student outcomes, so every application is handled with care and precision.",
  },
  {
    icon: <Heart className="w-7 h-7 text-red-500" />,
    title: "Student-First",
    desc: "Every decision we make starts with one question: is this best for the student's medical career? Your success and peace of mind are what we measure ourselves by.",
  },
];

const services = [
  { title: "MBBS Admission Guidance", desc: "End-to-end support for MBBS admission in India and abroad — Russia, Georgia, Uzbekistan, Kyrgyzstan and Nepal", icon: "🩺" },
  { title: "NEET Counselling", desc: "Understanding your NEET UG rank, eligibility, and realistic university options based on NMC guidelines", icon: "📝" },
  { title: "Documentation & Application", desc: "Complete help with paperwork, eligibility certificates, and university application filing", icon: "📋" },
  { title: "Visa & Travel Support", desc: "Guidance on visa processing, travel arrangements, and accommodation for students going abroad", icon: "✈️" },
  { title: "BDS, BAMS & BHMS Guidance", desc: "Admission support for dental, ayurvedic and homeopathic medical programs in India", icon: "⚕️" },
  { title: "Scholarship Assistance", desc: "Helping eligible students identify and apply for relevant government and university scholarships", icon: "🎓" },
];

const process = [
  { icon: <Phone className="w-6 h-6" />, title: "Free Counselling Call", desc: "Share your NEET score, budget and preferences with our counsellors over a free call or WhatsApp chat." },
  { icon: <GraduationCap className="w-6 h-6" />, title: "University Shortlisting", desc: "We help you shortlist the right medical colleges or universities in India or abroad based on your profile." },
  { icon: <FileCheck className="w-6 h-6" />, title: "Documentation & Application", desc: "Our team assists with eligibility checks, paperwork, and filing your admission application." },
  { icon: <Plane className="w-6 h-6" />, title: "Travel & Post-Admission Support", desc: "For students going abroad, we help with visa guidance, travel, accommodation and settling in." },
];

const team = [
  {
    name: "Aman",
    role: "Founder & Director, Hello Doctor",
    desc: "Aman founded Hello Doctor with the goal of giving NEET aspirants honest, transparent guidance for MBBS admission — whether in India or abroad. Under his leadership, the team focuses on personalised counselling rather than one-size-fits-all advice.",
    expertise: ["MBBS Admission Guidance – India & Abroad", "NEET Counselling & Eligibility Planning", "Student-First, Transparent Process"],
    quote: "Every student's NEET score and situation is different — our job is to find the medical college that's genuinely right for them.",
    initials: "A",
  },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <div className="bg-white min-h-screen">

        {/* Hero */}
        <div className="bg-gradient-to-br from-[#1e3a6e] via-blue-700 to-blue-600 py-20 px-4 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-20 w-64 h-64 bg-blue-300 rounded-full blur-3xl" />
          </div>
          <div className="max-w-7xl mx-auto relative text-center">
            <div className="flex justify-center mb-6">
              <Stethoscope className="w-16 h-16 text-blue-200" />
            </div>
            <div className="inline-flex items-center gap-2 bg-white/15 text-white text-sm font-medium px-4 py-2 rounded-full mb-4 border border-white/20">
              <Award className="w-4 h-4 text-yellow-300" /> Noida-Based MBBS Admission Consultancy
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold text-white mb-4 leading-tight">
              Hello Doctor<br />
              <span className="text-blue-200 text-2xl sm:text-3xl font-semibold">MBBS Admission Consultancy</span>
            </h1>
            <p className="text-blue-100 text-lg max-w-3xl mx-auto mb-8">
              We help NEET aspirants find the right path to becoming a doctor — MBBS admission guidance for India and abroad, with honesty, expertise, and heart.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact" className="bg-white text-blue-700 font-bold px-7 py-3.5 rounded-xl hover:bg-blue-50 transition-colors">
                Talk to a Counsellor
              </Link>
              <Link href="/colleges" className="border border-white/40 text-white font-bold px-7 py-3.5 rounded-xl hover:bg-white/10 transition-colors">
                Explore Medical Colleges
              </Link>
            </div>
          </div>
        </div>

        {/* Impact Stats */}
        <div className="bg-gray-50 py-14 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Why Students Choose Hello Doctor</h2>
              <p className="text-gray-500">Focused, honest guidance for your MBBS journey</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {stats.map((s) => (
                <div key={s.label} className={`${s.bg} rounded-2xl p-5 text-center border border-gray-100`}>
                  <div className={`flex justify-center mb-2 ${s.color}`}>{s.icon}</div>
                  <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
                  <p className="text-gray-600 text-xs mt-1 font-medium">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-sm font-semibold px-3 py-1.5 rounded-full mb-4">
                  <Target className="w-4 h-4" /> Our Purpose
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-5 leading-tight">
                  Guiding NEET Aspirants to<br /><span className="text-blue-600">the Right Medical College</span>
                </h2>
                <p className="text-gray-600 text-base leading-relaxed mb-5">
                  Hello Doctor is a Noida-based MBBS admission consultancy built on a simple belief — every NEET aspirant deserves honest, clear guidance about their real options, whether that's a government medical college in India or a recognised university abroad.
                </p>
                <p className="text-gray-600 text-base leading-relaxed mb-6">
                  We work closely with students and parents to understand their NEET score, budget, and goals, and then recommend the path that genuinely fits — with complete support from counselling to admission and beyond.
                </p>
                <div className="space-y-3">
                  {[
                    "Free initial counselling for all students",
                    "Unbiased guidance — we recommend best-fit, not highest-commission",
                    "Support for MBBS in India and abroad",
                    "Guidance for BDS, BAMS and BHMS admissions too",
                  ].map((point) => (
                    <div key={point} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                      <span className="text-gray-700">{point}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white">
                  <Target className="w-8 h-8 mb-3 text-blue-200" />
                  <h3 className="font-bold text-lg mb-2">Our Mission</h3>
                  <p className="text-blue-100 text-sm leading-relaxed">
                    To make honest, personalised MBBS admission guidance accessible to every NEET aspirant, regardless of where they're from.
                  </p>
                </div>
                <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-2xl p-6 text-white">
                  <Globe className="w-8 h-8 mb-3 text-indigo-200" />
                  <h3 className="font-bold text-lg mb-2">Our Vision</h3>
                  <p className="text-indigo-100 text-sm leading-relaxed">
                    A future where no aspiring doctor misses their MBBS dream due to lack of guidance or clarity on their options.
                  </p>
                </div>
                <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl p-6 text-white col-span-2">
                  <Stethoscope className="w-8 h-8 mb-3 text-green-200" />
                  <h3 className="font-bold text-lg mb-2">Our Promise</h3>
                  <p className="text-green-100 text-sm leading-relaxed">
                    Transparent counselling, realistic expectations, and support that continues well past the day you get your admission letter.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Core Values */}
        <div className="bg-gray-50 py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Our Core Values</h2>
              <p className="text-gray-500">The principles that guide every interaction with our students</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {values.map((v) => (
                <div key={v.title} className="bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-lg transition-shadow text-center">
                  <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    {v.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{v.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Services */}
        <div className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">What We Do</h2>
              <p className="text-gray-500">Complete support for your MBBS journey, from counselling to admission</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {services.map((s) => (
                <div key={s.title} className="bg-white border border-gray-100 rounded-2xl p-6 hover:border-blue-200 hover:shadow-md transition-all group">
                  <span className="text-3xl mb-4 block">{s.icon}</span>
                  <h3 className="font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{s.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Process */}
        <div className="bg-gray-50 py-16 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">How We Help</h2>
              <p className="text-gray-500">A simple, four-step process from first call to admission</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {process.map((p, i) => (
                <div key={p.title} className="bg-white rounded-2xl p-6 border border-gray-100 relative">
                  <div className="w-11 h-11 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                    {p.icon}
                  </div>
                  <p className="text-xs font-bold text-blue-600 mb-1">STEP {i + 1}</p>
                  <h3 className="font-bold text-gray-900 mb-2">{p.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Team */}
        <div className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Leadership</h2>
              <p className="text-gray-500">Committed to your success</p>
            </div>
            <div className="grid grid-cols-1 gap-8 max-w-lg mx-auto">
              {team.map((member) => (
                <div key={member.name} className="bg-white rounded-2xl border border-gray-100 p-8 hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full flex items-center justify-center text-white font-bold text-xl shrink-0">
                      {member.initials}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{member.name}</h3>
                      <p className="text-blue-600 text-xs font-semibold leading-snug mt-0.5">{member.role}</p>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">{member.desc}</p>
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Focus Areas</p>
                    <ul className="space-y-1">
                      {member.expertise.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
                          <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <blockquote className="border-l-2 border-blue-200 pl-4 text-sm text-gray-500 italic">
                    &ldquo;{member.quote}&rdquo;
                  </blockquote>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="py-16 px-4 bg-gray-50">
          <div className="max-w-4xl mx-auto text-center">
            <BookOpen className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">Ready to Start Your MBBS Journey?</h2>
            <p className="text-gray-500 mb-7 max-w-xl mx-auto">
              Talk to our counsellors about MBBS admission in India or abroad. We&apos;re available on call and WhatsApp all week.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/contact"
                className="flex items-center gap-2 bg-blue-600 text-white font-bold px-8 py-3.5 rounded-xl hover:bg-blue-700 transition-colors"
              >
                <Phone className="w-4 h-4" /> Book Free Counselling
              </Link>
              <Link
                href="/colleges"
                className="flex items-center gap-2 border border-gray-300 text-gray-700 font-bold px-8 py-3.5 rounded-xl hover:border-blue-400 hover:text-blue-600 transition-colors"
              >
                Explore Colleges <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
