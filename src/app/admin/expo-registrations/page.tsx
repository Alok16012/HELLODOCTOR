'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import AdminLayout from '@/components/admin/AdminLayout'

interface ExpoReg {
  id: string
  name: string
  phone: string
  email: string
  stream: string
  course: string
  college_preference: string
  state: string
  fair_city: string
  status: string
  created_at: string
  alternate_number: string
  class: string
  address: string
  volunteer_id: string
  intern_id: string
}

const STATUS_OPTIONS = ['Pending', 'Confirmed', 'Cancelled']
const PAGE_SIZE = 20

export default function ExpoRegistrationsPage() {
  const [records, setRecords] = useState<ExpoReg[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(0)
  const [search, setSearch] = useState('')
  const [filterState, setFilterState] = useState('')
  const [filterStream, setFilterStream] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [states, setStates] = useState<string[]>([])
  const [streams, setStreams] = useState<string[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editStatus, setEditStatus] = useState('')
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState('')

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const fetchData = useCallback(async () => {
    setLoading(true)
    let query = supabase
      .from('expo_registrations')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1)

    if (search) query = query.or(`name.ilike.%${search}%,phone.ilike.%${search}%,email.ilike.%${search}%`)
    if (filterState) query = query.eq('state', filterState)
    if (filterStream) query = query.eq('stream', filterStream)
    if (filterStatus) query = query.eq('status', filterStatus)

    const { data, count, error } = await query
    if (!error && data) {
      setRecords(data)
      setTotal(count || 0)

      const uniqueStates = [...new Set(data.map((r: ExpoReg) => r.state).filter(Boolean))]
      const uniqueStreams = [...new Set(data.map((r: ExpoReg) => r.stream).filter(Boolean))]
      if (uniqueStates.length > 0) setStates(prev => [...new Set([...prev, ...uniqueStates])])
      if (uniqueStreams.length > 0) setStreams(prev => [...new Set([...prev, ...uniqueStreams])])
    }
    setLoading(false)
  }, [page, search, filterState, filterStream, filterStatus])

  useEffect(() => {
    const fetchAllFilters = async () => {
      const { data } = await supabase.from('expo_registrations').select('state, stream')
      if (data) {
        setStates([...new Set(data.map((r: { state: string }) => r.state).filter(Boolean))])
        setStreams([...new Set(data.map((r: { stream: string }) => r.stream).filter(Boolean))])
      }
    }
    fetchAllFilters()
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const saveStatus = async (id: string) => {
    setSaving(true)
    const { error } = await supabase.from('expo_registrations').update({ status: editStatus }).eq('id', id)
    if (!error) {
      showToast('Status updated')
      setEditingId(null)
      fetchData()
    } else {
      showToast('Error: ' + error.message)
    }
    setSaving(false)
  }

  const statusColor = (s: string) => {
    const map: Record<string, string> = {
      Pending: 'bg-yellow-100 text-yellow-800',
      Confirmed: 'bg-green-100 text-green-800',
      Cancelled: 'bg-red-100 text-red-800',
    }
    return map[s] || 'bg-gray-100 text-gray-700'
  }

  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <AdminLayout requiredRole="admin">
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-green-600 text-white px-5 py-3 rounded-lg shadow-lg text-sm">
          {toast}
        </div>
      )}

      <div className="space-y-5">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Expo Registrations</h2>
          <p className="text-gray-500 text-sm">{total} total registrations</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(0) }}
              placeholder="Search name, phone, email..."
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select value={filterState} onChange={e => { setFilterState(e.target.value); setPage(0) }}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">All States</option>
              {states.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select value={filterStream} onChange={e => { setFilterStream(e.target.value); setPage(0) }}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">All Streams</option>
              {streams.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setPage(0) }}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">All Statuses</option>
              {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
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
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Email</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Stream</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Course</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">College Preference</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">State</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Fair City</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Status</th>
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
                ) : records.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="px-4 py-10 text-center text-gray-400">No records found.</td>
                  </tr>
                ) : records.map(rec => (
                  <tr key={rec.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-800 whitespace-nowrap">{rec.name}</td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{rec.phone}</td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap max-w-[180px] truncate">{rec.email || '-'}</td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{rec.stream || '-'}</td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{rec.course || '-'}</td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap max-w-[180px] truncate">{rec.college_preference || '-'}</td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{rec.state || '-'}</td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{rec.fair_city || '-'}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {editingId === rec.id ? (
                        <select
                          value={editStatus}
                          onChange={e => setEditStatus(e.target.value)}
                          className="border border-gray-300 rounded px-2 py-1 text-xs bg-white"
                        >
                          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      ) : (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor(rec.status)}`}>
                          {rec.status || 'Pending'}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap text-xs">
                      {new Date(rec.created_at).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {editingId === rec.id ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => saveStatus(rec.id)}
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
                          onClick={() => { setEditingId(rec.id); setEditStatus(rec.status || 'Pending') }}
                          className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Edit Status
                        </button>
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
                  className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-40">
                  Previous
                </button>
                <span className="px-3 py-1.5 text-sm text-gray-600">Page {page + 1} of {totalPages}</span>
                <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}
                  className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-40">
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
