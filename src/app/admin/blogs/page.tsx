'use client'

import AdminLayout from '@/components/admin/AdminLayout'
import ContentManager, { type Field } from '@/components/admin/ContentManager'
import { blogCategories } from '@/data/blogs'

const fields: Field[] = [
  { name: 'title', label: 'Title', type: 'text', required: true, wide: true },
  { name: 'slug', label: 'URL Slug', type: 'text', required: true, slugFrom: 'title', help: 'Auto-filled from the title.' },
  { name: 'category', label: 'Category', type: 'select', options: blogCategories.filter(c => c.slug !== 'all').map(c => c.name) },
  { name: 'excerpt', label: 'Short Summary', type: 'textarea', required: true, help: 'Shown on blog cards.' },
  { name: 'content', label: 'Article', type: 'markdown', required: true, help: 'Formatting: "## Heading", "### Sub-heading", "- list item", "**bold**". Leave a blank line between paragraphs.' },
  { name: 'image', label: 'Cover Image', type: 'image' },
  { name: 'tags', label: 'Tags', type: 'list' },
  { name: 'author', label: 'Author', type: 'text' },
  { name: 'author_role', label: 'Author Role', type: 'text' },
  { name: 'author_avatar', label: 'Author Photo', type: 'image' },
  { name: 'published_at', label: 'Publish Date', type: 'date', required: true },
  { name: 'read_time', label: 'Read Time (minutes)', type: 'number' },
  { name: 'featured', label: 'Show on homepage', type: 'checkbox' },
]

export default function AdminBlogsPage() {
  return (
    <AdminLayout>
      <ContentManager
        table="blogs"
        title="Blogs"
        singular="Blog"
        fields={fields}
        columns={[
          { key: 'title', label: 'Title' },
          { key: 'category', label: 'Category' },
          { key: 'published_at', label: 'Published' },
          { key: 'featured', label: 'Homepage' },
        ]}
        searchKeys={['title', 'category', 'author']}
        orderBy={{ column: 'published_at', ascending: false }}
        defaults={{
          title: '', slug: '', category: 'Admission Guide', excerpt: '', content: '', image: '', tags: [],
          author: 'Hello Doctor Team', author_role: 'NEET & MBBS Admission Counsellors', author_avatar: '',
          published_at: new Date().toISOString().slice(0, 10), read_time: 5, featured: false,
        }}
        viewUrl={row => `/blog/${row.slug}`}
      />
    </AdminLayout>
  )
}
