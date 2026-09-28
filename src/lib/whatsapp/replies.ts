import type { College } from "@/data/colleges";
import type { Scholarship } from "@/data/scholarships";
import { pgCourses } from "@/data/pg-courses";
import {
  CATEGORIES, MAX_SCORE, UG_QUALIFYING_MARKS, estimateRank, isUgQualified, pgBandFor, pgBranchSummary, predictPgColleges, predictUgColleges, ugAlternatives,
  type Category, type NeetType,
} from "@/data/neet-predictor";

// Rule-based WhatsApp replies (no AI). Every answer comes from the same data the
// website uses: Supabase colleges/scholarships, course lists and predictor cutoffs.

const SITE = "https://hellodoctorindia.com";
const PHONE = "+91 92116 07005";

export interface SiteData {
  colleges: College[];
  scholarships: Scholarship[];
}

export interface BotReply {
  text: string;
  /** Also send the main menu after the text. */
  menu?: boolean;
  /** Pause the bot and alert a counsellor. */
  handoff?: boolean;
}

const MENU: { id: string; label: string }[] = [
  { id: "predictor", label: "NEET College Predictor" },
  { id: "ug", label: "NEET UG Courses (MBBS, BDS, BAMS...)" },
  { id: "pg", label: "NEET PG Courses (MD, MS, DNB...)" },
  { id: "abroad", label: "MBBS Abroad" },
  { id: "colleges", label: "Top Colleges & Fees" },
  { id: "scholarship", label: "Scholarships" },
  { id: "contact", label: "Office & Contact" },
  { id: "counsellor", label: "Talk to Counsellor" },
];

export const MENU_TEXT =
  "Neeche se number reply kariye 👇\n" +
  MENU.map((m, i) => `*${i + 1}.* ${m.label}`).join("\n") +
  "\n\nYa seedha apna sawaal / NEET score likhiye.";

const norm = (s: string) => s.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, " ").replace(/\s+/g, " ").trim();
const hasWord = (text: string, words: string[]) => words.some((w) => new RegExp(`\\b${w}\\b`).test(text));
const fmt = (n: number) => n.toLocaleString("en-IN");

// ── Intents ────────────────────────────────────────────────────────────────

function welcome(name?: string): BotReply {
  return {
    text:
      `Namaste${name ? ` ${name}` : ""}! 👋 *Hello Doctor* mein aapka swagat hai.\n` +
      "Hum NEET UG & NEET PG aspirants ko sahi medical college chunne mein madad karte hain — India aur abroad dono.",
    menu: true,
  };
}

function counsellor(): BotReply {
  return {
    text:
      "Zaroor! 🙌 Hamare counsellor aapko jaldi call karenge.\n" +
      `Urgent ho toh abhi call karein: *${PHONE}*\n` +
      "Free counselling ke liye apna *NEET score/AIR, category aur state* bhej dijiye.",
    handoff: true,
  };
}

function contact(): BotReply {
  return {
    text:
      "*Hello Doctor — MBBS Admission Consultancy*\n" +
      "📍 Noida, Uttar Pradesh\n" +
      `📞 ${PHONE} (Call / WhatsApp)\n` +
      "✉️ info@hellodoctorindia.com\n" +
      "🕘 Mon–Sat 9 AM – 7 PM, Sun 10 AM – 5 PM\n" +
      `🌐 ${SITE}`,
  };
}

function predictorHelp(): BotReply {
  return {
    text:
      "*NEET College Predictor* 🎯\nApna result is format mein bhejiye:\n" +
      "- `UG 560 OBC` (score)\n- `UG AIR 25000 General` (rank)\n- `PG 520 SC`\n" +
      `Ya website pe try karein: ${SITE}/predictor`,
  };
}

function ugInfo(): BotReply {
  return {
    text:
      "*NEET UG Courses* 🎓\n" +
      "- MBBS India (5.5 yrs) — Govt, Private, Deemed\n" +
      "- MBBS Abroad (5.5–6 yrs) — WHO/NMC listed universities\n" +
      "- BDS (5 yrs), BAMS (5.5 yrs), BHMS (5.5 yrs)\n" +
      "- B.Sc Nursing (4 yrs)\n" +
      `Details: ${SITE}/streams?tab=ug\n\nApna score bhejiye (jaise \`UG 560 OBC\`) — hum batayenge kaunse colleges mil sakte hain.`,
  };
}

