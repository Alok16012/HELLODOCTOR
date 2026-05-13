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
  registration_status: string
  created_at: string
}

const STATUS_OPTIONS = ['pending', 'contacted', 'interested', 'registered', 'not_interested', 'follow_up']

export default function AssociatePortalPage() {
  const [user, setUser] = useState<UserData | null>(null)
  const [leads, setLeads] = useState<StudentLead[]>([])
  const [totalLeads, setTotalLeads] = useState(0)
  const [loading, setLoading] = useState(true)
  const [showAddLead, setShowAddLead] = useState(false)
  const [leadForm, setLeadForm] = useState({ name: '', phone: '', alt_phone: '', email: '', stream: '', course_interested: '', city: '' })
  const [submitting, setSubmitting] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editStatus, setEditStatus] = useState('')
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

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
    const { data, count } = await supabase
      .from('student_leads')
      .select('id, name, phone, stream, course_interested, city, registration_status, created_at', { count: 'exact' })
      .eq('associate_id', user.id)
      .order('created_at', { ascending: false })
      .limit(100)
    if (data) setLeads(data)
    setTotalLeads(count || 0)
    setLoading(false)
  }, [user?.id])

  useEffect(() => { fetchLeads() }, [fetchLeads])

  const handleAddLead = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!leadForm.name || !leadForm.phone || !user) {
      showToast('error', 'Name and phone are required.')
      return
    }
    setSubmitting(true)
    const { error } = await supabase.from('student_leads').insert([{
      name: leadForm.name,
      phone: leadForm.phone,
      alt_phone: leadForm.alt_phone,
      email: leadForm.email,
      stream: leadForm.stream,
      course_interested: leadForm.course_interested,
      city: leadForm.city,
      associate_id: user.id,
      associate_name: user.name,
      registration_status: 'pending',
    }])
    if (error) {
      showToast('error', error.message)
    } else {
      showToast('success', 'Lead added successfully.')
      setShowAddLead(false)
      setLeadForm({ name: '', phone: '', alt_phone: '', email: '', stream: '', course_interested: '', city: '' })
      fetchLeads()
    }
    setSubmitting(false)
  }

  const saveStatus = async (id: string) => {
    const { error } = await supabase.from('student_leads').update({ registration_status: editStatus }).eq('id', id)
    if (!error) {
      showToast('success', 'Status updated.')
      setEditingId(null)
      fetchLeads()
    } else {
      showToast('error', error.message)
    }
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

  return (
    <AdminLayout requiredRole="associate">
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-lg shadow-lg text-sm text-white
          ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
          {toast.message}
        </div>
      )}

      {showAddLead && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Add New Lead</h3>
            <form onSubmit={handleAddLead} className="space-y-3">
              {[
                { key: 'name', label: 'Full Name', required: true, type: 'text', placeholder: "Student's full name" },
                { key: 'phone', label: 'Phone', required: true, type: 'text', placeholder: '10-digit number' },
                { key: 'alt_phone', label: 'Alternate Phone', required: false, type: 'text', placeholder: 'Optional' },
                { key: 'email', label: 'Email', required: false, type: 'email', placeholder: 'Optional' },
                { key: 'stream', label: 'Stream', required: false, type: 'text', placeholder: 'Engineering, Medical...' },
                { key: 'course_interested', label: 'Course Interested', required: false, type: 'text', placeholder: 'B.Tech, MBBS...' },
                { key: 'city', label: 'City', required: false, type: 'text', placeholder: 'City name' },
              ].map(field => (
                <div key={field.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {field.label} {field.required && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type={field.type}
                    value={leadForm[field.key as keyof typeof leadForm]}
                    onChange={e => setLeadForm(p => ({ ...p, [field.key]: e.target.value }))}
                    required={field.required}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={field.placeholder}
                  />
                </div>
              ))}
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={submitting}
                  className="flex-1 bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 text-white font-semibold py-2.5 rounded-lg text-sm">
                  {submitting ? 'Adding...' : 'Add Lead'}
                </button>
                <button type="button" onClick={() => setShowAddLead(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 rounded-lg text-sm">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="space-y-6">
        <div className="bg-gradient-to-r from-indigo-700 to-indigo-600 rounded-2xl p-6 text-white">
          <div className="text-sm text-indigo-200 mb-1">Welcome back,</div>
          <div className="text-2xl font-bold">{user?.name || 'Associate'}</div>
          <div className="text-indigo-200 text-sm mt-1">Associate Portal</div>
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

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="text-sm text-gray-500 mb-1">My Total Leads</div>
          <div className="text-3xl font-bold text-indigo-700">{loading ? '...' : totalLeads}</div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800 text-base">My Student Leads</h3>
            <button onClick={() => setShowAddLead(true)}
              className="bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold px-4 py-2 rounded-lg">
              + Add Lead
            </button>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => <div key={i} className="h-10 bg-gray-100 animate-pulse rounded" />)}
            </div>
          ) : leads.length === 0 ? (
            <p className="text-gray-400 text-sm">No leads yet. Add your first student lead.</p>
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
                    <th className="pb-3 text-left font-semibold text-gray-600 whitespace-nowrap">Date</th>
                    <th className="pb-3 text-left font-semibold text-gray-600 whitespace-nowrap">Action</th>
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
                        {editingId === lead.id ? (
                          <select value={editStatus} onChange={e => setEditStatus(e.target.value)}
                            className="border border-gray-300 rounded px-2 py-1 text-xs bg-white">
                            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        ) : (
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor(lead.registration_status)}`}>
                            {lead.registration_status || 'pending'}
                          </span>
                        )}
                      </td>
                      <td className="py-3 text-gray-500 text-xs whitespace-nowrap">
                        {new Date(lead.created_at).toLocaleDateString('en-IN')}
                      </td>
                      <td className="py-3 whitespace-nowrap">
                        {editingId === lead.id ? (
                          <div className="flex gap-1">
                            <button onClick={() => saveStatus(lead.id)}
                              className="text-xs bg-blue-600 text-white px-2 py-1 rounded">Save</button>
                            <button onClick={() => setEditingId(null)}
                              className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">Cancel</button>
                          </div>
                        ) : (
                          <button onClick={() => { setEditingId(lead.id); setEditStatus(lead.registration_status || 'pending') }}
                            className="text-xs text-blue-600 hover:text-blue-800 font-medium">Edit</button>
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
