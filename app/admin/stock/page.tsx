'use client'

import { useEffect, useMemo, useState } from 'react'
import { Package2, Layers3, Boxes, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

type StockCone = {
  cone_size: number | string
  cones: number | string
}

type StockRow = {
  yarn_type: string
  yarn_sub_type: string
  category: string
  color: string
  unpacked_cones: StockCone[]
  packed_cones_size: StockCone[]
}

type StockResponse = {
  status: boolean
  message?: string
  data?: {
    list?: StockRow[]
    pagination?: {
      current_page: number
      per_page: number
      total_records: number
      total_pages: number
      has_next: boolean
      has_prev: boolean
    }
  }
}

function formatNumber(value: number | string) {
  const numericValue = Number(value)
  return Number.isFinite(numericValue) ? numericValue.toLocaleString() : String(value)
}

function StockRowCard({ item }: { item: StockRow }) {
  const unpackedTotal = item.unpacked_cones?.reduce((sum, row) => sum + Number(row.cones || 0), 0) || 0
  const packedTotal = item.packed_cones_size?.reduce((sum, row) => sum + Number(row.box || 0), 0) || 0

  return (
    <Card className="overflow-hidden border-slate-200 bg-white/90 shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-950/80">
      <div className="border-b border-slate-200 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 p-5 text-white dark:border-slate-800">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-xl font-semibold">{item.yarn_type}</h3>
              <Badge className="bg-white/15 text-white hover:bg-white/20">{item.yarn_sub_type}</Badge>
              <Badge className="bg-white/15 text-white hover:bg-white/20">{item.category}</Badge>
            </div>
            <p className="mt-1 text-sm text-slate-200">Color: {item.color}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm md:min-w-64">
            <div className="rounded-xl bg-white/10 p-3 backdrop-blur">
              <p className="text-slate-300">Unpacked cones</p>
              <p className="text-lg font-semibold">{formatNumber(unpackedTotal)}</p>
            </div>
            <div className="rounded-xl bg-white/10 p-3 backdrop-blur">
              <p className="text-slate-300">Packed boxes</p>
              <p className="text-lg font-semibold">{formatNumber(packedTotal)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 p-5 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/40">
          <div className="mb-3 flex items-center gap-2 text-slate-900 dark:text-slate-50">
            <Layers3 size={16} />
            <h4 className="font-semibold">Unpacked Cones</h4>
          </div>
          <div className="space-y-2">
            {item.unpacked_cones?.length ? item.unpacked_cones.map((cone, index) => (
              <div key={`${cone.cone_size}-${index}`} className="flex items-center justify-between rounded-xl bg-white px-3 py-2 text-sm shadow-sm dark:bg-slate-950">
                <span className="text-slate-600 dark:text-slate-300">Cone size {formatNumber(cone.cone_size)}</span>
                <span className="font-semibold text-slate-900 dark:text-slate-50">{formatNumber(cone.cones)} cones</span>
              </div>
            )) : (
              <p className="text-sm text-slate-500 dark:text-slate-400">No unpacked cones available.</p>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/40">
          <div className="mb-3 flex items-center gap-2 text-slate-900 dark:text-slate-50">
            <Boxes size={16} />
            <h4 className="font-semibold">Packed Cone Sizes</h4>
          </div>
          <div className="space-y-2">
            {item.packed_cones_size?.length ? item.packed_cones_size.map((cone, index) => (
              <div key={`${cone.cone_size}-${index}`} className="flex items-center justify-between rounded-xl bg-white px-3 py-2 text-sm shadow-sm dark:bg-slate-950">
                <span className="text-slate-600 dark:text-slate-300">Cone size {formatNumber(cone.cone_size)}</span>
                <span className="font-semibold text-slate-900 dark:text-slate-50">{formatNumber(cone.box)} boxes</span>
              </div>
            )) : (
              <p className="text-sm text-slate-500 dark:text-slate-400">No packed cone sizes available.</p>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}

export default function StockPage() {
  const [rows, setRows] = useState<StockRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 30,
    total_records: 0,
    total_pages: 1,
    has_next: false,
    has_prev: false,
  })

  const fetchStock = async (page: number) => {
    try {
      setLoading(true)
      setError('')
      const res = await fetch(`/api/stock?current_page=${page}&_t=${Date.now()}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      })
      const result: StockResponse = await res.json()

      const list = Array.isArray(result?.data?.list) ? result.data.list : []
      setRows(list)
      setPagination(result?.data?.pagination || {
        current_page: page,
        per_page: 30,
        total_records: list.length,
        total_pages: 1,
        has_next: false,
        has_prev: false,
      })
    } catch (err) {
      console.error('Error fetching stock data:', err)
      setRows([])
      setError('Failed to load stock data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStock(currentPage)
  }, [currentPage])

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(15,23,42,0.08),_transparent_35%),linear-gradient(180deg,_#f8fafc_0%,_#eef2ff_100%)] p-6 dark:bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.06),_transparent_35%),linear-gradient(180deg,_#020617_0%,_#0f172a_100%)]">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="overflow-hidden rounded-3xl border border-white/60 bg-white/70 p-6 shadow-xl backdrop-blur dark:border-slate-800 dark:bg-slate-950/60">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
                <Package2 size={14} /> Live Stock Overview
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Stock Management</h1>
                <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-400">
                  Read-only stock snapshot grouped by yarn type, subtype, category, and color with unpacked and packed cone details.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => fetchStock(currentPage)} className="gap-2 border-slate-200 bg-white/80 dark:border-slate-800 dark:bg-slate-950">
                <RefreshCw size={16} /> Refresh
              </Button>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-white/70 p-4 text-sm text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-950/50 dark:text-slate-400">
            Showing {rows.length} stock record{rows.length === 1 ? '' : 's'} on this page.
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <Card key={index} className="border-slate-200 bg-white/80 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950/70">
                <div className="space-y-4">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-72" />
                  <div className="grid gap-4 md:grid-cols-2">
                    <Skeleton className="h-28 rounded-2xl" />
                    <Skeleton className="h-28 rounded-2xl" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : error ? (
          <Card className="border-red-200 bg-red-50 p-6 text-red-700 shadow-sm dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
            {error}
          </Card>
        ) : rows.length === 0 ? (
          <Card className="border-slate-200 bg-white/80 p-10 text-center shadow-sm dark:border-slate-800 dark:bg-slate-950/70">
            <p className="text-lg font-medium text-slate-900 dark:text-slate-50">No stock data found</p>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">The API returned an empty list for the selected page.</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {rows.map((item, index) => (
              <StockRowCard key={`${item.yarn_type}-${item.yarn_sub_type}-${item.color}-${index}`} item={item} />
            ))}
          </div>
        )}

        {pagination.total_pages > 1 && (
          <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-white/60 bg-white/70 p-4 shadow-lg backdrop-blur dark:border-slate-800 dark:bg-slate-950/60 md:flex-row">
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Page {pagination.current_page} of {pagination.total_pages}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={!pagination.has_prev}
                className="gap-2"
              >
                <ChevronLeft size={16} /> Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(pagination.total_pages, prev + 1))}
                disabled={!pagination.has_next}
                className="gap-2"
              >
                Next <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
