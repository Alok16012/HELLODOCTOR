'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import AdminLayout from '@/components/admin/AdminLayout'

interface StudentLead {
  id: string
  name: string
  phone: string
  alt_phone: string
  email: string
  stream: string
  course_interested: string
  city: string
  intern_name: string
  volunteer_name: string
  registration_status: string
  visit_done: boolean
  created_at: string
  admin_remark: string
  fathers_name: string
  class: string
  branch: string
  location: string
}

const STATUS_OPTIONS = ['pending', 'contacted', 'interested', 'registered', 'not_interested', 'follow_up']
const PAGE_SIZE = 20

export default function StudentLeadsPage() {
  const [leads, setLeads] = useState<StudentLead[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(0)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterIntern, setFilterIntern] = useState('')
  const [filterVolunteer, setFilterVolunteer] = useState('')
  const [interns, setInterns] = useState<string[]>([])
  const [volunteers, setVolunteers] = useState<string[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editData, setEditData] = useState<{ registration_status: string; admin_remark: string }>({ registration_status: '', admin_remark: '' })
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState('')
  const [exporting, setExporting] = useState(false)

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const fetchLeads = useCallback(async () => {
    setLoading(true)
    let query = supabase
      .from('student_leads')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1)

    if (search) query = query.or(`name.ilike.%${search}%,phone.ilike.%${search}%`)
    if (filterStatus) query = query.eq('registration_status', filterStatus)
    if (filterIntern) query = query.eq('intern_name', filterIntern)
    if (filterVolunteer) query = query.eq('volunteer_name', filterVolunteer)

    const { data, count, error } = await query
    if (!error && data) {
      setLeads(data)
      setTotal(count || 0)
    }
    setLoading(false)
  }, [page, search, filterStatus, filterIntern, filterVolunteer])

  useEffect(() => { fetchLeads() }, [fetchLeads])

  useEffect(() => {
    const fetchFilters = async () => {
      const { data: internData } = await supabase.from('interns').select('name')
      const { data: volData } = await supabase.from('volunteers').select('name')
      if (internData) setInterns(internData.map(i => i.name))
      if (volData) setVolunteers(volData.map(v => v.name))
    }
    fetchFilters()
  }, [])

  const startEdit = (lead: StudentLead) => {
    setEditingId(lead.id)
    setEditData({ registration_status: lead.registration_status || '', admin_remark: lead.admin_remark || '' })
  }

  const saveEdit = async (id: string) => {
    setSaving(true)
    const { error } = await supabase.from('student_leads').update(editData).eq('id', id)
    if (!error) {
      showToast('Updated successfully')
      setEditingId(null)
      fetchLeads()
    } else {
      showToast('Error: ' + error.message)
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

  const totalPages = Math.ceil(total / PAGE_SIZE)

  const handleExport = async () => {
    setExporting(true)
    const { data } = await supabase
      .from('student_leads')
      .select('*')
      .order('created_at', { ascending: false })

    if (data && data.length > 0) {
      const headers = ['Name', 'Phone', 'Alt Phone', 'Email', 'Stream', 'Course', 'City', 'Class', 'Intern', 'Volunteer', 'Status', 'Visit Done', 'Admin Remark', 'Date']
      const rows = data.map(r => [
        r.name || '',
        r.phone || '',
        r.alt_phone || '',
        r.email || '',
        r.stream || '',
        r.course_interested || '',
        r.city || '',
        r.class || '',
        r.intern_name || '',
        r.volunteer_name || '',
        r.registration_status || '',
        r.visit_done ? 'Yes' : 'No',
        r.admin_remark || '',
        new Date(r.created_at).toLocaleDateString('en-IN'),
      ])
      const csv = [headers, ...rows].map(row => row.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n')
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `student_leads_${new Date().toISOString().slice(0, 10)}.csv`
      a.click()
      URL.revokeObjectURL(url)
    }
    setExporting(false)
  }

  return (
    <AdminLayout requiredRole="admin">
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-green-600 text-white px-5 py-3 rounded-lg shadow-lg text-sm">
          {toast}
        </div>
      )}

      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Student Leads</h2>
            <p className="text-gray-500 text-sm">{total} total records</p>
          </div>
          <button
            onClick={handleExport}
            disabled={exporting}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold px-4 py-2.5 rounded-lg text-sm"
          >
            {exporting ? '...' : '⬇️ Export Excel'}
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(0) }}
              placeholder="Search by name or phone..."
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setPage(0) }}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">All Statuses</option>
              {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
            </select>
            <select value={filterIntern} onChange={e => { setFilterIntern(e.target.value); setPage(0) }}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">All Interns</option>
              {interns.map(i => <option key={i} value={i}>{i}</option>)}
            </select>
            <select value={filterVolunteer} onChange={e => { setFilterVolunteer(e.target.value); setPage(0) }}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">All Volunteers</option>
              {volunteers.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
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
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Date</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i}>
                      {[...Array(11)].map((_, j) => (
                        <td key={j} className="px-4 py-3"><div className="h-4 bg-gray-100 animate-pulse rounded" /></td>
                      ))}
                    </tr>
                  ))
                ) : leads.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="px-4 py-10 text-center text-gray-400">No records found.</td>
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
                      {editingId === lead.id ? (
                        <select
                          value={editData.registration_status}
                          onChange={e => setEditData(prev => ({ ...prev, registration_status: e.target.value }))}
                          className="border border-gray-300 rounded px-2 py-1 text-xs bg-white"
                        >
                          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      ) : (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor(lead.registration_status)}`}>
                          {lead.registration_status || 'pending'}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${lead.visit_done ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {lead.visit_done ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap text-xs">
                      {new Date(lead.created_at).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {editingId === lead.id ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => saveEdit(lead.id)}
                            disabled={saving}
                            className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 disabled:opacity-50"
                          >
                            {saving ? '...' : 'Save'}
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="text-xs bg-gray-200 text-gray-700 px-3 py-1.5 rounded hover:bg-gray-300"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => startEdit(lead)}
                          className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Edit
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Showing {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, total)} of {total}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(p => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-40"
                >
                  Previous
                </button>
                <span className="px-3 py-1.5 text-sm text-gray-600">Page {page + 1} of {totalPages}</span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                  disabled={page >= totalPages - 1}
                  className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