function pgInfo(): BotReply {
  return {
    text:
      "*NEET PG Courses* 🩺\n" +
      pgCourses.map((c) => `- *${c.name}* (${c.duration}, ${c.exam})`).join("\n") +
      `\nDetails: ${SITE}/streams?tab=pg\n\nApna NEET PG score/AIR bhejiye (jaise \`PG 520 General\`) — branch guidance milegi.`,
  };
}

function abroadInfo(data: SiteData): BotReply {
  const list = data.colleges.filter((c) => c.streams.includes("MBBS Abroad")).slice(0, 6);
  return {
    text:
      "*MBBS Abroad* 🌍\nNEET qualify hona kaafi hai — Russia, Georgia, Uzbekistan, Kyrgyzstan, Nepal mein NMC-compliant universities.\n" +
      (list.length
        ? "\nKuch options:\n" + list.map((c) => `- *${c.shortName || c.name}*, ${c.location} — ${c.feesDisplay}`).join("\n") + "\n"
        : "\n") +
      `Sab universities: ${SITE}/colleges\nBudget aur country bataiye, hum best options shortlist karenge.`,
  };
}

function collegesInfo(data: SiteData): BotReply {
  const top = [...data.colleges].sort((a, b) => a.ranking - b.ranking).slice(0, 6);
  return {
    text:
      "*Top Colleges on Hello Doctor* 🏥\n" +
      (top.length ? top.map((c) => `- *${c.shortName || c.name}* (${c.type}), ${c.city} — ${c.feesDisplay}`).join("\n") + "\n" : "") +
      `Poori list: ${SITE}/colleges\nKisi college ka naam likhiye, uski details bhej denge.`,
  };
}

function scholarshipInfo(data: SiteData): BotReply {
  const list = data.scholarships.slice(0, 5);
  return {
    text:
      "*Medical Scholarships* 🎓\n" +
      (list.length ? list.map((s) => `- *${s.shortName || s.name}* — ${s.amountDisplay} (${s.provider})`).join("\n") + "\n" : "") +
      `Sab scholarships & eligibility: ${SITE}/scholarship`,
  };
}

function feesInfo(): BotReply {
  return {
    text:
      "*MBBS Fees (approx., per year)* 💰\n" +
      "- Government (AIQ/State): ₹5,000 – ₹1.5 L\n" +
      "- Private (State quota): ₹8 L – ₹18 L\n" +
      "- Deemed universities: ₹15 L – ₹30 L\n" +
      "- MBBS Abroad: ₹3 L – ₹6 L (total ₹20–40 L)\n" +
      "College ka naam likhiye, exact fee bhej denge.",
  };
}

// ── Predictor parsing ──────────────────────────────────────────────────────

const CATEGORY_WORDS: [Category, string[]][] = [
  ["ews", ["ews"]],
  ["obc", ["obc", "bc", "ncl"]],
  ["sc", ["sc"]],
  ["st", ["st"]],
  ["general", ["general", "gen", "ur", "open"]],
];

export function parsePrediction(text: string): { type: NeetType; mode: "score" | "rank"; value: number; category: Category } | null {
  const numbers = (text.match(/\d[\d,]*/g) ?? []).map((n) => Number(n.replace(/,/g, ""))).filter((n) => n > 0);
  if (!numbers.length) return null;
  const value = numbers[0];

  const type: NeetType = hasWord(text, ["pg", "md", "ms", "mds"]) ? "pg" : "ug";
  const saysRank = hasWord(text, ["rank", "air", "crl"]);
  const saysScore = hasWord(text, ["score", "marks", "number", "no"]);
  const mode: "score" | "rank" = saysRank ? "rank" : saysScore || value <= MAX_SCORE[type] ? "score" : "rank";
  if (mode === "score" && value > MAX_SCORE[type]) return null;

  const category = CATEGORY_WORDS.find(([, words]) => hasWord(text, words))?.[0] ?? "general";
  return { type, mode, value, category };
}

