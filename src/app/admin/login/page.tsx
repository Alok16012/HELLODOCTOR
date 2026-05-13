'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'

type Role = 'admin' | 'intern' | 'volunteer' | 'counselor' | 'associate'

const ROLE_OPTIONS: { value: Role; label: string; icon: string }[] = [
  { value: 'admin', label: 'Admin', icon: '🛡️' },
  { value: 'intern', label: 'Intern', icon: '👨‍💼' },
  { value: 'volunteer', label: 'Volunteer', icon: '🤝' },
  { value: 'counselor', label: 'Counselor', icon: '💬' },
  { value: 'associate', label: 'Associate', icon: '🧑‍💼' },
]

export default function AdminLoginPage() {
  const router = useRouter()
  const [role, setRole] = useState<Role>('admin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (role === 'admin') {
        if (email === 'skyhighdigital6@gmail.com' && password === 'admin@123') {
          localStorage.setItem('skyhigh_user', JSON.stringify({ role: 'admin', name: 'Admin', email }))
          router.replace('/admin')
        } else {
          setError('Invalid admin credentials.')
        }
        return
      }

      const tableMap: Record<Exclude<Role, 'admin'>, string> = {
        intern: 'interns',
        volunteer: 'volunteers',
        counselor: 'counselors',
        associate: 'associates',
      }

      const table = tableMap[role as Exclude<Role, 'admin'>]
      const { data, error: dbError } = await supabase
        .from(table)
        .select('*')
        .eq('email', email)
        .eq('password', password)
        .single()

      if (dbError || !data) {
        setError('Invalid email or password. Please try again.')
        return
      }

      if (role === 'intern') {
        localStorage.setItem('skyhigh_user', JSON.stringify({
          role: 'intern',
          id: data.id,
          name: data.name,
          email: data.email,
        }))
        router.replace('/admin/intern-portal')
      } else if (role === 'volunteer') {
        localStorage.setItem('skyhigh_user', JSON.stringify({
          role: 'volunteer',
          id: data.id,
          name: data.name,
          email: data.email,
          intern_id: data.intern_id,
          intern_name: data.intern_name,
        }))
        router.replace('/admin/volunteer-portal')
      } else if (role === 'counselor') {
        localStorage.setItem('skyhigh_user', JSON.stringify({
          role: 'counselor',
          id: data.id,
          name: data.name,
          email: data.email,
        }))
        router.replace('/admin/counselor-portal')
      } else if (role === 'associate') {
        localStorage.setItem('skyhigh_user', JSON.stringify({
          role: 'associate',
          id: data.id,
          name: data.name,
          email: data.email,
        }))
        router.replace('/admin/associate-portal')
      }
    } catch {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center bg-white rounded-2xl p-2 mb-4 shadow-lg">
            <Image src="/logo_new.jpg" alt="SKYHIGH" width={56} height={56} className="object-contain rounded-xl" />
          </div>
          <h1 className="text-3xl font-bold text-white">SKYHIGH</h1>
          <p className="text-blue-200 text-sm mt-1">Educational Services</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-1">Welcome Back</h2>
          <p className="text-gray-500 text-sm mb-6">Sign in to your portal</p>

          {/* Role Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Your Role</label>
            <div className="grid grid-cols-2 gap-2">
              {ROLE_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => { setRole(opt.value); setError('') }}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all
                    ${role === opt.value
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-200 text-gray-600 hover:border-blue-300 hover:bg-gray-50'}`}
                >
                  <span>{opt.icon}</span>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 text-white font-semibold py-3 rounded-lg transition-colors text-sm flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </>
              ) : `Sign In as ${ROLE_OPTIONS.find(r => r.value === role)?.label}`}
            </button>
          </form>
        </div>

        <p className="text-center text-blue-200 text-xs mt-6">
          SKYHIGH Educational Services &copy; {new Date().getFullYear()}
        </p>
      </div>
    </div>
  )
}
