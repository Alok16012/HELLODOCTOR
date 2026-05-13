'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import AdminLayout from '@/components/admin/AdminLayout'

interface Counselor {
  id: string
  name: string
  email: string
  password: string
  created_at: string
  leads_count?: number
}

interface LeadRow {
  id: string
  name: string
  phone: string
  stream: string
  course_interested: string
  city: string
  registration_status: string
  visit_done: boolean
  created_at: string
}

export default function CounselorsPage() {
  const [counselors, setCounselors] = useState<Counselor[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({})
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [counselorLeads, setCounselorLeads] = useState<Record<string, LeadRow[]>>({})
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message })
    setTimeout(() => setToast(null), 4000)
  }

  const fetchCounselors = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase.from('counselors').select('*').order('created_at', { ascending: false })
    if (!error && data) {
      const enriched = await Promise.all(data.map(async (c: Counselor) => {
        const { count } = await supabase
          .from('student_leads')
          .select('*', { count: 'exact', head: true })
          .or(`counselor_id.eq.${c.id},counselor_name.eq.${c.name}`)
        return { ...c, leads_count: count || 0 }
      }))
      setCounselors(enriched)
    }
    setLoading(false)
  }, [])

  useEffect(() => { fetchCounselors() }, [fetchCounselors])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.password) {
      showToast('error', 'All fields required.')
      return
    }
    setSubmitting(true)
    const { error } = await supabase.from('counselors').insert([{ name: form.name, email: form.email, password: form.password }])
    if (error) {
      showToast('error', error.message)
    } else {
      showToast('success', 'Counselor added.')
      setShowModal(false)
      setForm({ name: '', email: '', password: '' })
      fetchCounselors()
    }
    setSubmitting(false)
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete counselor "${name}"?`)) return
    setDeletingId(id)
    const { error } = await supabase.from('counselors').delete().eq('id', id)
    if (error) {
      showToast('error', error.message)
    } else {
      showToast('success', 'Counselor deleted.')
      fetchCounselors()
    }
    setDeletingId(null)
  }

  const togglePassword = (id: string) => {
    setVisiblePasswords(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const toggleExpand = async (counselor: Counselor) => {
    if (expandedId === counselor.id) {
      setExpandedId(null)
      return
    }
    setExpandedId(counselor.id)
    if (!counselorLeads[counselor.id]) {
      const { data } = await supabase
        .from('student_leads')
        .select('id, name, phone, stream, course_interested, city, registration_status, visit_done, created_at')
        .or(`counselor_id.eq.${counselor.id},counselor_name.eq.${counselor.name}`)
        .order('created_at', { ascending: false })
        .limit(50)
      setCounselorLeads(prev => ({ ...prev, [counselor.id]: data || [] }))
    }
  }

  const exportCounselorLeads = async (counselor: Counselor) => {
    const { data } = await supabase
      .from('student_leads')
      .select('*')
      .or(`counselor_id.eq.${counselor.id},counselor_name.eq.${counselor.name}`)
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
      a.download = `${counselor.name}_leads_${new Date().toISOString().slice(0, 10)}.csv`
      a.click()
      URL.revokeObjectURL(url)
    } else {
      showToast('error', 'No leads found for this counselor.')
    }
  }

  const statusColor = (s: string) => {
    const map: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-700',
      contacted: 'bg-blue-100 text-blue-700',
      interested: 'bg-green-100 text-green-700',
      registered: 'bg-emerald-100 text-emerald-700',
      not_interested: 'bg-red-100 text-red-700',
      follow_up: 'bg-purple-100 text-purple-700',
    }
    return map[s] || 'bg-gray-100 text-gray-700'
  }

  return (
    <AdminLayout requiredRole="admin">
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-lg shadow-lg text-sm text-white
          ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
          {toast.message}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Add New Counselor</h3>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name <span className="text-red-500">*</span></label>
                <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Counselor's full name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
                <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="counselor@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password <span className="text-red-500">*</span></label>
                <input type="text" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Set a password" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={submitting}
                  className="flex-1 bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 text-white font-semibold py-2.5 rounded-lg text-sm">
                  {submitting ? 'Adding...' : 'Add Counselor'}
                </button>
                <button type="button" onClick={() => { setShowModal(false); setForm({ name: '', email: '', password: '' }) }}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 rounded-lg text-sm">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Counselors</h2>
            <p className="text-gray-500 text-sm">{counselors.length} total counselors</p>
          </div>
          <button onClick={() => setShowModal(true)}
            className="bg-blue-700 hover:bg-blue-800 text-white font-semibold px-4 py-2.5 rounded-lg text-sm">
            + Add Counselor
          </button>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Name</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Email</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Password</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Leads</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Joined</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  [...Array(4)].map((_, i) => (
                    <tr key={i}>{[...Array(6)].map((_, j) => (
                      <td key={j} className="px-4 py-3"><div className="h-4 bg-gray-100 animate-pulse rounded" /></td>
                    ))}</tr>
                  ))
                ) : counselors.length === 0 ? (
                  <tr><td colSpan={6} className="px-4 py-10 text-center text-gray-400">No counselors. Add your first counselor.</td></tr>
                ) : counselors.map(c => (
                  <React.Fragment key={c.id}>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-800">{c.name}</td>
                      <td className="px-4 py-3 text-gray-600">{c.email}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-gray-700">
                            {visiblePasswords[c.id] ? c.password : '••••••••'}
                          </span>
                          <button onClick={() => togglePassword(c.id)}
                            className="text-gray-400 hover:text-gray-600">
                            {visiblePasswords[c.id] ? '🙈' : '👁️'}
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                          {c.leads_count}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{new Date(c.created_at).toLocaleDateString('en-IN')}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2 flex-wrap">
                          <button onClick={() => toggleExpand(c)}
                            className="text-xs text-blue-600 hover:text-blue-800 font-medium">
                            {expandedId === c.id ? 'Hide' : 'View'} Leads
                          </button>
                          <button onClick={() => exportCounselorLeads(c)}
                            className="text-xs text-green-600 hover:text-green-800 font-medium">
                            ⬇️ Export
                          </button>
                          <button onClick={() => handleDelete(c.id, c.name)} disabled={deletingId === c.id}
                            className="text-xs text-red-500 hover:text-red-700 font-medium disabled:opacity-50">
                            {deletingId === c.id ? 'Deleting...' : 'Delete'}
                          </button>
                        </div>
                      </td>
                    </tr>
                    {expandedId === c.id && (
                      <tr key={`${c.id}-leads`}>
                        <td colSpan={6} className="px-4 py-3 bg-indigo-50">
                          <div className="text-sm font-medium text-indigo-800 mb-2">
                            Leads assigned to {c.name}
                          </div>
                          {!counselorLeads[c.id] ? (
                            <div className="text-xs text-gray-500">Loading...</div>
                          ) : counselorLeads[c.id].length === 0 ? (
                            <div className="text-xs text-gray-500">No leads assigned yet.</div>
                          ) : (
                            <div className="overflow-x-auto">
                              <table className="w-full text-xs">
                                <thead>
                                  <tr className="border-b border-indigo-100">
                                    <th className="pb-2 text-left font-semibold text-indigo-700">Name</th>
                                    <th className="pb-2 text-left font-semibold text-indigo-700">Phone</th>
                                    <th className="pb-2 text-left font-semibold text-indigo-700">Stream</th>
                                    <th className="pb-2 text-left font-semibold text-indigo-700">City</th>
                                    <th className="pb-2 text-left font-semibold text-indigo-700">Status</th>
                                    <th className="pb-2 text-left font-semibold text-indigo-700">Visit</th>
                                    <th className="pb-2 text-left font-semibold text-indigo-700">Date</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-indigo-50">
                                  {counselorLeads[c.id].map(lead => (
                                    <tr key={lead.id} className="hover:bg-indigo-100">
                                      <td className="py-2 pr-4 font-medium text-gray-800">{lead.name}</td>
                                      <td className="py-2 pr-4 text-gray-600">{lead.phone}</td>
                                      <td className="py-2 pr-4 text-gray-600">{lead.stream || '-'}</td>
                                      <td className="py-2 pr-4 text-gray-600">{lead.city || '-'}</td>
                                      <td className="py-2 pr-4">
                                        <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${statusColor(lead.registration_status)}`}>
                                          {lead.registration_status || 'pending'}
                                        </span>
                                      </td>
                                      <td className="py-2 pr-4">
                                        <span className={`px-1.5 py-0.5 rounded text-xs ${lead.visit_done ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                          {lead.visit_done ? 'Done' : 'No'}
                                        </span>
                                      </td>
                                      <td className="py-2 text-gray-500">{new Date(lead.created_at).toLocaleDateString('en-IN')}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
