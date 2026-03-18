"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  Zap,
  Layers,
  Droplets,
  Wind,
  Package,
  Database,
  ChevronDown,
} from "lucide-react"

interface SidebarProps {
  open: boolean
  onToggle: () => void
}

export default function Sidebar({ open }: SidebarProps) {
  const pathname = usePathname()

  const menuItems = [
    {
      label: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
    },
    {
      label: "Manager",
      href: "/admin/manager",
      icon: Users,
    },
    {
      label: "Machines",
      href: "/admin/machines",
      icon: Zap,
    },
    {
      label: "Yarn",
      href: "/admin/yarn",
      icon: Layers,
    },
    {
      label: "TPM",
      href: "/admin/tpm",
      icon: Database,
    },
    {
      label: "Dyeing",
      href: "/admin/dyeing",
      icon: Droplets,
    },
    {
      label: "Conning",
      href: "/admin/conning",
      icon: Wind,
    },
    {
      label: "Packing",
      href: "/admin/packing",
      icon: Package,
    },
    {
      label: "Stock",
      href: "/admin/stock",
      icon: Database,
    },
  ]

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin" || pathname === "/admin/"
    }
    return pathname?.startsWith(href)
  }

  return (
    <aside
      className={`${
        open ? "w-64" : "w-20"
      } bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col overflow-hidden`}
    >
      {/* Logo */}
      <div className="h-16 border-b border-sidebar-border flex items-center justify-center px-4">
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-sidebar-primary to-accent">
            <svg
              className="w-5 h-5 text-sidebar-primary-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.5a2 2 0 00-1 .267"
              />
            </svg>
          </div>
          {open && (
            <div className="flex flex-col">
              <span className="font-bold text-sm text-sidebar-foreground">
                Yarn
              </span>
              <span className="text-xs text-sidebar-accent opacity-75">
                Factory
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)

          return (
            <Link key={item.href} href={item.href}>
              <button
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium ${
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/10 hover:text-sidebar-foreground"
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {open && <span className="flex-1 text-left">{item.label}</span>}
              </button>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="h-16 border-t border-sidebar-border px-3 py-4 flex items-center justify-center">
        <div className="text-xs text-sidebar-foreground opacity-50 text-center">
          {open && <p>© 2024 Yarn Factory</p>}
        </div>
      </div>
    </aside>
  )
}
