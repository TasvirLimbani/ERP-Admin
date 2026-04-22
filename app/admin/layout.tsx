'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, X, LayoutDashboard, Users, Cog, Shirt, Gauge, Palette, Wind, Package, Boxes, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
  { icon: Users, label: 'Manager', href: '/admin/manager' },
  { icon: Cog, label: 'Machines', href: '/admin/machines' },
  { icon: Shirt, label: 'Yarn', href: '/admin/yarn' },
  { icon: Gauge, label: 'TPM', href: '/admin/tpm' },
  { icon: Palette, label: 'Dyeing', href: '/admin/dyeing' },
  { icon: Wind, label: 'Conning', href: '/admin/conning' },
  { icon: Package, label: 'Packing', href: '/admin/packing' },
  { icon: Boxes, label: 'Stock', href: '/admin/stock' },
  { icon: Trash2, label: 'Waste', href: '/admin/waste' },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const user = localStorage.getItem('user')

    if (!user) {
      router.push('/login')
    } else {
      setLoading(false)
    }
  }, [])

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col transform bg-slate-900 text-white transition-transform duration-200 ease-in-out md:relative md:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-800 px-6">
          <h1 className="text-xl font-bold">Admin Panel</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto p-4">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-4 py-2 text-sm transition-colors',
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                )}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-slate-800 p-4">
          <button
            onClick={() => {
              localStorage.removeItem('user')
              localStorage.removeItem('role')
              router.push('/login')
            }}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white shadow-md transition-all duration-200 hover:bg-red-600 hover:shadow-lg active:scale-95"
          >
            {/* Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1m0-10V5"
              />
            </svg>

            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-16 items-center gap-4 border-b border-slate-200 bg-white px-6 dark:border-slate-800 dark:bg-slate-950">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800 md:hidden"
          >
            <Menu size={24} />
          </button>
          <h2 className="flex-1 text-lg font-semibold capitalize text-slate-900 dark:text-slate-50">
            {pathname.split('/').pop() || 'Dashboard'}
          </h2>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-slate-50 dark:bg-slate-950">
          {children}
        </main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}
