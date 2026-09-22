'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, usePathname } from 'next/navigation'
import { LayoutDashboard, Building2, BookOpen, Award, Inbox, LogOut, Menu, ExternalLink } from 'lucide-react'
import { supabase } from '@/lib/supabase'

const navLinks = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/leads', label: 'Leads', icon: Inbox },
  { href: '/admin/colleges', label: 'Colleges', icon: Building2 },
  { href: '/admin/blogs', label: 'Blogs', icon: BookOpen },
  { href: '/admin/scholarships', label: 'Scholarships', icon: Award },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [email, setEmail] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) return router.replace('/admin/login')
      const { data: isAdmin } = await supabase.rpc('is_admin')
      if (!isAdmin) {
        await supabase.auth.signOut()
        return router.replace('/admin/login')
      }
      setEmail(data.session.user.email ?? '')
    })
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.replace('/admin/login')
  }

  if (email === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex bg-gray-100">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-blue-900 text-white flex flex-col z-30 transform transition-transform duration-200
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:z-auto`}
      >
        <div className="px-6 py-5 border-b border-blue-800 flex items-center gap-3">
          <Image src="/logo.jpeg" alt="Hello Doctor" width={40} height={40} className="rounded-lg bg-white" />
          <div>
            <div className="font-bold text-base leading-tight">Hello Doctor</div>
            <div className="text-blue-300 text-xs">Admin Panel</div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-6 py-3 text-sm transition-colors
                ${pathname === href
                  ? 'bg-blue-700 text-white font-semibold border-r-4 border-yellow-400'
                  : 'text-blue-200 hover:bg-blue-800 hover:text-white'}`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-6 py-3 text-sm text-blue-200 hover:bg-blue-800 hover:text-white"
          >
            <ExternalLink className="w-4 h-4" />
            View Website
          </a>
        </nav>

        <div className="px-6 py-4 border-t border-blue-800">
          <div className="text-xs text-blue-300 truncate mb-2">{email}</div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 text-sm text-blue-200 hover:text-white transition-colors py-1"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-3 flex items-center gap-4 sticky top-0 z-10">
          <button className="lg:hidden p-2 rounded-md hover:bg-gray-100" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-gray-800 font-semibold text-base">Hello Doctor — Admin</h1>
        </header>
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  )
}
