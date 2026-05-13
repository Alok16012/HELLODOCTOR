export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  author: string;
  authorRole: string;
  authorAvatar: string;
  publishedAt: string;
  readTime: number;
  image: string;
  featured: boolean;
}

export const blogCategories = [
  { name: "All", slug: "all" },
  { name: "Admission Guide", slug: "admission-guide" },
  { name: "Entrance Exams", slug: "entrance-exams" },
  { name: "Rankings", slug: "rankings" },
  { name: "Career Advice", slug: "career-advice" },
  { name: "Scholarships", slug: "scholarships" },
  { name: "Study Abroad", slug: "study-abroad" },
  { name: "College Life", slug: "college-life" },
];

export const blogs: BlogPost[] = [
  {
    id: 1,
    slug: "jee-advanced-2025-complete-guide",
    title: "JEE Advanced 2025: Complete Guide to Crack India's Toughest Exam",
    excerpt: "Everything you need to know about JEE Advanced 2025 — eligibility, syllabus, preparation strategy, and tips from IIT toppers.",
    content: `
## What is JEE Advanced?

JEE Advanced is the gateway to India's 23 Indian Institutes of Technology (IITs). It is one of the most competitive undergraduate entrance exams in the world, with over 2.5 lakh candidates competing for approximately 17,000 seats.

## Eligibility Criteria

To appear for JEE Advanced 2025, candidates must:
- Be among the top 2.5 lakh rank holders in JEE Main 2025
- Have passed Class 12 (or equivalent) with Physics, Chemistry, and Mathematics
- Be born on or after October 1, 2000 (for General/OBC candidates)
- Have attempted JEE Advanced a maximum of 2 times in consecutive years

## Exam Pattern

JEE Advanced consists of two papers:
- **Paper 1**: 3 hours — Physics, Chemistry, Mathematics (54 questions, 183 marks)
- **Paper 2**: 3 hours — Physics, Chemistry, Mathematics (54 questions, 183 marks)

Both papers are mandatory. Question types include Multiple Choice (single/multiple correct), Integer type, and Match-the-column.

## Subject-wise Weightage

### Physics
- Mechanics (23–28%)
- Electromagnetism (18–22%)
- Optics & Modern Physics (18–22%)
- Thermodynamics (10–14%)
- Waves & Sound (8–12%)

### Chemistry
- Physical Chemistry (35–40%)
- Organic Chemistry (30–35%)
- Inorganic Chemistry (25–30%)

### Mathematics
- Calculus (30–35%)
- Algebra (28–32%)
- Coordinate Geometry (15–20%)
- Trigonometry & Vectors (12–16%)

## Preparation Strategy

### 12 Months Before Exam
Focus on building strong fundamentals. NCERT textbooks are your bible for Chemistry and basics of Physics. Solve previous year papers to understand the question pattern.

### 6 Months Before Exam
Move to advanced problem-solving. Books like H.C. Verma (Physics), I.E. Irodov (Physics), Arihant Organic Chemistry, and S.L. Loney (Trigonometry) are highly recommended.

### 3 Months Before Exam
Take full mock tests every week. Analyze your mistakes meticulously. Focus on your weak areas but don't neglect your strong subjects.

### Last Month
Revision time. Create formula sheets, short notes, and solve the last 10 years' JEE Advanced papers.

## Top IITs and Their Cutoffs (2024)

| IIT | CSE Cutoff (General) | EE Cutoff | Mechanical Cutoff |
|-----|---------------------|-----------|------------------|
| IIT Bombay | 67 | 284 | 576 |
| IIT Delhi | 98 | 248 | 532 |
| IIT Madras | 102 | 269 | 541 |
| IIT Kanpur | 153 | 327 | 617 |
| IIT Kharagpur | 178 | 342 | 629 |

## Books Recommended by Toppers

- **Physics**: H.C. Verma (Concepts of Physics Vol 1 & 2), D.C. Pandey, I.E. Irodov
- **Chemistry**: NCERT (must), P. Bahadur (Physical), Morrison Boyd (Organic), J.D. Lee (Inorganic)
- **Mathematics**: R.D. Sharma, Arihant series, S.L. Loney, Hall & Knight

## Common Mistakes to Avoid

1. Ignoring NCERT — JEE Advanced still has NCERT-based questions in Chemistry
2. Attempting all questions — negative marking can reduce your score significantly
3. Not managing time in the exam — practice timed mock tests regularly
4. Focusing only on strong subjects — maintain balance across all three subjects

## Final Words

JEE Advanced demands consistent, smart preparation over 2+ years. There are no shortcuts, but the reward — an IIT seat — is worth every moment of hard work. Stay focused, stay healthy, and keep solving problems.
    `,
    category: "Entrance Exams",
    tags: ["JEE Advanced", "IIT", "Engineering", "Entrance Exam", "2025"],
    author: "Rahul Sharma",
    authorRole: "Education Counsellor, Ex-IIT Delhi",
    authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
    publishedAt: "2025-01-15",
    readTime: 12,
    image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1200&q=80",
    featured: true,
  },
  {
    id: 2,
    slug: "neet-2025-preparation-tips",
    title: "NEET 2025 Preparation: Month-by-Month Study Plan for Medical Aspirants",
    excerpt: "A detailed 12-month roadmap for NEET 2025 covering Biology, Physics, and Chemistry with expert tips to score 650+.",
    content: `
## NEET 2025 Overview

NEET UG (National Eligibility cum Entrance Test) is the single national entrance exam for MBBS and BDS admissions across India. With over 23 lakh students appearing each year for just 1 lakh+ MBBS seats, competition is fierce but achievable with the right strategy.

## Exam Pattern 2025

- **Total Questions**: 200 (180 to be attempted)
- **Total Marks**: 720
- **Duration**: 3 hours 20 minutes
- **Marking Scheme**: +4 for correct, -1 for incorrect

### Subject Distribution
| Subject | Questions | Marks |
|---------|-----------|-------|
| Botany | 50 | 200 |
| Zoology | 50 | 200 |
| Physics | 50 | 200 |
| Chemistry | 50 | 200 |

## 12-Month Study Plan

### Months 1–3: Foundation Building
- Complete NCERT Biology (Class 11 & 12) — this is 80–90% of NEET Biology
- Understand basics of Physics: Mechanics, Thermodynamics, Electrostatics
- Build Organic Chemistry fundamentals: Reactions, named reactions, mechanisms

### Months 4–6: Advanced Concepts
- Solve NCERT Biology line by line — every diagram, every table is important
- Physics: Complete all chapters with numerical practice
- Chemistry: Biomolecules, Polymers, Environmental Chemistry (high-weightage chapters)

### Months 7–9: Mock Tests Begin
- Start taking chapter-wise tests
- Attempt 1 full mock test per week
- Maintain an error log and revise weak areas

### Months 10–12: Intensive Revision
- 2–3 full mock tests per week
- Solve previous 10 years' NEET papers
- Focus on NCERT revision — don't introduce new books at this stage

## Chapter-wise Weightage for Biology

### Botany (High Priority)
- Plant Kingdom (10–12 marks)
- Photosynthesis (8–10 marks)
- Reproduction in Flowering Plants (12–15 marks)
- Genetics and Evolution (18–22 marks)

### Zoology (High Priority)
- Human Physiology (22–25 marks)
- Animal Kingdom (8–10 marks)
- Biotechnology (10–12 marks)

## Scoring 650+ Tips

1. **Biology is King** — It's 360 marks. Score 330+ here for a good rank.
2. **NCERT is Everything** — 90%+ of Biology questions are directly from NCERT. Read every line.
3. **Physics Numericals** — Practice 10–15 numericals daily. Don't leave conceptual questions.
4. **Chemistry Reactions** — Learn all named reactions, organic mechanisms, and exceptions.

## Government Medical Colleges Cutoffs (2024)

| College | General Cutoff |
|---------|---------------|
| AIIMS Delhi | 715+ |
| JIPMER Puducherry | 706+ |
| Maulana Azad Medical College | 687+ |
| GMCH Chandigarh | 668+ |
| BJ Medical College Pune | 651+ |

## Recommended Books

- **Biology**: NCERT (mandatory), Trueman's Biology, MTG Fingertips
- **Physics**: NCERT, DC Pandey, MTG Objective Physics
- **Chemistry**: NCERT, OP Tandon Physical Chemistry, Himanshu Pandey Organic

Keep your health a priority — 8 hours of sleep, regular exercise, and balanced diet will keep your mind sharp for those long study sessions.
    `,
    category: "Entrance Exams",
    tags: ["NEET", "Medical", "MBBS", "Biology", "2025"],
    author: "Dr. Priya Nair",
    authorRole: "Medical Education Expert",
    authorAvatar: "https://images.unsplash.com/photo-1573496799652-408c2ac9fe98?w=100&q=80",
    publishedAt: "2025-01-20",
    readTime: 10,
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&q=80",
    featured: true,
  },
  {
    id: 3,
    slug: "top-mba-colleges-india-2025",
    title: "Top 20 MBA Colleges in India 2025: Fees, Placements & CAT Cutoffs",
    excerpt: "Comprehensive ranking of India's best MBA programs with detailed placement stats, fee structure, and CAT score requirements.",
    content: `
## Why MBA in India?

India's MBA landscape has transformed dramatically. IIMs now rival global business schools, with average packages at IIM Ahmedabad crossing ₹35 LPA. Here's your definitive guide to the top 20 MBA colleges.

## Tier 1 MBA Colleges

### 1. IIM Ahmedabad
- **Fees**: ₹34 lakhs (2 years)
- **Average Package**: ₹35 LPA
- **Highest Package**: ₹1.1 Crore
- **CAT Cutoff**: 99.5+ percentile
- **Batch Size**: 385

### 2. IIM Bangalore
- **Fees**: ₹26 lakhs
- **Average Package**: ₹33 LPA
- **Highest Package**: ₹98 LPA
- **CAT Cutoff**: 99+ percentile

### 3. IIM Calcutta
- **Fees**: ₹27 lakhs
- **Average Package**: ₹31 LPA
- **CAT Cutoff**: 99+ percentile

### 4. IIM Lucknow
- **Fees**: ₹19 lakhs
- **Average Package**: ₹26 LPA
- **CAT Cutoff**: 97+ percentile

### 5. IIM Kozhikode
- **Fees**: ₹21 lakhs
- **Average Package**: ₹24 LPA
- **CAT Cutoff**: 96+ percentile

## Tier 2 MBA Colleges

| Rank | College | Avg Package | CAT Cutoff |
|------|---------|------------|------------|
| 6 | XLRI Jamshedpur | ₹28 LPA | XAT 97%ile |
| 7 | MDI Gurgaon | ₹22 LPA | 97%ile |
| 8 | IIFT Delhi | ₹22 LPA | 98%ile |
| 9 | SPJIMR Mumbai | ₹30 LPA | 97%ile |
| 10 | IIM Indore | ₹22 LPA | 96%ile |

## CAT 2025 Preparation Strategy

### Section-wise Tips

**Verbal Ability & Reading Comprehension (VARC)**
- Read editorials from Hindu, ET, and HBR daily
- Practice RC passages — 4 passages × 6 questions
- Para jumbles and odd-one-out require practice

**Data Interpretation & Logical Reasoning (DILR)**
- Practice 2 sets daily (DI + LR)
- Focus on speed — 40 minutes for 24 questions
- Master: Bar graphs, Pie charts, Seating arrangements, Blood relations

**Quantitative Ability (QA)**
- Arithmetic (40%), Algebra (20%), Geometry (20%), Number System (15%)
- Target 99 percentile requires solving 22/26 correctly

## Beyond IIMs: Emerging MBA Programs

**PGDM vs MBA**
Many top private B-schools offer PGDM (Post Graduate Diploma in Management), which is AICTE-approved and equivalent to MBA. Schools like XLRI, ISB, SPJIMR, and MDI offer PGDM.

**ISB Hyderabad** — India's #1 globally ranked B-school
- 1-year MBA (Post Experience)
- Avg Package: ₹34 LPA
- GMAT/GRE based admission

## ROI Analysis

An MBA from IIM-A at ₹34 lakhs fees with ₹35 LPA placement means you recover the investment in under 1 year. Even Tier-2 schools offering ₹15–20 LPA packages at ₹10–15 lakh fees give solid 3–5 year ROI.

Choose your MBA college based on specialization strength, alumni network, and industry ties — not just brand name.
    `,
    category: "Rankings",
    tags: ["MBA", "CAT", "IIM", "Management", "Placements"],
    author: "Vikash Gupta",
    authorRole: "MBA Admissions Consultant",
    authorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80",
    publishedAt: "2025-02-01",
    readTime: 9,
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=80",
    featured: true,
  },
  {
    id: 4,
    slug: "how-to-choose-right-college",
    title: "How to Choose the Right College: 10 Factors Every Student Must Consider",
    excerpt: "Making the right college decision can shape your entire career. Here's a data-driven framework to evaluate and pick the best college for you.",
    content: `
## The College Choice Dilemma

Every year, millions of Indian students face one of life's most consequential decisions: which college to join. The pressure from family, peers, and society makes it harder. This guide gives you a clear, rational framework.

## The 10 Key Factors

### 1. Accreditation and Recognition
Always verify:
- **NAAC Grade**: A++ and A+ are top-tier. Avoid unaccredited institutions.
- **NIRF Ranking**: India's official ranking system by MHRD
- **NBA Accreditation**: For individual engineering programs
- **AICTE/UGC Approval**: Mandatory for technical and regular programs

### 2. Placement Statistics (Verified)
Don't just look at "100% placement" claims. Ask for:
- Median package (not average — averages are skewed by outliers)
- Percentage of students actually placed
- Names of top recruiters (Are they companies you'd want to work at?)
- Sector-wise placement data

### 3. Faculty Quality
- Ratio of PhD-holding faculty to total faculty
- Faculty publications in peer-reviewed journals
- Industry experience vs purely academic background
- Student-to-faculty ratio (lower is better)

### 4. Infrastructure and Facilities
- Modern labs and equipment (visit in person if possible)
- Library with digital resources
- Sports and extracurricular facilities
- Hostel quality and safety

### 5. Location and City
- Tier-1 cities (Mumbai, Delhi, Bangalore) offer more internship and placement opportunities
- Proximity to industry clusters matters for Engineering, Management, and Design
- Cost of living varies significantly — factor this into your total college cost

### 6. Alumni Network
A strong alumni network means:
- Better referral opportunities
- Mentorship and guidance
- Industry connections for placements

### 7. Research and Innovation Culture
If you're considering higher studies or research:
- Look at funded research projects
- Patent filings and publications
- Startup incubators and funding support

### 8. Fee vs ROI
Calculate your expected return:
- Total investment = Fees + Hostel + Living costs
- Expected first-year package from placements
- Years to break even

A ₹20 lakh MBA giving ₹20 LPA package = 1-year ROI. A ₹40 lakh private engineering degree giving ₹4 LPA = 10+ year ROI. Choose wisely.

### 9. Campus Culture and Diversity
- Student clubs and societies (technical, cultural, social)
- Annual fests and inter-college competitions
- International student presence
- Overall campus vibe — visit on a regular day, not just Open Day

### 10. Safety and Support Systems
- Anti-ragging policies and committees
- Counselling services for mental health
- Women's safety measures (especially for outstation students)
- Grievance redressal mechanisms

## Common Mistakes Students Make

**Choosing Brand Over Fit**: An average student at IIT will struggle more than a top student at a Tier-2 NIT. Find the right fit.

**Ignoring Specialization**: "Computer Science" at IIT Bombay vs "Computer Science" at a local private college are worlds apart in quality.

**Following Friends**: Your friends' right choice may be wrong for you. Align your college choice with your career goals.

**Ignoring Location Costs**: A ₹2L/year college in Mumbai may cost you ₹8L/year total. A ₹3L/year college in your hometown may be cheaper overall.

## Action Plan

1. Shortlist 8–10 colleges based on your entrance exam rank
2. Visit the top 3–4 in person
3. Talk to current students (not just placement officers)
4. Check NIRF rankings and NAAC reports (public documents)
5. Make a decision matrix — score each college on all 10 factors
6. Trust your gut after doing the data work
    `,
    category: "Admission Guide",
    tags: ["College Selection", "Admission", "NAAC", "NIRF", "Rankings"],
    author: "Sneha Agarwal",
    authorRole: "Senior Education Counsellor",
    authorAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&q=80",
    publishedAt: "2025-02-10",
    readTime: 8,
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&q=80",
    featured: false,
  },
  {
    id: 5,
    slug: "cat-2025-syllabus-preparation",
    title: "CAT 2025: Complete Syllabus, Exam Pattern & 6-Month Preparation Plan",
    excerpt: "From zero to 99 percentile — your complete roadmap for CAT 2025 with section-wise strategy and free resources.",
    content: `
## CAT 2025 Quick Facts

- **Conducting Body**: IIM (rotates annually)
- **Mode**: Computer-based test
- **Duration**: 2 hours (40 minutes per section)
- **Total Questions**: 66
- **Total Marks**: 198

## Exam Sections

| Section | Questions | Time | Marks |
|---------|-----------|------|-------|
| VARC | 24 | 40 min | 72 |
| DILR | 20 | 40 min | 60 |
| QA | 22 | 40 min | 66 |

## Section-wise Strategy

### VARC — Verbal Ability & Reading Comprehension

**Reading Comprehension (16 questions)**
- 4 passages of 500–700 words each
- Inference, tone, theme, and detail questions
- Practice: Read 2 quality articles daily (Hindu, Economist, Aeon)

**Verbal Ability (8 questions)**
- Para Jumbles (4 sentences to be rearranged)
- Summary questions
- Odd Sentence Out

**Target**: 18/24 correct for 90+ percentile in VARC

### DILR — Data Interpretation & Logical Reasoning

This is the most dreaded section. It has 4 sets of 5 questions each.

**DI Types**: Tables, Bar graphs, Pie charts, Line graphs, Scatter plots
**LR Types**: Seating arrangements, Grid puzzles, Blood relations, Games/Tournaments

**Strategy**: Attempt 3 sets fully rather than attempting all 4 partially. Accuracy > Attempts.

### QA — Quantitative Ability

**High Weightage Topics**:
- Arithmetic: Percentages, Profit-Loss, Time-Work, Speed-Time (40%)
- Algebra: Equations, Functions, Progressions (20%)
- Geometry: Circles, Triangles, Mensuration (20%)
- Number System: Remainders, Factors, HCF-LCM (15%)
- Modern Math: Permutations, Probability, Set Theory (5%)

## 6-Month Preparation Plan

### Month 1–2: Concept Building
- Complete all QA topics from fundamentals
- Build reading habit for VARC
- Learn DILR techniques (solving frameworks)
- Daily: 2 hours QA + 1 hour reading + 1 hour DILR

### Month 3–4: Practice Mode
- Chapter-wise tests for all topics
- Timed sectional mocks
- Build speed — CAT is as much about time management as knowledge
- Daily: 3 hours focused practice

### Month 5: Mock Tests
- Take 1 full CAT mock per week
- Analyze every mock in detail — 2 hours of analysis per mock
- Identify patterns in your mistakes

### Month 6: Intensive Sprint
- 2 mocks per week
- Last 5 years' actual CAT papers (must-do)
- Revise formulas and shortcuts

## Free Resources

- **Cracku**: Free CAT mocks and study material
- **2IIM**: Free YouTube lectures for QA
- **CATKing**: DILR video solutions
- **Unacademy**: Free VARC sessions

## What After CAT Score?

CAT score leads to applications to 20 IIMs and 1000+ other MBA colleges. Shortlisting process typically includes:
1. Written Ability Test (WAT)
2. Group Discussion (GD)
3. Personal Interview (PI)

Work on your profile: academics, work experience, extracurriculars. A 97 percentile with a weak interview can lose to an 85 percentile with an outstanding PI.
    `,
    category: "Entrance Exams",
    tags: ["CAT", "MBA", "IIM", "Entrance Exam", "Management"],
    author: "Arjun Mehta",
    authorRole: "CAT 99.8 %ile, IIM Bangalore Alumnus",
    authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80",
    publishedAt: "2025-02-18",
    readTime: 11,
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&q=80",
    featured: false,
  },
  {
    id: 6,
    slug: "engineering-vs-bsc-which-is-better",
    title: "B.Tech vs B.Sc: Which Should You Choose After Class 12?",
    excerpt: "A deep comparison of B.Tech and B.Sc programs — scope, salary, duration, and career paths to help you decide.",
    content: `
## The Big Question

After Class 12 with PCM, most students face a fork: B.Tech (engineering) or B.Sc (pure science)? Both are valid but very different paths. Here's an honest comparison.

## Quick Comparison Table

| Parameter | B.Tech | B.Sc |
|-----------|--------|------|
| Duration | 4 years | 3 years |
| Focus | Applied/Practical | Theoretical/Research |
| Fees | ₹1–15L/year | ₹20K–2L/year |
| Average Salary | ₹5–8 LPA (fresher) | ₹3–5 LPA (fresher) |
| Top Entrance | JEE Main/Advanced | CUET |
| Career Paths | Software, Hardware, Manufacturing | Research, Academia, UPSC |

## When to Choose B.Tech

Choose B.Tech if you:
- Want immediate employability after graduation
- Are interested in software development, electronics, or manufacturing
- Don't want to pursue a PhD
- Are comfortable with a more structured, application-oriented curriculum

**Top B.Tech streams in demand (2025)**:
1. Computer Science Engineering (CSE) — ₹8–15 LPA average
2. Artificial Intelligence & ML — ₹10–20 LPA average
3. Electronics & Communication (ECE) — ₹5–8 LPA average
4. Mechanical Engineering — ₹4–6 LPA average

## When to Choose B.Sc

Choose B.Sc if you:
- Have a deep passion for a specific science subject
- Are planning to do M.Sc → Ph.D → Research/Academia
- Want to prepare for UPSC, CSIR NET, or other competitive exams
- Are looking at affordable quality education

**Best B.Sc programs (2025)**:
1. B.Sc Computer Science / IT (crosses over to software industry)
2. B.Sc Physics + M.Sc at IITs (JEST exam pathway)
3. B.Sc Statistics + Data Science skills
4. B.Sc Biotechnology → Biotech/Pharma industry

## The IIT B.Sc Route

Many IITs now offer 4-year B.S. programs (different from B.Sc) that are equivalent in prestige to B.Tech at regular colleges. IISc offers a Research B.S. program that is perhaps the best pure science undergraduate degree in India.

## Hybrid Option: B.Sc → M.Tech

A lesser-known but smart route: B.Sc Physics/Math from a top college (St. Stephen's, Presidency, IISc) → GATE → M.Tech at IIT. This can rival a direct B.Tech path at a much lower total cost.

## Salary Reality Check (2024 Data)

| Program | College Tier | Starting Salary |
|---------|-------------|----------------|
| B.Tech CSE | IIT | ₹20–40 LPA |
| B.Tech CSE | NIT | ₹8–15 LPA |
| B.Tech CSE | Private (Top) | ₹5–8 LPA |
| B.Sc CS | Delhi University | ₹4–8 LPA |
| B.Sc Physics (IISc) | IISc | ₹8–15 LPA (research roles) |

## Final Verdict

There's no universally right answer. The best degree is the one that aligns with your interests, your rank, and your long-term goals. An interested, motivated B.Sc student at a top college will outperform a disinterested B.Tech student at a mediocre college every time.
    `,
    category: "Career Advice",
    tags: ["B.Tech", "B.Sc", "Engineering", "Science", "Career"],
    author: "Kavya Reddy",
    authorRole: "Career Guidance Expert",
    authorAvatar: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=100&q=80",
    publishedAt: "2025-03-05",
    readTime: 7,
    image: "https://images.unsplash.com/photo-1562774053-701939374585?w=1200&q=80",
    featured: false,
  },
  {
    id: 7,
    slug: "scholarship-india-2025-complete-list",
    title: "Top 15 Scholarships for Indian Students 2025: Eligibility & How to Apply",
    excerpt: "From ₹10,000 to full-tuition scholarships — a complete list of government and private scholarships available for Indian students in 2025.",
    content: `
## Why Scholarships Matter

The average annual college fee in India ranges from ₹50,000 to ₹5 lakhs. Scholarships can significantly reduce this burden, and in some cases, cover it entirely. Here are the top scholarships you should apply for.

## Government Scholarships

### 1. Central Sector Scheme of Scholarships (CSSS)
- **Amount**: ₹10,000/year (UG) — ₹20,000/year (PG)
- **Eligibility**: 80th percentile in Class 12, family income < ₹8 LPA
- **How to Apply**: National Scholarship Portal (scholarships.gov.in)

### 2. Post-Matric Scholarship for SC Students
- **Amount**: Full fee reimbursement + maintenance allowance
- **Eligibility**: SC category students, family income < ₹2.5 LPA
- **Apply**: State government portals via NSP

### 3. Prime Minister's Scholarship Scheme (PMSS)
- **Amount**: ₹2,500/month (girls) — ₹2,000/month (boys)
- **Eligibility**: Ward of ex-servicemen/paramilitary personnel, 60%+ in Class 12
- **Apply**: Kendriya Sainik Board portal

### 4. INSPIRE Scholarship (DST)
- **Amount**: ₹80,000/year for 5 years
- **Eligibility**: Top 1% in Class 12, pursuing B.Sc/B.S. in Natural Sciences
- **Apply**: Online at online-inspire.gov.in

## Private and Corporate Scholarships

### 5. Tata Capital Pankh Scholarship
- **Amount**: Up to ₹10,000/year
- **Eligibility**: 10th pass, pursuing diploma/graduation, family income < ₹4 LPA
- **Apply**: Buddy4Study platform

### 6. Reliance Foundation Scholarships
- **Amount**: ₹2–6 lakhs/year
- **Eligibility**: UG/PG students, merit + need based
- **Apply**: reliancefoundation.org/scholarships

### 7. Aditya Birla Scholarship
- **Amount**: ₹65,000/year
- **Eligibility**: CAT 98%ile+, admitted to IIM/XLRI/FMS; JEE Advanced top 10, admitted to IIT
- **Apply**: Through college after admission

### 8. HDFC Bank Educational Crisis Scholarship
- **Amount**: ₹75,000/year
- **Eligibility**: Students facing financial crisis, income < ₹2 LPA
- **Apply**: hdfcbank.com/scholarships

### 9. Sitaram Jindal Foundation Scholarship
- **Amount**: ₹500–2,000/month
- **Eligibility**: Merit + financial need, multiple categories
- **Apply**: sitaramjindalfoundation.org

### 10. Maulana Azad Education Foundation Minority Scholarship
- **Amount**: ₹25,000 for girls
- **Eligibility**: Minority students (Muslim, Christian, Sikh, Buddhist, Jain), Class 11 onwards
- **Apply**: maef.nic.in

## State Government Scholarships

Most states have their own scholarship schemes. Key ones:
- **Maharashtra**: Government of Maharashtra scholarship for OBC/SBC students
- **Karnataka**: Rajiv Gandhi Scholarship for SC students in Private Colleges
- **Rajasthan**: Mukhyamantri Uchch Shiksha Scholarship
- **UP**: UP Scholarship (one of India's largest — covers 2 crore+ students)

## Study Abroad Scholarships

### 11. ICCR Scholarship (for studying at Indian institutions for foreign students, and for Indians going abroad)
### 12. Inlaks Shivdasani Foundation (Masters/PhD abroad — ₹70L+)
### 13. Aga Khan Foundation International Scholarship
### 14. Commonwealth Scholarship (UK)
### 15. DAAD Scholarship (Germany — fully funded for M.Sc/Ph.D)

## How to Avoid Scholarship Scams

1. Only apply through official government/company portals
2. No legitimate scholarship charges an application fee
3. Verify the scholarship on NSP (National Scholarship Portal)
4. Be wary of WhatsApp forwards claiming "guaranteed scholarships"

## Action Plan

Start by visiting **scholarships.gov.in** and register with your Aadhaar. This single portal gives you access to 50+ government scholarships. Apply for all you're eligible for — there's no penalty for applying to multiple.
    `,
    category: "Scholarships",
    tags: ["Scholarships", "Financial Aid", "Government Schemes", "Education Funding"],
    author: "Pooja Iyer",
    authorRole: "Financial Aid Advisor",
    authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80",
    publishedAt: "2025-03-12",
    readTime: 9,
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&q=80",
    featured: false,
  },
  {
    id: 8,
    slug: "law-after-12th-complete-guide",
    title: "Law After 12th: CLAT 2025, Top NLUs, Fees & Career Scope",
    excerpt: "Everything you need to know about pursuing law after Class 12 — CLAT preparation, top National Law Universities, and career paths.",
    content: `
## Law as a Career in 2025

Law is one of India's fastest-growing professional fields. With corporate India booming, judiciary reforms, and expanding LegalTech, a law degree from a top NLU can open doors to careers at top law firms, corporations, and the judiciary.

## CLAT 2025 — The Gateway to NLUs

### Exam Pattern
- **Questions**: 120 MCQs
- **Duration**: 2 hours
- **Sections**: English (20), Current Affairs & GK (25), Legal Reasoning (35), Logical Reasoning (20), Quantitative Techniques (10)
- **Negative Marking**: -0.25 per wrong answer

### CLAT Preparation Tips

**English Language**
- Focus on Reading Comprehension — 3 passages per section
- Para summary questions test higher-order thinking
- Strong vocabulary is a bonus, not a requirement

**Legal Reasoning**
- No law knowledge required — it tests ability to apply given principles
- Practice "passage-based" legal reasoning questions
- Read newspaper legal analysis for exposure

**Current Affairs & GK**
- 12 months of current affairs essential
- Focus on legal current affairs (Supreme Court judgments, new laws)

## Top National Law Universities (NLUs) 2025

| Rank | NLU | Location | Fees (5 yrs) | Avg Placement |
|------|-----|----------|-------------|---------------|
| 1 | NLSIU Bengaluru | Bengaluru | ₹7 lakhs | ₹18–22 LPA |
| 2 | NALSAR Hyderabad | Hyderabad | ₹8 lakhs | ₹16–20 LPA |
| 3 | NLIU Bhopal | Bhopal | ₹8 lakhs | ₹12–16 LPA |
| 4 | WBNUJS Kolkata | Kolkata | ₹5 lakhs | ₹12–15 LPA |
| 5 | NLU Jodhpur | Jodhpur | ₹9 lakhs | ₹10–14 LPA |

## BA LLB vs BBA LLB

**BA LLB (5 years)**
- Humanities focus + Law
- Good for litigation, judiciary, and academic careers

**BBA LLB (5 years)**
- Business + Law
- Ideal for corporate law, law firms, M&A, IP
- Most sought-after by top law firms

**LLB (3 years — after graduation)**
- For those who want to add a law degree after B.Com/B.A./B.Sc
- Good for career switchers

## Career Paths in Law

1. **Corporate Law** — Work with companies on M&A, contracts, compliance (₹15–50 LPA)
2. **Litigation** — Argue cases in courts (takes time, but senior advocates earn ₹5–50 crore/year)
3. **Judiciary** — Appear for Judicial Services Exam (state-level) or UPSC Civil Services
4. **Legal Research & Academia** — Teaching, think-tanks, policy research
5. **LegalTech** — Growing field — companies like Kira Systems, ContractPodAi hire law graduates

## Emerging Specializations

- **Intellectual Property (IP) Law** — India's IP filings growing 25% YoY
- **Cyber Law & Data Privacy** — DPDP Act 2023 creates massive demand
- **International Trade Law** — For those interested in WTO, bilateral trade agreements
- **Environmental Law** — Growing rapidly with climate litigation worldwide
    `,
    category: "Admission Guide",
    tags: ["Law", "CLAT", "NLU", "LLB", "Legal Career"],
    author: "Adv. Rishi Kapoor",
    authorRole: "Legal Education Expert, NLSIU Alumnus",
    authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
    publishedAt: "2025-03-20",
    readTime: 8,
    image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200&q=80",
    featured: false,
  },
  {
    id: 9,
    slug: "nirf-ranking-2024-complete-analysis",
    title: "NIRF Rankings 2024: Complete Analysis — Engineering, Medical, Management & Law",
    excerpt: "A deep dive into NIRF 2024 rankings — who moved up, who dropped, surprises, and what the rankings really mean for students.",
    content: `
## What is NIRF?

The National Institutional Ranking Framework (NIRF) is India's official college ranking system by the Ministry of Education. Rankings are based on five parameters:

1. **Teaching, Learning & Resources (TLR)** — 30%
2. **Research and Professional Practice (RP)** — 30%
3. **Graduation Outcomes (GO)** — 20%
4. **Outreach and Inclusivity (OI)** — 10%
5. **Peer Perception** — 10%

## Engineering Rankings 2024 — Top 20

| Rank | Institute | Score |
|------|-----------|-------|
| 1 | IIT Madras | 91.55 |
| 2 | IIT Delhi | 88.08 |
| 3 | IIT Bombay | 83.96 |
| 4 | IIT Kanpur | 82.56 |
| 5 | IIT Roorkee | 76.38 |
| 6 | IIT Kharagpur | 74.84 |
| 7 | IIT Guwahati | 66.09 |
| 8 | IIT Hyderabad | 62.88 |
| 9 | NIT Trichy | 62.34 |
| 10 | BITS Pilani | 61.27 |

## Medical Rankings 2024

| Rank | Institute |
|------|-----------|
| 1 | AIIMS Delhi |
| 2 | PGI Chandigarh |
| 3 | CMC Vellore |
| 4 | JIPMER Puducherry |
| 5 | Amrita Institute of Medical Sciences |

## Management Rankings 2024

| Rank | Institute |
|------|-----------|
| 1 | IIM Ahmedabad |
| 2 | IIM Bangalore |
| 3 | IIM Calcutta |
| 4 | IIM Kozhikode |
| 5 | IIM Lucknow |

## Law Rankings 2024

| Rank | Institute |
|------|-----------|
| 1 | NLSIU Bengaluru |
| 2 | NLU Delhi |
| 3 | NALSAR Hyderabad |
| 4 | NLIU Bhopal |
| 5 | WBNUJS Kolkata |

## Key Changes in 2024

- **IIT Madras** retained #1 in Engineering for the 9th consecutive year
- **IIM Ahmedabad** reclaimed #1 in Management, surpassing IIM Bangalore
- **BITS Pilani** dropped slightly but remains the top private engineering college
- **VIT Vellore** improved significantly — now in top 15 engineering

## What NIRF Rankings Don't Tell You

1. **Placement quality**: A college can rank high in NIRF but have poor placements
2. **Campus experience**: Rankings don't capture culture, clubs, or campus life
3. **Specialization quality**: A college ranked #20 overall might have the best CSE department
4. **Location advantage**: NIRF doesn't factor in how much the city helps your career

## How to Use NIRF Rankings

Use NIRF as one of five factors in your college decision. Cross-reference with:
- NAAC accreditation grade
- Placement reports (directly from the college)
- Alumni feedback (LinkedIn, Quora)
- Your actual entrance exam rank eligibility
    `,
    category: "Rankings",
    tags: ["NIRF", "Rankings", "IIT", "IIM", "AIIMS", "NLU"],
    author: "Pradeep Joshi",
    authorRole: "Higher Education Analyst",
    authorAvatar: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100&q=80",
    publishedAt: "2025-04-02",
    readTime: 7,
    image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&q=80",
    featured: false,
  },
  {
    id: 10,
    slug: "pharmacy-career-india-2025",
    title: "Pharmacy Career Guide 2025: B.Pharma, D.Pharma, M.Pharma — Scope & Salary",
    excerpt: "Is pharmacy a good career in 2025? Complete guide to pharmacy courses, entrance exams, top colleges, and job opportunities.",
    content: `
## Pharmacy in India — 2025 Outlook

India is the world's largest provider of generic drugs, supplying 20% of global generic medicines. The pharma industry employs 3 million+ people and is growing at 10% annually. Pharmacy as a career has never been more promising.

## Pharmacy Courses After 12th (PCB/PCM)

### D.Pharma (Diploma in Pharmacy)
- **Duration**: 2 years
- **Eligibility**: 12th with PCB/PCM, 50%+
- **Entrance**: State CET or direct admission
- **Fees**: ₹30,000–80,000/year
- **Job**: Community pharmacist, hospital pharmacist

### B.Pharma (Bachelor of Pharmacy)
- **Duration**: 4 years
- **Eligibility**: 12th with PCB, 50%+
- **Entrance**: NEET (for some states), state-level pharmacy CETs
- **Fees**: ₹60,000–2 lakhs/year
- **Job**: Production, QC, QA, Sales, Research

### M.Pharma (Master of Pharmacy)
- **Duration**: 2 years
- **Eligibility**: B.Pharma, GPAT score
- **GPAT**: Graduate Pharmacy Aptitude Test (NTA)
- **Fees**: ₹50,000–3 lakhs/year
- **Job**: Research, Academia, Senior QC/QA

### Pharm.D (Doctor of Pharmacy)
- **Duration**: 6 years (5 + 1 internship)
- **Eligibility**: 12th PCB, 50%
- **Job**: Clinical pharmacy, hospital-based practice

## Top Pharmacy Colleges 2025

1. **Jamia Hamdard University Delhi** — NIRF #1
2. **JSS College of Pharmacy Mysore**
3. **Manipal College of Pharmaceutical Sciences**
4. **BITS Pilani Pharmacy Department**
5. **Panjab University Chandigarh**
6. **ICT Mumbai** (formerly UDCT)
7. **Bombay College of Pharmacy**

## Career Paths in Pharmacy

### Pharmaceutical Industry (Most Popular)
- Production/Manufacturing: ₹3–6 LPA (fresher)
- Quality Control/Assurance: ₹3–5 LPA (fresher)
- Regulatory Affairs: ₹4–8 LPA
- Medical Representative (Sales): ₹3–4 LPA + incentives

### Hospital Pharmacy
- Hospital Pharmacist: ₹3–5 LPA
- Clinical Pharmacist: ₹5–10 LPA
- Pharmacy Manager: ₹6–12 LPA

### Research & Academia
- Research Associate (Pharma companies): ₹4–7 LPA
- PhD + Post-Doc → Faculty (₹8–20 LPA in top colleges)

### Entrepreneurship
- Open a retail pharmacy: Low investment, steady income
- Contract manufacturing

## GPAT 2025 Preparation

The Graduate Pharmacy Aptitude Test is mandatory for M.Pharma admissions and AICTE scholarships.

**Syllabus**: Pharmaceutics, Pharmaceutical Chemistry, Pharmacology, Pharmacognosy

**Strategy**:
1. Complete B.Pharma study material for all 4 subjects
2. Focus on Pharmacology (highest weightage)
3. Solve previous 10 years' GPAT papers

## Salary Growth Trajectory

| Experience | Salary Range |
|-----------|-------------|
| 0–2 years | ₹2.5–5 LPA |
| 3–5 years | ₹5–10 LPA |
| 5–10 years | ₹10–20 LPA |
| 10+ years | ₹20–50 LPA |

Pharmacy in India is a stable, recession-proof career with global opportunities, especially in the USA and UK where Indian pharmacists are in high demand.
    `,
    category: "Career Advice",
    tags: ["Pharmacy", "B.Pharma", "D.Pharma", "GPAT", "Pharmaceutical Industry"],
    author: "Dr. Anita Sharma",
    authorRole: "Pharmaceutical Sciences Professor",
    authorAvatar: "https://images.unsplash.com/photo-1573496799652-408c2ac9fe98?w=100&q=80",
    publishedAt: "2025-04-15",
    readTime: 9,
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=1200&q=80",
    featured: false,
  },
  {
    id: 11,
    slug: "hostel-life-india-tips",
    title: "Hostel Life in India: What to Expect & How to Survive Your First Year",
    excerpt: "From packing your bags to making lifelong friends — a honest guide to hostel life at Indian colleges from students who've been there.",
    content: `
## Your First Day in Hostel

That knot in your stomach as your parents drive away? Completely normal. Millions of students experience it every year. Here's what hostel life actually looks like, and how to make the most of it.

## What to Pack (And What NOT To)

### Must-Haves
- **Bedding**: Bedsheet, pillow cover, light blanket (hostel mattresses are thin!)
- **Lock**: Heavy-duty padlock for your cupboard
- **Power strip**: You'll have 1–2 outlets for 2 people
- **Bucket and mug**: Most hostel bathrooms are bucket-wash style
- **Medicines**: Basic first aid, fever medicine, antacids
- **Documents**: Aadhar, college ID, fee receipts in a physical folder

### Leave At Home
- Your entire wardrobe (you'll wear 20% of clothes 80% of time)
- Expensive electronics (laptop is essential, but not a gaming PC)
- Too many books — buy locally or use the library

## Hostel Room Hacks

- **Coordinate with roommate** before arriving about who brings what (bucket, mirror, etc.)
- **Claim your bed early** — the one near the window gets better airflow
- **Under-bed storage** is your best friend in a small room
- **Cable management** with clips keeps your desk usable

## Mess Food Survival Guide

Hostel mess food is universally disliked — but it keeps you alive. To survive:

1. **Never skip breakfast** — skipping leads to junk food spending
2. **Fruit from local market** — cheapest way to supplement nutrition
3. **Milo/Horlicks** in a flask keeps you going during late-night study
4. **Budget ₹200–300/month** for eating out — keep it a treat, not a habit

## Making Friends

The first 2 weeks are crucial. Everyone is nervous, everyone is looking for friends.

- **Keep your room door open** when you're around
- **Join one club in the first week** — common interest > chance seating
- **Night canteen is social gold** — a 10 PM maggi run bonds people
- **Don't stay home-sick in your room** — push yourself to engage even when you don't feel like it

## Common Problems and Solutions

| Problem | Solution |
|---------|----------|
| Roommate conflict | Set ground rules early (sleep time, guests, cleanliness) |
| Homesickness | Call home daily in the first month, gradually reduce |
| Internet issues | Get a secondary data SIM for emergencies |
| Noisy corridor | Earplugs + study in the library |
| Power cuts | Keep a torch/charged power bank |

## Budget Management

Average monthly hostel expenses (excluding fees):
- Mess: ₹2,000–3,000 (if included in fees, often 0)
- Eating out: ₹500–1,500
- Laundry: ₹200–500
- Transport: ₹200–600
- Stationery & sundries: ₹200–400
- **Total**: ₹3,100–6,000/month

Ask your parents to send ₹5,000/month and spend less — save the rest. You'll thank yourself later.

## The Real Learning Happens Outside Class

College education is 40% classroom and 60% everything else. Use hostel life to:
- Develop independence and self-discipline
- Build a network that will last decades
- Explore interests through clubs, fests, and competitions
- Learn to manage time, money, and relationships

These are skills no textbook teaches — and hostel life is where you learn them.
    `,
    category: "College Life",
    tags: ["Hostel Life", "College Tips", "Student Life", "First Year"],
    author: "Tanvi Singh",
    authorRole: "Content Creator, Ex-NIT Student",
    authorAvatar: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=100&q=80",
    publishedAt: "2025-04-28",
    readTime: 7,
    image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=1200&q=80",
    featured: false,
  },
  {
    id: 12,
    slug: "study-abroad-after-12th-india",
    title: "Study Abroad After 12th: USA, UK, Canada, Germany — Costs, Eligibility & Scholarships",
    excerpt: "A practical guide for Indian students planning to study abroad — from choosing a country to getting scholarships and managing visa.",
    content: `
## Why Study Abroad?

International education offers exposure to global teaching methods, diverse cultures, and stronger alumni networks in global companies. But it comes with a significant cost. Here's everything you need to know.

## Country-wise Overview

### USA
- **Annual Cost**: ₹40–80 lakhs (tuition + living)
- **Top Exams**: SAT/ACT (UG), GRE/GMAT (PG), TOEFL/IELTS
- **Visa**: F-1 Student Visa
- **Strengths**: Best universities globally (MIT, Stanford, Harvard), massive tech industry
- **Post-Study Work**: OPT (1 year), STEM OPT extension (3 years)

### UK
- **Annual Cost**: ₹35–55 lakhs
- **Top Exams**: IELTS (6.5+), A-Levels or equivalent
- **Visa**: Student Visa (Tier 4)
- **Strengths**: Oxford, Cambridge, LSE, UCL; 3-year UG programs
- **Post-Study Work**: Graduate Visa (2 years)

### Canada
- **Annual Cost**: ₹25–45 lakhs
- **Top Exams**: IELTS (6.0+)
- **Visa**: Study Permit
- **Strengths**: Pathway to PR; multicultural; safe
- **Post-Study Work**: PGWP (up to 3 years)

### Germany
- **Annual Cost**: ₹5–15 lakhs (many public universities are FREE!)
- **Top Exams**: TestDaF/DSH (German) or IELTS for English programs
- **Visa**: German Student Visa
- **Strengths**: Free education, strong engineering programs, growing tech industry
- **Post-Study Work**: 18-month job seeker visa

### Australia
- **Annual Cost**: ₹30–50 lakhs
- **Top Exams**: IELTS (6.5+)
- **Strengths**: Safe, multicultural; good for engineering and nursing
- **Post-Study Work**: 2–4 years depending on study location

## Key Scholarships for Indian Students

1. **Fulbright-Nehru Fellowships** (USA) — Fully funded
2. **Commonwealth Scholarship** (UK) — Fully funded
3. **DAAD Scholarship** (Germany) — ₹80,000/month stipend
4. **Chevening Scholarship** (UK) — Fully funded for Master's
5. **Inlaks Foundation** — Up to ₹70 lakhs for 20 students/year
6. **Aga Khan Foundation** — 50% grant, 50% loan
7. **QS Scholarships** — Multiple universities list on QS website

## SAT Preparation (for USA)

The SAT has two sections: Evidence-Based Reading & Writing (800 marks) and Math (800 marks). Total: 1600.

For top US universities:
- **Ivy League / MIT / Stanford**: 1500+
- **Top 50 universities**: 1350+
- **State Universities**: 1150+

Preparation resources: Khan Academy (free, official SAT partner), College Panda, Barron's SAT

## Practical Tips

1. **Apply 12–18 months in advance** — US Common App opens August, deadlines in January
2. **Build your profile early**: Research, projects, community service, leadership roles
3. **Strong SOP and LORs** matter more than pure grades at many colleges
4. **Education loans**: Avail of education loans (SBI Scholar Loan, HDFC Credila) — interest is tax-deductible under Section 80E
5. **Forex cards**: Niyo, HDFC Forex, or a USD account before departure

## Is It Worth the Cost?

For a ₹70 lakh investment (4 years in USA), you'd need a starting salary of ₹1.5 crore/year to recover in under 2 years (at US salary levels, this is achievable in tech). For Germany (near-zero fees), it's almost always worth it. Calculate your expected ROI based on target country and field before committing.
    `,
    category: "Study Abroad",
    tags: ["Study Abroad", "USA", "UK", "Germany", "Scholarship", "International Education"],
    author: "Meera Krishnan",
    authorRole: "International Admissions Consultant",
    authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80",
    publishedAt: "2025-05-05",
    readTime: 10,
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&q=80",
    featured: false,
  },
];
