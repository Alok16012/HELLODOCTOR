"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

const inputClass = "w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

/** Dropdown with checkboxes and a search box for long lists. */
export default function MultiSelect({ label, placeholder, values, selected, onChange }: { label: string; placeholder: string; values: string[]; selected: string[]; onChange: (next: string[]) => void }) {
  const [open, setOpen] = useState(false);
  const [needle, setNeedle] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (event: MouseEvent) => { if (!ref.current?.contains(event.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);
  const shown = values.filter(v => v.toLowerCase().includes(needle.trim().toLowerCase()));
  const toggle = (value: string) => onChange(selected.includes(value) ? selected.filter(v => v !== value) : [...selected, value]);
  const summary = selected.length === 0 ? placeholder : selected.length === 1 ? selected[0] : `${selected.length} selected`;
  return (
    <div ref={ref} className="relative text-sm font-medium text-slate-500">
      <span>{label}</span>
      <button type="button" aria-haspopup="listbox" aria-expanded={open} onClick={() => setOpen(o => !o)} className={`${inputClass} mt-2 flex items-center justify-between gap-2 text-left`}>
        <span className={`truncate ${selected.length ? "text-slate-900" : ""}`}>{summary}</span>
        <ChevronDown size={16} className="shrink-0 text-slate-400" />
      </button>
      {open && (
        <div className="absolute z-30 mt-2 w-full min-w-[240px] rounded-xl border border-slate-200 bg-white shadow-lg">
          {values.length > 8 && <div className="border-b border-slate-100 p-2"><input autoFocus value={needle} onChange={e => setNeedle(e.target.value)} placeholder={`Search ${label.toLowerCase()}…`} className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm text-slate-700 outline-none focus:border-blue-500" /></div>}
          <ul role="listbox" aria-multiselectable className="max-h-64 overflow-y-auto py-1">
            {shown.map(value => {
              const on = selected.includes(value);
              return <li key={value} role="option" aria-selected={on}><button type="button" onClick={() => toggle(value)} className="flex w-full items-center gap-2 px-3 py-2 text-left text-slate-700 hover:bg-blue-50">
                <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${on ? "border-blue-600 bg-blue-600 text-white" : "border-slate-300"}`}>{on && <Check size={12} />}</span>{value}
              </button></li>;
            })}
            {!shown.length && <li className="px-3 py-2 text-slate-400">No matches</li>}
          </ul>
          {selected.length > 0 && <div className="border-t border-slate-100 p-2 text-right"><button type="button" onClick={() => onChange([])} className="text-xs font-semibold text-blue-700 hover:underline">Clear</button></div>}
        </div>
      )}
    </div>
  );
}
