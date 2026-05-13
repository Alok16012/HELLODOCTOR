'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { MapPin, Phone, Mail, Clock, MessageSquare, Send } from "lucide-react"

const contactDetails = [
  {
    icon: MapPin,
    title: "Visit Us",
    lines: [
      "Plot C-8, Center Market, Sector 5,",
      "Bokaro Steel City, Jharkhand 827006",
    ],
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: Phone,
    title: "Call Us",
    lines: ["+91 6200513372", "+91 9973234773"],
    color: "bg-green-50 text-green-600",
    links: ["tel:+916200513372", "tel:+919973234773"],
  },
  {
    icon: Mail,
    title: "Email Us",
    lines: ["director@skyhighcareers.com", "skyhighcareerpro@gmail.com"],
    color: "bg-purple-50 text-purple-600",
    links: ["mailto:director@skyhighcareers.com", "mailto:skyhighcareerpro@gmail.com"],
  },
  {
    icon: Clock,
    title: "Office Hours",
    lines: ["Mon – Sat: 9:00 AM – 7:00 PM", "Sun: 10:00 AM – 5:00 PM"],
    color: "bg-orange-50 text-orange-600",
  },
]

const socialLinks = [
  {
    label: "YouTube",
    href: "https://www.youtube.com/channel/UC_7gQBXw0VEpUAEwWVuFovA",
    color: "hover:bg-red-600",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M21.8 8s-.2-1.4-.8-2c-.8-.8-1.6-.8-2-.9C16.2 5 12 5 12 5s-4.2 0-7 .1c-.4.1-1.2.1-2 .9-.6.6-.8 2-.8 2S2 9.6 2 11.2v1.5c0 1.6.2 3.2.2 3.2s.2 1.4.8 2c.8.8 1.8.8 2.3.8C6.8 19 12 19 12 19s4.2 0 7-.2c.4-.1 1.2-.1 2-.9.6-.6.8-2 .8-2s.2-1.6.2-3.2v-1.5C22 9.6 21.8 8 21.8 8zM9.7 14.5V9.4l5.4 2.6-5.4 2.5z" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/skyhigheducational",
    color: "hover:bg-blue-600",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/sky-high-educational-services-private-limited-5730bb243",
    color: "hover:bg-blue-700",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/skyhigheducationalservices",
    color: "hover:bg-pink-600",
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
  },
]

