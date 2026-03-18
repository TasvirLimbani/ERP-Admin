"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { setUser } from "@/lib/auth"
import { Spinner } from "@/components/ui/spinner"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)


  useEffect(() => {
    const user = localStorage.getItem('auth_user') // or whatever setUser stores
    console.log("USER ::::::: ", user)
    if (user) {
      router.replace("/admin")
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      console.log("API RESPONSE:", data) // 👈 ADD THIS

      if (!res.ok || data.status === false) {
        throw new Error(data.message || "Login failed")
      }

      console.log("LOGIN SUCCESS") // 👈 ADD THIS

      setUser({
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: data.role,
      })

      // ✅ ADD THIS
      setTimeout(() => {
        router.replace("/admin")
      }, 100)
    } catch (err) {
      console.log("LOGIN ERROR:", err) // 👈 ADD THIS
      setError(err instanceof Error ? err.message : "Login failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background flex items-center justify-center px-4">
      {/* Background grid effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#30363d_1px,transparent_1px),linear-gradient(to_bottom,#30363d_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-5" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg blur-3xl opacity-20" />

        <div className="relative bg-card border border-border rounded-lg p-8 shadow-2xl">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-accent mb-4">
              <svg
                className="w-6 h-6 text-foreground"
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
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Yarn Factory
            </h1>
            <p className="text-muted-foreground text-sm">
              Inventory Management System
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground text-sm font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="bg-background border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground text-sm font-medium">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="bg-background border-border text-foreground placeholder:text-muted-foreground"
              />
              <p className="text-xs text-muted-foreground">
                Demo: Use any email and password (6+ chars)
              </p>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium h-10"
            >
              {isLoading ? (
                <>
                  <Spinner className="w-4 h-4 mr-2" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-border text-center">
            <p className="text-xs text-muted-foreground">
              Demo credentials:<br />
              Email: demo@example.com<br />
              Password: demo123
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
