import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Users, Award, Building2, GraduationCap, Target, Heart,
  Star, CheckCircle2, TrendingUp, Globe, BookOpen, Phone,
  ChevronRight, Landmark, Shield,
} from "lucide-react";

const stats = [
  { value: "50,000+", label: "Students Guided", icon: <Users className="w-6 h-6" />, color: "text-blue-600", bg: "bg-blue-50" },
  { value: "50+", label: "Centers Across India", icon: <Building2 className="w-6 h-6" />, color: "text-green-600", bg: "bg-green-50" },
  { value: "100+", label: "Partner Colleges", icon: <GraduationCap className="w-6 h-6" />, color: "text-purple-600", bg: "bg-purple-50" },
  { value: "200+", label: "Expert Counsellors", icon: <Award className="w-6 h-6" />, color: "text-orange-600", bg: "bg-orange-50" },
  { value: "₹100 Cr+", label: "Scholarships Facilitated", icon: <Star className="w-6 h-6" />, color: "text-yellow-600", bg: "bg-yellow-50" },
  { value: "2010", label: "Year Founded", icon: <Landmark className="w-6 h-6" />, color: "text-indigo-600", bg: "bg-indigo-50" },
];

const values = [
  {
    icon: <Shield className="w-7 h-7 text-blue-600" />,
    title: "Integrity",
    desc: "We provide honest, unbiased guidance. Our counsellors prioritize your best interests — not college commissions. Every recommendation is built on transparency.",
  },
  {
    icon: <Star className="w-7 h-7 text-yellow-500" />,
    title: "Excellence",
    desc: "We hold ourselves to the highest standards in counselling quality, data accuracy, and student outcomes. Best Educational Consultancy 2025 is a recognition we earned.",
  },
  {
    icon: <Heart className="w-7 h-7 text-red-500" />,
    title: "Student-First",
    desc: "Every decision we make starts with one question: Is this best for the student? Your career success and satisfaction are the only metrics we measure ourselves by.",
  },
];

const services = [
  { title: "College Admission Guidance", desc: "End-to-end support for Engineering, Medical, Management, Law, Design admissions", icon: "🏛️" },
  { title: "Scholarship Assistance", desc: "Identifying eligible scholarships, document prep, and application support — ₹100 Cr+ facilitated", icon: "🏆" },
  { title: "Entrance Exam Guidance", desc: "JEE, NEET, CAT, CLAT, GATE — strategy, resources, and mentoring from experts", icon: "📝" },
  { title: "Career Counselling", desc: "Career Compass — our proprietary framework to map your strengths to the right career path", icon: "🧭" },
  { title: "ETP Admissions", desc: "Specialized support for Elite Technical Programs and management fast-track programs", icon: "⚡" },
  { title: "Job-Ready Courses", desc: "Bridging the gap between graduation and employment with industry-aligned skill courses", icon: "💼" },
];

const team = [
  {
    name: "Prakash Chandra",
    role: "Senior Education Leader | Career Counselor | Motivational Speaker",
    desc: "Prakash Chandra is a seasoned education professional with over 18 years of extensive experience in the academic and career guidance sector. He holds an MBA from GNIM, Delhi, and has built a strong reputation for driving student success and institutional growth.",
    expertise: ["Regional Head – Amity University, Noida", "Regional Head – Aakash Institute, Gujarat", "State Head – ICFAI Business School"],
    quote: "He has guided thousands of students toward the right career paths and is known for inspiring students to unlock their potential.",
    initials: "PC",
  },
  {
    name: "Supriya Dubey",
    role: "Commerce Expert | Career Counselor | Education Entrepreneur",
    desc: "Supriya Dubey is a dedicated education professional and commerce expert, known for her strong commitment to student guidance and career development. She is a CMA Finalist and currently pursuing the US CPA.",
    expertise: ["Founder of Sky High Educational Services Pvt. Ltd.", "Expertise in Student Counseling & Career Planning", "Specialist in Organizing Impactful Education Events"],
    quote: "Her mission is to create a platform where students receive the right direction, exposure, and support to achieve their academic and professional goals.",
    initials: "SD",
  },
];