function prediction(p: NonNullable<ReturnType<typeof parsePrediction>>): BotReply {
  const rank = p.mode === "score" ? estimateRank(p.type, p.value) : p.value;
  const catLabel = CATEGORIES.find((c) => c.value === p.category)?.label ?? "General";
  const head =
    `*NEET ${p.type.toUpperCase()} Prediction* 🎯\n` +
    (p.mode === "score" ? `Score ${p.value}/${MAX_SCORE[p.type]} → Estimated AIR *~${fmt(rank)}*` : `AIR *${fmt(rank)}*`) +
    ` (${catLabel})\n`;
  const foot = `\n_Previous-year cutoffs par based, indicative hai._ Detailed list ke liye counsellor se baat karein ya ${SITE}/predictor dekhein.`;

  if (p.type === "pg") {
    const colleges = predictPgColleges(rank, p.category, true);
    if (!colleges.length) {
      const band = pgBandFor(rank, p.category);
      return { text: head + `\n*${band.title}*\nBranches: ${band.branches}\nKahan: ${band.where}\n` + foot };
    }
    const branches = pgBranchSummary(colleges).slice(0, 8);
    return {
      text:
        head +
        "\n*Branches jo mil sakti hain:*\n" +
        branches.map((b) => `- ${b.degree} ${b.branch} — ${b.chance} (${b.bestCollege}${b.colleges > 1 ? ` +${b.colleges - 1}` : ""})`).join("\n") +
        "\n\n*Colleges & branches:*\n" +
        colleges
          .slice(0, 5)
          .map((c) => `- *${c.name}* (${c.tierLabel}): ${c.branches.slice(0, 3).map((b) => `${b.branch} (${b.chance})`).join(", ")}`)
          .join("\n") +
        "\n" + foot,
    };
  }

  if (!isUgQualified(p.mode, p.value, p.category)) {
    return {
      text:
        head +
        `\nYe result NEET UG qualifying cutoff se neeche lag raha hai (pichhle saal: General/EWS ${UG_QUALIFYING_MARKS.general}, OBC/SC/ST ${UG_QUALIFYING_MARKS.obc} marks).\n` +
        "MBBS/BDS/AYUSH aur MBBS abroad ke liye NEET qualify zaroori hai.\n" +
        "- Agle NEET attempt ki planning\n- B.Sc Nursing / allied health courses (kai states mein bina NEET)\n" +
        "Counsellor se baat karne ke liye *counsellor* likhiye.",
    };
  }

  const matches = predictUgColleges(rank, p.category, true);
  const govt = matches.filter((c) => c.type === "Government" && c.course !== "BDS").slice(0, 5);
  const bds = matches.filter((c) => c.course === "BDS").slice(0, 3);
  const deemed = matches.filter((c) => c.type === "Deemed").slice(0, 3);
  let body = "";
  if (govt.length) body += "\n*Government MBBS (AIQ):*\n" + govt.map((c) => `- ${c.name} — ${c.chance}`).join("\n") + "\n";
  if (bds.length) body += "\n*Government BDS (Dental):*\n" + bds.map((c) => `- ${c.name} — ${c.chance}`).join("\n") + "\n";
  if (deemed.length) body += "\n*Deemed:*\n" + deemed.map((c) => `- ${c.name} (${c.fee}) — ${c.chance}`).join("\n") + "\n";
  if (!govt.length) body += "\n*Aur options:*\n" + ugAlternatives(rank, p.category).map((a) => `- ${a}`).join("\n") + "\n";
  return { text: head + body + foot };
}

// ── College lookup ─────────────────────────────────────────────────────────

const GENERIC = new Set([
  "medical", "college", "colleges", "institute", "university", "government", "govt", "state", "national",
  "sciences", "science", "hospital", "research", "and", "the", "of", "mbbs", "fees", "fee", "admission", "india",
]);

