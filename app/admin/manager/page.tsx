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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
  name: string
  email: string
  password?: string
  department: string
}

function TablePagination({
  data,
  onEdit,
  pageSize = 5,
}: {
  data: any[]
  onEdit: (item: any) => void
  pageSize?: number
}) {
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
              <TableHead className="text-slate-600 dark:text-slate-400">Admin Id</TableHead>
              <TableHead className="text-slate-600 dark:text-slate-400">Name</TableHead>
              <TableHead className="text-slate-600 dark:text-slate-400">Email</TableHead>
              <TableHead className="text-slate-600 dark:text-slate-400">Department</TableHead>
              <TableHead className="text-right text-slate-600 dark:text-slate-400">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentData.map((item) => (
              <TableRow key={item.id} className="border-slate-200 dark:border-slate-800">
                <TableCell className="font-medium text-slate-900 dark:text-slate-50">{item.admin_id}</TableCell>
                <TableCell className="text-slate-600 dark:text-slate-400">{item.name}</TableCell>
                <TableCell className="text-slate-600 dark:text-slate-400">{item.email}</TableCell>
                <TableCell className="text-slate-600 dark:text-slate-400">{Array.isArray(item.department) ? item.department.join(', ') : item.department}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => onEdit(item)} className="rounded p-1 hover:bg-blue-200 dark:hover:bg-slate-800">
                      <Edit2 size={16} className="text-slate-600 dark:text-slate-400" />
                    </button>
                    <button className="rounded p-1 hover:bg-red-200 dark:hover:bg-slate-800">
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

function ManagerForm({
  editData,
  onClose,
}: {
  editData: any
  onClose: () => void
}) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    department: '',
  })

  useEffect(() => {
    if (editData) {
      setFormData({
        name: editData.name,
        email: editData.email,
        department: editData.department,
      })
      setOpen(true)
    }
  }, [editData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}')

      const isEdit = !!editData

      const url = isEdit ? '/api/manager/edit' : '/api/manager'

      const payload: any = {
        manager_id: editData?.id, // 🔥 required for edit
        admin_id: user.id || 2,
        company_id: user.company_id,
        name: formData.name,
        email: formData.email,
        department: formData.department,
      }

      // Only include password for new managers
      if (!editData && formData.password) {
        payload.password = formData.password
      }

      const res = await fetch(url, {
        method: 'POST', // ✅ ALWAYS POST
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const result = await res.json()

      if (result.status) {
        alert(isEdit ? 'Updated ✅' : 'Created ✅')
        window.location.reload()
        setOpen(false)
        onClose()
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
        Add Manager
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md border-slate-200 dark:border-slate-800">
          <DialogHeader>
            <DialogTitle>{editData ? 'Edit Manager' : 'Add New Manager'}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <Label>Name</Label>
              <Input
                placeholder='name'
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            {!editData && (
              <div className="space-y-2">
                <Label>Password</Label>
                <Input
                  type="password"
                  value={formData.password || ''}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>
            )}

            <div className="space-y-2">
              <Label>Department</Label>
              <Input
                placeholder="raw_yarn,tmp,dyeing"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                required
              />
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

export default function ManagerPage() {
  const [companyId, setCompanyId] = useState<number | null>(null);
  const [managers, setManagers] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [editData, setEditData] = useState<any>(null)

  useEffect(() => {
    const user = localStorage.getItem('user')
    if (user) {
      const userData = JSON.parse(user)
      setCompanyId(userData.company_id)

      fetchManagers(userData.company_id)
    }
  }, [])

  const fetchManagers = async (company_id: number) => {
    try {
      setLoading(true)

      const res = await fetch(`/api/manager?company_id=${company_id}`)
      const result = await res.json()

      if (result?.status) {
        setManagers(result.data)
      } else {
        setManagers([])
      }
    } catch (err) {
      console.error('Error fetching managers:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">Manager Management</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">Manage managers</p>
        {/* {companyId && <p className="text-sm text-slate-500">Company ID: {companyId}</p>} */}
      </div>

      <div className="flex justify-end items-center gap-4">
        <ManagerForm
          editData={editData}
          onClose={() => setEditData(null)}
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-3">
            <Spinner className="size-8" />
            <p className="text-slate-600 dark:text-slate-400">Loading managers...</p>
          </div>
        </div>
      ) : (
        <TablePagination data={managers} onEdit={setEditData} />
      )}
    </div>
  )
}
