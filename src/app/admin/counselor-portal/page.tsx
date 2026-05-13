'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import AdminLayout from '@/components/admin/AdminLayout'

interface UserData {
  role: string
  id: string
  name: string
  email: string
}

interface StudentLead {
  id: string
  name: string
  phone: string
  stream: string
  course_interested: string
  city: string
  intern_name: string
  volunteer_name: string
  registration_status: string
  visit_done: boolean
  remarks: string
  created_at: string
  counselor_name: string
  visit_date: string
  visit_time: string
}

export default function CounselorPortalPage() {
  const [user, setUser] = useState<UserData | null>(null)
  const [leads, setLeads] = useState<StudentLead[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editData, setEditData] = useState<{ visit_done: boolean; remarks: string }>({ visit_done: false, remarks: '' })
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [search, setSearch] = useState('')
  const [exporting, setExporting] = useState(false)

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message })
    setTimeout(() => setToast(null), 4000)
  }

  useEffect(() => {
    const raw = localStorage.getItem('skyhigh_user')
    if (raw) setUser(JSON.parse(raw))
  }, [])

  const fetchLeads = useCallback(async () => {
    if (!user?.name) return
    setLoading(true)
    let query = supabase
      .from('student_leads')
      .select('id, name, phone, stream, course_interested, city, intern_name, volunteer_name, registration_status, visit_done, remarks, created_at, counselor_name, visit_date, visit_time')
      .order('created_at', { ascending: false })

    // Filter by counselor_id if set, otherwise by counselor_name
    if (user.id) {
      query = query.or(`counselor_id.eq.${user.id},counselor_name.eq.${user.name}`)
    } else {
      query = query.eq('counselor_name', user.name)
    }

    if (search) query = query.or(`name.ilike.%${search}%,phone.ilike.%${search}%`)

    const { data, error } = await query.limit(100)
    if (!error && data) setLeads(data)
    setLoading(false)
  }, [user?.id, user?.name, search])

  useEffect(() => { fetchLeads() }, [fetchLeads])

  const startEdit = (lead: StudentLead) => {
    setEditingId(lead.id)
    setEditData({ visit_done: lead.visit_done || false, remarks: lead.remarks || '' })
  }

  const saveEdit = async (id: string) => {
    setSaving(true)
    const { error } = await supabase.from('student_leads').update(editData).eq('id', id)
    if (!error) {
      showToast('success', 'Updated successfully.')
      setEditingId(null)
      fetchLeads()
    } else {
      showToast('error', error.message)
    }
    setSaving(false)
  }

  const statusColor = (s: string) => {
    const map: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      contacted: 'bg-blue-100 text-blue-800',
      interested: 'bg-green-100 text-green-800',
      registered: 'bg-emerald-100 text-emerald-800',
      not_interested: 'bg-red-100 text-red-800',
      follow_up: 'bg-purple-100 text-purple-800',
    }
    return map[s] || 'bg-gray-100 text-gray-700'
  }

  const visitedCount = leads.filter(l => l.visit_done).length
  const pendingVisit = leads.filter(l => !l.visit_done).length

  const handleExport = async () => {
    if (!user?.id) return
    setExporting(true)
    const { data } = await supabase
      .from('student_leads')
      .select('*')
      .or(`counselor_id.eq.${user.id},counselor_name.eq.${user.name}`)
      .order('created_at', { ascending: false })
    if (data && data.length > 0) {
      const headers = ['Name', 'Phone', 'Stream', 'Course', 'City', 'Intern', 'Volunteer', 'Status', 'Visit Done', 'Remarks', 'Date']
      const rows = data.map((r: Record<string, unknown>) => [
        r.name || '', r.phone || '', r.stream || '', r.course_interested || '', r.city || '',
        r.intern_name || '', r.volunteer_name || '', r.registration_status || '',
        r.visit_done ? 'Yes' : 'No', r.remarks || '',
        new Date(r.created_at as string).toLocaleDateString('en-IN'),
      ])
      const csv = [headers, ...rows].map(row => row.map((v: unknown) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n')
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `counselor_leads_${new Date().toISOString().slice(0, 10)}.csv`
      a.click()
      URL.revokeObjectURL(url)
    }
    setExporting(false)
  }

  return (
    <AdminLayout requiredRole="counselor">
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-lg shadow-lg text-sm text-white
          ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
          {toast.message}
        </div>
      )}

      <div className="space-y-6">
        {/* Welcome */}
        <div className="bg-gradient-to-r from-blue-700 to-blue-600 rounded-2xl p-6 text-white">
          <div className="text-sm text-blue-200 mb-1">Welcome back,</div>
          <div className="text-2xl font-bold">{user?.name || 'Counselor'}</div>
          <div className="text-blue-200 text-sm mt-1">Counselor Portal</div>
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

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="text-sm text-gray-500 mb-1">Assigned Leads</div>
            <div className="text-3xl font-bold text-blue-700">{loading ? '...' : leads.length}</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="text-sm text-gray-500 mb-1">Visits Done</div>
            <div className="text-3xl font-bold text-green-600">{loading ? '...' : visitedCount}</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="text-sm text-gray-500 mb-1">Pending Visits</div>
            <div className="text-3xl font-bold text-orange-500">{loading ? '...' : pendingVisit}</div>
          </div>
        </div>

        {/* Filter */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or phone..."
            className="w-full max-w-sm border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Leads Table */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-semibold text-gray-800">My Assigned Leads</h3>
            <button onClick={handleExport} disabled={exporting}
              className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white text-xs font-semibold px-3 py-2 rounded-lg">
              {exporting ? '...' : '⬇️ Export Excel'}
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Name</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Phone</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Stream</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Course</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">City</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Intern</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Volunteer</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Status</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Visit Done</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Remarks</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Date</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i}>
                      {[...Array(12)].map((_, j) => (
                        <td key={j} className="px-4 py-3"><div className="h-4 bg-gray-100 animate-pulse rounded" /></td>
                      ))}
                    </tr>
                  ))
                ) : leads.length === 0 ? (
                  <tr>
                    <td colSpan={12} className="px-4 py-10 text-center text-gray-400">
                      No leads assigned to you yet.
                    </td>
                  </tr>
                ) : leads.map(lead => (
                  <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-800 whitespace-nowrap">{lead.name}</td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{lead.phone}</td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{lead.stream || '-'}</td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{lead.course_interested || '-'}</td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{lead.city || '-'}</td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{lead.intern_name || '-'}</td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{lead.volunteer_name || '-'}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor(lead.registration_status)}`}>
                        {lead.registration_status || 'pending'}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {editingId === lead.id ? (
                        <input type="checkbox" checked={editData.visit_done}
                          onChange={e => setEditData(p => ({ ...p, visit_done: e.target.checked }))}
                          className="w-4 h-4 accent-blue-600" />
                      ) : (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${lead.visit_done ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {lead.visit_done ? 'Yes' : 'No'}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap max-w-[180px]">
                      {editingId === lead.id ? (
                        <input value={editData.remarks}
                          onChange={e => setEditData(p => ({ ...p, remarks: e.target.value }))}
                          className="border border-gray-300 rounded px-2 py-1 text-xs w-full"
                          placeholder="Add remark" />
                      ) : (
                        <span className="text-gray-600 text-xs truncate block">{lead.remarks || '-'}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                      {new Date(lead.created_at).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {editingId === lead.id ? (
                        <div className="flex gap-2">
                          <button onClick={() => saveEdit(lead.id)} disabled={saving}
                            className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 disabled:opacity-50">
                            {saving ? '...' : 'Save'}
                          </button>
                          <button onClick={() => setEditingId(null)}
                            className="text-xs bg-gray-200 text-gray-700 px-3 py-1.5 rounded hover:bg-gray-300">
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button onClick={() => startEdit(lead)}
                          className="text-xs text-blue-600 hover:text-blue-800 font-medium">
                          Edit
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
