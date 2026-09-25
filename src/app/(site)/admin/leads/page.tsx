'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import AdminLayout from '@/components/admin/AdminLayout'

interface Lead {
  id: number
  name: string
  email: string
  phone: string
  course: string
  message: string
  source: string
  status: string
  created_at: string
}

const STATUS_OPTIONS = ['new', 'contacted', 'interested', 'converted', 'not_interested']
const PAGE_SIZE = 20

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(0)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editStatus, setEditStatus] = useState('')
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState('')

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const fetchLeads = useCallback(async () => {
    setLoading(true)
    let query = supabase
      .from('enquiries')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1)

    if (search) query = query.or(`name.ilike.%${search}%,phone.ilike.%${search}%,email.ilike.%${search}%`)
    if (filterStatus) query = query.eq('status', filterStatus)

    const { data, count, error } = await query
    if (!error && data) {
      setLeads(data)
      setTotal(count || 0)
    }
    setLoading(false)
  }, [page, search, filterStatus])

  useEffect(() => { fetchLeads() }, [fetchLeads])

  const deleteLead = async (lead: Lead) => {
    if (!confirm(`Delete lead from ${lead.name}?`)) return
    const { error } = await supabase.from('enquiries').delete().eq('id', lead.id)
    showToast(error ? 'Error: ' + error.message : 'Lead deleted')
    if (!error) fetchLeads()
  }

  const saveStatus = async (id: number) => {
    setSaving(true)
    const { error } = await supabase.from('enquiries').update({ status: editStatus }).eq('id', id)
    if (!error) {
      showToast('Status updated')
      setEditingId(null)
      fetchLeads()
    } else {
      showToast('Error: ' + error.message)
    }
    setSaving(false)
  }

  const statusColor = (s: string) => {
    const map: Record<string, string> = {
      new: 'bg-blue-100 text-blue-800',
      contacted: 'bg-yellow-100 text-yellow-800',
      interested: 'bg-green-100 text-green-800',
      converted: 'bg-emerald-100 text-emerald-800',
      not_interested: 'bg-red-100 text-red-800',
    }
    return map[s] || 'bg-gray-100 text-gray-700'
  }

  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <AdminLayout>
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-green-600 text-white px-5 py-3 rounded-lg shadow-lg text-sm">
          {toast}
        </div>
      )}

      <div className="space-y-5">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Leads</h2>
          <p className="text-gray-500 text-sm">{total} total enquiries</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl">
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(0) }}
              placeholder="Search name, phone, email..."
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setPage(0) }}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">All Statuses</option>
              {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
            </select>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Name</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Phone</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Email</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Course</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Message</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Source</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Status</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Date</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i}>{[...Array(9)].map((_, j) => (
                      <td key={j} className="px-4 py-3"><div className="h-4 bg-gray-100 animate-pulse rounded" /></td>
                    ))}</tr>
                  ))
                ) : leads.length === 0 ? (
                  <tr><td colSpan={9} className="px-4 py-10 text-center text-gray-400">No enquiries found.</td></tr>
                ) : leads.map(lead => (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-800 whitespace-nowrap">{lead.name}</td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{lead.phone}</td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap max-w-[160px] truncate">{lead.email || '-'}</td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{lead.course || '-'}</td>
                    <td className="px-4 py-3 text-gray-600 min-w-[220px] max-w-xs"><p className="line-clamp-2" title={lead.message}>{lead.message || '-'}</p></td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{lead.source || '-'}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {editingId === lead.id ? (
                        <select value={editStatus} onChange={e => setEditStatus(e.target.value)}
                          className="border border-gray-300 rounded px-2 py-1 text-xs bg-white">
                          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      ) : (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor(lead.status)}`}>
                          {lead.status || 'new'}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                      {new Date(lead.created_at).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {editingId === lead.id ? (
                        <div className="flex gap-2">
                          <button onClick={() => saveStatus(lead.id)} disabled={saving}
                            className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 disabled:opacity-50">
                            {saving ? '...' : 'Save'}
                          </button>
                          <button onClick={() => setEditingId(null)}
                            className="text-xs bg-gray-200 text-gray-700 px-3 py-1.5 rounded hover:bg-gray-300">
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-3">
                          <button onClick={() => { setEditingId(lead.id); setEditStatus(lead.status || 'new') }}
                            className="text-xs text-blue-600 hover:text-blue-800 font-medium">
                            Edit Status
                          </button>
                          <button onClick={() => deleteLead(lead)}
                            className="text-xs text-red-500 hover:text-red-700 font-medium">
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Showing {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, total)} of {total}
              </div>
              <div className="flex gap-2">
                <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
                  className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-40">Previous</button>
                <span className="px-3 py-1.5 text-sm text-gray-600">Page {page + 1} of {totalPages}</span>
                <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}
                  className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-40">Next</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
