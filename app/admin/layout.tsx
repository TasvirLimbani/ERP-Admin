"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getUser, logout, isAuthenticated, User, getUserFromStorage } from "@/lib/auth"
import Sidebar from "@/components/admin/sidebar"
import { Button } from "@/components/ui/button"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [user, setUserState] = useState<User | null>(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      const storedUser = getUser()
      if (!storedUser || storedUser.role !== "admin") {
        router.push("/login")
      } else {
        setUserState(storedUser)
        setIsReady(true)
      }
    }, 50) // small delay

    return () => clearTimeout(timer)
  }, [])

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  if (!isReady) {
    return null
  }

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Sidebar */}
      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-foreground"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-foreground">
                {user?.name}
              </p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
            <Button
              onClick={handleLogout}
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground"
            >
              Sign Out
            </Button>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
