'use client'

import AdminLayout from '@/components/admin/AdminLayout'
import ContentManager, { type Field } from '@/components/admin/ContentManager'
import { scholarshipStreams, scholarshipLevels } from '@/data/scholarships'

const fields: Field[] = [
  { name: 'name', label: 'Scholarship Name', type: 'text', required: true, wide: true },
  { name: 'slug', label: 'URL Slug', type: 'text', required: true, slugFrom: 'name', help: 'Auto-filled from the name.' },
  { name: 'short_name', label: 'Short Name', type: 'text' },
  { name: 'provider', label: 'Provider', type: 'text', required: true },
  { name: 'provider_type', label: 'Provider Type', type: 'select', options: ['Government', 'Private', 'International', 'University'] },
  { name: 'category', label: 'Category', type: 'text', help: 'e.g. Merit-cum-Means' },
  { name: 'amount', label: 'Amount (₹, number)', type: 'number', help: 'Used for the amount filter' },
  { name: 'amount_display', label: 'Amount (display text)', type: 'text', help: 'e.g. ₹10,000–20,000/year' },
  { name: 'amount_type', label: 'Amount Type', type: 'select', options: ['Annual', 'One-time', 'Monthly', 'Full Tuition'] },
  { name: 'streams', label: 'Streams', type: 'multiselect', options: scholarshipStreams },
  { name: 'level', label: 'Levels', type: 'multiselect', options: scholarshipLevels },
  { name: 'income_limit', label: 'Family Income Limit (₹/yr)', type: 'number', nullable: true, help: 'Leave empty if there is no limit' },
  { name: 'income_limit_display', label: 'Income Limit (display text)', type: 'text', help: 'e.g. ₹4.5 Lakh/year or No Income Limit' },
  { name: 'min_marks', label: 'Minimum Marks (%)', type: 'number' },
  { name: 'deadline', label: 'Deadline', type: 'text', help: 'e.g. October 2026' },
  { name: 'application_mode', label: 'Application Mode', type: 'select', options: ['Online', 'Offline', 'Both'] },
  { name: 'apply_url', label: 'Apply Link', type: 'text' },
  { name: 'contact', label: 'Contact', type: 'text' },
  { name: 'no_of_awards', label: 'Number of Awards', type: 'text' },
  { name: 'established_year', label: 'Established (year)', type: 'number' },
  { name: 'description', label: 'Description', type: 'textarea', required: true },
  { name: 'eligibility_criteria', label: 'Eligibility Criteria', type: 'list' },
  { name: 'benefits', label: 'Benefits', type: 'list' },
  { name: 'documents', label: 'Documents Required', type: 'list' },
  { name: 'selection_process', label: 'Selection Process', type: 'textarea' },
  { name: 'renewal_criteria', label: 'Renewal Criteria', type: 'textarea' },
  { name: 'tags', label: 'Tags', type: 'list' },
  { name: 'featured', label: 'Show on homepage', type: 'checkbox' },
]

export default function AdminScholarshipsPage() {
  return (
    <AdminLayout>
      <ContentManager
        table="scholarships"
        title="Scholarships"
        singular="Scholarship"
        fields={fields}
        columns={[
          { key: 'name', label: 'Name' },
          { key: 'provider_type', label: 'Type' },
          { key: 'amount_display', label: 'Amount' },
          { key: 'deadline', label: 'Deadline' },
          { key: 'featured', label: 'Homepage' },
        ]}
        searchKeys={['name', 'short_name', 'provider']}
        orderBy={{ column: 'id', ascending: true }}
        defaults={{
          name: '', slug: '', short_name: '', provider: '', provider_type: 'Government', category: '', amount: 0,
          amount_display: '', amount_type: 'Annual', streams: ['Medical'], level: ['UG'], income_limit: null,
          income_limit_display: 'No Income Limit', min_marks: 0, deadline: '', application_mode: 'Online', apply_url: '',
          contact: '', no_of_awards: '', established_year: new Date().getFullYear(), description: '',
          eligibility_criteria: [], benefits: [], documents: [], selection_process: '', renewal_criteria: '', tags: [],
          featured: false,
        }}
        viewUrl={row => `/scholarship/${row.slug}`}
      />
    </AdminLayout>
  )
}