const milestones = [
  { year: "2010", event: "Founded in Bokaro Steel City, Jharkhand with a mission to democratize quality education guidance" },
  { year: "2013", event: "Expanded to 10 centers across Jharkhand, helping 5,000+ students annually" },
  { year: "2016", event: "Reached 20,000 students milestone. Launched scholarship assistance program" },
  { year: "2019", event: "100+ partner college network established. Expanded to neighboring states" },
  { year: "2022", event: "50 centers operational across India. 200+ certified counsellors nationwide" },
  { year: "2025", event: "50,000+ students guided. ₹100 Cr+ scholarships facilitated. Named Best Educational Consultancy 2025" },
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
            {/* Logo mark */}
            <div className="flex justify-center mb-6">
              <svg width="72" height="72" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <polygon points="50,4 96,32 96,36 50,10 4,36 4,32" fill="#93c5fd"/>
                <polygon points="50,10 90,35 90,38 50,16 10,38 10,35" fill="#60a5fa"/>
                <polygon points="50,16 84,38 84,41 50,22 16,41 16,38" fill="#3b82f6"/>
                <path d="M22,44 L22,70 L50,85 L78,70 L78,44 L50,58 Z" fill="none" stroke="#93c5fd" strokeWidth="4" strokeLinejoin="round"/>
                <line x1="50" y1="38" x2="50" y2="58" stroke="#93c5fd" strokeWidth="3"/>
                <line x1="84" y1="41" x2="84" y2="62" stroke="#bfdbfe" strokeWidth="3.5"/>
                <circle cx="84" cy="65" r="4" fill="#bfdbfe"/>
              </svg>
            </div>
            <div className="inline-flex items-center gap-2 bg-white/15 text-white text-sm font-medium px-4 py-2 rounded-full mb-4 border border-white/20">
              <Award className="w-4 h-4 text-yellow-300" /> Best Educational Consultancy 2025
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold text-white mb-4 leading-tight">
              SKYHIGH Educational Services<br />
              <span className="text-blue-200 text-2xl sm:text-3xl font-semibold">Private Limited</span>
            </h1>
            <p className="text-blue-100 text-lg max-w-3xl mx-auto mb-8">
              India's most trusted educational consultancy, empowering students since 2010 to find the right college, career path, and scholarship — with honesty, expertise, and heart.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact" className="bg-white text-blue-700 font-bold px-7 py-3.5 rounded-xl hover:bg-blue-50 transition-colors">
                Talk to a Counsellor
              </Link>
              <Link href="/colleges" className="border border-white/40 text-white font-bold px-7 py-3.5 rounded-xl hover:bg-white/10 transition-colors">
                Explore Colleges
              </Link>
            </div>
          </div>
        </div>

        {/* Impact Stats */}
        <div className="bg-gray-50 py-14 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Our Impact in Numbers</h2>
              <p className="text-gray-500">15 years of transforming student futures across India</p>
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
                  Democratizing Access to<br /><span className="text-blue-600">Quality Education</span>
                </h2>
                <p className="text-gray-600 text-base leading-relaxed mb-5">
                  Founded in 2010 in Bokaro Steel City, SKYHIGH started with a simple belief — every student deserves access to the same quality of college guidance regardless of where they're from or how much money their family has.
                </p>
                <p className="text-gray-600 text-base leading-relaxed mb-6">
                  Today, with 50+ centers, 200+ counsellors, and 50,000+ students guided, we've become India's most trusted name in educational consulting. We've facilitated over ₹100 crores in scholarships, ensuring financial barriers don't stop deserving students.
                </p>
                <div className="space-y-3">
                  {[
                    "Free initial counselling for all students",
                    "Unbiased guidance — we recommend best-fit, not highest-commission",
                    "Pan-India presence with local expertise",
                    "100+ partner colleges across streams",
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
                    To make quality educational guidance accessible to every Indian student — from metros to tier-3 towns.
                  </p>
                </div>
                <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-2xl p-6 text-white">
                  <Globe className="w-8 h-8 mb-3 text-indigo-200" />
                  <h3 className="font-bold text-lg mb-2">Our Vision</h3>
                  <p className="text-indigo-100 text-sm leading-relaxed">
                    A future where no talented student misses their dream college due to lack of guidance or financial constraint.
                  </p>
                </div>
                <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl p-6 text-white col-span-2">
                  <TrendingUp className="w-8 h-8 mb-3 text-green-200" />
                  <h3 className="font-bold text-lg mb-2">2025 Recognition</h3>
                  <p className="text-green-100 text-sm leading-relaxed">
                    Named <strong>"Best Educational Consultancy 2025"</strong> — recognizing 15 years of student-first counselling, scholarship facilitation, and pan-India reach.
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
              <p className="text-gray-500">Comprehensive educational support from Class 12 to career launch</p>
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

        {/* Journey / Timeline */}
        <div className="bg-gray-50 py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Our Journey</h2>
              <p className="text-gray-500">From a single office in Bokaro to a pan-India network</p>
            </div>
            <div className="relative">
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-blue-200" />
              <div className="space-y-8">
                {milestones.map((m, i) => (
                  <div key={m.year} className="flex items-start gap-6 relative">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 z-10 font-bold text-sm ${
                      i === milestones.length - 1 ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "bg-white border-2 border-blue-300 text-blue-600"
                    }`}>
                      {m.year.slice(2)}
                    </div>
                    <div className="flex-1 bg-white rounded-2xl p-5 border border-gray-100 hover:border-blue-200 transition-colors">
                      <p className="text-xs font-bold text-blue-600 mb-1">{m.year}</p>
                      <p className="text-gray-700 text-sm leading-relaxed">{m.event}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Team */}
        <div className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Leadership Team</h2>
              <p className="text-gray-500">Experienced professionals committed to your success</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
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
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Leadership & Expertise</p>
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

        {/* Recognition */}
        <div className="bg-gradient-to-r from-[#1e3a6e] to-blue-700 py-16 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <Award className="w-14 h-14 text-yellow-400 mx-auto mb-5" />
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Best Educational Consultancy 2025</h2>
            <p className="text-blue-100 max-w-2xl mx-auto mb-6 text-base">
              Recognized for 15 years of impact, integrity, and student-first approach. This award reflects the trust of 50,000+ students and their families who chose SKYHIGH to guide their educational journey.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {["50,000+ Students", "50+ Centers", "200+ Counsellors", "₹100 Cr Scholarships"].map((badge) => (
                <span key={badge} className="bg-white/15 text-white text-sm font-semibold px-5 py-2 rounded-full border border-white/25">
                  ✓ {badge}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="py-16 px-4 bg-gray-50">
          <div className="max-w-4xl mx-auto text-center">
            <BookOpen className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">Ready to Start Your Journey?</h2>
            <p className="text-gray-500 mb-7 max-w-xl mx-auto">
              Join 50,000+ students who found their dream college with SKYHIGH. Our counsellors are available 6 days a week.
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