export function findColleges(text: string, colleges: College[]): College[] {
  const words = new Set(text.split(" ").filter((w) => w.length >= 3 && !GENERIC.has(w)));
  if (!words.size) return [];
  const scored = colleges
    .map((c) => {
      const short = norm(c.shortName || "");
      if (short && short.length >= 3 && new RegExp(`\\b${short}\\b`).test(text)) return { c, score: 10 };
      const tokens = norm(`${c.name} ${c.city}`).split(" ").filter((t) => t.length >= 3 && !GENERIC.has(t));
      return { c, score: tokens.filter((t) => words.has(t)).length };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);
  if (!scored.length) return [];
  const best = scored[0].score;
  return scored.filter((x) => x.score === best).slice(0, 3).map((x) => x.c);
}

function collegeDetails(list: College[]): BotReply {
  return {
    text: list
      .map(
        (c) =>
          `🏥 *${c.name}*\n📍 ${c.location} · ${c.type}${c.established ? ` · Est. ${c.established}` : ""}\n` +
          `💰 Fees: ${c.feesDisplay}\n🎓 ${c.streams.join(", ")}\n` +
          (c.highlights.length ? `✅ ${c.highlights.slice(0, 2).join("; ")}\n` : "") +
          `🔗 ${SITE}/colleges/${c.slug}`,
      )
      .join("\n\n") + "\n\nAdmission process ya cutoff jaanna ho toh *counsellor* likhiye.",
  };
}

// ── Router ─────────────────────────────────────────────────────────────────

export function buildReply(rawText: string | null, data: SiteData, profileName?: string): BotReply {
  const choice = rawText?.trim().match(/^([1-8])\.?$/);
  const menuId = choice ? MENU[Number(choice[1]) - 1].id : null;
  switch (menuId) {
    case "predictor": return predictorHelp();
    case "ug": return ugInfo();
    case "pg": return pgInfo();
    case "abroad": return abroadInfo(data);
    case "colleges": return collegesInfo(data);
    case "scholarship": return scholarshipInfo(data);
    case "contact": return contact();
    case "counsellor": return counsellor();
  }

  if (!rawText) {
    return { text: "Abhi hum sirf text messages samajh sakte hain — please apna sawaal type karke bhejiye 🙏", menu: true };
  }
  const text = norm(rawText);

  if (hasWord(text, ["counsellor", "counselor", "counselling", "call", "callback", "human", "agent", "baat", "talk", "sir", "madam", "mam"])) {
    return counsellor();
  }

  const pred = parsePrediction(text);
  if (pred) return prediction(pred);

  if (hasWord(text, ["hi", "hii", "hello", "hey", "helo", "namaste", "namaskar", "menu", "start", "hlo"])) return welcome(profileName);

  const colleges = findColleges(text, data.colleges);
  if (colleges.length) return collegeDetails(colleges);

  if (hasWord(text, ["predict", "predictor", "cutoff", "chance", "chances", "milega", "mil"])) return predictorHelp();
  if (hasWord(text, ["abroad", "russia", "georgia", "uzbekistan", "kyrgyzstan", "nepal", "kazakhstan", "foreign", "videsh", "bahar"])) return abroadInfo(data);
  if (hasWord(text, ["pg", "md", "ms", "mds", "dnb", "diploma", "postgraduate"])) return pgInfo();
  if (hasWord(text, ["scholarship", "scholarships"])) return scholarshipInfo(data);
  if (hasWord(text, ["fee", "fees", "cost", "kitna", "kitni", "budget", "paisa", "kharcha"])) return feesInfo();
  if (hasWord(text, ["address", "office", "location", "kahan", "contact", "number", "phone", "email", "timing"])) return contact();
  if (hasWord(text, ["ug", "mbbs", "bds", "bams", "bhms", "nursing", "course", "courses"])) return ugInfo();
  if (hasWord(text, ["college", "colleges", "list"])) return collegesInfo(data);
  if (hasWord(text, ["thanks", "thank", "thx", "ok", "okay", "dhanyavad", "shukriya"])) {
    return { text: "Aapka swagat hai! 😊 Kuch aur jaanna ho toh *menu* likhiye." };
  }

  return { text: "Maaf kijiye, ye sawaal hum samajh nahi paaye 🙏", menu: true };
}
