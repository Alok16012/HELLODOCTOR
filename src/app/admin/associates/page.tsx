'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import AdminLayout from '@/components/admin/AdminLayout'

interface Associate {
  id: string
  name: string
  email: string
  password: string
  phone: string
  created_at: string
  leads_count?: number
}

export default function AssociatesPage() {
  const [associates, setAssociates] = useState<Associate[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' })
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({})
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message })
    setTimeout(() => setToast(null), 4000)
  }

  const fetchAssociates = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase.from('associates').select('*').order('created_at', { ascending: false })
    if (!error && data) {
      const enriched = await Promise.all(data.map(async (a: Associate) => {
        const { count } = await supabase
          .from('student_leads')
          .select('*', { count: 'exact', head: true })
          .eq('associate_id', a.id)
        return { ...a, leads_count: count || 0 }
      }))
      setAssociates(enriched)
    }
    setLoading(false)
  }, [])

  useEffect(() => { fetchAssociates() }, [fetchAssociates])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.password) {
      showToast('error', 'Name, email and password are required.')
      return
    }
    setSubmitting(true)
    const { error } = await supabase.from('associates').insert([{
      name: form.name,
      email: form.email,
      password: form.password,
      phone: form.phone,
    }])
    if (error) {
      showToast('error', error.message)
    } else {
      showToast('success', 'Associate added successfully.')
      setShowModal(false)
      setForm({ name: '', email: '', password: '', phone: '' })
      fetchAssociates()
    }
    setSubmitting(false)
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete associate "${name}"?`)) return
    setDeletingId(id)
    const { error } = await supabase.from('associates').delete().eq('id', id)
    if (error) {
      showToast('error', error.message)
    } else {
      showToast('success', 'Associate deleted.')
      fetchAssociates()
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

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Add New Associate</h3>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name <span className="text-red-500">*</span></label>
                <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Associate's full name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
                <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="associate@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password <span className="text-red-500">*</span></label>
                <input type="text" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Set a password" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Phone number" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={submitting}
                  className="flex-1 bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 text-white font-semibold py-2.5 rounded-lg text-sm">
                  {submitting ? 'Adding...' : 'Add Associate'}
                </button>
                <button type="button" onClick={() => { setShowModal(false); setForm({ name: '', email: '', password: '', phone: '' }) }}
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
            <h2 className="text-2xl font-bold text-gray-800">Associates</h2>
            <p className="text-gray-500 text-sm">{associates.length} total associates</p>
          </div>
          <button onClick={() => setShowModal(true)}
            className="bg-blue-700 hover:bg-blue-800 text-white font-semibold px-4 py-2.5 rounded-lg text-sm">
            + Add Associate
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
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Phone</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Leads</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Joined</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  [...Array(4)].map((_, i) => (
                    <tr key={i}>{[...Array(7)].map((_, j) => (
                      <td key={j} className="px-4 py-3"><div className="h-4 bg-gray-100 animate-pulse rounded" /></td>
                    ))}</tr>
                  ))
                ) : associates.length === 0 ? (
                  <tr><td colSpan={7} className="px-4 py-10 text-center text-gray-400">No associates. Add your first associate.</td></tr>
                ) : associates.map(a => (
                  <tr key={a.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-800">{a.name}</td>
                    <td className="px-4 py-3 text-gray-600">{a.email}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-gray-700">
                          {visiblePasswords[a.id] ? a.password : '••••••••'}
                        </span>
                        <button onClick={() => togglePassword(a.id)}
                          className="text-gray-400 hover:text-gray-600">
                          {visiblePasswords[a.id] ? '🙈' : '👁️'}
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{a.phone || '-'}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">{a.leads_count}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{new Date(a.created_at).toLocaleDateString('en-IN')}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleDelete(a.id, a.name)} disabled={deletingId === a.id}
                        className="text-xs text-red-500 hover:text-red-700 font-medium disabled:opacity-50">
                        {deletingId === a.id ? 'Deleting...' : 'Delete'}
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