const faqs = [
  {
    q: "What courses do you provide counselling for?",
    a: "We provide expert counselling for Engineering (JEE), Medical (NEET), MBA (CAT/MAT), Law (CLAT), Design (NID/NIFT), B.Sc, B.Com, Agriculture, and many more streams.",
  },
  {
    q: "Is your counselling service free?",
    a: "We offer a free initial consultation. Detailed one-on-one counselling packages are available at nominal charges. Contact us to learn about our current plans.",
  },
  {
    q: "Do you help with scholarship applications?",
    a: "Yes! Our team actively helps students identify, apply, and follow up on central and state government scholarships as well as private scholarships worth crores annually.",
  },
  {
    q: "Can students outside Bokaro avail your services?",
    a: "Absolutely. We serve students across India through phone, WhatsApp, and video counselling. We have partner centres in 50+ cities.",
  },
  {
    q: "How soon can I get an appointment?",
    a: "Walk-in appointments are welcome during office hours. For telephonic/video sessions, call or WhatsApp us and we'll schedule within 24 hours.",
  },
]

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', course: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.phone) {
      setError('Name and phone number are required.')
      return
    }
    setError('')
    setLoading(true)
    try {
      const { error: dbError } = await supabase.from('leads').insert([{
        name: form.name,
        phone: form.phone,
        email: form.email,
        course: form.course,
        message: form.message,
        source: 'Contact Form',
        status: 'new',
      }])
      if (dbError) throw dbError
      setSubmitted(true)
      setForm({ name: '', phone: '', email: '', course: '', message: '' })
    } catch (err: unknown) {
      setError((err as Error).message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="bg-gradient-to-br from-[#0f2454] to-[#1e3a8a] text-white py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 text-blue-200 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
              <MessageSquare className="w-4 h-4" />
              We&apos;re here to help
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-4">
              Get in Touch with<br />
              <span className="text-blue-300">SKYHIGH</span>
            </h1>
            <p className="text-blue-200 text-lg max-w-2xl mx-auto">
              Have questions about college admissions, scholarships, or career counselling?
              Our expert team is ready to guide you every step of the way.
            </p>
          </div>
        </section>

        {/* Contact Cards */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {contactDetails.map((item) => (
                <div key={item.title} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.color}`}>
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                    {item.lines.map((line, i) =>
                      item.links?.[i] ? (
                        <a key={i} href={item.links[i]}
                          className="block text-sm text-gray-600 hover:text-blue-600 transition-colors">
                          {line}
                        </a>
                      ) : (
                        <p key={i} className="text-sm text-gray-600">{line}</p>
                      )
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Map + Form */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Map */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Find Our Office</h2>
              <div className="w-full h-72 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl flex flex-col items-center justify-center border border-blue-100 mb-6">
                <MapPin className="w-10 h-10 text-blue-500 mb-3" />
                <p className="text-gray-700 font-semibold text-center">Plot C-8, Center Market</p>
                <p className="text-gray-500 text-sm text-center">Sector 5, Bokaro Steel City</p>
                <p className="text-gray-500 text-sm text-center">Jharkhand 827006</p>
                <a href="https://maps.google.com/?q=Bokaro+Steel+City+Sector+5+Center+Market"
                  target="_blank" rel="noopener noreferrer"
                  className="mt-4 text-sm text-blue-600 hover:underline font-medium">
                  Open in Google Maps →
                </a>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Follow Us</h3>
              <div className="flex gap-3 flex-wrap">
                {socialLinks.map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                    className={`flex items-center gap-2 bg-gray-100 text-gray-700 hover:text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors ${s.color}`}>
                    {s.svg}
                    {s.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h2>

              {submitted ? (
                <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
                  <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-green-800 mb-2">Message Sent!</h3>
                  <p className="text-green-700 text-sm mb-4">Thank you for reaching out. Our team will contact you within 2 business hours.</p>
                  <button onClick={() => setSubmitted(false)}
                    className="text-sm text-green-700 underline hover:text-green-900">
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name *</label>
                      <input type="text" value={form.name}
                        onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                        placeholder="Your full name" required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number *</label>
                      <input type="tel" value={form.phone}
                        onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                        placeholder="+91 XXXXX XXXXX" required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                    <input type="email" value={form.email}
                      onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                      placeholder="you@example.com"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Interested In</label>
                    <select value={form.course}
                      onChange={e => setForm(p => ({ ...p, course: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition text-gray-700 bg-white">
                      <option value="">Select a stream / service</option>
                      <option>Engineering (JEE)</option>
                      <option>Medical (NEET)</option>
                      <option>MBA (CAT / MAT)</option>
                      <option>Law (CLAT)</option>
                      <option>Design (NID / NIFT)</option>
                      <option>B.Sc / B.Com / Arts</option>
                      <option>Scholarship Guidance</option>
                      <option>Study Abroad</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Message</label>
                    <textarea rows={4} value={form.message}
                      onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                      placeholder="Tell us about your query or goals..."
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition resize-none" />
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">
                      {error}
                    </div>
                  )}

                  <button type="submit" disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-6 rounded-xl transition-colors text-sm">
                    {loading ? (
                      <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Sending...</>
                    ) : (
                      <><Send className="w-4 h-4" /> Send Message</>
                    )}
                  </button>
                  <p className="text-xs text-gray-500 text-center">
                    We typically respond within 2 business hours during office hours.
                  </p>
                </form>
              )}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <details key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm group">
                  <summary className="flex items-center justify-between px-6 py-4 cursor-pointer font-medium text-gray-900 list-none select-none">
                    {faq.q}
                    <span className="ml-4 text-blue-600 text-xl font-light group-open:rotate-45 transition-transform">+</span>
                  </summary>
                  <p className="px-6 pb-5 text-gray-600 text-sm leading-relaxed">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="bg-gradient-to-r from-blue-600 to-blue-700 py-14 px-4 text-white text-center">
          <h2 className="text-3xl font-black mb-3">Ready to Start Your Journey?</h2>
          <p className="text-blue-200 mb-8 max-w-xl mx-auto">
            Book a free counselling call today. Our experts are available 7 days a week to help you find the right college and career path.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="tel:+916200513372"
              className="flex items-center gap-2 bg-white text-blue-700 font-semibold px-7 py-3 rounded-xl hover:bg-blue-50 transition-colors">
              <Phone className="w-4 h-4" />
              Call Now: +91 6200513372
            </a>
            <a href="https://wa.me/916200513372" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-7 py-3 rounded-xl transition-colors">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              WhatsApp Us
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
