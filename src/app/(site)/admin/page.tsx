'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Inbox, Building2, BookOpen, Award, BellDot } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import AdminLayout from '@/components/admin/AdminLayout'

interface RecentLead {
  id: number
  name: string
  phone: string
  course: string | null
  status: string
  created_at: string
}

const count = async (table: string, filter?: [string, string]) => {
  let q = supabase.from(table).select('*', { count: 'exact', head: true })
  if (filter) q = q.eq(filter[0], filter[1])
  const { count } = await q
  return count ?? 0
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Record<string, number> | null>(null)
  const [recent, setRecent] = useState<RecentLead[]>([])

  useEffect(() => {
    Promise.all([
      count('enquiries'),
      count('enquiries', ['status', 'new']),
      count('colleges'),
      count('blogs'),
      count('scholarships'),
      supabase.from('enquiries').select('id, name, phone, course, status, created_at').order('created_at', { ascending: false }).limit(6),
    ]).then(([leads, newLeads, colleges, blogs, scholarships, recentRes]) => {
      setStats({ leads, newLeads, colleges, blogs, scholarships })
      setRecent((recentRes.data as RecentLead[]) ?? [])
    })
  }, [])

  const cards = [
    { label: 'New Leads', key: 'newLeads', href: '/admin/leads', icon: BellDot, color: 'bg-red-50 text-red-600' },
    { label: 'Total Leads', key: 'leads', href: '/admin/leads', icon: Inbox, color: 'bg-green-50 text-green-600' },
    { label: 'Colleges', key: 'colleges', href: '/admin/colleges', icon: Building2, color: 'bg-blue-50 text-blue-600' },
    { label: 'Blogs', key: 'blogs', href: '/admin/blogs', icon: BookOpen, color: 'bg-purple-50 text-purple-600' },
    { label: 'Scholarships', key: 'scholarships', href: '/admin/scholarships', icon: Award, color: 'bg-yellow-50 text-yellow-600' },
  ]

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
          <p className="text-gray-500 text-sm mt-1">Leads and website content at a glance</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
          {cards.map(({ label, key, href, icon: Icon, color }) => (
            <Link key={key} href={href} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center gap-4 hover:border-blue-200 transition-colors">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">
                  {stats ? stats[key].toLocaleString() : <div className="w-10 h-7 bg-gray-200 animate-pulse rounded" />}
                </div>
                <div className="text-sm text-gray-500">{label}</div>
              </div>
            </Link>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Latest Leads</h3>
            <Link href="/admin/leads" className="text-blue-600 text-xs hover:underline">View all</Link>
          </div>
          {!stats ? (
            <div className="space-y-3">{[1, 2, 3].map(i => <div key={i} className="h-10 bg-gray-100 animate-pulse rounded" />)}</div>
          ) : recent.length === 0 ? (
            <p className="text-gray-400 text-sm">No leads yet. Contact form submissions will appear here.</p>
          ) : (
            <div className="divide-y divide-gray-50">
              {recent.map(lead => (
                <div key={lead.id} className="flex items-center justify-between py-2.5">
                  <div>
                    <div className="text-sm font-medium text-gray-800">{lead.name}</div>
                    <div className="text-xs text-gray-500">{lead.phone}{lead.course ? ` • ${lead.course}` : ''}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-400">{new Date(lead.created_at).toLocaleDateString('en-IN')}</div>
                    <div className="text-xs capitalize text-gray-500">{lead.status.replace('_', ' ')}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
