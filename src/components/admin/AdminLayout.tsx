'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'

interface AdminLayoutProps {
  children: React.ReactNode
  requiredRole?: string | string[]
}

const navLinks = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/student-leads', label: 'Student Leads', icon: '🎓' },
  { href: '/admin/expo-registrations', label: 'Expo Registrations', icon: '📋' },
  { href: '/admin/interns', label: 'Interns', icon: '👨‍💼' },
  { href: '/admin/volunteers', label: 'Volunteers', icon: '🤝' },
  { href: '/admin/counselors', label: 'Counselors', icon: '💬' },
  { href: '/admin/associates', label: 'Associates', icon: '🧑‍💼' },
  { href: '/admin/leads', label: 'Enquiries', icon: '📞' },
  { href: '/admin/registration-colleges', label: 'Reg. Colleges', icon: '🏫' },
]

export default function AdminLayout({ children, requiredRole }: AdminLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<{ role: string; name: string; email: string } | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const raw = localStorage.getItem('skyhigh_user')
    if (!raw) {
      router.replace('/admin/login')
      return
    }
    const parsed = JSON.parse(raw)
    const allowed = requiredRole
      ? Array.isArray(requiredRole)
        ? requiredRole
        : [requiredRole]
      : ['admin']
    if (!allowed.includes(parsed.role)) {
      router.replace('/admin/login')
      return
    }
    setUser(parsed)
  }, [router, requiredRole])

  const handleLogout = () => {
    localStorage.removeItem('skyhigh_user')
    router.replace('/admin/login')
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-blue-900 text-white flex flex-col z-30 transform transition-transform duration-200
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:z-auto`}
      >
        {/* Logo */}
        <div className="px-6 py-5 border-b border-blue-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-yellow-400 rounded-lg flex items-center justify-center font-bold text-blue-900 text-sm">SH</div>
            <div>
              <div className="font-bold text-base leading-tight">SKYHIGH</div>
              <div className="text-blue-300 text-xs">Admin Panel</div>
            </div>
          </div>
        </div>

        {/* User info */}
        <div className="px-6 py-4 border-b border-blue-800 bg-blue-800">
          <div className="text-xs text-blue-300 uppercase tracking-wide mb-1">Logged in as</div>
          <div className="font-semibold text-sm truncate">{user.name || user.email}</div>
          <div className="text-blue-300 text-xs capitalize">{user.role}</div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          {user.role === 'admin' && navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-6 py-3 text-sm transition-colors
                ${pathname === link.href
                  ? 'bg-blue-700 text-white font-semibold border-r-4 border-yellow-400'
                  : 'text-blue-200 hover:bg-blue-800 hover:text-white'}`}
            >
              <span className="text-base">{link.icon}</span>
              {link.label}
            </a>
          ))}

          {user.role === 'intern' && (
            <a
              href="/admin/intern-portal"
              className={`flex items-center gap-3 px-6 py-3 text-sm transition-colors
                ${pathname === '/admin/intern-portal'
                  ? 'bg-blue-700 text-white font-semibold border-r-4 border-yellow-400'
                  : 'text-blue-200 hover:bg-blue-800 hover:text-white'}`}
            >
              <span>🏠</span> My Portal
            </a>
          )}

          {user.role === 'volunteer' && (
            <a
              href="/admin/volunteer-portal"
              className={`flex items-center gap-3 px-6 py-3 text-sm transition-colors
                ${pathname === '/admin/volunteer-portal'
                  ? 'bg-blue-700 text-white font-semibold border-r-4 border-yellow-400'
                  : 'text-blue-200 hover:bg-blue-800 hover:text-white'}`}
            >
              <span>🏠</span> My Portal
            </a>
          )}

          {user.role === 'counselor' && (
            <a
              href="/admin/counselor-portal"
              className={`flex items-center gap-3 px-6 py-3 text-sm transition-colors
                ${pathname === '/admin/counselor-portal'
                  ? 'bg-blue-700 text-white font-semibold border-r-4 border-yellow-400'
                  : 'text-blue-200 hover:bg-blue-800 hover:text-white'}`}
            >
              <span>🏠</span> My Portal
            </a>
          )}

          {user.role === 'associate' && (
            <a
              href="/admin/associate-portal"
              className={`flex items-center gap-3 px-6 py-3 text-sm transition-colors
                ${pathname === '/admin/associate-portal'
                  ? 'bg-blue-700 text-white font-semibold border-r-4 border-yellow-400'
                  : 'text-blue-200 hover:bg-blue-800 hover:text-white'}`}
            >
              <span>🏠</span> My Portal
            </a>
          )}
        </nav>

        {/* Logout */}
        <div className="px-6 py-4 border-t border-blue-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 text-sm text-blue-200 hover:text-white transition-colors py-2"
          >
            <span>🚪</span> Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-0">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-3 flex items-center gap-4 sticky top-0 z-10">
          <button
            className="lg:hidden p-2 rounded-md hover:bg-gray-100"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <div className="w-5 h-0.5 bg-gray-600 mb-1" />
            <div className="w-5 h-0.5 bg-gray-600 mb-1" />
            <div className="w-5 h-0.5 bg-gray-600" />
          </button>
          <h1 className="text-gray-800 font-semibold text-base">SKYHIGH Educational Services</h1>
          <div className="ml-auto text-sm text-gray-500">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
