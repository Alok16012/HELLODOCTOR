'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import AdminLayout from '@/components/admin/AdminLayout'

interface UserData {
  role: string
  id: string
  name: string
  email: string
  intern_id: string
  intern_name: string
}

interface StudentLead {
  id: string
  name: string
  phone: string
  alt_phone: string
  stream: string
  course_interested: string
  city: string
  fathers_name: string
  class: string
  registration_status: string
  visit_done: boolean
  remarks: string
  created_at: string
}

const CLASS_OPTIONS = ['10th', '11th', '12th', 'Graduated']
const STREAM_OPTIONS = ['Engineering', 'Medical', 'Management', 'Law', 'Design', 'Science', 'Arts', 'Commerce']
const COURSE_OPTIONS: Record<string, string[]> = {
  Engineering: ['B.Tech', 'B.E.', 'Diploma Engineering', 'M.Tech'],
  Medical: ['MBBS', 'BDS', 'BAMS', 'BHMS', 'B.Pharm', 'B.Sc Nursing'],
  Management: ['BBA', 'MBA', 'BCA', 'MCA', 'PGDM'],
  Law: ['LLB (3yr)', 'BA LLB (5yr)', 'BBA LLB (5yr)'],
  Design: ['B.Des', 'B.Arch', 'M.Des'],
  Science: ['B.Sc', 'M.Sc', 'B.Sc (Hons)'],
  Arts: ['BA', 'MA', 'B.Ed'],
  Commerce: ['B.Com', 'M.Com', 'CA Foundation'],
}

const emptyForm = { name: '', phone: '', alt_phone: '', city: '', stream: '', course_interested: '', fathers_name: '', class: '' }

