'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

// Validation schema
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password must be less than 100 characters'),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const router = useRouter()

  useEffect(() => {
    const user = localStorage.getItem('user')

    if (user) {
      router.push('/admin')
    }
  }, [])

  async function onSubmit(data: LoginFormValues) {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      console.log("API RESULT:", result)

      if (!result.status) {
        throw new Error(result.message || 'Login failed')
      }

      // Store user information
      if (result.user) {
        localStorage.setItem('user', JSON.stringify(result.user))
        localStorage.setItem('role', result.role)
      }

      // Redirect to admin dashboard
      window.location.href = '/admin'
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <Card className="relative w-full max-w-md border-slate-700 bg-slate-800/50 backdrop-blur-xl">
        <div className="space-y-6 px-6 py-8">
          {/* Header */}
          <div className="space-y-2 text-center">
            <div className="mb-4 flex justify-center">
              <div className="rounded-lg bg-gradient-to-br from-primary to-primary/60 p-3">
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
            <p className="text-sm text-slate-400">
              Sign in to your account to continue
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {/* Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="email" className="text-slate-200">
                      Email Address
                    </Label>
                    <FormControl>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        disabled={isLoading}
                        className="border-slate-600 bg-slate-700/50 text-white placeholder:text-slate-500 focus-visible:border-primary"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-destructive" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-slate-200">
                        Password
                      </Label>
                    </div>
                    <FormControl>
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        disabled={isLoading}
                        className="border-slate-600 bg-slate-700/50 text-white placeholder:text-slate-500 focus-visible:border-primary"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-destructive" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
              >
                {isLoading ? (
                  <>
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>
          </Form>
        </div>
      </Card>
    </div>
  )
}
