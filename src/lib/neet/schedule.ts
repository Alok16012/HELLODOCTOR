// Counselling schedules transcribed from official MCC notices. Update each season.
import type { Exam } from "./meta";

export interface ScheduleRound {
  round: string;
  steps: { label: string; date: string }[];
  state?: string;
}

export const SCHEDULE: Record<Exam, { title: string; source: string; sourceUrl: string; rounds: ScheduleRound[] }> = {
  ug: {
    title: "NEET UG 2026 — MCC AIQ Counselling Schedule (MBBS, BDS & B.Sc Nursing)",
    source: "MCC: UG AIQ Counselling Schedule 2026, Rounds 2–4 (14.09.2026)",
    sourceUrl: "https://cdnbbsr.s3waas.gov.in/s3e0f7a4d0ef9b84b83b693bbf3feb8e6e/uploads/2026/09/202609151605377053.pdf",
    rounds: [
      {
        round: "Round 1",
        steps: [{ label: "Final allotment result", date: "Published 24 Aug 2026" }],
      },
      {
        round: "Round 2",
        steps: [
          { label: "Seat matrix verification", date: "1–2 Sep 2026" },
          { label: "Registration / payment", date: "3–8 Sep 2026 (till 3 PM)" },
          { label: "Choice filling / locking", date: "3–9 Sep 2026 (till 10 AM); locking from 4 PM, 8 Sep" },
          { label: "Seat allotment processing", date: "9–10 Sep 2026" },
          { label: "Result", date: "11 Sep 2026" },
          { label: "Reporting", date: "12–18 Sep 2026" },
        ],
      },
      {
        round: "Round 3",
        steps: [
          { label: "Seat matrix verification", date: "21 Sep 2026" },
          { label: "Registration / payment", date: "22–27 Sep 2026 (till 3 PM)" },
          { label: "Choice filling / locking", date: "23–28 Sep 2026 (till 12 noon); locking from 7 PM, 27 Sep" },
          { label: "Seat allotment processing", date: "28–29 Sep 2026" },
          { label: "Result", date: "30 Sep 2026" },
          { label: "Reporting", date: "1–9 Oct 2026" },
        ],
      },
      {
        round: "Stray Vacancy Round",
        steps: [
          { label: "Registration / payment", date: "12–14 Oct 2026 (till 3 PM)" },
          { label: "Choice filling / locking", date: "12–15 Oct 2026 (till 10 AM); locking from 4 PM, 14 Oct" },
          { label: "Seat allotment processing", date: "15–16 Oct 2026" },
          { label: "Result", date: "17 Oct 2026" },
          { label: "Reporting", date: "19–26 Oct 2026" },
        ],
      },
    ],
  },
  pg: {
    title: "NEET PG 2026 — MCC & State Counselling Schedule (MD, MS, DNB, Diploma)",
    source: "MCC: AIQ and State Counselling Schedule PG 2026 (08.10.2026)",
    sourceUrl: "https://cdnbbsr.s3waas.gov.in/s3e0f7a4d0ef9b84b83b693bbf3feb8e6e/uploads/2026/10/202610081115756031.pdf",
    rounds: [
      {
        round: "Round 1",
        steps: [
          { label: "AIQ / Deemed / Central counselling", date: "12–24 Oct 2026" },
          { label: "Last date of joining (AIQ)", date: "2 Nov 2026" },
        ],
        state: "State counselling 21 Oct – 2 Nov 2026; last joining 10 Nov 2026",
      },
      {
        round: "Round 2",
        steps: [
          { label: "AIQ / Deemed / Central counselling", date: "6–14 Nov 2026" },
          { label: "Last date of joining (AIQ)", date: "23 Nov 2026" },
        ],
        state: "State counselling 14–23 Nov 2026; last joining 30 Nov 2026",
      },
      {
        round: "Round 3",
        steps: [
          { label: "AIQ / Deemed / Central counselling", date: "26 Nov – 4 Dec 2026" },
          { label: "Last date of joining (AIQ)", date: "12 Dec 2026" },
        ],
        state: "State counselling 4–12 Dec 2026; last joining 18 Dec 2026",
      },
      {
        round: "Stray Vacancy Round",
        steps: [
          { label: "AIQ / Deemed / Central counselling", date: "16–24 Dec 2026" },
          { label: "Last date of joining", date: "31 Dec 2026" },
        ],
        state: "State stray round 22–25 Dec 2026; last joining 31 Dec 2026",
      },
    ],
  },
};

