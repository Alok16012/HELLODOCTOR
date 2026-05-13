"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Phone } from "lucide-react";

const navLinks = [
  { label: "Colleges", href: "/colleges" },
  { label: "Streams", href: "/streams" },
  { label: "Blog", href: "/blog" },
  { label: "Scholarship", href: "/scholarship" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <Image
              src="/logo_new.jpg"
              alt="SKYHIGH Educational Services"
              width={60}
              height={60}
              className="object-contain rounded-lg"
              priority
            />
            <div className="flex flex-col leading-none">
              <span className="text-lg font-black text-[#1e3a6e] tracking-wide">SKYHIGH</span>
              <span className="text-[10px] font-semibold text-blue-600 tracking-tight">Educational Services Pvt. Ltd.</span>
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
              href="/counselling"
              className="flex items-center gap-1.5 text-sm text-blue-600 border border-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors font-medium"
            >
              <Phone className="w-4 h-4" />
              Counselling
            </Link>
            <Link
              href="/admission"
              className="text-sm bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Admission Form
            </Link>
            <Link
              href="/admin/login"
              className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Login
            </Link>
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
              href="/counselling"
              className="text-center text-sm text-blue-600 border border-blue-600 px-4 py-2 rounded-lg font-medium"
              onClick={() => setIsOpen(false)}
            >
              Counselling
            </Link>
            <Link
              href="/admission"
              className="text-center text-sm bg-green-600 text-white px-4 py-2 rounded-lg font-medium"
              onClick={() => setIsOpen(false)}
            >
              Admission Form
            </Link>
            <Link
              href="/admin/login"
              className="text-center text-sm bg-blue-600 text-white px-4 py-2 rounded-lg font-medium"
              onClick={() => setIsOpen(false)}
            >
              Login
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
