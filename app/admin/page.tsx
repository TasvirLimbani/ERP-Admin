'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

type DashboardData = {
  total_yarn_stock: number
  total_yarn_types: { total_yarn_types: number }
  yarn_types: Array<{ yarn_type: string, yarn_sub_type: string, stock: string, waste: string }>
  low_stock_alert: Array<{ yarn_type: string, yarn_sub_type: string, stock?: string, remaining?: string }>
  weight_loss: {
    total_tpm_waste: number
    total_dyeing_waste: number
    total_weight_loss: number
  }
  production_chart_7_days: Array<any>
  tpm_running: Array<{ yarn_type: string, yarn_sub_type: string, weight: string }>
  dyeing_running: Array<{ yarn_type: string, yarn_sub_type: string, color: string, total_weight: string }>
  coning: Array<{ yarn_type: string, yarn_sub_type: string, color: string, total_weight: string, total_cones: number }>
  packing: Array<{ yarn_type: string, color: string, total_box: number }>
  waste_category_wise: Array<{
    yarn_type: string
    yarn_sub_type: string
    total_tpm_waste: string
    total_dyeing_waste: string
    total_waste: string
  }>
}

type DashboardApiResponse = {
  status: boolean
  data?: DashboardData
  message?: string
}

function SectionCard({ title, count, children }: { title: string, count?: number, children: React.ReactNode }) {
  return (
    <Card className="border-slate-200 dark:border-slate-800">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base font-semibold">{title}</CardTitle>
          {typeof count === 'number' && <Badge variant="secondary">{count}</Badge>}
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}

export default function Dashboard() {
  const router = useRouter()
  const [authLoading, setAuthLoading] = useState(true)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [companyId, setCompanyId] = useState<string>('')
  const [dashboard, setDashboard] = useState<DashboardData | null>(null)

  const fetchDashboard = async (currentCompanyId: string) => {
    try {
      setLoading(true)
      setError('')
      const res = await fetch(`/api/dashboard?company_id=${currentCompanyId}&_t=${Date.now()}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      })

      const result: DashboardApiResponse = await res.json()
      if (!res.ok || !result.status || !result.data) {
        throw new Error(result.message || 'Failed to load dashboard')
      }

      setDashboard(result.data)
    } catch (err) {
      console.error('Dashboard fetch error:', err)
      setError('Failed to load dashboard data')
      setDashboard(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const user = localStorage.getItem('user')

    if (!user) {
      router.push('/login')
    } else {
      try {
        const userData = JSON.parse(user)
        const currentCompanyId = String(userData.company_id || '')
        if (!currentCompanyId) {
          setError('Company not found for current user')
          setDashboard(null)
          setLoading(false)
        } else {
          setCompanyId(currentCompanyId)
          fetchDashboard(currentCompanyId)
        }
      } catch (err) {
        console.error('Invalid user data in localStorage:', err)
        setError('Invalid user session data')
        setLoading(false)
      }
      setAuthLoading(false)
    }
  }, [router])

  if (authLoading) return null

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Company ID: {companyId || '-'}</p>
        </div>
        <Button onClick={() => companyId && fetchDashboard(companyId)} disabled={loading || !companyId}>
          {loading ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30">
          <CardContent className="p-4 text-red-700 dark:text-red-300">{error}</CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Total Yarn Stock</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold">{dashboard?.total_yarn_stock ?? '-'}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Total Yarn Types</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold">{dashboard?.total_yarn_types?.total_yarn_types ?? '-'}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Total Weight Loss</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold">{dashboard?.weight_loss?.total_weight_loss ?? '-'}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold">{dashboard?.low_stock_alert?.length ?? 0}</p></CardContent>
        </Card>
      </div>

      <SectionCard title="Yarn Types" count={dashboard?.yarn_types?.length || 0}>
        <div className="rounded-md border border-slate-200 dark:border-slate-800">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Yarn Type</TableHead>
                <TableHead>Sub Type</TableHead>
                <TableHead className="text-right">Stock</TableHead>
                <TableHead className="text-right">Waste</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(dashboard?.yarn_types || []).map((row, idx) => (
                <TableRow key={`${row.yarn_type}-${row.yarn_sub_type}-${idx}`}>
                  <TableCell>{row.yarn_type}</TableCell>
                  <TableCell>{row.yarn_sub_type}</TableCell>
                  <TableCell className="text-right">{row.stock}</TableCell>
                  <TableCell className="text-right">{row.waste}</TableCell>
                </TableRow>
              ))}
              {!dashboard?.yarn_types?.length && (
                <TableRow><TableCell colSpan={4} className="text-center text-slate-500">No yarn type data</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </SectionCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="TPM Running" count={dashboard?.tpm_running?.length || 0}>
          <div className="space-y-2">
            {(dashboard?.tpm_running || []).map((row, idx) => (
              <div key={`${row.yarn_type}-${row.yarn_sub_type}-${idx}`} className="flex items-center justify-between rounded-md border border-slate-200 px-3 py-2 dark:border-slate-800">
                <div>
                  <p className="font-medium">{row.yarn_type}</p>
                  <p className="text-xs text-slate-500">{row.yarn_sub_type}</p>
                </div>
                <Badge>{row.weight}</Badge>
              </div>
            ))}
            {!dashboard?.tpm_running?.length && <p className="text-sm text-slate-500">No running TPM data</p>}
          </div>
        </SectionCard>

        <SectionCard title="Dyeing Running" count={dashboard?.dyeing_running?.length || 0}>
          <div className="space-y-2">
            {(dashboard?.dyeing_running || []).map((row, idx) => (
              <div key={`${row.yarn_type}-${row.yarn_sub_type}-${row.color}-${idx}`} className="flex items-center justify-between rounded-md border border-slate-200 px-3 py-2 dark:border-slate-800">
                <div>
                  <p className="font-medium">{row.yarn_type} - {row.yarn_sub_type}</p>
                  <p className="text-xs text-slate-500">Color: {row.color}</p>
                </div>
                <Badge>{row.total_weight}</Badge>
              </div>
            ))}
            {!dashboard?.dyeing_running?.length && <p className="text-sm text-slate-500">No running dyeing data</p>}
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="Coning" count={dashboard?.coning?.length || 0}>
          <div className="rounded-md border border-slate-200 dark:border-slate-800">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Yarn</TableHead>
                  <TableHead>Color</TableHead>
                  <TableHead className="text-right">Weight</TableHead>
                  <TableHead className="text-right">Cones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(dashboard?.coning || []).map((row, idx) => (
                  <TableRow key={`${row.yarn_type}-${row.yarn_sub_type}-${idx}`}>
                    <TableCell>{row.yarn_type} - {row.yarn_sub_type}</TableCell>
                    <TableCell>{row.color}</TableCell>
                    <TableCell className="text-right">{row.total_weight}</TableCell>
                    <TableCell className="text-right">{row.total_cones}</TableCell>
                  </TableRow>
                ))}
                {!dashboard?.coning?.length && (
                  <TableRow><TableCell colSpan={4} className="text-center text-slate-500">No coning data</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </SectionCard>

        <SectionCard title="Packing" count={dashboard?.packing?.length || 0}>
          <div className="rounded-md border border-slate-200 dark:border-slate-800">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Yarn Type</TableHead>
                  <TableHead>Color</TableHead>
                  <TableHead className="text-right">Total Box</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(dashboard?.packing || []).map((row, idx) => (
                  <TableRow key={`${row.yarn_type}-${row.color}-${idx}`}>
                    <TableCell>{row.yarn_type}</TableCell>
                    <TableCell>{row.color}</TableCell>
                    <TableCell className="text-right">{row.total_box}</TableCell>
                  </TableRow>
                ))}
                {!dashboard?.packing?.length && (
                  <TableRow><TableCell colSpan={3} className="text-center text-slate-500">No packing data</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Waste Category Wise" count={dashboard?.waste_category_wise?.length || 0}>
        <div className="rounded-md border border-slate-200 dark:border-slate-800">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Yarn</TableHead>
                <TableHead className="text-right">TPM Waste</TableHead>
                <TableHead className="text-right">Dyeing Waste</TableHead>
                <TableHead className="text-right">Total Waste</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(dashboard?.waste_category_wise || []).map((row, idx) => (
                <TableRow key={`${row.yarn_type}-${row.yarn_sub_type}-${idx}`}>
                  <TableCell>{row.yarn_type} - {row.yarn_sub_type}</TableCell>
                  <TableCell className="text-right">{row.total_tpm_waste}</TableCell>
                  <TableCell className="text-right">{row.total_dyeing_waste}</TableCell>
                  <TableCell className="text-right font-semibold">{row.total_waste}</TableCell>
                </TableRow>
              ))}
              {!dashboard?.waste_category_wise?.length && (
                <TableRow><TableCell colSpan={4} className="text-center text-slate-500">No waste breakdown data</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </SectionCard>

      <SectionCard title="Low Stock Alert" count={dashboard?.low_stock_alert?.length || 0}>
        {!dashboard?.low_stock_alert?.length ? (
          <p className="text-sm text-slate-500">No low stock alerts right now.</p>
        ) : (
          <div className="space-y-2">
            {dashboard.low_stock_alert.map((item, idx) => (
              <div key={`${item.yarn_type}-${item.yarn_sub_type}-${idx}`} className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300">
                {item.yarn_type} - {item.yarn_sub_type}
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      {!!dashboard?.production_chart_7_days?.length && (
        <SectionCard title="Production Chart (7 Days)" count={dashboard.production_chart_7_days.length}>
          <pre className="max-h-64 overflow-auto rounded-md bg-slate-50 p-3 text-xs dark:bg-slate-900">{JSON.stringify(dashboard.production_chart_7_days, null, 2)}</pre>
        </SectionCard>
      )}
    </div>
  )
}