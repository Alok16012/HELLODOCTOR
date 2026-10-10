"use client";
import { useState } from "react";
import { X, Loader2, CheckCircle2, Phone } from "lucide-react";
import { supabase } from "@/lib/supabase";

const courses = ["NEET UG (MBBS / BDS)", "NEET PG (MD / MS)", "MBBS Abroad", "BAMS / BHMS", "Other"];

// Store Indian numbers as 10 digits (matches the rest of the CRM), whatever the user typed.
function normalizeMobile(input: string): string {
  const d = input.replace(/\D/g, "");
  if (d.length === 12 && d.startsWith("91")) return d.slice(2);
  if (d.length === 11 && d.startsWith("0")) return d.slice(1);
  return d;
}

export default function EnquiryModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ name: "", phone: "", course: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const phone = normalizeMobile(form.phone);
  const valid = form.name.trim() !== "" && phone.length === 10 && form.course !== "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) {
      setError("Please enter your name, a 10-digit mobile number and the course.");
      return;
    }
    setError("");
    setLoading(true);
    const { error: dbError } = await supabase.from("enquiries").insert([{
      name: form.name.trim(),
      phone,
      course: form.course,
      message: form.message.trim(),
      source: "Enquiry Now (Website)",
      status: "new",
    }]);
    setLoading(false);
    if (dbError) {
      setError("Something went wrong. Please call us at +91 92116 07005.");
      return;
    }
    setSubmitted(true);
  };

  const field =
    "w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none bg-white";

  return (
    <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-5">
          <div>
            <h2 className="text-xl font-black text-blue-900">Enquiry Now</h2>
            <p className="text-sm text-gray-500 mt-0.5">Free counselling — our expert will call you back</p>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="text-center py-6">
            <CheckCircle2 className="w-14 h-14 text-green-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-900 mb-1">Thank you, {form.name.trim().split(" ")[0]}!</h3>
            <p className="text-sm text-gray-500 mb-5">Our counsellor will call you within 24 hours.</p>
            <button onClick={onClose} className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl">
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Full name *"
              className={field}
            />
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="10-digit mobile number *"
              className={field}
            />
            <select
              value={form.course}
              onChange={(e) => setForm({ ...form, course: e.target.value })}
              className={`${field} ${form.course ? "text-gray-900" : "text-gray-400"}`}
            >
              <option value="">Interested in *</option>
              {courses.map((c) => <option key={c} value={c} className="text-gray-900">{c}</option>)}
            </select>
            <textarea
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="NEET score / rank, preferred state or any question (optional)"
              rows={3}
              className={`${field} resize-none`}
            />
            {error && <p className="text-xs text-rose-600">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-300 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Submit Enquiry
            </button>
            <a href="tel:+919211607005" className="flex items-center justify-center gap-1.5 text-xs text-gray-500 hover:text-blue-600">
              <Phone className="w-3.5 h-3.5" /> Or call us directly: +91 92116 07005
            </a>
          </form>
        )}
      </div>
    </div>
  );
}
