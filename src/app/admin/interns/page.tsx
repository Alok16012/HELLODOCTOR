'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import AdminLayout from '@/components/admin/AdminLayout'

interface Intern {
  id: string
  name: string
  email: string
  password: string
  created_at: string
  volunteers_count?: number
  leads_count?: number
}

export default function InternsPage() {
  const [interns, setInterns] = useState<Intern[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [internVolunteers, setInternVolunteers] = useState<Record<string, { id: string; name: string; email: string; password: string; leads_count: number }[]>>({})
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({})

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message })
    setTimeout(() => setToast(null), 4000)
  }

  const fetchInterns = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase.from('interns').select('*').order('created_at', { ascending: false })
    if (!error && data) {
      const enriched = await Promise.all(data.map(async (intern: Intern) => {
        const { count: volCount } = await supabase
          .from('volunteers')
          .select('*', { count: 'exact', head: true })
          .eq('intern_id', intern.id)
        const { count: leadsCount } = await supabase
          .from('student_leads')
          .select('*', { count: 'exact', head: true })
          .eq('intern_id', intern.id)
        return { ...intern, volunteers_count: volCount || 0, leads_count: leadsCount || 0 }
      }))
      setInterns(enriched)
    }
    setLoading(false)
  }, [])

  useEffect(() => { fetchInterns() }, [fetchInterns])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.password) {
      showToast('error', 'All fields are required.')
      return
    }
    setSubmitting(true)
    const { error } = await supabase.from('interns').insert([{ name: form.name, email: form.email, password: form.password }])
    if (error) {
      showToast('error', error.message)
    } else {
      showToast('success', 'Intern added successfully.')
      setShowModal(false)
      setForm({ name: '', email: '', password: '' })
      fetchInterns()
    }
    setSubmitting(false)
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete intern "${name}"? This will NOT delete their volunteers or leads.`)) return
    setDeletingId(id)
    const { error } = await supabase.from('interns').delete().eq('id', id)
    if (error) {
      showToast('error', error.message)
    } else {
      showToast('success', 'Intern deleted.')
      fetchInterns()
    }
    setDeletingId(null)
  }

  const toggleExpand = async (internId: string) => {
    if (expandedId === internId) {
      setExpandedId(null)
      return
    }
    setExpandedId(internId)
    if (!internVolunteers[internId]) {
      const { data: vols } = await supabase.from('volunteers').select('id, name, email, password').eq('intern_id', internId)
      if (vols) {
        const enrichedVols = await Promise.all(vols.map(async (v: { id: string; name: string; email: string; password: string }) => {
          const { count } = await supabase.from('student_leads').select('*', { count: 'exact', head: true }).eq('volunteer_id', v.id)
          return { ...v, leads_count: count || 0 }
        }))
        setInternVolunteers(prev => ({ ...prev, [internId]: enrichedVols }))
      }
    }
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

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Add New Intern</h3>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name <span className="text-red-500">*</span></label>
                <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Intern's full name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
                <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="intern@example.com" />
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
                  {submitting ? 'Adding...' : 'Add Intern'}
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
            <h2 className="text-2xl font-bold text-gray-800">Interns</h2>
            <p className="text-gray-500 text-sm">{interns.length} total interns</p>
          </div>
          <button onClick={() => setShowModal(true)}
            className="bg-blue-700 hover:bg-blue-800 text-white font-semibold px-4 py-2.5 rounded-lg text-sm flex items-center gap-2">
            + Add Intern
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
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Volunteers</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Total Leads</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Joined</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  [...Array(4)].map((_, i) => (
                    <tr key={i}>
                      {[...Array(7)].map((_, j) => (
                        <td key={j} className="px-4 py-3"><div className="h-4 bg-gray-100 animate-pulse rounded" /></td>
                      ))}
                    </tr>
                  ))
                ) : interns.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-gray-400">No interns found. Add your first intern.</td>
                  </tr>
                ) : interns.map(intern => (
                  <React.Fragment key={intern.id}>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-800">{intern.name}</td>
                      <td className="px-4 py-3 text-gray-600">{intern.email}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-gray-700">
                            {visiblePasswords[intern.id] ? intern.password : '••••••••'}
                          </span>
                          <button onClick={() => togglePassword(intern.id)}
                            className="text-gray-400 hover:text-gray-600 text-xs">
                            {visiblePasswords[intern.id] ? '🙈' : '👁️'}
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                          {intern.volunteers_count}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                          {intern.leads_count}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs">
                        {new Date(intern.created_at).toLocaleDateString('en-IN')}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button onClick={() => toggleExpand(intern.id)}
                            className="text-xs text-blue-600 hover:text-blue-800 font-medium">
                            {expandedId === intern.id ? 'Hide' : 'View'} Volunteers
                          </button>
                          <button onClick={() => handleDelete(intern.id, intern.name)} disabled={deletingId === intern.id}
                            className="text-xs text-red-500 hover:text-red-700 font-medium disabled:opacity-50">
                            {deletingId === intern.id ? 'Deleting...' : 'Delete'}
                          </button>
                        </div>
                      </td>
                    </tr>
                    {expandedId === intern.id && (
                      <tr key={`${intern.id}-expanded`}>
                        <td colSpan={7} className="px-4 py-3 bg-blue-50">
                          <div className="text-sm font-medium text-blue-800 mb-2">
                            Volunteers under {intern.name}
                          </div>
                          {!internVolunteers[intern.id] ? (
                            <div className="text-xs text-gray-500">Loading...</div>
                          ) : internVolunteers[intern.id].length === 0 ? (
                            <div className="text-xs text-gray-500">No volunteers assigned yet.</div>
                          ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                              {internVolunteers[intern.id].map(vol => (
                                <div key={vol.id} className="bg-white rounded-lg px-3 py-2 border border-blue-100">
                                  <div className="font-medium text-sm text-gray-800">{vol.name}</div>
                                  <div className="text-xs text-gray-500">{vol.email}</div>
                                  <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                    <span>Pass:</span>
                                    <span className="font-mono">{vol.password}</span>
                                  </div>
                                  <div className="text-xs text-blue-600 mt-1">{vol.leads_count} leads</div>
                                </div>
                              ))}
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
