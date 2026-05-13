'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import AdminLayout from '@/components/admin/AdminLayout'

interface Volunteer {
  id: string
  name: string
  email: string
  password: string
  intern_id: string
  intern_name: string
  created_at: string
  leads_count?: number
}

export default function VolunteersPage() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterIntern, setFilterIntern] = useState('')
  const [interns, setInterns] = useState<{ id: string; name: string }[]>([])
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({})
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message })
    setTimeout(() => setToast(null), 4000)
  }

  useEffect(() => {
    const fetchInterns = async () => {
      const { data } = await supabase.from('interns').select('id, name')
      if (data) setInterns(data)
    }
    fetchInterns()
  }, [])

  const fetchVolunteers = useCallback(async () => {
    setLoading(true)
    let query = supabase.from('volunteers').select('*').order('created_at', { ascending: false })
    if (search) query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`)
    if (filterIntern) query = query.eq('intern_id', filterIntern)

    const { data, error } = await query
    if (!error && data) {
      const enriched = await Promise.all(data.map(async (v: Volunteer) => {
        const { count } = await supabase.from('student_leads').select('*', { count: 'exact', head: true }).eq('volunteer_id', v.id)
        return { ...v, leads_count: count || 0 }
      }))
      setVolunteers(enriched)
    }
    setLoading(false)
  }, [search, filterIntern])

  useEffect(() => { fetchVolunteers() }, [fetchVolunteers])

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete volunteer "${name}"?`)) return
    setDeletingId(id)
    const { error } = await supabase.from('volunteers').delete().eq('id', id)
    if (error) {
      showToast('error', error.message)
    } else {
      showToast('success', 'Volunteer deleted.')
      fetchVolunteers()
    }
    setDeletingId(null)
  }

  const togglePassword = (id: string) => {
    setVisiblePasswords(prev => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <AdminLayout requiredRole="admin">
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-lg shadow-lg text-sm text-white
          ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
          {toast.message}
        </div>
      )}

      <div className="space-y-5">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Volunteers</h2>
          <p className="text-gray-500 text-sm">{volunteers.length} total volunteers</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl">
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <select value={filterIntern} onChange={e => setFilterIntern(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">All Interns</option>
              {interns.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
            </select>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Name</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Email</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Password</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Intern</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Leads</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Joined</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i}>{[...Array(7)].map((_, j) => (
                      <td key={j} className="px-4 py-3"><div className="h-4 bg-gray-100 animate-pulse rounded" /></td>
                    ))}</tr>
                  ))
                ) : volunteers.length === 0 ? (
                  <tr><td colSpan={7} className="px-4 py-10 text-center text-gray-400">No volunteers found.</td></tr>
                ) : volunteers.map(vol => (
                  <tr key={vol.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-800">{vol.name}</td>
                    <td className="px-4 py-3 text-gray-600">{vol.email}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-gray-700">
                          {visiblePasswords[vol.id] ? vol.password : '••••••••'}
                        </span>
                        <button onClick={() => togglePassword(vol.id)}
                          className="text-gray-400 hover:text-gray-600">
                          {visiblePasswords[vol.id] ? '🙈' : '👁️'}
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{vol.intern_name || '-'}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">{vol.leads_count}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{new Date(vol.created_at).toLocaleDateString('en-IN')}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleDelete(vol.id, vol.name)} disabled={deletingId === vol.id}
                        className="text-xs text-red-500 hover:text-red-700 font-medium disabled:opacity-50">
                        {deletingId === vol.id ? 'Deleting...' : 'Delete'}
                      </button>
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
