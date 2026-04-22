'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const user = localStorage.getItem('user')

    if (user) {
      router.push('/admin')
    } else {
      router.push('/login')
    }
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="text-center">
        <div className="mb-4 flex justify-center">
          <div className="animate-spin">
            <div className="h-12 w-12 rounded-full border-4 border-slate-700 border-t-primary"></div>
          </div>
        </div>
        <p className="text-slate-400">Loading...</p>
      </div>
    </div>
  )
}
