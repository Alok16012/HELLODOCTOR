'use client'

import AdminLayout from '@/components/admin/AdminLayout'
import ContentManager, { type Field } from '@/components/admin/ContentManager'
import { streams } from '@/data/colleges'

const streamOptions = [
  ...streams.map(s => s.name),
  'MBBS Russia', 'MBBS Georgia', 'MBBS Uzbekistan', 'MBBS Kyrgyzstan', 'MBBS Nepal',
]

const fields: Field[] = [
  { name: 'name', label: 'College / University Name', type: 'text', required: true, wide: true },
  { name: 'slug', label: 'URL Slug', type: 'text', required: true, slugFrom: 'name', help: 'Auto-filled from the name. Lowercase words joined by hyphens.' },
  { name: 'short_name', label: 'Short Name', type: 'text', help: 'e.g. AIIMS Delhi' },
  { name: 'streams', label: 'Programs', type: 'multiselect', options: streamOptions, help: 'Abroad universities: select "MBBS Abroad" plus the country.' },
  { name: 'type', label: 'Type', type: 'select', options: ['Government', 'Private', 'Deemed'] },
  { name: 'accreditation', label: 'Accreditation', type: 'text', help: 'e.g. NMC Approved' },
  { name: 'location', label: 'Location (display)', type: 'text', help: 'e.g. New Delhi, Delhi' },
  { name: 'city', label: 'City', type: 'text' },
  { name: 'state', label: 'State / Country', type: 'text' },
  { name: 'fees', label: 'Annual Fees (₹, number)', type: 'number', help: 'Used for the fee filter' },
  { name: 'fees_display', label: 'Fees (display text)', type: 'text', help: 'e.g. ₹3.5L/yr (indicative)' },
  { name: 'established', label: 'Established (year)', type: 'number' },
  { name: 'rating', label: 'Rating (0–5)', type: 'number', step: '0.1' },
  { name: 'review_count', label: 'Review Count', type: 'number' },
  { name: 'ranking', label: 'NIRF Rank (number)', type: 'number', help: 'Used for sorting. Use 999 if not ranked.' },
  { name: 'nirf_rank', label: 'NIRF Rank (display text)', type: 'text', help: 'e.g. #1 NIRF Medical' },
  { name: 'image', label: 'Image', type: 'image' },
  { name: 'description', label: 'Description', type: 'textarea', required: true },
  { name: 'highlights', label: 'Key Highlights', type: 'list' },
  { name: 'courses', label: 'Programs Offered', type: 'list', help: 'e.g. MBBS, MD, MS' },
  { name: 'exams', label: 'Entrance Exams', type: 'list' },
  { name: 'approvals', label: 'Approvals', type: 'list' },
  { name: 'avg_package', label: 'Avg Starting Salary (₹/yr)', type: 'number' },
  { name: 'highest_package', label: 'Senior Specialist Salary (₹/yr)', type: 'number' },
  { name: 'top_hospitals', label: 'Internship & Residency Hospitals', type: 'list' },
]

export default function AdminCollegesPage() {
  return (
    <AdminLayout>
      <ContentManager
        table="colleges"
        title="Colleges"
        singular="College"
        fields={fields}
        columns={[
          { key: 'name', label: 'Name' },
          { key: 'streams', label: 'Programs' },
          { key: 'location', label: 'Location' },
          { key: 'fees_display', label: 'Fees' },
        ]}
        searchKeys={['name', 'short_name', 'location', 'city', 'state']}
        orderBy={{ column: 'id', ascending: true }}
        defaults={{
          name: '', slug: '', short_name: '', streams: ['MBBS India'], type: 'Private', accreditation: 'NMC Approved',
          location: '', city: '', state: '', fees: 0, fees_display: '', established: new Date().getFullYear(),
          rating: 4.0, review_count: 0, ranking: 999, nirf_rank: 'Not NIRF Ranked', image: '', description: '',
          highlights: [], courses: ['MBBS'], exams: ['NEET UG'], approvals: ['NMC'], avg_package: 0, highest_package: 0,
          top_hospitals: [],
        }}
        viewUrl={row => `/colleges/${row.id}`}
      />
    </AdminLayout>
  )
}
