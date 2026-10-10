"use client";
import { useEffect, useState } from "react";
import { toCutoff, type Cutoff, type Exam, type PgCollege, type PgRow, type UgCollege, type UgRow } from "./meta";

// Static JSON published under /public/data/neet (built from MCC results).
const cache = new Map<string, Promise<unknown>>();
function load<T>(url: string): Promise<T> {
  if (!cache.has(url)) {
    cache.set(url, fetch(url).then((r) => {
      if (!r.ok) throw new Error(`${url}: ${r.status}`);
      return r.json();
    }).catch((e) => { cache.delete(url); throw e; }));
  }
  return cache.get(url) as Promise<T>;
}

export function useColleges(exam: Exam) {
  const [colleges, setColleges] = useState<(UgCollege | PgCollege)[] | null>(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    let live = true;
    load<(UgCollege | PgCollege)[]>(`/data/neet/${exam}-colleges.json`)
      .then((d) => live && setColleges(d))
      .catch(() => live && setError(true));
    return () => { live = false; };
  }, [exam]);
  return { colleges, error };
}

/** Cut-off rows for the given years (each year is a separate file). */
export function useCutoffs(exam: Exam, years: number[]) {
  const key = `${exam}:${years.join(",")}`;
  // Rows are tagged with the request they belong to, so a year change shows loading again.
  const [state, setState] = useState<{ key: string; rows: Cutoff[] } | null>(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    let live = true;
    const ys = key.split(":")[1].split(",").filter(Boolean);
    Promise.all(ys.map((y) => load<(UgRow | PgRow)[]>(`/data/neet/${exam}-cutoffs-${y}.json`)))
      .then((parts) => live && setState({ key, rows: parts.flat().map((r) => toCutoff(exam, r)) }))
      .catch(() => live && setError(true));
    return () => { live = false; };
  }, [exam, key]);
  return { rows: state?.key === key ? state.rows : null, error };
}
