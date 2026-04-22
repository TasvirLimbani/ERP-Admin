'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, Edit2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

interface FormData {
  machine_number: string
  machine_type: string
  status: string
}

const MACHINE_TYPE_OPTIONS = [
  'Spinning Machine',
  'Twisting Machine',
  'Warping Machine',
  'Dyeing Machine',
  'Packaging Machine',
  'Cone Winding',
  'Automatic Cone',
]

function TablePagination({ data, onEdit, onDelete, pageSize = 5 }: { data: any[], onEdit: (item: any) => void, onDelete: (item: any) => void, pageSize?: number }) {
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = Math.ceil(data.length / pageSize)
  const startIdx = (currentPage - 1) * pageSize
  const endIdx = startIdx + pageSize
  const currentData = data.slice(startIdx, endIdx)

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-slate-200 dark:border-slate-800">
        <Table>
          <TableHeader>
            <TableRow className="border-slate-200 hover:bg-transparent dark:border-slate-800">
              <TableHead className="text-slate-600 dark:text-slate-400">ID</TableHead>
              <TableHead className="text-slate-600 dark:text-slate-400">Machine Number</TableHead>
              <TableHead className="text-slate-600 dark:text-slate-400">Machine Type</TableHead>
              <TableHead className="text-slate-600 dark:text-slate-400">Status</TableHead>
              <TableHead className="text-right text-slate-600 dark:text-slate-400">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentData.map((item) => (
              <TableRow key={item.id} className="border-slate-200 dark:border-slate-800">
                <TableCell className="font-medium text-slate-900 dark:text-slate-50">{item.id}</TableCell>
                <TableCell className="text-slate-600 dark:text-slate-400">{item.machine_number}</TableCell>
                <TableCell className="text-slate-600 dark:text-slate-400">{item.machine_type}</TableCell>
                <TableCell>
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${item.status === 'active'
                    ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                    : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                    }`}>
                    {item.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => onEdit(item)} className="rounded p-1 hover:bg-slate-100 dark:hover:bg-slate-800">
                      <Edit2 size={16} className="text-slate-600 dark:text-slate-400" />
                    </button>
                    <button onClick={() => onDelete(item)} className="rounded p-1 hover:bg-slate-100 dark:hover:bg-slate-800">
                      <Trash2 size={16} className="text-red-600 dark:text-red-400" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationPrevious
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
            />
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const pageNum = i + 1
              return (
                <PaginationItem key={pageNum}>
                  <PaginationLink
                    onClick={() => setCurrentPage(pageNum)}
                    isActive={currentPage === pageNum}
                    className="cursor-pointer"
                  >
                    {pageNum}
                  </PaginationLink>
                </PaginationItem>
              )
            })}
            {totalPages > 5 && <PaginationEllipsis />}
            <PaginationNext
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
            />
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}

function MachineForm({ editData, onClose, onRefresh, company_id }: { editData: any, onClose: () => void, onRefresh: () => void, company_id: number | null }) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    machine_number: '',
    machine_type: '',
    status: '',
  })

  useEffect(() => {
    if (editData) {
      setFormData({
        machine_number: editData.machine_number,
        machine_type: editData.machine_type,
        status: editData.status,
      })
      setOpen(true)
    }
  }, [editData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      const isEdit = !!editData

      let payload: any = {
        machine_number: formData.machine_number,
        machine_type: formData.machine_type,
        status: formData.status,
      }

      // Add id for edit, company_id for add
      if (isEdit) {
        payload.id = editData.id
      } else {
        payload.company_id = user.company_id
      }

      const url = isEdit ? '/api/machines/edit' : '/api/machines'

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const result = await res.json()

      if (result.status) {
        alert(isEdit ? 'Machine updated ✅' : 'Machine added ✅')
        setFormData({ machine_number: '', machine_type: '', status: '' })
        setOpen(false)
        onClose()
        onRefresh()
      } else {
        alert(result.message || 'Failed ❌')
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <>
      <Button onClick={() => setOpen(true)} className="gap-2">
        <Plus size={18} />
        Add Machine
      </Button>

      <Dialog open={open} onOpenChange={(newOpen) => {
        setOpen(newOpen)
        if (!newOpen) {
          onClose()
        }
      }}>
        <DialogContent className="max-w-md border-slate-200 dark:border-slate-800">
          <DialogHeader>
            <DialogTitle>{editData ? 'Edit Machine' : 'Add New Machine'}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="machine_number">Machine Number</Label>
              <Input
                id="machine_number"
                placeholder="e.g., 1"
                type="number"
                value={formData.machine_number}
                onChange={(e) => setFormData({ ...formData, machine_number: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="machine_type">Machine Type</Label>
              <select
                id="machine_type"
                value={formData.machine_type}
                onChange={(e) => setFormData({ ...formData, machine_type: e.target.value })}
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
                required
              >
                <option value="">Select machine type</option>
                {MACHINE_TYPE_OPTIONS.map((machineType) => (
                  <option key={machineType} value={machineType}>
                    {machineType}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
                required
              >
                <option value="">Select status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <Button type="submit" className="w-full">
              Submit
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default function MachinesPage() {
  const [machines, setMachines] = useState<any[]>([])
  const [editData, setEditData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [companyId, setCompanyId] = useState<number | null>(null)

  useEffect(() => {
    const user = localStorage.getItem('user')
    if (user) {
      const userData = JSON.parse(user)
      setCompanyId(userData.company_id)
      fetchMachines(userData.company_id)
    }
  }, [])

  const fetchMachines = async (company_id: number) => {
    try {
      setLoading(true)
      const res = await fetch(`/api/machines?company_id=${company_id}`)
      const result = await res.json()

      if (result?.status && result?.data) {
        setMachines(result.data)
      } else {
        setMachines([])
      }
    } catch (err) {
      console.error('Error fetching machines:', err)
      setMachines([])
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (item: any) => {
    if (!confirm(`Are you sure you want to delete machine ${item.machine_number}?`)) {
      return
    }

    try {
      const res = await fetch('/api/machines/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id }),
      })

      const result = await res.json()

      if (result.status) {
        alert('Machine deleted ✅')
        companyId && fetchMachines(companyId)
      } else {
        alert(result.message || 'Failed to delete ❌')
      }
    } catch (err) {
      console.error('Error deleting machine:', err)
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">Machines Management</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">Manage machines</p>
      </div>

      <div className="flex justify-end">
        <MachineForm editData={editData} onClose={() => setEditData(null)} onRefresh={() => companyId && fetchMachines(companyId)} company_id={companyId} />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-3">
            <Spinner className="size-8" />
            <p className="text-slate-600 dark:text-slate-400">Loading machines...</p>
          </div>
        </div>
      ) : (
        <TablePagination data={machines} onEdit={setEditData} onDelete={handleDelete} />
      )}
    </div>
  )
}
