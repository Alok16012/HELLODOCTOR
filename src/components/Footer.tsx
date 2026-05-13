import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

const socialLinks = [
  {
    label: "YouTube",
    href: "https://www.youtube.com/channel/UC_7gQBXw0VEpUAEwWVuFovA",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M21.8 8s-.2-1.4-.8-2c-.8-.8-1.6-.8-2-.9C16.2 5 12 5 12 5s-4.2 0-7 .1c-.4.1-1.2.1-2 .9-.6.6-.8 2-.8 2S2 9.6 2 11.2v1.5c0 1.6.2 3.2.2 3.2s.2 1.4.8 2c.8.8 1.8.8 2.3.8C6.8 19 12 19 12 19s4.2 0 7-.2c.4-.1 1.2-.1 2-.9.6-.6.8-2 .8-2s.2-1.6.2-3.2v-1.5C22 9.6 21.8 8 21.8 8zM9.7 14.5V9.4l5.4 2.6-5.4 2.5z" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/skyhigheducational",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/sky-high-educational-services-private-limited-5730bb243",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/skyhigheducationalservices",
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
  },
];

const streamSlugMap: Record<string, string> = {
  Engineering: "engineering",
  Medical: "medical",
  MBA: "management",
  Law: "law",
  Design: "design",
  Science: "science",
  Commerce: "management",
  Agriculture: "agriculture",
};

const examStreamMap: Record<string, string> = {
  "JEE Main": "/streams/engineering",
  "JEE Advanced": "/streams/engineering",
  "NEET UG": "/streams/medical",
  "CAT": "/streams/management",
  "CLAT": "/streams/law",
  "GATE": "/streams/engineering",
  "CUET": "/colleges",
  "NIFT": "/streams/design",
};

const quickLinkMap: Record<string, string> = {
  "College Predictor": "/colleges",
  "Scholarship": "/scholarship",
  "Compare Colleges": "/colleges",
  "Blog": "/blog",
  "About Us": "/about",
  "Contact Us": "/contact",
};

const footerLinks = {
  Streams: ["Engineering", "Medical", "MBA", "Law", "Design", "Science", "Commerce", "Agriculture"],
  Exams: ["JEE Main", "JEE Advanced", "NEET UG", "CAT", "CLAT", "GATE", "CUET", "NIFT"],
  Quick: ["College Predictor", "Scholarship", "Compare Colleges", "Blog", "About Us", "Contact Us"],
};

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Newsletter */}
      <div className="bg-blue-600 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-white text-xl font-bold mb-1">Get Admission Updates</h3>
            <p className="text-blue-200 text-sm">Never miss a deadline. Subscribe for cutoffs, seat availability & more.</p>
          </div>
          <div className="flex w-full sm:w-auto gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 sm:w-72 px-4 py-2.5 rounded-xl text-gray-800 text-sm outline-none"
            />
            <button className="bg-white text-blue-600 font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-blue-50 transition-colors whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">

          {/* Brand + Contact */}
          <div className="col-span-2">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <Image
                src="/logo_new.jpg"
                alt="SKYHIGH Educational Services"
                width={44}
                height={44}
                className="object-contain rounded-lg"
              />
              <div className="flex flex-col leading-none">
                <span className="text-lg font-black text-white tracking-wide">SKYHIGH</span>
                <span className="text-[10px] font-semibold text-blue-400 tracking-tight">Educational Services Pvt. Ltd.</span>
              </div>
            </Link>

            <p className="text-gray-400 text-sm leading-relaxed mb-5">
              India's most trusted educational consultancy. Guiding students to their dream colleges since 2010 with 50,000+ students counselled across India.
            </p>

            {/* Social Icons */}
            <div className="flex gap-2.5 mb-6">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-8 h-8 bg-gray-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors text-gray-300 hover:text-white"
                >
                  {s.svg}
                </a>
              ))}
            </div>

            {/* Contact Info */}
            <div className="space-y-2.5">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <p className="text-gray-400 text-xs leading-relaxed">
                  Plot C-8, Center Market, Sector 5,<br />
                  Bokaro Steel City, Jharkhand 827006
                </p>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                <div className="text-xs text-gray-400">
                  <a href="tel:+916200513372" className="hover:text-white transition-colors block">+91 6200513372</a>
                  <a href="tel:+919973234773" className="hover:text-white transition-colors block">+91 9973234773</a>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <div className="text-xs text-gray-400">
                  <a href="mailto:director@skyhighcareers.com" className="hover:text-white transition-colors block">director@skyhighcareers.com</a>
                  <a href="mailto:skyhighcareerpro@gmail.com" className="hover:text-white transition-colors block">skyhighcareerpro@gmail.com</a>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-blue-400 shrink-0" />
                <div className="text-xs text-gray-400">
                  <span className="block">Mon–Sat: 9:00 AM – 7:00 PM</span>
                  <span className="block">Sun: 10:00 AM – 5:00 PM</span>
                </div>
              </div>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-white font-semibold text-sm mb-4">{category === "Quick" ? "Quick Links" : category}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => {
                  let href = "/";
                  if (category === "Streams") href = `/streams/${streamSlugMap[link] ?? link.toLowerCase()}`;
                  else if (category === "Exams") href = examStreamMap[link] ?? "/colleges";
                  else if (category === "Quick") href = quickLinkMap[link] ?? "/";
                  return (
                    <li key={link}>
                      <Link href={href} className="text-gray-400 hover:text-white text-sm transition-colors">
                        {link}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-500">
          <p>© 2025 SKYHIGH Educational Services Private Limited. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Use</Link>
            <Link href="/sitemap" className="hover:text-white transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
