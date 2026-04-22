'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line
} from 'recharts'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const data = [
  { name: 'Jan', machines: 4, yarn: 24, dyeing: 18 },
  { name: 'Feb', machines: 3, yarn: 19, dyeing: 22 },
  { name: 'Mar', machines: 2, yarn: 29, dyeing: 20 },
  { name: 'Apr', machines: 5, yarn: 39, dyeing: 18 },
  { name: 'May', machines: 4, yarn: 49, dyeing: 28 },
  { name: 'Jun', machines: 6, yarn: 59, dyeing: 30 },
]

const stats = [
  { label: 'Active Machines', value: '24', change: '+2' },
  { label: 'Total Yarn (kg)', value: '1,234', change: '+12%' },
  { label: 'Dyeing Progress', value: '85%', change: '+5%' },
  { label: 'Stock Levels', value: '2,456', change: '-3%' },
]

export default function Dashboard() {
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

  // 👇 prevent flicker
  if (loading) return null

  return (
    <div className="space-y-6 p-6">

      {/* 🔴 Logout Button */}
      {/* <div className="flex justify-end">
        <button
          onClick={() => {
            localStorage.removeItem('user')
            localStorage.removeItem('role')
            window.location.href = '/login'
          }}
          className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
        >
          Logout
        </button>
      </div> */}

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, idx) => (
          <Card key={idx}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">
                {stat.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stat.value}
              </div>
              <p className="mt-2 text-xs text-green-500">
                {stat.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Production Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="machines" stroke="#3b82f6" />
                <Line type="monotone" dataKey="yarn" stroke="#8b5cf6" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Department Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="machines" fill="#3b82f6" />
                <Bar dataKey="dyeing" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}