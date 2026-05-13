import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export type SupabaseCollege = {
  id: string
  name: string
  slug: string
  location_city: string
  location_state: string
  category: string
  description: string
  logo_url: string
  logo: string
  banner_url: string
  rating: number
  reviews_count: number
  fees: number
  fee: number
  ranking: number
  nirf: number
  is_top: boolean
  is_popular: boolean
  established: number
  established_year: number
  website: string
  dept: string
  exam: string
  courses: string[] | string
  specialties: string[] | string
  facilities: string[]
  placement: Record<string, unknown>
  accreditation: string
  tags: string[]
}

// Map Supabase college to the shape the existing components expect
import type { College } from '@/data/colleges'

export function mapCollege(c: SupabaseCollege): College {
  const fees = c.fees || c.fee || 0
  const feesDisplay = fees >= 100000
    ? `₹${(fees / 100000).toFixed(1)}L/yr`
    : fees > 0
    ? `₹${(fees / 1000).toFixed(0)}K/yr`
    : 'Contact for fees'

  const location = [c.location_city, c.location_state].filter(Boolean).join(', ')

  const rawDept = c.dept || c.category || ''
  const streams = rawDept
    .split(/[,/]/)
    .map((s: string) => s.trim())
    .filter(Boolean)

  let type: 'Government' | 'Private' | 'Deemed' = 'Private'
  if (c.category === 'Government') type = 'Government'
  else if (c.category === 'Deemed') type = 'Deemed'

  const exams = c.exam
    ? c.exam.split(/[,;]/).map((s: string) => s.trim()).filter(Boolean)
    : []

  const p = (c.placement as Record<string, unknown>) || {}
  const placements = {
    avgPackage: (p.avgPackage as number) || (p.avg_package as number) || 500000,
    highestPackage: (p.highestPackage as number) || (p.highest_package as number) || 1500000,
    companies: (p.companies as string[]) || (p.top_companies as string[]) || [],
  }

  const courses: string[] = Array.isArray(c.courses)
    ? c.courses
    : typeof c.courses === 'string' && c.courses
    ? c.courses.split(/[,/]/).map((s: string) => s.trim()).filter(Boolean)
    : ['B.Tech']

  const highlights: string[] = Array.isArray(c.specialties)
    ? c.specialties
    : typeof c.specialties === 'string' && c.specialties
    ? c.specialties.split(',').map((s: string) => s.trim()).filter(Boolean)
    : []

  const image =
    c.banner_url ||
    c.logo_url ||
    c.logo ||
    'https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80'

  return {
    id: c.id as unknown as number,
    name: c.name,
    shortName: c.name.split(' ').slice(0, 3).join(' '),
    slug: c.slug || String(c.id),
    location,
    city: c.location_city || '',
    state: c.location_state || '',
    fees,
    feesDisplay,
    rating: c.rating || 4.0,
    reviewCount: c.reviews_count || 100,
    streams: streams.length > 0 ? streams : ['Engineering'],
    ranking: c.nirf || c.ranking || 999,
    nirfRank: c.nirf ? `#${c.nirf} NIRF 2024` : 'Listed',
    established: c.established || c.established_year || 2000,
    type,
    accreditation: c.accreditation || 'NAAC',
    image,
    description:
      c.description ||
      `${c.name} is a premier educational institution offering quality education across various disciplines.`,
    highlights,
    exams,
    placements,
    courses,
    approvals: c.accreditation ? c.accreditation.split(',').map((s: string) => s.trim()) : ['UGC'],
  }
}
