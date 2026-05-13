'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import AdminLayout from '@/components/admin/AdminLayout'

interface UserData {
  role: string
  id: string
  name: string
  email: string
  password?: string
}

interface Volunteer {
  id: string
  name: string
  email: string
  password: string
  created_at: string
  leads_count?: number
}

interface StudentLead {
  id: string
  name: string
  phone: string
  stream: string
  course_interested: string
  city: string
  volunteer_name: string
  registration_status: string
  created_at: string
}

export default function InternPortalPage() {
  const [user, setUser] = useState<UserData | null>(null)
  const [volunteers, setVolunteers] = useState<Volunteer[]>([])
  const [leads, setLeads] = useState<StudentLead[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddVolunteer, setShowAddVolunteer] = useState(false)
  const [volForm, setVolForm] = useState({ name: '', email: '', password: '' })
  const [submitting, setSubmitting] = useState(false)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [totalLeads, setTotalLeads] = useState(0)
  const [showMyPassword, setShowMyPassword] = useState(false)
  const [myPassword, setMyPassword] = useState('')
  const [visibleVolPasswords, setVisibleVolPasswords] = useState<Record<string, boolean>>({})
  const [exporting, setExporting] = useState(false)

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message })
    setTimeout(() => setToast(null), 4000)
  }

  useEffect(() => {
    const raw = localStorage.getItem('skyhigh_user')
    if (raw) {
      const parsed = JSON.parse(raw)
      setUser(parsed)
      // Fetch actual password from DB
      supabase.from('interns').select('password').eq('id', parsed.id).single()
        .then(({ data }) => { if (data) setMyPassword(data.password) })
    }
  }, [])

  const fetchData = useCallback(async () => {
    if (!user?.id) return
    setLoading(true)
    try {
      const { data: vols } = await supabase
        .from('volunteers')
        .select('*')
        .eq('intern_id', user.id)
        .order('created_at', { ascending: false })

      if (vols) {
        const enriched = await Promise.all(vols.map(async (v: Volunteer) => {
          const { count } = await supabase
            .from('student_leads')
            .select('*', { count: 'exact', head: true })
            .eq('volunteer_id', v.id)
          return { ...v, leads_count: count || 0 }
        }))
        setVolunteers(enriched)
      }

      const { data: leadsData, count } = await supabase
        .from('student_leads')
        .select('id, name, phone, stream, course_interested, city, volunteer_name, registration_status, created_at', { count: 'exact' })
        .eq('intern_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50)

      if (leadsData) setLeads(leadsData)
      setTotalLeads(count || 0)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [user?.id])

  useEffect(() => { fetchData() }, [fetchData])

  const handleAddVolunteer = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!volForm.name || !volForm.email || !volForm.password || !user) {
      showToast('error', 'All fields are required.')
      return
    }
    setSubmitting(true)
    const { error } = await supabase.from('volunteers').insert([{
      name: volForm.name,
      email: volForm.email,
      password: volForm.password,
      intern_id: user.id,
      intern_name: user.name,
    }])
    if (error) {
      showToast('error', error.message)
    } else {
      showToast('success', 'Volunteer added successfully.')
      setShowAddVolunteer(false)
      setVolForm({ name: '', email: '', password: '' })
      fetchData()
    }
    setSubmitting(false)
  }

  const handleExport = async () => {
    if (!user?.id) return
    setExporting(true)
    const { data } = await supabase
      .from('student_leads')
      .select('*')
      .eq('intern_id', user.id)
      .order('created_at', { ascending: false })
    if (data && data.length > 0) {
      const headers = ['Name', 'Phone', 'Alt Phone', 'Stream', 'Course', 'City', 'Class', 'Father Name', 'Volunteer', 'Status', 'Visit Done', 'Remarks', 'Date']
      const rows = data.map((r: Record<string, unknown>) => [
        r.name || '', r.phone || '', r.alt_phone || '', r.stream || '', r.course_interested || '',
        r.city || '', r.class || '', r.fathers_name || '', r.volunteer_name || '',
        r.registration_status || '', r.visit_done ? 'Yes' : 'No', r.remarks || '',
        new Date(r.created_at as string).toLocaleDateString('en-IN'),
      ])
      const csv = [headers, ...rows].map(row => row.map((v: unknown) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n')
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `my_leads_${new Date().toISOString().slice(0, 10)}.csv`
      a.click()
      URL.revokeObjectURL(url)
    }
    setExporting(false)
  }

  const statusColor = (s: string) => {
    const map: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      contacted: 'bg-blue-100 text-blue-800',
      interested: 'bg-green-100 text-green-800',
      registered: 'bg-emerald-100 text-emerald-800',
      not_interested: 'bg-red-100 text-red-800',
    }
    return map[s] || 'bg-gray-100 text-gray-700'
  }

  return (
    <AdminLayout requiredRole="intern">
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-lg shadow-lg text-sm text-white
          ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
          {toast.message}
        </div>
      )}

      {/* Add Volunteer Modal */}
      {showAddVolunteer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Add New Volunteer</h3>
            <form onSubmit={handleAddVolunteer} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name <span className="text-red-500">*</span></label>
                <input value={volForm.name} onChange={e => setVolForm(p => ({ ...p, name: e.target.value }))} required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Volunteer's full name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
                <input type="email" value={volForm.email} onChange={e => setVolForm(p => ({ ...p, email: e.target.value }))} required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="volunteer@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password <span className="text-red-500">*</span></label>
                <input type="password" value={volForm.password} onChange={e => setVolForm(p => ({ ...p, password: e.target.value }))} required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Set a password" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={submitting}
                  className="flex-1 bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 text-white font-semibold py-2.5 rounded-lg text-sm">
                  {submitting ? 'Adding...' : 'Add Volunteer'}
                </button>
                <button type="button" onClick={() => { setShowAddVolunteer(false); setVolForm({ name: '', email: '', password: '' }) }}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 rounded-lg text-sm">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* Welcome */}
        <div className="bg-gradient-to-r from-blue-700 to-blue-600 rounded-2xl p-6 text-white">
          <div className="text-sm text-blue-200 mb-1">Welcome back,</div>
          <div className="text-2xl font-bold">{user?.name || 'Intern'}</div>
          <div className="text-blue-200 text-sm mt-1">Intern Portal</div>
        </div>

        {/* Form Links */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Share Forms with Students</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a href="/registration" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-3 border border-orange-200 bg-orange-50 hover:bg-orange-100 rounded-xl px-4 py-3 transition-colors">
              <div className="w-9 h-9 bg-orange-500 rounded-lg flex items-center justify-center text-white text-lg shrink-0">📋</div>
              <div>
                <div className="font-semibold text-sm text-gray-800">Expo Registration</div>
                <div className="text-xs text-gray-500">Student lead capture form</div>
              </div>
            </a>
            <a href="/admission" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-3 border border-green-200 bg-green-50 hover:bg-green-100 rounded-xl px-4 py-3 transition-colors">
              <div className="w-9 h-9 bg-green-600 rounded-lg flex items-center justify-center text-white text-lg shrink-0">🎓</div>
              <div>
                <div className="font-semibold text-sm text-gray-800">Admission Form</div>
                <div className="text-xs text-gray-500">College admission registration</div>
              </div>
            </a>
          </div>
        </div>

        {/* Stats + Credentials */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="text-sm text-gray-500 mb-1">My Volunteers</div>
            <div className="text-3xl font-bold text-blue-700">{loading ? '...' : volunteers.length}</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="text-sm text-gray-500 mb-1">Total Leads</div>
            <div className="text-3xl font-bold text-green-600">{loading ? '...' : totalLeads}</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="text-sm text-gray-500 mb-1">My Credentials</div>
            <div className="text-xs text-gray-700 mt-1 break-all">{user?.email}</div>
            <div className="flex items-center gap-2 mt-1">
              <span className="font-mono text-xs text-gray-700">
                {showMyPassword ? myPassword : '••••••••'}
              </span>
              <button onClick={() => setShowMyPassword(p => !p)} className="text-gray-400 hover:text-gray-600">
                {showMyPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>
        </div>

        {/* Volunteers */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800 text-base">My Volunteers</h3>
            <button onClick={() => setShowAddVolunteer(true)}
              className="bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold px-4 py-2 rounded-lg">
              + Add Volunteer
            </button>
          </div>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => <div key={i} className="h-12 bg-gray-100 animate-pulse rounded-lg" />)}
            </div>
          ) : volunteers.length === 0 ? (
            <p className="text-gray-400 text-sm">No volunteers yet. Add your first volunteer.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="pb-3 text-left font-semibold text-gray-600">Name</th>
                    <th className="pb-3 text-left font-semibold text-gray-600">Email</th>
                    <th className="pb-3 text-left font-semibold text-gray-600">Password</th>
                    <th className="pb-3 text-left font-semibold text-gray-600">Leads</th>
                    <th className="pb-3 text-left font-semibold text-gray-600">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {volunteers.map(vol => (
                    <tr key={vol.id} className="hover:bg-gray-50">
                      <td className="py-3 font-medium text-gray-800">{vol.name}</td>
                      <td className="py-3 text-gray-600">{vol.email}</td>
                      <td className="py-3">
                        <div className="flex items-center gap-1">
                          <span className="font-mono text-xs text-gray-700">
                            {visibleVolPasswords[vol.id] ? vol.password : '••••••••'}
                          </span>
                          <button onClick={() => setVisibleVolPasswords(p => ({ ...p, [vol.id]: !p[vol.id] }))}
                            className="text-gray-400 hover:text-gray-600 text-xs">
                            {visibleVolPasswords[vol.id] ? '🙈' : '👁️'}
                          </button>
                        </div>
                      </td>
                      <td className="py-3">
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">{vol.leads_count}</span>
                      </td>
                      <td className="py-3 text-gray-500 text-xs">{new Date(vol.created_at).toLocaleDateString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Leads */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800 text-base">Student Leads from My Team</h3>
            <button onClick={handleExport} disabled={exporting}
              className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white text-xs font-semibold px-3 py-2 rounded-lg">
              {exporting ? '...' : '⬇️ Export Excel'}
            </button>
          </div>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => <div key={i} className="h-10 bg-gray-100 animate-pulse rounded" />)}
            </div>
          ) : leads.length === 0 ? (
            <p className="text-gray-400 text-sm">No leads yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="pb-3 text-left font-semibold text-gray-600 whitespace-nowrap">Name</th>
                    <th className="pb-3 text-left font-semibold text-gray-600 whitespace-nowrap">Phone</th>
                    <th className="pb-3 text-left font-semibold text-gray-600 whitespace-nowrap">Stream</th>
                    <th className="pb-3 text-left font-semibold text-gray-600 whitespace-nowrap">City</th>
                    <th className="pb-3 text-left font-semibold text-gray-600 whitespace-nowrap">Volunteer</th>
                    <th className="pb-3 text-left font-semibold text-gray-600 whitespace-nowrap">Status</th>
                    <th className="pb-3 text-left font-semibold text-gray-600 whitespace-nowrap">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {leads.map(lead => (
                    <tr key={lead.id} className="hover:bg-gray-50">
                      <td className="py-3 font-medium text-gray-800 whitespace-nowrap">{lead.name}</td>
                      <td className="py-3 text-gray-600 whitespace-nowrap">{lead.phone}</td>
                      <td className="py-3 text-gray-600 whitespace-nowrap">{lead.stream || '-'}</td>
                      <td className="py-3 text-gray-600 whitespace-nowrap">{lead.city || '-'}</td>
                      <td className="py-3 text-gray-600 whitespace-nowrap">{lead.volunteer_name || '-'}</td>
                      <td className="py-3 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor(lead.registration_status)}`}>
                          {lead.registration_status || 'pending'}
                        </span>
                      </td>
                      <td className="py-3 text-gray-500 text-xs whitespace-nowrap">
                        {new Date(lead.created_at).toLocaleDateString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
