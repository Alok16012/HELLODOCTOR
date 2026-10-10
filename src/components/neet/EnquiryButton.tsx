"use client";
import { useState } from "react";
import { MessageSquare } from "lucide-react";
import EnquiryModal from "@/components/EnquiryModal";

export default function EnquiryButton({ className, label = "Enquiry Now" }: { className?: string; label?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className}>
        <MessageSquare className="w-5 h-5" /> {label}
      </button>
      {open && <EnquiryModal onClose={() => setOpen(false)} />}
    </>
  );
}
