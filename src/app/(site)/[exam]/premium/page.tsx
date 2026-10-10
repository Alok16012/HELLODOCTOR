import type { Metadata } from "next";
import { CheckCircle2, Crown, Phone, UserCheck, ListOrdered, FileCheck, CalendarClock, MessageCircle, MapPinned } from "lucide-react";
import { EXAM, examFromSlug, type Exam } from "@/lib/neet/meta";
import PageHeader from "@/components/neet/PageHeader";
import EnquiryButton from "@/components/neet/EnquiryButton";

type Props = { params: Promise<{ exam: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const e = EXAM[examFromSlug((await params).exam) as Exam];
  return {
    title: `${e.label} Premium Counselling — Dedicated Expert Guidance | Hello Doctor`,
    description: `One-to-one ${e.label} counselling with a dedicated senior counsellor: rank analysis, college list, AIQ + state choice filling, documents and reporting support.`,
  };
}

export default async function PremiumPage({ params }: Props) {
  const exam = examFromSlug((await params).exam) as Exam;
  const e = EXAM[exam];
  const features = exam === "ug"
    ? [
        "Dedicated senior counsellor — one point of contact till admission",
        "Rank, category & budget analysis with a personal college list",
        "MCC (AIQ, Deemed, Central) + your home-state counselling plan",
        "Round-by-round choice filling and locking support",
        "Private, deemed & management-quota options with fee comparison",
        "Document checklist, certificate verification and reporting help",
        "Upgrade / resign / free-exit decisions at every round",
        "MBBS abroad backup plan (NMC-compliant universities)",
      ]
    : [
        "Dedicated senior counsellor — one point of contact till joining",
        "Branch vs college strategy built around your rank and goals",
        "MCC (AIQ, Deemed, Central, DNB) + state counselling plan",
        "Round-by-round choice filling with stipend & bond comparison",
        "DNB vs MD/MS guidance and hospital-wise clinical exposure tips",
        "Document checklist, service-bond and fee planning",
        "Upgrade / resign decisions at every round",
        "Support till the stray vacancy round",
      ];
  const steps = [
    { icon: UserCheck, t: "Profile call", d: "Rank, category, domicile, budget and preferences." },
    { icon: ListOrdered, t: "Personal college list", d: "Safe, moderate and dream options across AIQ and state." },
    { icon: CalendarClock, t: "Round-wise filling", d: "We prepare and review your choices before every lock." },
    { icon: FileCheck, t: "Documents & reporting", d: "Checklists and help till you join the college." },
  ];

  return (
    <>
      <PageHeader
        slug={e.slug}
        title={`${e.label} Premium Counselling`}
        subtitle="Hand over the stress — a dedicated Hello Doctor counsellor guides you from rank analysis to final admission."
        crumbs={[{ href: `/${e.slug}/premium`, label: "Premium Counselling" }]}
      />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 grid lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 space-y-8">
          <div>
            <h2 className="text-2xl font-black text-gray-900 mb-4">What you get</h2>
            <ul className="grid sm:grid-cols-2 gap-3">
              {features.map((f) => (
                <li key={f} className="flex gap-2.5 bg-white border border-gray-100 rounded-xl p-3.5 shadow-sm text-sm text-gray-700">
                  <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" /> {f}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-black text-gray-900 mb-4">How it works</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {steps.map(({ icon: Icon, t, d }, i) => (
                <div key={t} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0"><Icon className="w-5 h-5" /></div>
                  <div>
                    <p className="font-bold text-gray-900">{i + 1}. {t}</p>
                    <p className="text-sm text-gray-500">{d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <aside className="lg:col-span-2">
          <div className="bg-gradient-to-br from-blue-700 to-green-700 text-white rounded-3xl p-6 lg:sticky lg:top-40 shadow-xl">
            <Crown className="w-10 h-10 text-yellow-300 mb-3" />
            <h2 className="text-2xl font-black mb-1">Premium {e.label} Plan</h2>
            <p className="text-blue-100 text-sm mb-5">Personalised counselling for the full 2026 season. Fees depend on the services you choose — ask our team for a quote.</p>
            <div className="space-y-2.5">
              <EnquiryButton label="Request a Call Back" className="w-full flex items-center justify-center gap-2 bg-white text-blue-800 font-bold rounded-xl py-3 hover:bg-blue-50" />
              <a href="tel:+919211607005" className="w-full flex items-center justify-center gap-2 border border-white/40 font-bold rounded-xl py-3 hover:bg-white/10">
                <Phone className="w-5 h-5" /> +91 92116 07005
              </a>
              <a href="https://wa.me/919211607005" target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 border border-white/40 font-bold rounded-xl py-3 hover:bg-white/10">
                <MessageCircle className="w-5 h-5" /> WhatsApp us
              </a>
            </div>
            <p className="flex items-center gap-1.5 text-xs text-blue-100 mt-4"><MapPinned className="w-3.5 h-3.5" /> Office in Noida · counselling across India by phone & video</p>
          </div>
        </aside>
      </div>
    </>
  );
}
