"use client";

import { useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { Loader2, Lock, LogIn, ShieldCheck, UserPlus } from "lucide-react";
import type { AccessStatus } from "@/lib/neet/usePredictorAccess";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void; on: (event: string, cb: (...args: unknown[]) => void) => void };
  }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

const inputClass = "w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none";

interface AuthFormProps {
  supabase: SupabaseClient;
}

function AuthForm({ supabase }: AuthFormProps) {
  const [mode, setMode] = useState<"signup" | "login">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setInfo("");
    setLoading(true);
    try {
      if (mode === "signup") {
        const { data, error: authError } = await supabase.auth.signUp({ email, password });
        if (authError) throw authError;
        if (!data.session) setInfo("Account ban gaya! Apna email check karke confirm kar lo, phir yahan login kar dena.");
      } else {
        const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
        if (authError) throw authError;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kuch gadbad ho gayi, dobara try karo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto">
      <div className="flex bg-gray-100 rounded-xl p-1 mb-5">
        {(["signup", "login"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => { setMode(m); setError(""); setInfo(""); }}
            className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${mode === m ? "bg-blue-600 text-white shadow-md" : "text-gray-500 hover:text-gray-700"}`}
          >
            {m === "signup" ? "Account banao" : "Login karo"}
          </button>
        ))}
      </div>
      <form onSubmit={submit} className="space-y-3">
        <input type="email" required placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
        <input type="password" required minLength={6} placeholder="Password (6+ characters)" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} />
        {error && <p className="text-xs text-rose-600">{error}</p>}
        {info && <p className="text-xs text-green-700">{info}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-700 hover:bg-blue-800 disabled:bg-gray-300 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : mode === "signup" ? <UserPlus className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
          {mode === "signup" ? "Account banao" : "Login karo"}
        </button>
      </form>
    </div>
  );
}

interface PaywallProps {
  exam: "ug" | "pg";
  onUnlocked: () => void;
}

function Paywall({ exam, onUnlocked }: PaywallProps) {
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");

  const pay = async () => {
    setPaying(true);
    setError("");
    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded || !window.Razorpay) throw new Error("Payment gateway load nahi hua. Internet check karke try karo.");

      const orderRes = await fetch("/api/predictor/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ exam }),
      });
      const order = await orderRes.json();
      if (!orderRes.ok) throw new Error(order.error || "Payment start nahi ho paya.");

      const razorpay = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        order_id: order.orderId,
        name: "Hello Doctor",
        description: "NEET Predictor — Full Report Unlock",
        theme: { color: "#1d4ed8" },
        handler: async (response: unknown) => {
          try {
            const verifyRes = await fetch("/api/predictor/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(response),
            });
            const result = await verifyRes.json();
            if (!verifyRes.ok || !result.unlocked) throw new Error(result.error || "Payment verify nahi hua.");
            onUnlocked();
          } catch (err) {
            setError(err instanceof Error ? err.message : "Payment verify nahi ho paya.");
          } finally {
            setPaying(false);
          }
        },
        modal: { ondismiss: () => setPaying(false) },
      });
      razorpay.on("payment.failed", () => {
        setError("Payment fail ho gaya. Dobara try karo.");
        setPaying(false);
      });
      razorpay.open();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kuch gadbad ho gayi.");
      setPaying(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto text-center">
      <button
        onClick={pay}
        disabled={paying}
        className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-300 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg"
      >
        {paying ? <Loader2 className="w-5 h-5 animate-spin" /> : <Lock className="w-5 h-5" />}
        {paying ? "Processing…" : "Unlock Full Report"}
      </button>
      {error && <p className="text-xs text-rose-600 mt-2">{error}</p>}
      <p className="text-[11px] text-gray-400 mt-3">Secure payment via Razorpay · UPI, Card, Netbanking</p>
    </div>
  );
}

interface PredictorAccessGateProps {
  status: AccessStatus;
  supabase: SupabaseClient;
  exam: "ug" | "pg";
  onUnlocked: () => void;
  /** Short text summarising what's hidden (e.g. "42 colleges found for your rank"). */
  teaser: string;
}

/** Shown below the result summary while the visitor hasn't unlocked the full report. */
export default function PredictorAccessGate({ status, supabase, exam, onUnlocked, teaser }: PredictorAccessGateProps) {
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center gap-2 py-10 text-gray-400">
        <Loader2 className="w-5 h-5 animate-spin" /> Checking your account…
      </div>
    );
  }

  return (
    <div className="bg-white border-2 border-blue-100 rounded-2xl p-6 md:p-8 mb-6">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 mb-3">
          <Lock className="w-6 h-6 text-blue-700" />
        </div>
        <h3 className="text-lg font-black text-gray-900">{teaser}</h3>
        <p className="text-sm text-gray-500 mt-1">
          {status === "signed-out"
            ? "College names, closing ranks aur fees dekhne ke liye apna account banao, phir ek baar payment karke unlock karo."
            : "Account ban gaya! Ab ek baar payment karke pura report unlock karo."}
        </p>
      </div>
      {status === "signed-out" ? <AuthForm supabase={supabase} /> : <Paywall exam={exam} onUnlocked={onUnlocked} />}
      <p className="text-[11px] text-gray-400 text-center mt-5 flex items-center justify-center gap-1.5">
        <ShieldCheck className="w-3.5 h-3.5" /> Ek baar unlock karne ke baad, aapka account hamesha ke liye unlocked rahega
      </p>
    </div>
  );
}
