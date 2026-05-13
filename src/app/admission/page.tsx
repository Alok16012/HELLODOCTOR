'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

interface RegistrationCollege {
  id: string
  course: string
  state: string
  college_name: string
  is_active: boolean
}

const CLASS_OPTIONS = ['10th', '11th', '12th', 'Graduate', 'Post Graduate']
const STREAM_OPTIONS = ['Science', 'Commerce', 'Arts', 'Other']

export default function AdmissionPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    alternate_number: '',
    address: '',
    class: '',
    stream: '',
  })

  const [colleges, setColleges] = useState<RegistrationCollege[]>([])
  const [availableCourses, setAvailableCourses] = useState<string[]>([])
  const [availableStates, setAvailableStates] = useState<string[]>([])
  const [availableColleges, setAvailableColleges] = useState<string[]>([])

  const [selectedCourses, setSelectedCourses] = useState<string[]>([])
  const [selectedState, setSelectedState] = useState('')
  const [selectedColleges, setSelectedColleges] = useState<string[]>([])

  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  useEffect(() => {
    const fetchColleges = async () => {
      const { data } = await supabase
        .from('registration_colleges')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })
      if (data) setColleges(data)
    }
    fetchColleges()
  }, [])

  useEffect(() => {
    if (colleges.length > 0) {
      const courses = [...new Set(colleges.map(c => c.course))].filter(Boolean)
      setAvailableCourses(courses)
    }
  }, [colleges])

  useEffect(() => {
    if (selectedCourses.length > 0) {
      const filtered = colleges.filter(c => selectedCourses.includes(c.course))
      const states = [...new Set(filtered.map(c => c.state))].filter(Boolean)
      setAvailableStates(states)
      setSelectedState('')
      setSelectedColleges([])
      setAvailableColleges([])
    } else {
      setAvailableStates([])
      setSelectedState('')
      setSelectedColleges([])
      setAvailableColleges([])
    }
  }, [selectedCourses, colleges])

  useEffect(() => {
    if (selectedState && selectedCourses.length > 0) {
      const filtered = colleges.filter(
        c => selectedCourses.includes(c.course) && c.state === selectedState
      )
      setAvailableColleges([...new Set(filtered.map(c => c.college_name))])
      setSelectedColleges([])
    } else {
      setAvailableColleges([])
      setSelectedColleges([])
    }
  }, [selectedState, selectedCourses, colleges])

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message })
    setTimeout(() => setToast(null), 5000)
  }

  const toggleCourse = (course: string) => {
    setSelectedCourses(prev =>
      prev.includes(course) ? prev.filter(c => c !== course) : [...prev, course]
    )
  }

  const toggleCollege = (college: string) => {
    setSelectedColleges(prev =>
      prev.includes(college) ? prev.filter(c => c !== college) : [...prev, college]
    )
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.phone || !form.class || !form.stream) {
      showToast('error', 'Please fill in all required fields.')
      return
    }
    setLoading(true)
    try {
      const { error } = await supabase.from('expo_registrations').insert([{
        name: form.name,
        email: form.email,
        phone: form.phone,
        alternate_number: form.alternate_number,
        address: form.address,
        class: form.class,
        stream: form.stream,
        course: selectedCourses.join(', '),
        state: selectedState,
        college_preference: selectedColleges.join(', '),
        status: 'Pending',
      }])
      if (error) throw error
      showToast('success', 'Registration successful! We will contact you soon.')
      setForm({ name: '', email: '', phone: '', alternate_number: '', address: '', class: '', stream: '' })
      setSelectedCourses([])
      setSelectedState('')
      setSelectedColleges([])
    } catch (err: unknown) {
      showToast('error', (err as Error).message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-10 px-4">
        {toast && (
          <div className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-lg shadow-xl text-white text-sm font-medium max-w-sm transition-all
            ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
            {toast.message}
          </div>
        )}

        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Student Registration</h1>
            <p className="text-gray-500 text-sm">Fill in the details below and our counselor will reach out to you</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Academic Info — FIRST */}
            <div className="bg-white rounded-2xl border-l-4 border-purple-500 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h2 className="text-base font-semibold text-purple-700">Academic Info</h2>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Class <span className="text-red-500">*</span>
                  </label>
                  <select name="class" value={form.class} onChange={handleChange} required
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white">
                    <option value="">Select class</option>
                    {CLASS_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stream <span className="text-red-500">*</span>
                  </label>
                  <select name="stream" value={form.stream} onChange={handleChange} required
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white">
                    <option value="">Select stream</option>
                    {STREAM_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              {/* Course Toggle Buttons */}
              {availableCourses.length > 0 && (
                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Choose Course to Study
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {availableCourses.map(course => (
                      <button
                        key={course}
                        type="button"
                        onClick={() => toggleCourse(course)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all
                          ${selectedCourses.includes(course)
                            ? 'bg-purple-600 text-white border-purple-600'
                            : 'bg-white text-gray-600 border-gray-300 hover:border-purple-400 hover:text-purple-600'
                          }`}
                      >
                        {course}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* State Dropdown — appears after course selected */}
              {selectedCourses.length > 0 && availableStates.length > 0 && (
                <div className="mb-5 animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Choose State
                  </label>
                  <select
                    value={selectedState}
                    onChange={e => setSelectedState(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white"
                  >
                    <option value="">Select state</option>
                    {availableStates.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              )}

              {/* College Multi-select — appears after state selected */}
              {selectedState && availableColleges.length > 0 && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Choose University / College
                  </label>
                  <div className="border border-gray-200 rounded-lg overflow-y-auto max-h-48 divide-y divide-gray-100">
                    {availableColleges.map(college => (
                      <label key={college} className="flex items-center gap-3 px-4 py-2.5 hover:bg-purple-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedColleges.includes(college)}
                          onChange={() => toggleCollege(college)}
                          className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-400"
                        />
                        <span className="text-sm text-gray-700">{college}</span>
                      </label>
                    ))}
                  </div>
                  {selectedColleges.length > 0 && (
                    <p className="text-xs text-purple-600 mt-1.5 font-medium">
                      {selectedColleges.length} college{selectedColleges.length > 1 ? 's' : ''} selected
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Personal Info — SECOND */}
            <div className="bg-white rounded-2xl border-l-4 border-blue-500 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h2 className="text-base font-semibold text-blue-700">Personal Info</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </span>
                    <input name="name" value={form.name} onChange={handleChange} required
                      className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                      placeholder="Your full name" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </span>
                    <input name="email" type="email" value={form.email} onChange={handleChange}
                      className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                      placeholder="email@example.com" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </span>
                    <input name="phone" value={form.phone} onChange={handleChange} required
                      className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                      placeholder="10-digit mobile number" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Alternate Number</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </span>
                    <input name="alternate_number" value={form.alternate_number} onChange={handleChange}
                      className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                      placeholder="Alternate contact" />
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea name="address" value={form.address} onChange={handleChange} rows={2}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                  placeholder="Your complete address" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-semibold py-3 px-6 rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Submitting...
                </>
              ) : 'Submit Registration'}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-6">
            By submitting, you agree to be contacted by SKYHIGH Educational Services. 100% Free service.
          </p>
        </div>
      </div>
      <Footer />
    </>
  )
}
