-- Hello Doctor — one-time database setup.
-- Supabase Dashboard → SQL Editor → New query → paste this whole file → Run.
-- Safe to run again: it will not duplicate data.

-- ─────────────── Admins ───────────────
-- Only emails listed here can edit content from the admin panel.
create table if not exists admins (
  email text primary key
);
alter table admins enable row level security;

create or replace function is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from admins where email = auth.jwt() ->> 'email');
$$;

-- ─────────────── Colleges ───────────────
create table if not exists colleges (
  id bigserial primary key,
  name text not null,
  short_name text not null default '',
  slug text not null unique,
  location text not null default '',
  city text not null default '',
  state text not null default '',
  fees integer not null default 0,
  fees_display text not null default '',
  rating numeric(2,1) not null default 4.0,
  review_count integer not null default 0,
  streams text[] not null default '{}',
  ranking integer not null default 999,
  nirf_rank text not null default '',
  established integer not null default 2000,
  type text not null default 'Private' check (type in ('Government', 'Private', 'Deemed')),
  accreditation text not null default '',
  image text not null default '',
  description text not null default '',
  highlights text[] not null default '{}',
  exams text[] not null default '{NEET UG}',
  avg_package integer not null default 0,
  highest_package integer not null default 0,
  top_hospitals text[] not null default '{}',
  courses text[] not null default '{}',
  approvals text[] not null default '{}',
  created_at timestamptz not null default now()
);

-- ─────────────── Blogs ───────────────
create table if not exists blogs (
  id bigserial primary key,
  slug text not null unique,
  title text not null,
  excerpt text not null default '',
  content text not null default '',
  category text not null default 'Admission Guide',
  tags text[] not null default '{}',
  author text not null default 'Hello Doctor Team',
  author_role text not null default '',
  author_avatar text not null default '',
  published_at date not null default current_date,
  read_time integer not null default 5,
  image text not null default '',
  featured boolean not null default false,
  created_at timestamptz not null default now()
);

-- ─────────────── Scholarships ───────────────
create table if not exists scholarships (
  id bigserial primary key,
  slug text not null unique,
  name text not null,
  short_name text not null default '',
  provider text not null default '',
  provider_type text not null default 'Government' check (provider_type in ('Government', 'Private', 'International', 'University')),
  amount integer not null default 0,
  amount_display text not null default '',
  amount_type text not null default 'Annual' check (amount_type in ('Annual', 'One-time', 'Monthly', 'Full Tuition')),
  category text not null default '',
  streams text[] not null default '{}',
  level text[] not null default '{}',
  eligibility_criteria text[] not null default '{}',
  income_limit integer,
  income_limit_display text not null default '',
  min_marks integer not null default 0,
  deadline text not null default '',
  application_mode text not null default 'Online' check (application_mode in ('Online', 'Offline', 'Both')),
  apply_url text not null default '',
  description text not null default '',
  benefits text[] not null default '{}',
  documents text[] not null default '{}',
  selection_process text not null default '',
  renewal_criteria text not null default '',
  featured boolean not null default false,
  tags text[] not null default '{}',
  no_of_awards text not null default '',
  established_year integer not null default 2000,
  contact text not null default '',
  created_at timestamptz not null default now()
);