// Official state counselling authorities (state quota). Names only — check each
// authority's notice for dates and eligibility.
export const STATE_AUTHORITIES: Record<string, { ug: string; pg: string }> = {
  "Andhra Pradesh": { ug: "Dr. NTR University of Health Sciences, Vijayawada", pg: "Dr. NTR University of Health Sciences, Vijayawada" },
  "Assam": { ug: "Directorate of Medical Education, Assam", pg: "Directorate of Medical Education, Assam" },
  "Bihar": { ug: "Bihar Combined Entrance Competitive Examination Board (BCECEB)", pg: "Bihar Combined Entrance Competitive Examination Board (BCECEB)" },
  "Chhattisgarh": { ug: "Directorate of Medical Education, Chhattisgarh", pg: "Directorate of Medical Education, Chhattisgarh" },
  "Delhi": { ug: "MCC (Delhi University & IP University 85% quota)", pg: "MCC (Delhi University & IP University quota)" },
  "Goa": { ug: "Directorate of Technical Education, Goa", pg: "Goa Medical College / DTE Goa" },
  "Gujarat": { ug: "Admission Committee for Professional UG Medical Courses (ACPUGMEC)", pg: "Admission Committee for Professional PG Medical Courses (ACPPGMEC)" },
  "Haryana": { ug: "Pt. B.D. Sharma University of Health Sciences, Rohtak", pg: "Pt. B.D. Sharma University of Health Sciences, Rohtak" },
  "Himachal Pradesh": { ug: "Atal Medical & Research University (AMRU)", pg: "Atal Medical & Research University (AMRU)" },
  "Jammu And Kashmir": { ug: "J&K Board of Professional Entrance Examinations (BOPEE)", pg: "J&K Board of Professional Entrance Examinations (BOPEE)" },
  "Jharkhand": { ug: "Jharkhand Combined Entrance Competitive Examination Board (JCECEB)", pg: "Jharkhand Combined Entrance Competitive Examination Board (JCECEB)" },
  "Karnataka": { ug: "Karnataka Examinations Authority (KEA)", pg: "Karnataka Examinations Authority (KEA)" },
  "Kerala": { ug: "Commissioner for Entrance Examinations (CEE), Kerala", pg: "Commissioner for Entrance Examinations (CEE), Kerala" },
  "Madhya Pradesh": { ug: "Directorate of Medical Education, Madhya Pradesh", pg: "Directorate of Medical Education, Madhya Pradesh" },
  "Maharashtra": { ug: "State Common Entrance Test Cell, Maharashtra", pg: "State Common Entrance Test Cell, Maharashtra" },
  "Odisha": { ug: "Odisha JEE / OJEE Committee", pg: "Odisha JEE / OJEE Committee" },
  "Puducherry": { ug: "CENTAC, Puducherry", pg: "CENTAC, Puducherry" },
  "Punjab": { ug: "Baba Farid University of Health Sciences, Faridkot", pg: "Baba Farid University of Health Sciences, Faridkot" },
  "Rajasthan": { ug: "Rajasthan NEET UG Medical & Dental Admission Board", pg: "Rajasthan University of Health Sciences (RUHS), Jaipur" },
  "Tamil Nadu": { ug: "Selection Committee, Directorate of Medical Education, Tamil Nadu", pg: "Selection Committee, Directorate of Medical Education, Tamil Nadu" },
  "Telangana": { ug: "Kaloji Narayana Rao University of Health Sciences (KNRUHS)", pg: "Kaloji Narayana Rao University of Health Sciences (KNRUHS)" },
  "Uttar Pradesh": { ug: "Directorate General of Medical Education & Training (DGME), UP", pg: "Directorate General of Medical Education & Training (DGME), UP" },
  "Uttarakhand": { ug: "Hemwati Nandan Bahuguna Uttarakhand Medical Education University", pg: "Hemwati Nandan Bahuguna Uttarakhand Medical Education University" },
  "West Bengal": { ug: "West Bengal Medical Counselling Committee (WBMCC)", pg: "West Bengal Medical Counselling Committee (WBMCC)" },
};
