import { supabase } from './supabase'
import type { College } from '@/data/colleges'
import type { BlogPost } from '@/data/blogs'
import type { Scholarship } from '@/data/scholarships'

export interface CollegeRow {
  id: number
  name: string
  short_name: string
  slug: string
  location: string
  city: string
  state: string
  fees: number
  fees_display: string
  rating: number
  review_count: number
  streams: string[]
  ranking: number
  nirf_rank: string
  established: number
  type: College['type']
  accreditation: string
  image: string
  description: string
  highlights: string[]
  exams: string[]
  avg_package: number
  highest_package: number
  top_hospitals: string[]
  courses: string[]
  approvals: string[]
}

export interface BlogRow {
  id: number
  slug: string
  title: string
  excerpt: string
  content: string
  category: string
  tags: string[]
  author: string
  author_role: string
  author_avatar: string
  published_at: string
  read_time: number
  image: string
  featured: boolean
}

export interface ScholarshipRow {
  id: number
  slug: string
  name: string
  short_name: string
  provider: string
  provider_type: Scholarship['providerType']
  amount: number
  amount_display: string
  amount_type: Scholarship['amountType']
  category: string
  streams: string[]
  level: Scholarship['level']
  eligibility_criteria: string[]
  income_limit: number | null
  income_limit_display: string
  min_marks: number
  deadline: string
  application_mode: Scholarship['applicationMode']
  apply_url: string
  description: string
  benefits: string[]
  documents: string[]
  selection_process: string
  renewal_criteria: string
  featured: boolean
  tags: string[]
  no_of_awards: string
  established_year: number
  contact: string
}

const toCollege = (r: CollegeRow): College => ({
  id: r.id,
  name: r.name,
  shortName: r.short_name,
  slug: r.slug,
  location: r.location,
  city: r.city,
  state: r.state,
  fees: r.fees,
  feesDisplay: r.fees_display,
  rating: Number(r.rating),
  reviewCount: r.review_count,
  streams: r.streams,
  ranking: r.ranking,
  nirfRank: r.nirf_rank,
  established: r.established,
  type: r.type,
  accreditation: r.accreditation,
  image: r.image,
  description: r.description,
  highlights: r.highlights,
  exams: r.exams,
  placements: { avgPackage: r.avg_package, highestPackage: r.highest_package, companies: r.top_hospitals },
  courses: r.courses,
  approvals: r.approvals,
})

const toBlog = (r: BlogRow): BlogPost => ({
  id: r.id,
  slug: r.slug,
  title: r.title,
  excerpt: r.excerpt,
  content: r.content,
  category: r.category,
  tags: r.tags,
  author: r.author,
  authorRole: r.author_role,
  authorAvatar: r.author_avatar,
  publishedAt: r.published_at,
  readTime: r.read_time,
  image: r.image,
  featured: r.featured,
})

const toScholarship = (r: ScholarshipRow): Scholarship => ({
  id: r.id,
  slug: r.slug,
  name: r.name,
  shortName: r.short_name,
  provider: r.provider,
  providerType: r.provider_type,
  amount: r.amount,
  amountDisplay: r.amount_display,
  amountType: r.amount_type,
  category: r.category,
  streams: r.streams,
  level: r.level,
  eligibilityCriteria: r.eligibility_criteria,
  incomeLimit: r.income_limit,
  incomeLimitDisplay: r.income_limit_display,
  minMarks: r.min_marks,
  deadline: r.deadline,
  applicationMode: r.application_mode,
  applyUrl: r.apply_url,
  description: r.description,
  benefits: r.benefits,
  documents: r.documents,
  selectionProcess: r.selection_process,
  renewalCriteria: r.renewal_criteria,
  featured: r.featured,
  tags: r.tags,
  noOfAwards: r.no_of_awards,
  establishedYear: r.established_year,
  contact: r.contact,
})

// Errors are thrown (not swallowed) so a failed fetch keeps serving the last good page instead of an empty one.
export async function getColleges(): Promise<College[]> {
  const { data, error } = await supabase.from('colleges').select('*').order('id')
  if (error) throw new Error(`colleges: ${error.message}`)
  return (data as CollegeRow[]).map(toCollege)
}

export async function getBlogs(): Promise<BlogPost[]> {
  const { data, error } = await supabase.from('blogs').select('*').order('published_at', { ascending: false })
  if (error) throw new Error(`blogs: ${error.message}`)
  return (data as BlogRow[]).map(toBlog)
}

export async function getScholarships(): Promise<Scholarship[]> {
  const { data, error } = await supabase.from('scholarships').select('*').order('id')
  if (error) throw new Error(`scholarships: ${error.message}`)
  return (data as ScholarshipRow[]).map(toScholarship)
}