-- ─────────────── Enquiries (contact form) ───────────────
create table if not exists leads (
  id bigserial primary key,
  name text not null,
  phone text not null,
  email text,
  course text,
  city text,
  message text,
  source text,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

-- ─────────────── Row Level Security ───────────────
alter table colleges enable row level security;
alter table blogs enable row level security;
alter table scholarships enable row level security;
alter table leads enable row level security;

-- Content: anyone can read, only admins can write.
do $$
declare t text;
begin
  foreach t in array array['colleges', 'blogs', 'scholarships'] loop
    execute format('drop policy if exists "public read" on %I', t);
    execute format('create policy "public read" on %I for select using (true)', t);
    execute format('drop policy if exists "admin write" on %I', t);
    execute format('create policy "admin write" on %I for all to authenticated using (is_admin()) with check (is_admin())', t);
  end loop;
end $$;

-- Enquiries: anyone can submit, only admins can view / update / delete.
drop policy if exists "public submit" on leads;
create policy "public submit" on leads for insert with check (true);
drop policy if exists "admin manage" on leads;
create policy "admin manage" on leads for all to authenticated using (is_admin()) with check (is_admin());

-- ─────────────── Image uploads ───────────────
insert into storage.buckets (id, name, public) values ('images', 'images', true)
on conflict (id) do nothing;

drop policy if exists "public read images" on storage.objects;
create policy "public read images" on storage.objects for select using (bucket_id = 'images');
drop policy if exists "admin upload images" on storage.objects;
create policy "admin upload images" on storage.objects for insert to authenticated
  with check (bucket_id = 'images' and public.is_admin());
drop policy if exists "admin delete images" on storage.objects;
create policy "admin delete images" on storage.objects for delete to authenticated
  using (bucket_id = 'images' and public.is_admin());


-- Hello Doctor — initial website content. Run after schema.sql.
insert into colleges (id, name, short_name, slug, location, city, state, fees, fees_display, rating, review_count, streams, ranking, nirf_rank, established, type, accreditation, image, description, highlights, exams, avg_package, highest_package, top_hospitals, courses, approvals) values
  (1, 'All India Institute of Medical Sciences, New Delhi', 'AIIMS Delhi', 'aiims-delhi', 'New Delhi, Delhi', 'Delhi', 'Delhi', 6000, '₹6K/yr', 4.9, 3120, array['MBBS India']::text[], 1, '#1 NIRF Medical', 1956, 'Government', 'NMC Approved', 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80', 'AIIMS New Delhi is India''s premier government medical institute and consistently ranks #1 in NIRF''s medical category. Admission is entirely through NEET UG counselling for the all-India quota, with extremely limited seats and very high cutoffs.', array['#1 NIRF Medical (India)', 'Near-nil tuition fees', 'World-class faculty & hospital', 'Extremely competitive NEET cutoff']::text[], array['NEET UG']::text[], 900000, 2500000, array['AIIMS Hospital', 'Safdarjung Hospital', 'RML Hospital']::text[], array['MBBS', 'MD', 'MS']::text[], array['NMC']::text[]),
  (2, 'Maulana Azad Medical College, New Delhi', 'MAMC Delhi', 'maulana-azad-medical-college', 'New Delhi, Delhi', 'Delhi', 'Delhi', 15000, '₹15K/yr', 4.7, 2140, array['MBBS India']::text[], 6, 'Top 10 NIRF Medical', 1958, 'Government', 'NMC Approved', 'https://images.unsplash.com/photo-1580537659466-0a9bfa916a54?w=800&q=80', 'One of Delhi''s oldest and most respected government medical colleges, MAMC is affiliated with Lok Nayak Hospital and known for strong clinical exposure and a large patient base for training.', array['Affiliated to Lok Nayak Hospital', 'Strong clinical training volume', 'Low government fees', 'Delhi NEET counselling seats']::text[], array['NEET UG']::text[], 850000, 2200000, array['Lok Nayak Hospital', 'GB Pant Hospital', 'GTB Hospital']::text[], array['MBBS', 'MD', 'MS']::text[], array['NMC']::text[]),
  (3, 'King George''s Medical University, Lucknow', 'KGMU Lucknow', 'kgmu-lucknow', 'Lucknow, Uttar Pradesh', 'Lucknow', 'Uttar Pradesh', 25000, '₹25K/yr', 4.6, 1980, array['MBBS India']::text[], 11, 'Top 15 NIRF Medical', 1911, 'Government', 'NMC Approved', 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80', 'One of the oldest medical universities in Uttar Pradesh, KGMU offers a wide range of undergraduate and postgraduate medical programs with a large multi-specialty hospital network attached.', array['Among UP''s oldest medical universities', 'Large attached hospital network', 'UP state NEET counselling quota', 'Strong PG programs']::text[], array['NEET UG']::text[], 750000, 2000000, array['KGMU Hospital', 'Trauma Centre Lucknow']::text[], array['MBBS', 'MD', 'MS', 'BDS']::text[], array['NMC']::text[]),
  (4, 'Institute of Medical Sciences, Banaras Hindu University', 'IMS BHU', 'ims-bhu-varanasi', 'Varanasi, Uttar Pradesh', 'Varanasi', 'Uttar Pradesh', 20000, '₹20K/yr', 4.7, 1750, array['MBBS India']::text[], 9, 'Top 10 NIRF Medical', 1960, 'Government', 'NMC Approved', 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=800&q=80', 'IMS BHU is a highly regarded central-university medical institute within Banaras Hindu University, offering MBBS through NEET UG counselling with a strong reputation for research and clinical training.', array['Central university institute', 'Strong research output', 'Sir Sunderlal Hospital attached', 'Beautiful BHU campus']::text[], array['NEET UG']::text[], 800000, 2100000, array['Sir Sunderlal Hospital', 'BHU Trauma Centre']::text[], array['MBBS', 'MD', 'MS']::text[], array['NMC']::text[]),
  (5, 'Government Institute of Medical Sciences, Greater Noida', 'GIMS Greater Noida', 'gims-greater-noida', 'Greater Noida, Uttar Pradesh', 'Greater Noida', 'Uttar Pradesh', 30000, '₹30K/yr', 4.4, 620, array['MBBS India']::text[], 55, 'Listed (Growing)', 2016, 'Government', 'NMC Approved', 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80', 'A newer UP government medical college located in Greater Noida, close to Delhi-NCR. GIMS offers MBBS through UP state NEET counselling at affordable government fees, making it a popular option for local students.', array['Delhi-NCR location', 'Affordable government fees', 'Modern campus & hospital', 'UP state quota counselling']::text[], array['NEET UG']::text[], 650000, 1600000, array['GIMS Hospital', 'Partner NCR Hospitals']::text[], array['MBBS', 'Nursing']::text[], array['NMC']::text[]),
  (6, 'Santosh Medical College & Hospital, Ghaziabad', 'Santosh Medical College', 'santosh-medical-college-ghaziabad', 'Ghaziabad, Uttar Pradesh (near Noida)', 'Ghaziabad', 'Uttar Pradesh', 1400000, '₹14.0L/yr', 4.1, 890, array['MBBS India']::text[], 999, 'Not NIRF Ranked', 1997, 'Private', 'NMC Approved', 'https://images.unsplash.com/photo-1573496799515-eebbb63814f2?w=800&q=80', 'A private medical college near Noida with its own teaching hospital, popular with NCR-based students seeking a management/private quota MBBS seat without relocating far from home.', array['Close to Noida/Delhi-NCR', 'Own attached teaching hospital', 'Management & NRI quota seats', 'Hostel facilities available']::text[], array['NEET UG']::text[], 700000, 1800000, array['Santosh Hospital', 'NCR Private Hospitals']::text[], array['MBBS', 'BDS', 'Nursing']::text[], array['NMC']::text[]),
  (7, 'Sharda School of Medical Sciences & Research, Greater Noida', 'Sharda Medical College', 'sharda-medical-college-greater-noida', 'Greater Noida, Uttar Pradesh', 'Greater Noida', 'Uttar Pradesh', 1600000, '₹16.0L/yr', 4.2, 540, array['MBBS India']::text[], 999, 'Not NIRF Ranked', 2018, 'Private', 'NMC Approved', 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800&q=80', 'Part of Sharda University''s Greater Noida campus, this private medical college offers modern infrastructure and is a convenient option for NCR families exploring management-quota MBBS seats.', array['Modern NCR campus', 'Multi-specialty attached hospital', 'Management & NRI quota seats', 'Popular with NCR-based families']::text[], array['NEET UG']::text[], 680000, 1700000, array['Sharda Hospital', 'NCR Private Hospitals']::text[], array['MBBS', 'BDS', 'Nursing']::text[], array['NMC']::text[]),
  (8, 'Seth GS Medical College & KEM Hospital, Mumbai', 'KEM Mumbai', 'seth-gs-medical-college-kem', 'Mumbai, Maharashtra', 'Mumbai', 'Maharashtra', 20000, '₹20K/yr', 4.8, 2450, array['MBBS India']::text[], 4, 'Top 5 NIRF Medical', 1926, 'Government', 'NMC Approved', 'https://images.unsplash.com/photo-1626315869436-d6781ba69d6e?w=800&q=80', 'One of India''s most respected government medical colleges, affiliated with KEM Hospital — a major public hospital known for high patient volume, research output, and rigorous clinical training.', array['Top 5 NIRF Medical (India)', 'KEM Hospital — high patient volume', 'Strong research culture', 'Maharashtra state quota']::text[], array['NEET UG']::text[], 950000, 2400000, array['KEM Hospital', 'Sion Hospital', 'Cooper Hospital']::text[], array['MBBS', 'MD', 'MS']::text[], array['NMC']::text[]),
  (9, 'Grant Medical College & Sir J.J. Group of Hospitals, Mumbai', 'Grant Medical College (JJ)', 'grant-medical-college-jj', 'Mumbai, Maharashtra', 'Mumbai', 'Maharashtra', 18000, '₹18K/yr', 4.6, 1680, array['MBBS India']::text[], 14, 'Top 20 NIRF Medical', 1845, 'Government', 'NMC Approved', 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80', 'India''s oldest medical college, Grant Medical College is affiliated with the historic Sir J.J. Group of Hospitals in Mumbai and offers MBBS through Maharashtra state NEET counselling.', array['India''s oldest medical college', 'Historic J.J. Hospital campus', 'Low government fees', 'Maharashtra state quota']::text[], array['NEET UG']::text[], 820000, 2000000, array['Sir J.J. Hospital', 'St. George Hospital']::text[], array['MBBS', 'MD', 'MS']::text[], array['NMC']::text[]),
  (10, 'Madras Medical College, Chennai', 'Madras Medical College', 'madras-medical-college', 'Chennai, Tamil Nadu', 'Chennai', 'Tamil Nadu', 15000, '₹15K/yr', 4.7, 2010, array['MBBS India']::text[], 8, 'Top 10 NIRF Medical', 1835, 'Government', 'NMC Approved', 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80', 'One of Asia''s oldest medical colleges, MMC is affiliated with Rajiv Gandhi Government General Hospital, Chennai, and is a top choice for Tamil Nadu state-quota NEET aspirants.', array['Among Asia''s oldest medical colleges', 'Affiliated to RGGGH Chennai', 'Strong Tamil Nadu state quota', 'Very low government fees']::text[], array['NEET UG']::text[], 780000, 1900000, array['RGGGH Chennai', 'Government Hospitals TN']::text[], array['MBBS', 'MD', 'MS']::text[], array['NMC']::text[]),
  (11, 'Christian Medical College, Vellore', 'CMC Vellore', 'cmc-vellore', 'Vellore, Tamil Nadu', 'Vellore', 'Tamil Nadu', 55000, '₹55K/yr', 4.9, 2890, array['MBBS India']::text[], 2, '#2 NIRF Medical', 1900, 'Deemed', 'NMC Approved', 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80', 'CMC Vellore is one of India''s most prestigious deemed medical universities, known for exceptional clinical training, research, and a unique NEET-based merit-and-service-bond admission process.', array['#2 NIRF Medical (India)', 'World-renowned clinical training', 'Unique service-bond admission model', 'Strong global research reputation']::text[], array['NEET UG']::text[], 1000000, 2600000, array['CMC Hospital Vellore']::text[], array['MBBS', 'MD', 'MS', 'Nursing']::text[], array['NMC', 'UGC (Deemed)']::text[]),
  (12, 'Bangalore Medical College and Research Institute', 'BMCRI Bengaluru', 'bmcri-bengaluru', 'Bengaluru, Karnataka', 'Bengaluru', 'Karnataka', 30000, '₹30K/yr', 4.6, 1540, array['MBBS India']::text[], 18, 'Top 25 NIRF Medical', 1955, 'Government', 'NMC Approved', 'https://images.unsplash.com/photo-1580537659466-0a9bfa916a54?w=800&q=80', 'A leading government medical college in Bengaluru, BMCRI is affiliated with Victoria and Vani Vilas hospitals and is a top pick for Karnataka state-quota NEET aspirants.', array['Karnataka''s leading govt. medical college', 'Affiliated to Victoria Hospital', 'Strong state-quota seats', 'Well-established alumni network']::text[], array['NEET UG']::text[], 800000, 2000000, array['Victoria Hospital', 'Vani Vilas Hospital']::text[], array['MBBS', 'MD', 'MS']::text[], array['NMC']::text[]),
  (13, 'Armed Forces Medical College, Pune', 'AFMC Pune', 'afmc-pune', 'Pune, Maharashtra', 'Pune', 'Maharashtra', 10000, '₹10K/yr', 4.8, 1320, array['MBBS India']::text[], 3, 'Top 5 NIRF Medical', 1948, 'Government', 'NMC Approved', 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80', 'AFMC Pune is a premier defence-run medical college offering MBBS with a service bond in the Armed Forces Medical Services, admitted through NEET UG plus a separate selection process.', array['Run by Indian Armed Forces', 'Stipend during training', 'Guaranteed service commission post-MBBS', 'Highly disciplined campus life']::text[], array['NEET UG']::text[], 1100000, 2000000, array['Armed Forces Medical Services', 'Military Hospitals']::text[], array['MBBS', 'MD', 'MS']::text[], array['NMC']::text[]),
  (14, 'Government Medical College, Nagpur', 'GMC Nagpur', 'gmc-nagpur', 'Nagpur, Maharashtra', 'Nagpur', 'Maharashtra', 22000, '₹22K/yr', 4.4, 980, array['MBBS India']::text[], 40, 'Listed NIRF Medical', 1947, 'Government', 'NMC Approved', 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=800&q=80', 'A well-established government medical college in central India offering MBBS through Maharashtra state NEET counselling with a large attached teaching hospital.', array['Central India''s key govt. medical college', 'Large attached teaching hospital', 'Affordable government fees', 'Maharashtra state quota']::text[], array['NEET UG']::text[], 700000, 1700000, array['GMC Hospital Nagpur']::text[], array['MBBS', 'MD', 'MS']::text[], array['NMC']::text[]),
  (15, 'Maulana Azad Institute of Dental Sciences, New Delhi', 'MAIDS Delhi', 'maulana-azad-institute-dental-sciences', 'New Delhi, Delhi', 'Delhi', 'Delhi', 25000, '₹25K/yr', 4.6, 640, array['BDS']::text[], 5, 'Top 5 NIRF Dental', 1968, 'Government', 'NMC (Dental) Approved', 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80', 'One of India''s top government dental colleges, offering BDS through NEET UG counselling with strong clinical exposure attached to Lok Nayak Hospital, Delhi.', array['Top 5 NIRF Dental (India)', 'Attached to Lok Nayak Hospital', 'Low government fees', 'Delhi state quota seats']::text[], array['NEET UG']::text[], 500000, 1200000, array['Lok Nayak Hospital', 'Private Dental Clinics']::text[], array['BDS', 'MDS']::text[], array['NMC (Dental)']::text[]),
  (16, 'Government College of Ayurveda, Lucknow', 'Govt Ayurved College Lucknow', 'govt-ayurved-college-lucknow', 'Lucknow, Uttar Pradesh', 'Lucknow', 'Uttar Pradesh', 20000, '₹20K/yr', 4.3, 380, array['BAMS']::text[], 999, 'Listed', 1921, 'Government', 'NCISM Approved', 'https://images.unsplash.com/photo-1573496799515-eebbb63814f2?w=800&q=80', 'A well-established government ayurvedic medical college offering BAMS through UP state NEET counselling, with a long history of traditional and integrative medicine training.', array['Century-old institution', 'UP state quota seats', 'Affordable government fees', 'Attached Ayurvedic hospital']::text[], array['NEET UG']::text[], 400000, 900000, array['Ayurvedic Hospitals UP']::text[], array['BAMS', 'MD (Ayurveda)']::text[], array['NCISM']::text[]),
  (17, 'National Homoeopathy Research Institute in Mental Health, Kottayam', 'NHRIMH Kottayam', 'nhrimh-kottayam', 'Kottayam, Kerala', 'Kottayam', 'Kerala', 18000, '₹18K/yr', 4.2, 210, array['BHMS']::text[], 999, 'Listed', 1975, 'Government', 'NCH Approved', 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800&q=80', 'A government-run institute offering BHMS with a special research focus on homeopathy in mental health, providing structured clinical training through its attached hospital.', array['Research focus on mental health', 'Government fee structure', 'Attached homeopathic hospital', 'Kerala state quota seats']::text[], array['NEET UG']::text[], 380000, 850000, array['Homeopathic Hospitals Kerala']::text[], array['BHMS', 'MD (Homeopathy)']::text[], array['NCH']::text[]),
  (18, 'Rufaida College of Nursing, Jamia Hamdard, New Delhi', 'Rufaida College of Nursing', 'rufaida-college-of-nursing', 'New Delhi, Delhi', 'Delhi', 'Delhi', 120000, '₹1.2L/yr', 4.3, 310, array['Nursing']::text[], 999, 'Listed', 1996, 'Deemed', 'INC Approved', 'https://images.unsplash.com/photo-1626315869436-d6781ba69d6e?w=800&q=80', 'A well-known nursing college under Jamia Hamdard, offering B.Sc Nursing and GNM with strong clinical training tie-ups in Delhi-NCR hospitals.', array['Part of Jamia Hamdard', 'Strong Delhi-NCR hospital tie-ups', 'B.Sc & GNM programs', 'State/entrance based admission']::text[], array['NEET UG']::text[], 350000, 700000, array['Delhi-NCR Hospitals']::text[], array['B.Sc Nursing', 'GNM', 'Post Basic B.Sc Nursing']::text[], array['INC']::text[]),
  (19, 'Kazan State Medical University, Russia', 'Kazan State Medical University', 'mbbs-russia-kazan-state-medical-university', 'Kazan, Russia', 'Kazan', 'Russia', 380000, '₹3.8L/yr (indicative)', 4.4, 410, array['MBBS Russia', 'MBBS Abroad']::text[], 999, 'Not NIRF Ranked (Abroad)', 1814, 'Government', 'WHO / NMC Screening Eligible', 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80', 'One of Russia''s oldest and most established public medical universities, popular with Indian students for its recognised MBBS (General Medicine) program and lower comparative cost.', array['Historic public state university', 'English-medium MBBS program', 'NMC screening test eligible on return', 'Lower cost vs India private colleges']::text[], array['NEET UG']::text[], 600000, 1500000, array['FMGE / NExT eligible on return to India']::text[], array['MBBS (General Medicine)']::text[], array['NMC Screening Eligible', 'WHO Listed']::text[]),
  (20, 'Kursk State Medical University, Russia', 'Kursk State Medical University', 'mbbs-russia-kursk-state-medical-university', 'Kursk, Russia', 'Kursk', 'Russia', 350000, '₹3.5L/yr (indicative)', 4.3, 380, array['MBBS Russia', 'MBBS Abroad']::text[], 999, 'Not NIRF Ranked (Abroad)', 1935, 'Government', 'WHO / NMC Screening Eligible', 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80', 'A popular choice among Indian NEET-qualified students for MBBS in Russia, known for its dedicated international faculty and structured English-medium curriculum.', array['Large international student community', 'English-medium MBBS program', 'Recognised by WHO Directory', 'Affordable hostel & living cost']::text[], array['NEET UG']::text[], 580000, 1400000, array['FMGE / NExT eligible on return to India']::text[], array['MBBS (General Medicine)']::text[], array['NMC Screening Eligible', 'WHO Listed']::text[]),
  (21, 'Samara State Medical University, Russia', 'Samara State Medical University', 'mbbs-russia-samara-state-medical-university', 'Samara, Russia', 'Samara', 'Russia', 400000, '₹4.0L/yr (indicative)', 4.3, 260, array['MBBS Russia', 'MBBS Abroad']::text[], 999, 'Not NIRF Ranked (Abroad)', 1919, 'Government', 'WHO / NMC Screening Eligible', 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80', 'A well-regarded Russian public medical university offering an English-medium MBBS track with modern simulation labs and a large multi-specialty teaching hospital network.', array['Modern simulation & skills labs', 'Multi-specialty teaching hospitals', 'Direct university admission (no entrance test)', '6-year MBBS program']::text[], array['NEET UG']::text[], 600000, 1500000, array['FMGE / NExT eligible on return to India']::text[], array['MBBS (General Medicine)']::text[], array['NMC Screening Eligible', 'WHO Listed']::text[]),
  (22, 'Tbilisi State Medical University, Georgia', 'Tbilisi State Medical University', 'mbbs-georgia-tbilisi-state-medical-university', 'Tbilisi, Georgia', 'Tbilisi', 'Georgia', 450000, '₹4.5L/yr (indicative)', 4.5, 520, array['MBBS Georgia', 'MBBS Abroad']::text[], 999, 'Not NIRF Ranked (Abroad)', 1918, 'Government', 'WHO / NMC Screening Eligible', 'https://images.unsplash.com/photo-1580537659466-0a9bfa916a54?w=800&q=80', 'Georgia''s oldest and most recognised medical university, popular with Indian students for its European-standard curriculum, direct-entry MBBS program, and growing Indian student community.', array['Georgia''s oldest medical university', 'European-standard curriculum', 'No entrance exam for admission', 'Growing Indian student community']::text[], array['NEET UG']::text[], 650000, 1600000, array['FMGE / NExT eligible on return to India']::text[], array['MBBS (General Medicine)']::text[], array['NMC Screening Eligible', 'WHO Listed']::text[]),
  (23, 'New Vision University, Tbilisi, Georgia', 'New Vision University', 'mbbs-georgia-new-vision-university', 'Tbilisi, Georgia', 'Tbilisi', 'Georgia', 500000, '₹5.0L/yr (indicative)', 4.4, 290, array['MBBS Georgia', 'MBBS Abroad']::text[], 999, 'Not NIRF Ranked (Abroad)', 2011, 'Private', 'WHO / NMC Screening Eligible', 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80', 'A modern private university in Tbilisi offering an English-medium MBBS program with newer infrastructure and a growing international faculty base.', array['Modern campus infrastructure', 'English-medium MBBS program', 'Smaller batch sizes', 'Direct university admission']::text[], array['NEET UG']::text[], 630000, 1550000, array['FMGE / NExT eligible on return to India']::text[], array['MBBS (General Medicine)']::text[], array['NMC Screening Eligible', 'WHO Listed']::text[]),
  (24, 'Tashkent Medical Academy, Uzbekistan', 'Tashkent Medical Academy', 'mbbs-uzbekistan-tashkent-medical-academy', 'Tashkent, Uzbekistan', 'Tashkent', 'Uzbekistan', 350000, '₹3.5L/yr (indicative)', 4.3, 340, array['MBBS Uzbekistan', 'MBBS Abroad']::text[], 999, 'Not NIRF Ranked (Abroad)', 1919, 'Government', 'WHO / NMC Screening Eligible', 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=800&q=80', 'One of Uzbekistan''s leading public medical universities, offering an affordable English-medium MBBS program that is a popular choice among budget-conscious NEET-qualified students.', array['Among Uzbekistan''s oldest medical universities', 'Affordable tuition & living cost', 'English-medium MBBS program', 'Direct university admission']::text[], array['NEET UG']::text[], 560000, 1400000, array['FMGE / NExT eligible on return to India']::text[], array['MBBS (General Medicine)']::text[], array['NMC Screening Eligible', 'WHO Listed']::text[]),
  (25, 'Samarkand State Medical University, Uzbekistan', 'Samarkand State Medical University', 'mbbs-uzbekistan-samarkand-state-medical-university', 'Samarkand, Uzbekistan', 'Samarkand', 'Uzbekistan', 330000, '₹3.3L/yr (indicative)', 4.2, 250, array['MBBS Uzbekistan', 'MBBS Abroad']::text[], 999, 'Not NIRF Ranked (Abroad)', 1930, 'Government', 'WHO / NMC Screening Eligible', 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80', 'A long-established public medical university in historic Samarkand, offering an English-medium MBBS track and a relatively lower cost of living for international students.', array['Historic public medical university', 'Low overall program cost', 'English-medium MBBS program', 'Growing Indian student batch']::text[], array['NEET UG']::text[], 550000, 1350000, array['FMGE / NExT eligible on return to India']::text[], array['MBBS (General Medicine)']::text[], array['NMC Screening Eligible', 'WHO Listed']::text[]),
  (26, 'Osh State Medical University, Kyrgyzstan', 'Osh State Medical University', 'mbbs-kyrgyzstan-osh-state-medical-university', 'Osh, Kyrgyzstan', 'Osh', 'Kyrgyzstan', 320000, '₹3.2L/yr (indicative)', 4.2, 300, array['MBBS Kyrgyzstan', 'MBBS Abroad']::text[], 999, 'Not NIRF Ranked (Abroad)', 1993, 'Government', 'WHO / NMC Screening Eligible', 'https://images.unsplash.com/photo-1573496799515-eebbb63814f2?w=800&q=80', 'A well-known public medical university in Kyrgyzstan, popular for its low overall MBBS cost and dedicated international faculty for English-medium teaching.', array['One of the most affordable MBBS-abroad options', 'English-medium MBBS program', 'Large Indian student community', 'Direct university admission']::text[], array['NEET UG']::text[], 540000, 1300000, array['FMGE / NExT eligible on return to India']::text[], array['MBBS (General Medicine)']::text[], array['NMC Screening Eligible', 'WHO Listed']::text[]),
  (27, 'Jalalabad State Medical University, Kyrgyzstan', 'Jalalabad State Medical University', 'mbbs-kyrgyzstan-jalalabad-state-medical-university', 'Jalalabad, Kyrgyzstan', 'Jalalabad', 'Kyrgyzstan', 300000, '₹3.0L/yr (indicative)', 4.1, 190, array['MBBS Kyrgyzstan', 'MBBS Abroad']::text[], 999, 'Not NIRF Ranked (Abroad)', 1996, 'Government', 'WHO / NMC Screening Eligible', 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800&q=80', 'A budget-friendly public medical university option in Kyrgyzstan for NEET-qualified students, with a straightforward direct-admission process and English-medium coursework.', array['Among the lowest total MBBS cost options', 'English-medium coursework', 'Simple direct-admission process', 'Compact, manageable campus']::text[], array['NEET UG']::text[], 520000, 1250000, array['FMGE / NExT eligible on return to India']::text[], array['MBBS (General Medicine)']::text[], array['NMC Screening Eligible', 'WHO Listed']::text[]),
  (28, 'Kathmandu University School of Medical Sciences, Nepal', 'KUSMS Nepal', 'mbbs-nepal-kathmandu-university', 'Dhulikhel, Nepal', 'Dhulikhel', 'Nepal', 600000, '₹6.0L/yr (indicative)', 4.4, 220, array['MBBS Nepal', 'MBBS Abroad']::text[], 999, 'Not NIRF Ranked (Abroad)', 1994, 'Deemed', 'WHO / NMC Screening Eligible', 'https://images.unsplash.com/photo-1626315869436-d6781ba69d6e?w=800&q=80', 'A well-regarded private medical university in Nepal offering MBBS with the advantage of geographic and cultural proximity to India, making it a comparatively easier transition for Indian students.', array['Geographic proximity to India', 'Culturally familiar environment', 'Recognised teaching hospital', 'Entrance test based admission']::text[], array['NEET UG', 'MBBS Entrance Test (Nepal)']::text[], 620000, 1500000, array['FMGE / NExT eligible on return to India']::text[], array['MBBS (General Medicine)']::text[], array['NMC Screening Eligible', 'WHO Listed']::text[])
on conflict do nothing;
select setval(pg_get_serial_sequence('colleges', 'id'), (select max(id) from colleges));

insert into blogs (id, slug, title, excerpt, content, category, tags, author, author_role, author_avatar, published_at, read_time, image, featured) values
  (1, 'neet-ug-2026-complete-preparation-guide', 'NEET UG 2026: Complete Preparation Guide for Medical Aspirants', 'A month-by-month NEET UG 2026 preparation plan covering syllabus priorities, mock test strategy, and common mistakes to avoid.', '## What is NEET UG?

NEET UG (National Eligibility cum Entrance Test — Undergraduate) is the single entrance exam for admission to MBBS, BDS, BAMS, BHMS and other medical courses across India. It is also the qualifying exam that Indian students must clear before pursuing MBBS abroad.

## Eligibility Criteria

- Passed or appearing in Class 12 with Physics, Chemistry, Biology/Biotechnology and English
- Minimum qualifying percentage as prescribed by NMC (varies by category)
- No fixed upper age limit currently applies as per the latest NMC guidelines — always confirm the current rule on the official NTA notification before applying

## Exam Pattern

NEET UG is a pen-and-paper test with 200 multiple-choice questions (180 to be attempted) across Physics, Chemistry and Biology (Botany + Zoology), each carrying 4 marks with negative marking of 1 mark for a wrong answer.

## Month-by-Month Study Plan

### 12 Months Before
Build strong NCERT fundamentals in Biology, Physics and Chemistry. Biology carries the highest weightage — start there.

### 6 Months Before
Move to standard reference books and previous years'' NEET papers. Start topic-wise mock tests to identify weak areas.

### 3 Months Before
Take full-length mock tests every week under exam conditions. Revise NCERT line-by-line for Biology — a large share of NEET Biology questions are directly NCERT-based.

### Last Month
Pure revision — formula sheets, diagrams, and previous 5–10 years'' papers. Avoid starting new topics.

## Common Mistakes to Avoid

1. Underestimating NCERT — most NEET Biology and Chemistry questions trace back to it
2. Ignoring negative marking — avoid guesswork on questions you''re unsure of
3. Skipping mock tests — time management is often the biggest score-killer
4. Neglecting Biology in favour of Physics/Chemistry — Biology alone carries 50% weightage

## After NEET UG: What Next?

Once your NEET UG result and rank are out, counselling begins — for MBBS/BDS in India through MCC/state counselling, or for MBBS abroad through direct university admission. Our counsellors can help you understand realistic options based on your score before counselling rounds begin.

## Final Words

NEET UG rewards consistent, NCERT-first preparation over flashy shortcuts. Start early, track your progress with regular mock tests, and reach out for counselling as soon as your result is out — seats fill up fast.', 'Entrance Exams', array['NEET UG', 'NEET 2026', 'MBBS Entrance', 'Preparation']::text[], 'Hello Doctor Team', 'NEET & MBBS Admission Counsellors', 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100&q=80', '2026-01-10', 10, 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&q=80', true),
  (2, 'mbbs-india-vs-mbbs-abroad', 'MBBS in India vs MBBS Abroad: Which Should You Choose?', 'A practical, NEET-score-based comparison of MBBS in India versus MBBS abroad — cost, recognition, and what actually matters.', '## The Real Decision Point: Your NEET UG Score

The choice between MBBS in India and MBBS abroad usually comes down to your NEET UG rank and your family''s budget — not a simple "better or worse" comparison. Both paths lead to the same MBBS degree pathway, provided you choose recognised institutions.

## MBBS in India

**Pros:**
- Widely recognised, no additional licensing exam needed to practise in India
- Government college fees can be as low as a few thousand rupees a year
- Familiar language, culture and food

**Cons:**
- Extremely high NEET UG cutoffs for government seats
- Private/deemed college fees can run into ₹15–25 lakh a year

## MBBS Abroad

**Pros:**
- Direct admission at many universities once you have a qualifying NEET UG score — no separate entrance test at most destinations
- Lower total program cost at several public universities compared to private Indian colleges
- Exposure to an international environment

**Cons:**
- You must clear the NMC-mandated FMGE/NExT screening test to practise in India after returning
- Always verify a university is WHO-listed and NMC screening-test eligible before applying
- Adjustment to a new country, language and climate

## What to Actually Check Before Deciding

1. Is the university WHO-listed and NMC screening-test eligible?
2. What is the total cost over the full course — tuition, hostel, food and travel?
3. What is the medium of instruction — is it genuinely English-medium?
4. What is the visa and travel process like for that country?

## Our Recommendation

There''s no universal right answer — it depends on your NEET score, budget, and comfort with studying abroad. Talk to our counsellors with your NEET UG rank and we''ll walk you through realistic, verified options in India and abroad.', 'Study Abroad', array['MBBS Abroad', 'MBBS India', 'NEET UG', 'Comparison']::text[], 'Aman', 'Founder, Hello Doctor', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80', '2026-01-18', 9, 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&q=80', true),
  (3, 'top-government-medical-colleges-india-2026', 'Top Government Medical Colleges in India 2026: NIRF Rankings & Fees', 'A NEET-counselling ready list of India''s top government medical colleges, with indicative fees and NIRF standing.', '## Why Government Medical Colleges Are the First Choice

Government medical colleges in India offer MBBS at a fraction of private college fees, along with strong clinical exposure through large attached hospitals. Admission is entirely through NEET UG counselling (All-India Quota or State Quota).

## Top Government Medical Colleges (Indicative NIRF Standing)

- **AIIMS New Delhi** — consistently ranked #1 in NIRF Medical
- **Christian Medical College, Vellore** — top-ranked deemed medical university
- **Armed Forces Medical College, Pune** — defence-run, with a service bond
- **Seth GS Medical College (KEM Hospital), Mumbai** — one of India''s oldest, high patient volume
- **Madras Medical College, Chennai** — among Asia''s oldest medical colleges
- **King George''s Medical University, Lucknow** — a leading UP government medical university
- **Institute of Medical Sciences, BHU, Varanasi** — strong research reputation

## What NIRF Ranking Does (and Doesn''t) Tell You

NIRF ranks colleges on research output, teaching resources, and outreach — useful, but it doesn''t fully capture clinical exposure, faculty mentorship, or fit for your specific goals. Rankings shift year to year, so always check the latest official NIRF release before finalising a choice.

## A Note on Fees

Government medical college fees typically range from a few thousand to around ₹30,000 a year — far lower than private colleges. Always confirm exact, current fees directly with the college or through official counselling brochures, as they can change each academic year.

## How We Help

Our counsellors help you shortlist realistic government and private college options based on your NEET UG rank, category and home state quota — so you''re not guessing which college is actually within reach.', 'Rankings', array['NIRF', 'Medical Colleges', 'Government Colleges', 'MBBS India']::text[], 'Hello Doctor Team', 'NEET & MBBS Admission Counsellors', 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100&q=80', '2026-01-25', 8, 'https://images.unsplash.com/photo-1562774053-701939374585?w=1200&q=80', true),
  (4, 'how-to-choose-right-medical-college', 'How to Choose the Right Medical College: 10 Factors to Consider', 'Beyond rankings — a practical checklist for choosing between MBBS colleges in India and abroad.', '## 1. NEET UG Rank Realism

Start with an honest assessment of your NEET UG rank and category — it determines which government and deemed colleges are realistically within reach.

## 2. Total Cost, Not Just Tuition

Add up tuition, hostel, food, travel (for abroad options) and living costs over the full course — not just the advertised annual fee.

## 3. Recognition & Approvals

For India, confirm NMC approval. For abroad, confirm WHO listing and NMC screening-test (FMGE/NExT) eligibility before applying anywhere.

## 4. Clinical Exposure

A college attached to a large, busy hospital generally offers richer hands-on clinical training than one with a smaller patient base.

## 5. Location & Language

Consider how far the college is from home, the local language of instruction outside class, and how that affects your day-to-day comfort.

## 6. Hostel & Safety

For students moving away from home — especially abroad — check hostel facilities, safety record, and the presence of an existing Indian student community.

## 7. Faculty & Batch Size

Smaller batch sizes generally mean more individual attention during clinical postings.

## 8. Post-MBBS Pathway

Understand what''s required after graduation — internship rules, licensing exams (FMGE/NExT for abroad), and postgraduate options.

## 9. Visa & Documentation (For Abroad)

Understand the visa process, required documents, and processing timelines well before your intended admission date.

## 10. Talk to Current Students or Alumni

Wherever possible, get a first-hand account of campus life, teaching quality and support systems from someone who has actually studied there.

## Final Word

No single factor should decide your choice alone — weigh them together against your own priorities. Our counsellors are happy to walk through this checklist with you for any specific college or university you''re considering.', 'Admission Guide', array['Medical College', 'Admission Guide', 'MBBS', 'Checklist']::text[], 'Aman', 'Founder, Hello Doctor', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80', '2026-02-02', 9, 'https://images.unsplash.com/photo-1580537659466-0a9bfa916a54?w=1200&q=80', false),
  (5, 'nmc-guidelines-mbbs-abroad', 'NMC Guidelines for MBBS Abroad: What Every Student Must Know', 'A plain-language summary of the National Medical Commission''s key requirements for Indian students pursuing MBBS abroad.', '## Why NMC Guidelines Matter

If you plan to pursue MBBS outside India and later practise in India, the National Medical Commission''s (NMC) regulations determine whether your degree will actually be recognised. Ignoring these guidelines is the single most common — and costly — mistake families make.

## Key Points to Know (Always Verify the Latest Official Notification)

- A qualifying NEET UG score is mandatory before you can pursue MBBS abroad as an Indian student
- The university/medical institute abroad should be recognised by the relevant local authority and listed with the World Directory of Medical Schools (WHO)
- On completing your MBBS abroad, you must clear the **Foreign Medical Graduate Examination (FMGE)** or its successor, the **National Exit Test (NExT)**, to practise medicine in India
- There are minimum course duration and internship requirements that must be fulfilled at the foreign institution

## Why This Matters Before You Apply

Enrolling at a university that isn''t properly recognised, or skipping the NEET UG eligibility requirement, can mean your degree isn''t valid for practice in India — regardless of how good the education itself was. Always verify a university''s status independently before paying any fees.

## How We Help

Every college and university we recommend is checked for WHO listing and NMC screening-test eligibility as part of our counselling process. If you already have an offer from another agent, we''re happy to help you independently verify it before you commit.

## Disclaimer

NMC guidelines are updated periodically. This article is for general awareness only — always cross-check the latest requirements on the official NMC website or with your counsellor before making a final decision.', 'Study Abroad', array['NMC', 'FMGE', 'NExT', 'MBBS Abroad', 'Regulations']::text[], 'Hello Doctor Team', 'NEET & MBBS Admission Counsellors', 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100&q=80', '2026-02-10', 7, 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&q=80', false),
  (6, 'mbbs-vs-bds-vs-bams-vs-bhms', 'MBBS vs BDS vs BAMS vs BHMS: Which Medical Course Should You Choose?', 'All four are NEET UG based medical courses — here''s how they actually differ in scope, duration and career paths.', '## They All Start With the Same Exam

MBBS, BDS, BAMS and BHMS are all admitted through NEET UG counselling in India, but they lead to very different practice areas and career paths.

## MBBS (Bachelor of Medicine, Bachelor of Surgery)

- **Duration:** 5.5 years including internship
- **Focus:** General allopathic medicine and surgery
- **Career paths:** General physician, surgeon, specialist (after MD/MS)
- **Best for:** Students wanting the broadest scope of practice and specialisation options

## BDS (Bachelor of Dental Surgery)

- **Duration:** 5 years including internship
- **Focus:** Dental and oral healthcare
- **Career paths:** Dentist, orthodontist, oral surgeon, own clinical practice
- **Best for:** Students interested in a more predictable work-life balance and clinic ownership

## BAMS (Bachelor of Ayurvedic Medicine and Surgery)

- **Duration:** 5.5 years including internship
- **Focus:** Traditional Ayurvedic medicine alongside modern medical science
- **Career paths:** Ayurvedic physician, panchakarma specialist, wellness consultant
- **Best for:** Students interested in traditional and integrative medicine

## BHMS (Bachelor of Homeopathic Medicine and Surgery)

- **Duration:** 5.5 years including internship
- **Focus:** Homeopathic medicine
- **Career paths:** Homeopathic physician, own clinical practice
- **Best for:** Students interested in homeopathy as a system of medicine

## How to Decide

If your NEET UG rank doesn''t yet secure the MBBS seat you want, BDS, BAMS or BHMS are legitimate, NMC/NCISM/NCH-recognised medical career paths worth considering — not "fallback" options. The right choice depends on your genuine interest in the field, not rank alone.

## Talk to a Counsellor

If you''re unsure which path fits your NEET UG score and interests, our counsellors can walk you through realistic options across all four courses.', 'Career Advice', array['MBBS', 'BDS', 'BAMS', 'BHMS', 'Career Guide']::text[], 'Aman', 'Founder, Hello Doctor', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80', '2026-02-16', 8, 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=1200&q=80', false),
  (7, 'neet-ug-2026-exam-pattern-cutoff-trends', 'NEET UG 2026: Exam Pattern, Syllabus & Cutoff Trends', 'A breakdown of the NEET UG exam pattern, subject-wise weightage, and how to read cutoff trends before counselling.', '## Exam Pattern at a Glance

NEET UG is a 200-question (180 to be attempted), pen-and-paper multiple-choice test covering Physics, Chemistry, and Biology (Botany + Zoology), each correct answer worth 4 marks with a 1 mark penalty for incorrect answers.

## Subject-wise Weightage (Approximate)

- **Biology (Botany + Zoology):** ~50% of total marks — the single most important section
- **Chemistry:** ~25%, split roughly evenly between Physical, Organic and Inorganic
- **Physics:** ~25%, generally considered the most time-consuming section per question

## Understanding Cutoff Trends

NEET UG cutoffs (qualifying marks/percentile) and the actual rank required for a specific college vary every year based on difficulty level, number of candidates, and seat availability. A rank that secured a government seat last year may not do the same this year — always check the latest official cutoff data during counselling rather than relying on old figures.

## How to Use Cutoff Data Sensibly

1. Look at cutoff trends over the last 2–3 years, not just one year, to spot a realistic range
2. Separate All-India Quota cutoffs from your specific state''s quota cutoffs — they can differ significantly
3. Keep a realistic shortlist of government, deemed, private and abroad options rather than fixating on one college

## Final Tips

Don''t let last year''s cutoff numbers create false confidence or unnecessary panic — they''re a guide, not a guarantee. Once your actual NEET UG result is out, our counsellors can help you map your rank to realistic, current options across India and abroad.', 'Entrance Exams', array['NEET UG', 'Exam Pattern', 'Cutoff', 'Syllabus']::text[], 'Hello Doctor Team', 'NEET & MBBS Admission Counsellors', 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100&q=80', '2026-02-22', 7, 'https://images.unsplash.com/photo-1573496799515-eebbb63814f2?w=1200&q=80', false),
  (8, 'scholarships-for-medical-students-india-2026', 'Top Scholarships for Medical Students in India 2026', 'Government and private scholarship schemes that MBBS, BDS, BAMS and BHMS students in India can apply for.', '## Government Scholarships Open to Medical Students

Several national scholarship schemes are open to students across streams, including medical courses:

- **Central Sector Scheme of Scholarships** — merit-cum-means based, for college and university students including medical courses
- **Post-Matric Scholarships (SC/OBC/Minority)** — category-based schemes for eligible students
- **State Government Scholarships** (e.g. UP Scholarship Scheme) — for domicile students of that state, including those pursuing MBBS/BDS

## Private & Institutional Scholarships

Several private foundations and trusts run merit-cum-means scholarship programs open to "any stream," which medical students can apply for alongside engineering, commerce and other students. Always check each scheme''s current eligibility criteria and income limits, as these are revised periodically.

## Tips for a Strong Scholarship Application

1. Apply well before the deadline — most schemes work on a first-come, document-verification basis
2. Keep income certificates, category certificates and academic records ready and updated
3. Apply to multiple schemes rather than relying on just one
4. Double-check eligibility criteria before applying — the biggest reason applications get rejected is a mismatch in eligibility, not application quality

## How We Help

Our team can help you identify which government and private scholarships you''re genuinely eligible for based on your category, income, and course, and guide you through the application and document process.', 'Scholarships', array['Scholarships', 'Medical Students', 'MBBS', 'Government Schemes']::text[], 'Hello Doctor Team', 'NEET & MBBS Admission Counsellors', 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100&q=80', '2026-03-01', 7, 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200&q=80', true),
  (9, 'mbbs-russia-georgia-uzbekistan-comparison', 'MBBS in Russia vs Georgia vs Uzbekistan: A Cost & Quality Comparison', 'How three of the most popular MBBS-abroad destinations for Indian students compare on cost, curriculum and recognition.', '## Why These Three Countries

Russia, Georgia and Uzbekistan are among the most commonly chosen MBBS-abroad destinations for NEET-qualified Indian students, largely due to public state medical universities offering English-medium programs with direct admission.

## Russia

- Long-established medical education system with several public universities offering MBBS in English
- Comparatively lower cost than private Indian colleges
- Large, well-settled Indian student communities at most universities

## Georgia

- European-standard curriculum, increasingly popular in recent years
- Generally considered a safe, welcoming environment for international students
- Slightly higher average tuition than some Central Asian options, but still well below private Indian college fees

## Uzbekistan

- Among the more budget-friendly options, with established public universities in Tashkent and Samarkand
- Lower cost of living compared to Russia and Georgia
- Growing but still relatively newer Indian student presence compared to Russia

## What Matters More Than the Country

Regardless of country, always independently verify:
1. WHO World Directory of Medical Schools listing
2. NMC screening-test (FMGE/NExT) eligibility
3. Actual, current total cost — tuition, hostel, food and travel
4. Genuine English-medium teaching, not just an English-medium claim

## Our Recommendation

There''s no single "best" country — the right fit depends on your budget, comfort level, and the specific university''s recognition status. Talk to our counsellors for a side-by-side comparison based on your NEET UG score and budget.', 'Study Abroad', array['MBBS Russia', 'MBBS Georgia', 'MBBS Uzbekistan', 'Study Abroad']::text[], 'Aman', 'Founder, Hello Doctor', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80', '2026-03-08', 9, 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&q=80', true),
  (10, 'medical-college-hostel-life-survival-tips', 'Life at a Medical College: Hostel, Study Routine & Survival Tips', 'What to actually expect in your first year of medical college — hostel life, study balance, and settling in, in India or abroad.', '## The First Few Weeks

The first month at a new medical college — whether in another Indian state or abroad — is usually the hardest. New routine, new people, and a much heavier study load than school. Give yourself time to adjust rather than expecting to have it figured out immediately.

## Hostel Life Basics

- Pack light but smart — bedding, basic medicines, and weather-appropriate clothing matter more than you''d think
- Most hostels have shared rooms in the first year — a good roommate relationship makes a big difference
- Keep copies of all your important documents (admission letter, ID, passport for abroad students) both physically and digitally

## Balancing Study & Life

Medical college coursework is intense from day one. A simple, sustainable routine — regular lecture attendance, daily revision, and scheduled breaks — beats last-minute cramming over a full semester.

## For Students Going Abroad

- Learn a handful of basic local-language phrases before you leave — it helps enormously in daily life
- Connect with the existing Indian student community at your university before you arrive, if possible
- Keep your family updated on your visa, residence permit and any local registration deadlines

## Mental Health Matters

It''s normal to feel homesick or overwhelmed in the first semester, especially abroad. Stay connected with family, build a support circle among fellow students, and don''t hesitate to use your university''s counselling resources if things feel heavy.

## Final Word

Every doctor you admire went through this same adjustment period. Give yourself grace in the first semester — it does get easier once you find your routine.', 'College Life', array['Hostel Life', 'Medical College', 'Student Life', 'MBBS Abroad']::text[], 'Hello Doctor Team', 'NEET & MBBS Admission Counsellors', 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100&q=80', '2026-03-15', 7, 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=1200&q=80', false)
on conflict do nothing;
select setval(pg_get_serial_sequence('blogs', 'id'), (select max(id) from blogs));

insert into scholarships (id, slug, name, short_name, provider, provider_type, amount, amount_display, amount_type, category, streams, level, eligibility_criteria, income_limit, income_limit_display, min_marks, deadline, application_mode, apply_url, description, benefits, documents, selection_process, renewal_criteria, featured, tags, no_of_awards, established_year, contact) values
  (1, 'central-sector-scheme-scholarships', 'Central Sector Scheme of Scholarships for College and University Students', 'CSSS', 'Ministry of Education, Government of India', 'Government', 20000, '₹10,000–20,000/year', 'Annual', 'Merit-cum-Means', array['Any Stream']::text[], array['UG', 'PG']::text[], array['Must have scored above 80th percentile in Class 12 board exams', 'Enrolled in regular degree programs (not correspondence)', 'Annual family income below ₹8 lakhs', 'Not receiving any other Central Government scholarship', 'Must be a regular student in a recognized college/university']::text[], 800000, '₹8 Lakhs/year', 80, 'October 2025', 'Online', 'https://scholarships.gov.in', 'The Central Sector Scheme of Scholarships (CSSS) is India''s largest scholarship program for college students. Funded by the Ministry of Education, it provides financial assistance to meritorious students from low and middle-income families pursuing higher education. Over 82,000 new scholarships are awarded annually through this scheme.', array['₹10,000 per year for first 3 years of UG course', '₹20,000 per year for PG courses', 'Direct transfer to student''s bank account', 'Renewable every year with minimum 60% marks', 'No repayment required']::text[], array['Class 12 marksheet and certificate', 'Aadhaar card', 'Bank account details (linked with Aadhaar)', 'Income certificate from competent authority', 'Caste certificate (if applicable)', 'Current year college admission receipt/fee receipt', 'Passport size photograph']::text[], 'Merit-based selection using Class 12 board exam percentile. Students must be in the top 20% of successful candidates in respective state/UT boards.', 'Minimum 60% marks in each year of the course. Student must not have any gap year. Must continue studying in the same college/stream.', true, array['Government', 'Merit', 'UG', 'PG', 'NSP']::text[], '82,000 new scholarships per year', 2008, 'scholarships.gov.in | helpdesk@nsp.gov.in'),
  (2, 'post-matric-scholarship-sc', 'Post-Matric Scholarship for Scheduled Castes', 'Post-Matric SC', 'Ministry of Social Justice and Empowerment, Govt. of India', 'Government', 150000, 'Full Fee + Maintenance', 'Annual', 'Reserved Category', array['Any Stream']::text[], array['Class 11-12', 'UG', 'PG', 'PhD', 'Diploma']::text[], array['Must belong to Scheduled Caste (SC) category', 'Annual family income below ₹2.5 lakhs', 'Studying in a government-recognized institution', 'Must be an Indian national', 'Not receiving scholarship from any other source']::text[], 250000, '₹2.5 Lakhs/year', 0, 'November 2025', 'Online', 'https://scholarships.gov.in', 'Post-Matric Scholarship for SC students is one of India''s most important social welfare scholarship schemes. It covers tuition fees, maintenance allowance, and other essential expenses for SC students pursuing post-matriculation education. The scheme ensures that no deserving SC student is denied higher education due to financial constraints.', array['Full reimbursement of tuition and non-refundable fees', 'Maintenance allowance: ₹1,200–2,000/month (hostellers) or ₹550–1,200/month (day scholars)', 'Book grant up to ₹3,000/year', 'Study tour charges (up to 2 tours/year for professional courses)', 'Thesis/dissertation typing allowance for research students']::text[], array['Caste certificate from competent authority', 'Income certificate from competent authority', 'Aadhaar card', 'Bank account details', 'Previous year marksheet', 'Current year admission proof and fee receipt', 'Residential proof', 'Passport size photograph']::text[], 'All eligible applicants who fulfill income and caste criteria are awarded the scholarship, subject to budget availability. Priority given to students with lower income.', 'Pass in each year''s examination. Must maintain regular attendance. Income limit must be satisfied annually.', true, array['Government', 'SC', 'Post-Matric', 'NSP', 'Reserved Category']::text[], '40+ lakh students per year', 1944, 'scholarships.gov.in | 0120-6619540'),
  (3, 'pm-scholarship-scheme', 'Prime Minister''s Scholarship Scheme (PMSS)', 'PMSS', 'Department of Ex-Servicemen Welfare, Ministry of Defence', 'Government', 30000, '₹2,500–3,000/month', 'Monthly', 'Defence/Paramilitary', array['Engineering', 'Medical', 'Management', 'Any Stream']::text[], array['UG', 'PG']::text[], array['Ward or widow of Ex-servicemen/Ex-Coast Guard personnel', 'Minimum 60% marks in Class 12/Diploma qualifying exam', 'Enrolled in first year of professional degree (1st year only)', 'Age not exceeding 25 years', 'Not availing any other Central Government scholarship']::text[], null, 'No Income Limit', 60, 'October 2025', 'Online', 'https://ksb.gov.in', 'The Prime Minister''s Scholarship Scheme honours the sacrifice of armed forces and central paramilitary forces personnel by supporting their children''s higher education. Available for wards and widows of ex-servicemen for professional degree programs including engineering, medicine, MBA, MCA, B.Ed, and similar courses.', array['₹3,000/month for girl students', '₹2,500/month for boy students', 'Payable for the full duration of the course', 'Special provision for wards of martyrs/killed in action', 'No repayment required']::text[], array['Ex-serviceman discharge certificate', 'Class 12 marksheet', 'Aadhaar card of student and parent', 'Bank account details', 'Dependency certificate', 'Admission proof from institution', 'Service record extract']::text[], 'Applications reviewed by Kendriya Sainik Board. Merit list prepared on basis of Class 12/graduation marks. Priority to wards of deceased/disabled ex-servicemen.', 'Minimum 50% marks in each semester/year. Must not change the course/college without prior approval. Annual renewal required.', true, array['Government', 'Defence', 'Ex-Servicemen', 'Merit']::text[], '5,500 new scholarships per year', 2006, 'ksb.gov.in | 011-26173215'),
  (4, 'inspire-scholarship-dst', 'INSPIRE Scholarship for Higher Education (SHE)', 'INSPIRE SHE', 'Department of Science & Technology, Government of India', 'Government', 80000, '₹80,000/year', 'Annual', 'Science & Research', array['Science']::text[], array['UG', 'PG']::text[], array['Top 1% students in Class 12 board exams', 'Pursuing B.Sc/B.S./M.Sc in Natural/Basic Sciences', 'Must be enrolled in a recognized science college/university', 'Age between 17–22 years at the time of enrollment', 'Not pursuing professional courses (engineering, medical, law, management)']::text[], null, 'No Income Limit', 90, 'November 2025', 'Online', 'https://online-inspire.gov.in', 'INSPIRE (Innovation in Science Pursuit for Inspired Research) Scholarship for Higher Education is a prestigious scholarship to attract talented students to pursue science as a career. Awarded to top 1% in Class 12, it encourages the best minds to pursue pure science degrees rather than professional courses.', array['₹80,000 per year (₹60,000 annual scholarship + ₹20,000 summer/winter research attachment)', 'Mentorship by senior scientists', 'Research exposure at national R&D institutions', 'Certificate of recognition from DST', 'Networking with scientific community']::text[], array['Class 12 marksheet showing top 1% rank', 'Aadhaar card', 'Bank account details', 'Admission proof in natural science course', 'Passport size photograph', 'Income certificate (optional but preferred)']::text[], 'Based on Class 12 board results. Top 1% from each board (10,000 students per year) are eligible. First-come-first-served among eligible students for online applications.', 'Minimum 60% in each year. Must continue in natural/basic science stream only. Annual online renewal on INSPIRE portal.', true, array['Government', 'Science', 'Research', 'Merit', 'DST']::text[], '10,000 per year', 2008, 'online-inspire.gov.in | inspire-she@nic.in'),
  (5, 'moma-scholarship-minority', 'Scholarships for Minority Communities (Pre-Matric & Post-Matric)', 'Minority Scholarship', 'Ministry of Minority Affairs, Government of India', 'Government', 25000, '₹25,000/year (Girls), ₹20,000/year (Boys)', 'Annual', 'Minority', array['Any Stream']::text[], array['Class 11-12', 'UG', 'PG']::text[], array['Belongs to minority community (Muslim, Christian, Sikh, Buddhist, Jain, Zoroastrian/Parsi)', 'Annual family income below ₹2 lakhs (Post-Matric) or ₹1 lakh (Pre-Matric)', 'Minimum 50% marks in previous exam', 'Enrolled in a government-recognized institution', 'Not availing any other scholarship from Central/State Govt.']::text[], 200000, '₹2 Lakhs/year', 50, 'October 2025', 'Online', 'https://scholarships.gov.in', 'Maulana Azad National Fellowship and Scholarship Schemes provide financial assistance to students from minority communities for pursuing higher education. These scholarships cover tuition fees and maintenance charges to support meritorious minority students who might otherwise be unable to continue their studies.', array['₹25,000/year for girls, ₹20,000/year for boys (Post-Matric)', 'Covers tuition fees and maintenance allowance', 'Hostel charges covered separately', 'Renewable for entire course duration', 'Direct bank transfer']::text[], array['Minority community certificate from competent authority', 'Income certificate', 'Aadhaar card', 'Previous exam marksheet', 'Admission and fee receipt', 'Bank account details', 'Residential proof']::text[], '85% of scholarships are awarded based on merit. 30% reserved for girls. Selection by State/UT Channelizing Agencies through online portal.', 'Minimum 50% marks each year. Must remain enrolled in same course. Income criteria must be re-verified annually.', false, array['Government', 'Minority', 'Means-cum-Merit', 'NSP']::text[], '5 lakh students per year', 2007, 'scholarships.gov.in | 011-23231002'),
  (6, 'tata-capital-pankh-scholarship', 'Tata Capital Pankh Scholarship Program', 'Tata Pankh', 'Tata Capital Limited', 'Private', 10000, 'Up to ₹10,000/year', 'Annual', 'Corporate CSR', array['Any Stream']::text[], array['Class 11-12', 'UG', 'Diploma']::text[], array['Passed Class 10 with minimum 60% marks', 'Currently enrolled in Class 11, 12, or UG/Diploma', 'Annual family income below ₹4 lakhs', 'Must be an Indian citizen', 'Both male and female students are eligible']::text[], 400000, '₹4 Lakhs/year', 60, 'August 2025', 'Online', 'https://buddy4study.com/scholarship/tata-capital-pankh', 'Tata Capital''s Pankh Scholarship is a Corporate Social Responsibility initiative to support bright but financially challenged students. The scholarship aims to ''give wings'' (Pankh) to deserving students to pursue their academic dreams. Applications are processed through Buddy4Study, India''s largest scholarship platform.', array['Up to ₹10,000 per year towards education expenses', 'Covers tuition, books, and other academic expenses', 'Online mentoring sessions', 'Career guidance workshops', 'Certificate from Tata Capital']::text[], array['Class 10 marksheet', 'Current enrollment proof', 'Income certificate', 'Aadhaar card', 'Bank account details', 'Essay on career goals (500 words)', 'Passport size photograph']::text[], 'Two-stage process: (1) Application screening based on academic merit and financial need, (2) Telephonic interview for shortlisted candidates. Final selection by Tata Capital CSR team.', 'Annual renewal based on academic performance. Minimum 60% marks required. Must reapply each year.', false, array['Private', 'Corporate', 'Tata', 'Buddy4Study', 'CSR']::text[], '1,000+ per year', 2012, 'buddy4study.com/scholarship/tata-capital-pankh'),
  (7, 'reliance-foundation-scholarship', 'Reliance Foundation Scholarships', 'RF Scholarships', 'Reliance Foundation', 'Private', 600000, '₹2–6 Lakhs/year', 'Annual', 'Merit-cum-Means', array['Engineering', 'Science', 'Any Stream']::text[], array['UG', 'PG']::text[], array['Indian national studying in India', 'Exceptional academic record (top 10% of class)', 'Enrolled in full-time undergraduate or postgraduate program', 'Strong financial need demonstrated', 'Leadership qualities and community involvement', 'Annual family income below ₹15 lakhs']::text[], 1500000, '₹15 Lakhs/year', 85, 'January 2026', 'Online', 'https://reliancefoundation.org/scholarships', 'Reliance Foundation Scholarships are among India''s most prestigious private scholarships, supporting extraordinary students with the potential to create positive change. The Foundation offers scholarships across four categories: Undergraduate, Postgraduate, Sports, and Music & Arts. Recipients become part of the RF Scholar community with access to mentors and networking opportunities.', array['₹2–6 lakhs annually for tuition and living expenses', 'Mentoring by industry leaders and Reliance executives', 'Internship opportunities within Reliance Industries', 'Access to RF Scholar community (1,000+ scholars)', 'Career development workshops', 'Annual convocation and networking events']::text[], array['Complete academic transcripts', 'Admission letter from institution', 'Income and wealth declaration', 'Two letters of recommendation', 'Statement of purpose (1,000 words)', 'Proof of extracurricular achievements', 'Aadhaar card and bank account details']::text[], 'Three rounds: (1) Online application screening, (2) Aptitude and essay assessment, (3) Personal interview with RF Selection Committee. Only top 0.5% applicants are selected.', 'Top quartile in academic performance each year. Active participation in RF Scholar community events. Minimum 75% attendance.', true, array['Private', 'Reliance', 'Merit', 'Leadership', 'Prestigious']::text[], '5,000 per year', 2015, 'reliancefoundation.org/scholarships | 1800-419-8800'),
  (8, 'aditya-birla-scholarship', 'Aditya Birla Scholarships', 'AB Scholarship', 'Aditya Birla Group', 'Private', 65000, '₹65,000/year', 'Annual', 'Merit', array['Engineering', 'Management', 'Law']::text[], array['UG', 'PG']::text[], array['CAT 98th percentile and above for IIM admission; OR', 'JEE Advanced top 10 rank and admitted to IIT; OR', 'CLAT top 10 rank and admitted to top NLU', 'Must be in first year of the program', 'Demonstrated leadership and extracurricular excellence']::text[], null, 'No Income Limit', 0, 'September 2025', 'Online', 'https://adityabirla.com/scholarships', 'The Aditya Birla Scholarships are awarded to the best students entering India''s most elite institutions — IITs, IIMs, and top NLUs. Named after the late Aditya Vikram Birla, these scholarships recognize exceptional talent and provide financial support along with mentoring by Aditya Birla Group''s senior leadership.', array['₹65,000 per year throughout the program', 'Personal mentoring by Aditya Birla Group executives', 'Internship priority at Aditya Birla Group companies', 'Scholarship plaque and certificate', 'Annual AB Scholar conclave', 'Networking with India''s top young talent']::text[], array['Entrance exam scorecard (CAT/JEE/CLAT)', 'Admission letter from IIM/IIT/NLU', 'Class 10 and 12 marksheets', 'CV and extracurricular achievements', 'Two reference letters', 'Essay on leadership experience']::text[], 'Institution-driven process. Selected institutions nominate candidates. Personal interview with Aditya Birla Group panel. Final approval by Group Chairman''s office.', 'Top quintile in batch performance. No academic backlogs. Active participation in AB Scholar community.', true, array['Private', 'Aditya Birla', 'IIT', 'IIM', 'NLU', 'Elite', 'Merit']::text[], '~60 per year', 1999, 'adityabirla.com/scholarships | scholarship@adityabirla.com'),
  (9, 'hdfc-bank-educational-crisis-scholarship', 'HDFC Bank Educational Crisis Scholarship Support', 'HDFC ECSS', 'HDFC Bank Parivartan', 'Private', 75000, 'Up to ₹75,000/year', 'Annual', 'Financial Crisis', array['Any Stream']::text[], array['Class 11-12', 'UG', 'PG', 'Diploma']::text[], array['Student facing sudden financial crisis due to death/disability of earning member', 'Annual family income below ₹2.5 lakhs after crisis', 'Minimum 55% marks in previous year exam', 'Enrolled in a recognized institution', 'The financial crisis must have occurred within the last 2 years']::text[], 250000, '₹2.5 Lakhs/year', 55, 'Rolling (Apply Anytime)', 'Online', 'https://hdfcbank.com/scholarships', 'HDFC Bank Educational Crisis Scholarship Support is specifically designed for students who face sudden financial hardship due to the death, disability, or loss of livelihood of the primary earning member of the family. The scholarship ensures that students do not have to drop out of their education due to such unfortunate circumstances.', array['Up to ₹75,000 per year for tuition and living expenses', 'Covers actual academic expenses (fee receipts required)', 'Counselling and mental health support', 'Career guidance services', 'Emergency assistance within 30 days of application']::text[], array['Death certificate/disability certificate of earning member', 'FIR/medical documents as applicable', 'Income proof showing financial distress', 'Admission and fee receipts', 'Previous year marksheet', 'Aadhaar card', 'Bank account details', 'Statement explaining the crisis']::text[], 'Case-by-case evaluation. Priority to students whose primary earner has recently passed away or become permanently disabled. Quick turnaround (within 30 working days).', 'Annual renewal with updated documents. Minimum academic performance required. Financial situation re-assessed each year.', false, array['Private', 'HDFC', 'Crisis', 'Means-Based', 'Emergency']::text[], '5,000+ per year', 2014, 'hdfcbank.com/scholarships | 1800-202-6161'),
  (10, 'sitaram-jindal-scholarship', 'Sitaram Jindal Foundation Scholarship', 'Jindal Scholarship', 'Sitaram Jindal Foundation', 'Private', 24000, '₹500–2,000/month', 'Monthly', 'Merit-cum-Means', array['Any Stream']::text[], array['Class 11-12', 'UG', 'PG', 'Diploma']::text[], array['Annual family income below ₹2.5 lakhs (Category A) or ₹3.5 lakhs (Category B)', 'Minimum 55% marks in previous qualifying exam', 'Enrolled in recognized institution in India', 'Indian citizen', 'Not receiving scholarship exceeding ₹500/month from other sources']::text[], 350000, '₹3.5 Lakhs/year', 55, 'September 2025', 'Both', 'https://sitaramjindalfoundation.org', 'The Sitaram Jindal Foundation has been supporting Indian students for over four decades. Known for its simple application process and reliable disbursement, the Foundation awards scholarships to deserving students across all streams and levels, from Class 11 to PhD. The Foundation particularly supports girl students and students from rural areas.', array['₹500–2,000 per month depending on category', 'Category A (below ₹2.5L income): higher amounts', 'Category B (₹2.5L–₹3.5L income): standard amounts', '25% higher scholarship for girl students', 'Paid for 10 months per year', 'Renewable for full course duration']::text[], array['Income certificate from Tahsildar/SDM', 'Previous year marksheet', 'Admission and fee receipt', 'Aadhaar card', 'Bank account details', 'Caste certificate (if applicable)', 'Two passport size photographs']::text[], 'Applications reviewed by Foundation''s screening committee. Merit and financial need both considered. Personal verification may be done. Results declared within 2 months.', 'Minimum 50% marks (general) or 45% marks (SC/ST). Submit renewal form with marksheet by July each year.', false, array['Private', 'Foundation', 'Merit-cum-Means', 'Girls', 'Rural']::text[], '10,000+ per year', 1975, 'sitaramjindalfoundation.org | 080-23357540'),
  (11, 'vidyasaarathi-scholarship', 'Vidyasaarathi Scholarship Platform (NSE Foundation)', 'Vidyasaarathi', 'NSE Foundation', 'Private', 50000, '₹10,000–50,000/year', 'Annual', 'Corporate CSR', array['Engineering', 'Management', 'Commerce', 'Any Stream']::text[], array['UG', 'PG', 'Diploma']::text[], array['Indian citizen enrolled in recognized institution', 'Annual family income varies by scholarship (₹2L–₹8L)', 'Minimum 60% marks in qualifying exam', 'Enrolled in full-time program', 'Specific criteria vary by corporate partner']::text[], 800000, '₹2–8 Lakhs/year (varies)', 60, 'Rolling Deadlines', 'Online', 'https://www.vidyasaarathi.co.in', 'Vidyasaarathi is NSE Foundation''s digital scholarship platform connecting students with corporate CSR scholarship programs. The platform hosts scholarships from companies like Mahindra, L&T, HDFC Life, ICICI Prudential, and more. Students can apply to multiple scholarships through a single profile.', array['Multiple scholarships on a single platform', '₹10,000–50,000 per year from various corporates', 'Career mentoring programs', 'Digital skills workshops', 'Certificate from partner companies', 'Internship referrals']::text[], array['Aadhaar card', 'Income certificate', 'Previous year marksheet', 'Admission proof', 'Bank account details', 'Specific documents as per scholarship']::text[], 'Varies by scholarship. Generally: application screening → merit list → verification. Some include telephonic interviews.', 'Annual renewal. Different criteria for different partner scholarships.', false, array['Private', 'NSE Foundation', 'Platform', 'Multiple Scholarships', 'Corporate']::text[], '10,000+ across all scholarships', 2016, 'vidyasaarathi.co.in | support@vidyasaarathi.co.in'),
  (13, 'inlaks-shivdasani-scholarship', 'Inlaks Shivdasani Foundation Scholarship', 'Inlaks Scholarship', 'Inlaks Shivdasani Foundation', 'International', 7000000, 'Up to ₹70 Lakhs', 'One-time', 'Study Abroad', array['Any Stream']::text[], array['PG', 'PhD']::text[], array['Indian citizen (living in India at time of application)', 'Age below 30 years (below 35 for PhD)', 'Excellent academic record (minimum first class throughout)', 'Seeking admission to a top university abroad for Masters or PhD', 'Strong research/work experience preferred', 'Not a current student abroad']::text[], null, 'No Income Limit', 65, 'February 2026', 'Online', 'https://www.inlaksfoundation.org', 'The Inlaks Shivdasani Scholarship is India''s most prestigious fully-funded scholarship for studying abroad. Each year, only about 20 extraordinary individuals are selected for this life-changing scholarship. Covering tuition, living expenses, flights, and incidentals at top global universities, it has helped hundreds of Indians achieve their dream of world-class education.', array['Up to ₹70 lakhs total (covers entire study period)', 'Full tuition fee coverage', 'Monthly living allowance in local currency', 'Return flight tickets to India', 'Medical insurance', 'Incidental expenses allowance', 'Membership in Inlaks Alumni Network']::text[], array['Complete academic transcripts (Class 10 to latest)', 'GRE/GMAT/IELTS scores', 'Admission offer from foreign university', 'Three letters of recommendation', 'Personal statement (2,000 words)', 'CV with detailed work/research experience', 'Two forms of ID']::text[], 'Highly competitive: (1) Application screening by committee, (2) Shortlisting of ~100 candidates, (3) In-person interview in Mumbai/Delhi, (4) Final 20 scholars selected. Less than 1% selection rate.', 'Annual progress report. Good standing at the university. Participation in Inlaks alumni events.', true, array['International', 'Study Abroad', 'Prestigious', 'Fully-Funded', 'Masters', 'PhD']::text[], '~20 per year', 1976, 'inlaksfoundation.org | info@inlaksfoundation.org'),
  (14, 'commonwealth-scholarship-uk', 'Commonwealth Scholarship & Fellowship Plan (CSFP)', 'Commonwealth Scholarship', 'Commonwealth Scholarship Commission, UK Government', 'International', 5000000, 'Fully Funded (UK Study)', 'Full Tuition', 'Study Abroad', array['Any Stream']::text[], array['PG', 'PhD']::text[], array['Indian citizen permanently residing in India', 'First class Bachelor''s degree (for Masters)', 'Master''s degree for PhD applications', 'Application must address development needs of India', 'Under 35 years of age (Masters), no age limit for PhD', 'Must return to India after scholarship completion']::text[], null, 'No Income Limit', 60, 'October 2025', 'Online', 'https://cscuk.fcdo.gov.uk', 'Commonwealth Scholarships for Indian students are administered by INYAS (Indian National Young Academy of Science) and funded by the UK government. Available for Masters (1 year) and PhD (3 years) programs at UK universities. These scholarships support academic development and strengthen ties between Commonwealth nations.', array['Full tuition fee coverage at UK universities', 'Monthly stipend in British Pounds (£1,000+/month)', 'Return flights from India to UK', 'UK student visa cost covered', 'Thesis allowance and study travel grants', 'Warm welcome service and study support']::text[], array['All academic transcripts', 'Statement of Purpose', 'Three academic/professional references', 'Research proposal (PhD applicants)', 'IELTS/TOEFL scores', 'Evidence of UK university application/acceptance', 'Passport']::text[], 'Applications submitted to Association of Indian Universities. AUI nominates candidates to Commonwealth Scholarship Commission. Final selection by CSC panel. Very competitive.', 'Annual satisfactory progress reports. Good standing at UK university. Participation in CSC events.', true, array['International', 'UK', 'Commonwealth', 'Fully-Funded', 'Study Abroad']::text[], '~30 for India per year', 1959, 'cscuk.fcdo.gov.uk | aiu.ac.in/scholarships'),
  (15, 'daad-scholarship-germany', 'DAAD Scholarship (German Academic Exchange Service)', 'DAAD', 'Deutscher Akademischer Austauschdienst (DAAD), Germany', 'International', 1300000, '€934/month + Benefits', 'Monthly', 'Study Abroad', array['Engineering', 'Science', 'Management', 'Any Stream']::text[], array['PG', 'PhD']::text[], array['Bachelor''s degree from recognized Indian university', 'Excellent academic record (minimum 55% in graduation)', 'Age below 32 (Masters), below 35 (PhD)', 'German or English language proficiency', 'Accepted or seeking admission at German university', 'Minimum 2 years work experience recommended (for some programs)']::text[], null, 'No Income Limit', 55, 'November 2025', 'Online', 'https://daad.in', 'DAAD (German Academic Exchange Service) is the world''s largest international student exchange organization. For Indian students, DAAD offers a range of scholarships for Masters and PhD programs at German universities. Germany''s public universities often charge zero tuition fees, making a DAAD scholarship effectively a fully-funded education opportunity in Europe.', array['€934 per month (Masters) or €1,200/month (PhD) stipend', 'Study and research allowance', 'Travel subsidy for Germany', 'Health, accident and personal liability insurance', 'Language course support', 'No tuition fees at most German public universities']::text[], array['All academic transcripts', 'Language proficiency (IELTS/German TestDaF)', 'Research proposal', 'CV (Europass format recommended)', 'Two academic references', 'Motivation letter', 'Acceptance letter from German university (if available)']::text[], 'Applications submitted to DAAD Delhi office. Academic evaluation by DAAD, sometimes with interview. Very competitive (5–10% acceptance rate).', 'Satisfactory academic progress reports every semester. Participation in DAAD alumni events post-scholarship.', true, array['International', 'Germany', 'DAAD', 'Study Abroad', 'Europe', 'Free Tuition']::text[], '500+ for India annually', 1925, 'daad.in | delhi@daad.de | +91-11-41065200'),
  (16, 'ugc-net-jrf-fellowship', 'UGC-NET Junior Research Fellowship (JRF)', 'UGC JRF', 'University Grants Commission (UGC), Government of India', 'Government', 312000, '₹37,000/month (JRF), ₹42,000/month (SRF)', 'Monthly', 'Research/PhD', array['Science', 'Arts & Humanities', 'Commerce', 'Any Stream']::text[], array['PhD']::text[], array['NET qualified in a subject', 'Pursuing or seeking to pursue PhD in the subject', 'Age below 30 years (relaxable by 5 years for reserved categories)', 'Masters degree with minimum 55% marks', 'Must be admitted to a recognized Indian university for PhD']::text[], null, 'No Income Limit', 55, 'Rolling (After NET Results)', 'Online', 'https://ugcnet.nta.nic.in', 'UGC-NET Junior Research Fellowship is India''s premier fellowship for PhD research. Awarded to candidates who qualify in the top band of UGC-NET exam, JRF enables bright scholars to pursue full-time doctoral research without financial burden. JRF holders transition to SRF (Senior Research Fellowship) after 2 years with enhanced stipend.', array['JRF: ₹37,000/month for first 2 years', 'SRF: ₹42,000/month after 2 years', 'Contingency grant: ₹10,000/year (Humanities), ₹12,000/year (Sciences)', 'HRA as per university norms', 'Fellowship valid for 5 years total', 'Eligibility for faculty positions (UGC JRF is mandatory for lectureship)']::text[], array['UGC-NET score card', 'Masters degree certificate and marksheet', 'PhD admission letter from university', 'Aadhaar card', 'Bank account details', 'Supervisor acceptance letter']::text[], 'Based on UGC-NET exam results. Top performers (typically top 6% of qualified candidates) receive JRF award letters.', 'Annual progress report approved by supervisor. Upgrade from JRF to SRF based on satisfactory research progress. Maximum 5 years total.', false, array['Government', 'UGC', 'PhD', 'Research', 'JRF', 'SRF', 'NET']::text[], '3,000–4,000 per year', 1987, 'ugcnet.nta.nic.in | ugcnet@nta.ac.in'),
  (18, 'up-scholarship-scheme', 'Uttar Pradesh Scholarship Scheme (Pre & Post-Matric)', 'UP Scholarship', 'Backward Class Welfare Dept., Government of Uttar Pradesh', 'Government', 20000, '₹3,000–20,000/year', 'Annual', 'State Scholarship', array['Any Stream']::text[], array['Class 11-12', 'UG', 'PG']::text[], array['Domicile of Uttar Pradesh', 'SC/ST/OBC/EWS/Minority category student', 'Annual family income below ₹2 lakhs (SC/ST) or ₹2.5 lakhs (OBC/General)', 'Enrolled in a government-recognized institution in UP', 'Aadhaar number mandatory for application']::text[], 250000, '₹2–2.5 Lakhs/year', 0, 'October 2025', 'Online', 'https://scholarship.up.gov.in', 'The UP Scholarship Scheme is India''s largest state-level scholarship program, covering over 2 crore students annually. It provides fee reimbursement and maintenance allowance to SC, ST, OBC, EWS, and minority students in Uttar Pradesh. The scheme is entirely online with direct bank transfer.', array['Pre-Matric (Class 9–10): ₹3,000/year', 'Post-Matric (Class 11–12): ₹8,000–12,000/year', 'UG/PG: ₹12,000–20,000/year', 'Fee reimbursement for recognized courses', 'Hostel allowance for residential students']::text[], array['Domicile certificate', 'Caste certificate', 'Income certificate', 'Previous year marksheet', 'Admission and fee receipt', 'Aadhaar card', 'Bank account details', 'Passport size photograph']::text[], 'All eligible applicants receive the scholarship, subject to budget. Applications verified at district level by welfare department officials.', 'Must renew each year. Passing marks in previous year. Enrollment in the same institution.', false, array['Government', 'UP', 'State Scholarship', 'SC/ST/OBC', 'Reserved Category']::text[], '2 Crore+ students per year', 2001, 'scholarship.up.gov.in | 0522-2287861'),
  (19, 'nsp-obc-scholarship', 'Post-Matric Scholarship for OBC Students', 'Post-Matric OBC', 'Ministry of Social Justice and Empowerment, Govt. of India', 'Government', 15000, 'Fees + ₹1,000–1,200/month', 'Annual', 'Reserved Category', array['Any Stream']::text[], array['Class 11-12', 'UG', 'PG']::text[], array['Belongs to Other Backward Classes (OBC)', 'Annual family income below ₹1 lakh', 'Enrolled in recognized post-matriculation course', 'Must not be receiving scholarship from any other Central Govt. source', 'Indian citizen']::text[], 100000, '₹1 Lakh/year', 0, 'November 2025', 'Online', 'https://scholarships.gov.in', 'The Post-Matric Scholarship for OBC Students is a central government scheme to support Other Backward Class students in pursuing post-matriculation education. The scheme covers maintenance allowance and partial/full fee reimbursement, enabling OBC students from low-income families to continue their education.', array['Maintenance allowance: ₹1,000–1,200/month (hostellers)', 'Day scholar allowance: ₹230–550/month', 'Partial reimbursement of tuition fees', 'Renewable for entire course duration']::text[], array['OBC certificate from competent authority', 'Income certificate', 'Aadhaar card', 'Marksheet of previous exam', 'Current year enrollment and fee proof', 'Bank account details']::text[], 'All eligible applicants who meet income and caste criteria are awarded scholarship, subject to state-wise budget allocation.', 'Pass in each year''s examination. Income limit re-verified annually.', false, array['Government', 'OBC', 'Post-Matric', 'NSP', 'Reserved Category']::text[], '35+ lakh per year', 1998, 'scholarships.gov.in | helpdesk@nsp.gov.in'),
  (20, 'lic-golden-jubilee-scholarship', 'LIC Golden Jubilee Scholarship', 'LIC GJS', 'LIC (Life Insurance Corporation of India)', 'Private', 20000, '₹20,000/year', 'Annual', 'Corporate CSR', array['Any Stream']::text[], array['Class 11-12', 'UG']::text[], array['Passed Class 10 with minimum 60% marks', 'Currently in Class 11, 12, or first year of graduation', 'Annual family income below ₹2.5 lakhs', 'Age between 13–25 years', 'Indian citizen', 'Only NEW applicants in first year; existing students not eligible for fresh application']::text[], 250000, '₹2.5 Lakhs/year', 60, 'May 2026', 'Online', 'https://licindia.in/golden-jubilee', 'LIC Golden Jubilee Scholarship is LIC''s flagship CSR scholarship program to support meritorious students from economically weaker sections. With a track record of over 50 years, LIC has supported thousands of students in completing their education. The scholarship is simple to apply for and has clear eligibility criteria.', array['₹20,000 per year for regular graduation courses', '₹10,000 per year for Class 11/12', 'Covers tuition fees and academic expenses', 'Certificate of scholarship from LIC']::text[], array['Class 10 marksheet', 'Class 12 marksheet (for UG applicants)', 'Income certificate from Tahsildar', 'Admission proof', 'Bank account details', 'Aadhaar card', 'Passport size photograph']::text[], 'Merit-based selection among eligible applicants. Higher marks and lower income prioritized. Central selection by LIC''s Golden Jubilee Foundation.', 'Minimum 60% in each year. Annual renewal with marksheet submission by September.', false, array['Private', 'LIC', 'Corporate', 'Means-cum-Merit']::text[], '2,000 per year', 1957, 'licindia.in/golden-jubilee | 022-68276827')
on conflict do nothing;
select setval(pg_get_serial_sequence('scholarships', 'id'), (select max(id) from scholarships));

-- ─────────────── Admin access ───────────────
insert into admins (email) values ('admin@hellodoctorindia.com') on conflict do nothing;
