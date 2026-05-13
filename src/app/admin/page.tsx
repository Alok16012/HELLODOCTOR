'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import AdminLayout from '@/components/admin/AdminLayout'

interface Stats {
  student_leads: number
  expo_registrations: number
  leads: number
  interns: number
  volunteers: number
  counselors: number
}

const StatCard = ({ label, count, icon, color }: { label: string; count: number | null; icon: string; color: string }) => (
  <div className={`bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex items-center gap-4`}>
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${color}`}>
      {icon}
    </div>
    <div>
      <div className="text-2xl font-bold text-gray-800">
        {count === null ? <div className="w-12 h-7 bg-gray-200 animate-pulse rounded" /> : count.toLocaleString()}
      </div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  </div>
)

export default function AdminDashboard() {
  const [stats, setStats] = useState<Partial<Stats>>({})
  const [loading, setLoading] = useState(true)
  const [recentLeads, setRecentLeads] = useState<{ name: string; phone: string; stream: string; created_at: string }[]>([])

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [
          { count: slCount },
          { count: erCount },
          { count: leadsCount },
          { count: internsCount },
          { count: volCount },
          { count: counselorsCount },
        ] = await Promise.all([
          supabase.from('student_leads').select('*', { count: 'exact', head: true }),
          supabase.from('expo_registrations').select('*', { count: 'exact', head: true }),
          supabase.from('leads').select('*', { count: 'exact', head: true }),
          supabase.from('interns').select('*', { count: 'exact', head: true }),
          supabase.from('volunteers').select('*', { count: 'exact', head: true }),
          supabase.from('counselors').select('*', { count: 'exact', head: true }),
        ])

        setStats({
          student_leads: slCount || 0,
          expo_registrations: erCount || 0,
          leads: leadsCount || 0,
          interns: internsCount || 0,
          volunteers: volCount || 0,
          counselors: counselorsCount || 0,
        })

        const { data: recent } = await supabase
          .from('student_leads')
          .select('name, phone, stream, created_at')
          .order('created_at', { ascending: false })
          .limit(5)
        if (recent) setRecentLeads(recent)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  return (
    <AdminLayout requiredRole="admin">
      <div className="space-y-6">
        {/* Page Title */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
          <p className="text-gray-500 text-sm mt-1">Overview of all activities</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          <StatCard label="Student Leads" count={loading ? null : (stats.student_leads ?? 0)} icon="🎓" color="bg-blue-100" />
          <StatCard label="Expo Registrations" count={loading ? null : (stats.expo_registrations ?? 0)} icon="📋" color="bg-purple-100" />
          <StatCard label="Enquiries (Leads)" count={loading ? null : (stats.leads ?? 0)} icon="📞" color="bg-green-100" />
          <StatCard label="Interns" count={loading ? null : (stats.interns ?? 0)} icon="👨‍💼" color="bg-orange-100" />
          <StatCard label="Volunteers" count={loading ? null : (stats.volunteers ?? 0)} icon="🤝" color="bg-pink-100" />
          <StatCard label="Counselors" count={loading ? null : (stats.counselors ?? 0)} icon="💬" color="bg-teal-100" />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Recent Leads */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">Recent Student Leads</h3>
              <a href="/admin/student-leads" className="text-blue-600 text-xs hover:underline">View all</a>
            </div>
            {loading ? (
              <div className="space-y-3">
                {[1,2,3].map(i => <div key={i} className="h-10 bg-gray-100 animate-pulse rounded" />)}
              </div>
            ) : recentLeads.length === 0 ? (
              <p className="text-gray-400 text-sm">No leads yet.</p>
            ) : (
              <div className="space-y-3">
                {recentLeads.map((lead, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <div>
                      <div className="text-sm font-medium text-gray-800">{lead.name}</div>
                      <div className="text-xs text-gray-500">{lead.phone} &bull; {lead.stream}</div>
                    </div>
                    <div className="text-xs text-gray-400">
                      {new Date(lead.created_at).toLocaleDateString('en-IN')}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-semibold text-gray-800 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { href: '/admin/student-leads', label: 'Student Leads', icon: '🎓' },
                { href: '/admin/expo-registrations', label: 'Expo Registrations', icon: '📋' },
                { href: '/admin/interns', label: 'Manage Interns', icon: '👨‍💼' },
                { href: '/admin/leads', label: 'Enquiries', icon: '📞' },
                { href: '/registration', label: 'Registration Form', icon: '📝' },
                { href: '/admission', label: 'Admission Form', icon: '🏫' },
              ].map(item => (
                <a
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm text-gray-700 font-medium"
                >
                  <span>{item.icon}</span>
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
