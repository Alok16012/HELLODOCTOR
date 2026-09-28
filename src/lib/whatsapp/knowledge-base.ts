import { getBlogs, getColleges, getScholarships } from "@/lib/content";
import { streams } from "@/data/colleges";
import { pgCourses } from "@/data/pg-courses";
import { CATEGORY_FACTOR, PG_BANDS, UG_COLLEGES } from "@/data/neet-predictor";

// The bot's knowledge base is built from the same data the website renders
// (Supabase colleges/blogs/scholarships + static course data), so anything the
// team publishes on the site is automatically known to the WhatsApp assistant.

const STATIC_INFO = `# Hello Doctor — About
Hello Doctor is a Noida-based MBBS admission consultancy (website: hellodoctorindia.com).
We help NEET UG and NEET PG aspirants get admission in medical colleges in India and abroad.
Services: free initial counselling, NEET UG & PG counselling (MCC AIQ + state quota), college shortlisting,
choice filling, documentation, MBBS abroad admission (Russia, Georgia, Uzbekistan, Kyrgyzstan, Nepal),
visa & travel support, BDS/BAMS/BHMS/Nursing admission guidance, scholarship assistance.
Phone / WhatsApp: +91 92116 07005
Email: info@hellodoctorindia.com, admissions@hellodoctorindia.com
Office: Noida, Uttar Pradesh, India
Hours: Mon–Sat 9:00 AM – 7:00 PM, Sun 10:00 AM – 5:00 PM
Free NEET predictor: https://hellodoctorindia.com/predictor`;

// Built once per server instance and refreshed hourly, matching the site's ISR window.
let cache: { text: string; builtAt: number } | null = null;
const TTL_MS = 60 * 60 * 1000;

export async function getKnowledgeBase(): Promise<string> {
  if (cache && Date.now() - cache.builtAt < TTL_MS) return cache.text;

  const [colleges, scholarships, blogs] = await Promise.all([
    getColleges().catch(() => []),
    getScholarships().catch(() => []),
    getBlogs().catch(() => []),
  ]);

  const sections: string[] = [STATIC_INFO];

  sections.push(
    "# UG programs (NEET UG)\n" + streams.map((s) => `- ${s.name}`).join("\n"),
  );

  sections.push(
    "# PG programs (NEET PG / NEET MDS / AIAPGET)\n" +
      pgCourses
        .map((c) => `- ${c.name}: ${c.duration}, exam ${c.exam}. Specialties: ${c.specialties.join(", ")}`)
        .join("\n"),
  );

  if (colleges.length) {
    sections.push(
      "# Colleges listed on our website\n" +
        colleges
          .map(
            (c) =>
              `## ${c.name} (${c.shortName})\n` +
              `Location: ${c.location}. Type: ${c.type}. Established: ${c.established}. Fees: ${c.feesDisplay}.\n` +
              `Programs: ${c.streams.join(", ")}. Courses: ${c.courses.join(", ")}. Exams: ${c.exams.join(", ")}.\n` +
              `Approvals: ${c.approvals.join(", ")}. NIRF: ${c.nirfRank}.\n` +
              `${c.description}\nHighlights: ${c.highlights.join("; ")}\n` +
              `Page: https://hellodoctorindia.com/colleges/${c.slug}`,
          )
          .join("\n\n"),
    );
  }

  sections.push(
    "# Indicative previous-year MCC AIQ MBBS closing ranks (General category)\n" +
      `Category closing ranks are roughly: EWS x${CATEGORY_FACTOR.ews}, OBC x${CATEGORY_FACTOR.obc}, SC x${CATEGORY_FACTOR.sc}, ST x${CATEGORY_FACTOR.st} of General (deemed universities have no reservation).\n` +
      UG_COLLEGES.map((c) => `- ${c.name}, ${c.city} (${c.type}): ~${c.closingRank.toLocaleString("en-IN")}, fee ${c.fee}`).join("\n"),
  );

  sections.push(
    "# Indicative NEET PG rank bands (General AIR)\n" +
      PG_BANDS.map(
        (b) => `- up to ${Number.isFinite(b.maxRank) ? b.maxRank.toLocaleString("en-IN") : "any rank"}: ${b.title}. Branches: ${b.branches}. Where: ${b.where}`,
      ).join("\n"),
  );

  if (scholarships.length) {
    sections.push(
      "# Scholarships\n" +
        scholarships
          .map(
            (s) =>
              `## ${s.name}\nProvider: ${s.provider} (${s.providerType}). Amount: ${s.amountDisplay} (${s.amountType}). ` +
              `Level: ${s.level.join(", ")}. Income limit: ${s.incomeLimitDisplay}. Deadline: ${s.deadline}.\n` +
              `Eligibility: ${s.eligibilityCriteria.join("; ")}\n${s.description}\nApply: ${s.applyUrl}`,
          )
          .join("\n\n"),
    );
  }

  if (blogs.length) {
    sections.push(
      "# Blog articles\n" +
        blogs
          .map((b) => `## ${b.title}\nhttps://hellodoctorindia.com/blog/${b.slug}\n${b.content}`)
          .join("\n\n"),
    );
  }

  const text = sections.join("\n\n");
  cache = { text, builtAt: Date.now() };
  return text;
}
