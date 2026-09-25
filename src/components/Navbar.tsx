"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Phone, TrendingUp, Briefcase, GraduationCap, Handshake, ChevronRight } from "lucide-react";

const navLinks = [
  { label: "Colleges", href: "/colleges" },
  { label: "Streams", href: "/streams" },
  { label: "Blog", href: "/blog" },
  { label: "Scholarship", href: "/scholarship" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const loginOptions = [
  { label: "Office Staff", desc: "Admin, counsellor & team CRM login", href: "/crm/login", icon: Briefcase, color: "bg-blue-50 text-blue-600" },
  { label: "Student", desc: "Admission, fees & documents portal", href: "/crm/student/login", icon: GraduationCap, color: "bg-green-50 text-green-600" },
  { label: "Associate", desc: "Partner portal — leads, students & wallet", href: "/crm/login?as=associate", icon: Handshake, color: "bg-teal-50 text-teal-700" },
];

const statItems = [
  { label: "NEET-Based Admission", value: "100%" },
  { label: "Initial Counselling", value: "Free" },
  { label: "Support Availability", value: "7 Days" },
  { label: "Medical Programs", value: "5" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5">
              <Image
                src="/logo.jpeg"
                alt="Hello Doctor"
                width={60}
                height={60}
                className="object-contain rounded-lg"
                priority
              />
              <div className="flex flex-col leading-none">
                <span className="text-lg font-black text-[#1e3a6e] tracking-wide">Hello Doctor</span>
                <span className="text-[10px] font-semibold text-blue-600 tracking-tight">MBBS Admission Consultancy</span>
              </div>
            </Link>

            {/* Desktop Links */}
            <div className="hidden lg:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-sm text-gray-600 hover:text-blue-600 font-medium transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="hidden lg:flex items-center gap-3">
              <Link
                href="/predictor"
                className="bg-red-600 hover:bg-red-700 text-white font-bold px-5 py-2.5 rounded-lg shadow-md shadow-red-200 transition-colors text-sm flex items-center gap-1.5"
              >
                <TrendingUp className="w-4 h-4" />
                NEET Predictor
              </Link>
              <a
                href="tel:+919211607005"
                className="flex items-center gap-1.5 text-sm text-blue-600 border border-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors font-medium"
              >
                <Phone className="w-4 h-4" />
                <span className="flex flex-col leading-none">
                  <span>Counselling</span>
                  <span className="text-[10px] font-normal text-blue-500">+91 9211607005</span>
                </span>
              </a>
              <button
                type="button"
                onClick={() => setLoginOpen(true)}
                className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Login
              </button>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="bg-blue-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-center gap-6 sm:gap-10 py-2.5 text-white">
              {statItems.map((item) => (
                <div key={item.label} className="text-center">
                  <div className="text-sm sm:text-base font-bold leading-tight">{item.value}</div>
                  <div className="text-[10px] sm:text-xs text-blue-200 leading-tight">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="block text-sm text-gray-700 hover:text-blue-600 font-medium py-2"
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 flex flex-col gap-2">
            <Link
              href="/predictor"
              className="flex items-center justify-center gap-2 text-sm bg-red-600 text-white px-4 py-2.5 rounded-lg font-bold shadow-md"
              onClick={() => setIsOpen(false)}
            >
              <TrendingUp className="w-4 h-4" />
              NEET Predictor
            </Link>
            <a
              href="tel:+919211607005"
              className="flex items-center justify-center gap-2 text-sm text-blue-600 border border-blue-600 px-4 py-2 rounded-lg font-medium"
              onClick={() => setIsOpen(false)}
            >
              <Phone className="w-4 h-4" />
              Counselling · +91 9211607005
            </a>
            <button
              type="button"
              className="text-center text-sm bg-blue-600 text-white px-4 py-2 rounded-lg font-medium"
              onClick={() => { setIsOpen(false); setLoginOpen(true); }}
            >
              Login
            </button>
          </div>
        </div>
      )}

      {/* Login chooser */}
      {loginOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4"
          onClick={() => setLoginOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-5">
              <div>
                <h2 className="text-xl font-black text-[#1e3a6e]">Login</h2>
                <p className="text-sm text-gray-500 mt-0.5">Choose how you want to sign in</p>
              </div>
              <button
                type="button"
                onClick={() => setLoginOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              {loginOptions.map(({ label, desc, href, icon: Icon, color }) => (
                <a
                  key={label}
                  href={href}
                  className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all group"
                >
                  <span className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
                    <Icon className="w-5 h-5" />
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block font-bold text-gray-900">{label}</span>
                    <span className="block text-xs text-gray-500">{desc}</span>
                  </span>
                  <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-blue-600" />
                </a>
              ))}
            </div>
            <Link
              href="/admin/login"
              className="block text-center text-xs text-gray-400 hover:text-blue-600 mt-5"
            >
              Website content admin →
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
