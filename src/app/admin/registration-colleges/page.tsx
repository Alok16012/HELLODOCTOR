'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import AdminLayout from '@/components/admin/AdminLayout'

interface RegCollege {
  id: string
  course: string
  state: string
  college_name: string
  is_active: boolean
  sort_order: number
  created_at: string
}

export default function RegistrationCollegesPage() {
  const [colleges, setColleges] = useState<RegCollege[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterState, setFilterState] = useState('')
  const [filterCourse, setFilterCourse] = useState('')
  const [states, setStates] = useState<string[]>([])
  const [courses, setCourses] = useState<string[]>([])
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ course: '', state: '', college_name: '', sort_order: '0' })
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message })
    setTimeout(() => setToast(null), 4000)
  }

  const fetchColleges = useCallback(async () => {
    setLoading(true)
    let query = supabase.from('registration_colleges').select('*').order('sort_order', { ascending: true })
    if (search) query = query.ilike('college_name', `%${search}%`)
    if (filterState) query = query.eq('state', filterState)
    if (filterCourse) query = query.eq('course', filterCourse)

    const { data, error } = await query
    if (!error && data) {
      setColleges(data)
      setStates([...new Set(data.map((c: RegCollege) => c.state).filter(Boolean))])
      setCourses([...new Set(data.map((c: RegCollege) => c.course).filter(Boolean))])
    }
    setLoading(false)
  }, [search, filterState, filterCourse])

  useEffect(() => { fetchColleges() }, [fetchColleges])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.college_name || !form.course || !form.state) {
      showToast('error', 'College name, course, and state are required.')
      return
    }
    setSubmitting(true)
    const { error } = await supabase.from('registration_colleges').insert([{
      college_name: form.college_name,
      course: form.course,
      state: form.state,
      sort_order: parseInt(form.sort_order) || 0,
      is_active: true,
    }])
    if (error) {
      showToast('error', error.message)
    } else {
      showToast('success', 'College added.')
      setShowModal(false)
      setForm({ course: '', state: '', college_name: '', sort_order: '0' })
      fetchColleges()
    }
    setSubmitting(false)
  }

  const toggleActive = async (id: string, current: boolean) => {
    const { error } = await supabase.from('registration_colleges').update({ is_active: !current }).eq('id', id)
    if (!error) fetchColleges()
    else showToast('error', error.message)
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return
    setDeletingId(id)
    const { error } = await supabase.from('registration_colleges').delete().eq('id', id)
    if (error) {
      showToast('error', error.message)
    } else {
      showToast('success', 'Deleted.')
      fetchColleges()
    }
    setDeletingId(null)
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
            <h3 className="text-lg font-bold text-gray-800 mb-4">Add College</h3>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">College Name <span className="text-red-500">*</span></label>
                <input value={form.college_name} onChange={e => setForm(p => ({ ...p, college_name: e.target.value }))} required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Full college name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Course <span className="text-red-500">*</span></label>
                <input value={form.course} onChange={e => setForm(p => ({ ...p, course: e.target.value }))} required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. B.Tech, MBBS" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State <span className="text-red-500">*</span></label>
                <input value={form.state} onChange={e => setForm(p => ({ ...p, state: e.target.value }))} required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. Rajasthan, Maharashtra" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
                <input type="number" value={form.sort_order} onChange={e => setForm(p => ({ ...p, sort_order: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={submitting}
                  className="flex-1 bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 text-white font-semibold py-2.5 rounded-lg text-sm">
                  {submitting ? 'Adding...' : 'Add College'}
                </button>
                <button type="button" onClick={() => { setShowModal(false); setForm({ course: '', state: '', college_name: '', sort_order: '0' }) }}
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
            <h2 className="text-2xl font-bold text-gray-800">Registration Colleges</h2>
            <p className="text-gray-500 text-sm">{colleges.length} colleges</p>
          </div>
          <button onClick={() => setShowModal(true)}
            className="bg-blue-700 hover:bg-blue-800 text-white font-semibold px-4 py-2.5 rounded-lg text-sm">
            + Add College
          </button>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search college name..."
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <select value={filterState} onChange={e => setFilterState(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">All States</option>
              {states.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select value={filterCourse} onChange={e => setFilterCourse(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">All Courses</option>
              {courses.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-4 py-3 text-left font-semibold text-gray-600">College Name</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Course</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">State</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Sort Order</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Active</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>{[...Array(6)].map((_, j) => (
                    <td key={j} className="px-4 py-3"><div className="h-4 bg-gray-100 animate-pulse rounded" /></td>
                  ))}</tr>
                ))
              ) : colleges.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-10 text-center text-gray-400">No colleges found.</td></tr>
              ) : colleges.map(col => (
                <tr key={col.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">{col.college_name}</td>
                  <td className="px-4 py-3 text-gray-600">{col.course}</td>
                  <td className="px-4 py-3 text-gray-600">{col.state}</td>
                  <td className="px-4 py-3 text-gray-600">{col.sort_order}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleActive(col.id, col.is_active)}
                      className={`px-2 py-1 rounded-full text-xs font-medium transition-colors
                        ${col.is_active ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                      {col.is_active ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleDelete(col.id, col.college_name)} disabled={deletingId === col.id}
                      className="text-xs text-red-500 hover:text-red-700 font-medium disabled:opacity-50">
                      {deletingId === col.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  )
}
