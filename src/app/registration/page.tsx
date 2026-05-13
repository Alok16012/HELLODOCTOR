'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

const CLASS_OPTIONS = ['10th', '11th', '12th', 'Graduated']
const STREAM_OPTIONS = ['Engineering', 'Medical', 'Management', 'Law', 'Design', 'Science', 'Arts', 'Commerce']
const COURSE_OPTIONS: Record<string, string[]> = {
  Engineering: ['B.Tech', 'B.E.', 'Diploma Engineering', 'M.Tech'],
  Medical: ['MBBS', 'BDS', 'BAMS', 'BHMS', 'B.Pharm', 'M.Pharm', 'B.Sc Nursing'],
  Management: ['BBA', 'MBA', 'BCA', 'MCA', 'PGDM'],
  Law: ['LLB (3yr)', 'BA LLB (5yr)', 'BBA LLB (5yr)'],
  Design: ['B.Des', 'B.Arch', 'M.Des', 'M.Arch'],
  Science: ['B.Sc', 'M.Sc', 'B.Sc (Hons)'],
  Arts: ['BA', 'MA', 'B.Ed', 'M.Ed'],
  Commerce: ['B.Com', 'M.Com', 'CA Foundation', 'CS'],
}

export default function RegistrationPage() {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    alt_phone: '',
    email: '',
    fathers_name: '',
    class: '',
    stream: '',
    course_interested: '',
    location: '',
    city: '',
    branch: '',
  })

  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message })
    setTimeout(() => setToast(null), 5000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    if (name === 'stream') {
      setForm(prev => ({ ...prev, stream: value, course_interested: '' }))
    } else {
      setForm(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.phone) {
      showToast('error', 'Name and phone number are required.')
      return
    }
    setLoading(true)
    try {
      const { error } = await supabase.from('student_leads').insert([{
        name: form.name,
        phone: form.phone,
        alt_phone: form.alt_phone,
        email: form.email,
        fathers_name: form.fathers_name,
        class: form.class,
        stream: form.stream,
        course_interested: form.course_interested,
        location: form.location,
        city: form.city,
        branch: form.branch,
        registration_status: 'pending',
      }])
      if (error) throw error
      showToast('success', 'Registration successful! Our counselor will contact you shortly.')
      setForm({
        name: '', phone: '', alt_phone: '', email: '', fathers_name: '',
        class: '', stream: '', course_interested: '', location: '', city: '', branch: '',
      })
    } catch (err: unknown) {
      showToast('error', (err as Error).message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const coursesForStream = form.stream ? (COURSE_OPTIONS[form.stream] || []) : []

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-10 px-4">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-lg shadow-xl text-white text-sm font-medium max-w-sm
          ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
          {toast.message}
        </div>
      )}

      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="w-10 h-10 bg-blue-700 rounded-lg flex items-center justify-center text-white font-bold text-lg">SH</div>
            <span className="text-2xl font-bold text-blue-800">SKYHIGH</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Student Registration</h1>
          <p className="text-gray-500 text-sm">Register your interest and get free college admission guidance</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Info */}
            <div>
              <h2 className="text-base font-semibold text-blue-700 mb-4 border-b border-blue-100 pb-2">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name <span className="text-red-500">*</span></label>
                  <input name="name" value={form.name} onChange={handleChange} required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Student's full name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Father's Name</label>
                  <input name="fathers_name" value={form.fathers_name} onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Father's full name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number <span className="text-red-500">*</span></label>
                  <input name="phone" value={form.phone} onChange={handleChange} required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="10-digit mobile number" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Alternate Phone</label>
                  <input name="alt_phone" value={form.alt_phone} onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Alternate number" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="email@example.com" />
                </div>
              </div>
            </div>

            {/* Academic Info */}
            <div>
              <h2 className="text-base font-semibold text-blue-700 mb-4 border-b border-blue-100 pb-2">Academic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Class / Qualification</label>
                  <select name="class" value={form.class} onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                    <option value="">Select class</option>
                    {CLASS_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stream</label>
                  <select name="stream" value={form.stream} onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                    <option value="">Select stream</option>
                    {STREAM_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Course Interested</label>
                  <select name="course_interested" value={form.course_interested} onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    disabled={coursesForStream.length === 0}>
                    <option value="">{coursesForStream.length === 0 ? 'Select stream first' : 'Select course'}</option>
                    {coursesForStream.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Location */}
            <div>
              <h2 className="text-base font-semibold text-blue-700 mb-4 border-b border-blue-100 pb-2">Location Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location / Area</label>
                  <input name="location" value={form.location} onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Locality or area" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input name="city" value={form.city} onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Your city" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Branch / Source</label>
                  <input name="branch" value={form.branch} onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="How did you hear about us?" />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors text-sm flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Submitting...
                </>
              ) : 'Submit Registration'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Your information is secure and will only be used for admission counselling purposes.
        </p>
      </div>
    </div>
  )
}