export default function VolunteerPortalPage() {
  const [user, setUser] = useState<UserData | null>(null)
  const [leads, setLeads] = useState<StudentLead[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(emptyForm)
  const [submitting, setSubmitting] = useState(false)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editData, setEditData] = useState<{ visit_done: boolean; remarks: string }>({ visit_done: false, remarks: '' })
  const [saving, setSaving] = useState(false)
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
    if (!user?.id) return
    setLoading(true)
    const { data } = await supabase
      .from('student_leads')
      .select('id, name, phone, alt_phone, stream, course_interested, city, fathers_name, class, registration_status, visit_done, remarks, created_at')
      .eq('volunteer_id', user.id)
      .order('created_at', { ascending: false })
    if (data) setLeads(data)
    setLoading(false)
  }, [user?.id])

  useEffect(() => { fetchLeads() }, [fetchLeads])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    if (name === 'stream') {
      setForm(prev => ({ ...prev, stream: value, course_interested: '' }))
    } else {
      setForm(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleAddLead = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.phone || !user) {
      showToast('error', 'Name and phone are required.')
      return
    }
    setSubmitting(true)
    const { error } = await supabase.from('student_leads').insert([{
      name: form.name,
      phone: form.phone,
      alt_phone: form.alt_phone,
      city: form.city,
      stream: form.stream,
      course_interested: form.course_interested,
      fathers_name: form.fathers_name,
      class: form.class,
      volunteer_id: user.id,
      volunteer_name: user.name,
      intern_id: user.intern_id,
      intern_name: user.intern_name,
      registration_status: 'pending',
    }])
    if (error) {
      showToast('error', error.message)
    } else {
      showToast('success', 'Lead added successfully.')
      setForm(emptyForm)
      fetchLeads()
    }
    setSubmitting(false)
  }

  const handleExport = async () => {
    if (!user?.id) return
    setExporting(true)
    const { data } = await supabase
      .from('student_leads')
      .select('*')
      .eq('volunteer_id', user.id)
      .order('created_at', { ascending: false })
    if (data && data.length > 0) {
      const headers = ['Name', 'Phone', 'Alt Phone', 'Stream', 'Course', 'City', 'Class', 'Father Name', 'Status', 'Visit Done', 'Remarks', 'Date']
      const rows = data.map((r: Record<string, unknown>) => [
        r.name || '', r.phone || '', r.alt_phone || '', r.stream || '', r.course_interested || '',
        r.city || '', r.class || '', r.fathers_name || '',
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

  const startEditLead = (lead: StudentLead) => {
    setEditingId(lead.id)
    setEditData({ visit_done: lead.visit_done || false, remarks: lead.remarks || '' })
  }

  const saveEditLead = async (id: string) => {
    setSaving(true)
    const { error } = await supabase.from('student_leads').update(editData).eq('id', id)
    if (!error) {
      showToast('success', 'Updated.')
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
    }
    return map[s] || 'bg-gray-100 text-gray-700'
  }

  const coursesForStream = form.stream ? (COURSE_OPTIONS[form.stream] || []) : []

  return (
    <AdminLayout requiredRole="volunteer">
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
          <div className="text-2xl font-bold">{user?.name || 'Volunteer'}</div>
          <div className="text-blue-200 text-sm mt-1">Under Intern: <span className="text-white font-medium">{user?.intern_name || '-'}</span></div>
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
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="text-sm text-gray-500 mb-1">My Total Leads</div>
          <div className="text-3xl font-bold text-blue-700">{loading ? '...' : leads.length}</div>
        </div>

        {/* Add Lead Form */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-semibold text-gray-800 text-base mb-4">Add New Student Lead</h3>
          <form onSubmit={handleAddLead} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Student Name <span className="text-red-500">*</span></label>
                <input name="name" value={form.name} onChange={handleChange} required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Full name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Father's Name</label>
                <input name="fathers_name" value={form.fathers_name} onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Father's name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone <span className="text-red-500">*</span></label>
                <input name="phone" value={form.phone} onChange={handleChange} required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Mobile number" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alternate Phone</label>
                <input name="alt_phone" value={form.alt_phone} onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Alternate number" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input name="city" value={form.city} onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="City" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                <select name="class" value={form.class} onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select class</option>
                  {CLASS_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stream</label>
                <select name="stream" value={form.stream} onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select stream</option>
                  {STREAM_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Course Interested</label>
                <select name="course_interested" value={form.course_interested} onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={coursesForStream.length === 0}>
                  <option value="">{coursesForStream.length === 0 ? 'Select stream first' : 'Select course'}</option>
                  {coursesForStream.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <button type="submit" disabled={submitting}
              className="bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 text-white font-semibold px-6 py-2.5 rounded-lg text-sm flex items-center gap-2">
              {submitting ? (
                <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Adding...</>
              ) : '+ Add Lead'}
            </button>
          </form>
        </div>

        {/* Leads Table */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800 text-base">My Student Leads</h3>
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
            <p className="text-gray-400 text-sm">No leads yet. Add your first student lead above.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="pb-3 text-left font-semibold text-gray-600 whitespace-nowrap">Name</th>
                    <th className="pb-3 text-left font-semibold text-gray-600 whitespace-nowrap">Phone</th>
                    <th className="pb-3 text-left font-semibold text-gray-600 whitespace-nowrap">Stream</th>
                    <th className="pb-3 text-left font-semibold text-gray-600 whitespace-nowrap">City</th>
                    <th className="pb-3 text-left font-semibold text-gray-600 whitespace-nowrap">Status</th>
                    <th className="pb-3 text-left font-semibold text-gray-600 whitespace-nowrap">Visit Done</th>
                    <th className="pb-3 text-left font-semibold text-gray-600 whitespace-nowrap">Remarks</th>
                    <th className="pb-3 text-left font-semibold text-gray-600 whitespace-nowrap">Date</th>
                    <th className="pb-3 text-left font-semibold text-gray-600 whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {leads.map(lead => (
                    <tr key={lead.id} className="hover:bg-gray-50">
                      <td className="py-3 font-medium text-gray-800 whitespace-nowrap">{lead.name}</td>
                      <td className="py-3 text-gray-600 whitespace-nowrap">{lead.phone}</td>
                      <td className="py-3 text-gray-600 whitespace-nowrap">{lead.stream || '-'}</td>
                      <td className="py-3 text-gray-600 whitespace-nowrap">{lead.city || '-'}</td>
                      <td className="py-3 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor(lead.registration_status)}`}>
                          {lead.registration_status || 'pending'}
                        </span>
                      </td>
                      <td className="py-3 whitespace-nowrap">
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
                      <td className="py-3 whitespace-nowrap max-w-[150px]">
                        {editingId === lead.id ? (
                          <input value={editData.remarks}
                            onChange={e => setEditData(p => ({ ...p, remarks: e.target.value }))}
                            className="border border-gray-300 rounded px-2 py-1 text-xs w-full"
                            placeholder="Add remark" />
                        ) : (
                          <span className="text-gray-600 text-xs truncate block">{lead.remarks || '-'}</span>
                        )}
                      </td>
                      <td className="py-3 text-gray-500 text-xs whitespace-nowrap">
                        {new Date(lead.created_at).toLocaleDateString('en-IN')}
                      </td>
                      <td className="py-3 whitespace-nowrap">
                        {editingId === lead.id ? (
                          <div className="flex gap-2">
                            <button onClick={() => saveEditLead(lead.id)} disabled={saving}
                              className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 disabled:opacity-50">
                              {saving ? '...' : 'Save'}
                            </button>
                            <button onClick={() => setEditingId(null)}
                              className="text-xs bg-gray-200 text-gray-700 px-3 py-1.5 rounded hover:bg-gray-300">
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button onClick={() => startEditLead(lead)}
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
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
