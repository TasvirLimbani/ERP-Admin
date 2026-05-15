'use client'

import { useEffect, useState } from 'react'
import { Plus, Trash2, Edit2, ArrowUp, ArrowDown } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'

type DyeingStatus = 'Pending' | 'Processing' | 'Completed' | 'Rejected'

type InputDyeingRecord = {
  id: number | string
  batch_id: string
  yarn_type: string
  yarn_sub_type: string
  tpm: string
  weight: string
}

type OutputDyeingRecord = {
  id: string | number
  company_id: string
  admin_id: string
  machine_id: string
  batch_id: string
  yarn_type: string
  yarn_sub_type: string
  color: string
  category: string
  input_weight: string
  output_weight: string
  status: string
  created_at?: string
}

function getStatusClasses(status: string) {
  if (status === 'Completed' || status === 'completed') {
    return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
  }

  if (status === 'Rejected' || status === 'rejected') {
    return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
  }

  if (status === 'running') {
    return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
  }

  return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
}

function InputTablePagination({ refreshTrigger, onEditItem, onDeleteItem }: { refreshTrigger?: number, onEditItem?: (item: any) => void, onDeleteItem?: (item: any) => void }) {
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [data, setData] = useState<InputDyeingRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [companyId, setCompanyId] = useState<string>('')

  const fetchInputData = async (page: number, company_id: string) => {
    try {
      setLoading(true)
      const res = await fetch(`/api/dyeing/inputTpm?company_id=${company_id}&current_page=${page}&_t=${Date.now()}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      })
      const result = await res.json()

      const resultList: InputDyeingRecord[] = Array.isArray(result?.data?.list) ? result.data.list : []

      if (result.status && resultList.length >= 0) {
        setData(resultList)
        setTotalPages(result?.data?.pagination?.total_pages || 1)
        setCurrentPage(result?.data?.pagination?.current_page || page)
      } else {
        setData([])
        setTotalPages(1)
      }
    } catch (error) {
      console.error('Error fetching dyeing input data:', error)
      setData([])
      setTotalPages(1)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const user = localStorage.getItem('user')
    if (user) {
      const userData = JSON.parse(user)
      setCompanyId(String(userData.company_id || ''))
    }
  }, [])

  useEffect(() => {
    if (companyId) {
      fetchInputData(currentPage, companyId)
    }
  }, [currentPage, companyId, refreshTrigger])

  if (loading) {
    return <div className="py-4 text-center">Loading...</div>
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-slate-200 dark:border-slate-800">
        <Table>
          <TableHeader>
            <TableRow className="border-slate-200 hover:bg-transparent dark:border-slate-800">
              <TableHead className="text-slate-600 dark:text-slate-400">ID</TableHead>
              <TableHead className="text-slate-600 dark:text-slate-400">Batch ID</TableHead>
              <TableHead className="text-slate-600 dark:text-slate-400">Yarn Type</TableHead>
              <TableHead className="text-slate-600 dark:text-slate-400">Yarn Sub Type</TableHead>
              <TableHead className="text-slate-600 dark:text-slate-400">TPM</TableHead>
              <TableHead className="text-slate-600 dark:text-slate-400">Weight</TableHead>
              <TableHead className="text-right text-slate-600 dark:text-slate-400">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id} className="border-slate-200 dark:border-slate-800">
                <TableCell className="font-medium">{item.id}</TableCell>
                <TableCell className="font-medium">{item.batch_id}</TableCell>
                <TableCell>{item.yarn_type}</TableCell>
                <TableCell>{item.yarn_sub_type}</TableCell>
                <TableCell>{item.tpm}</TableCell>
                <TableCell>{item.weight}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => onEditItem?.(item)} className="rounded p-1 hover:bg-slate-100 dark:hover:bg-slate-800">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => onDeleteItem?.(item)} className="rounded p-1 hover:bg-slate-100 dark:hover:bg-slate-800">
                      <Trash2 size={16} className="text-red-600" />
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
            <PaginationPrevious onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'} />
            {Array.from({ length: totalPages }, (_, i) => (
              <PaginationItem key={i}>
                <PaginationLink onClick={() => setCurrentPage(i + 1)} isActive={currentPage === i + 1} className="cursor-pointer">{i + 1}</PaginationLink>
              </PaginationItem>
            ))}
            <PaginationNext onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'} />
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}

function OutputTablePagination({ refreshTrigger, onEditItem, onDeleteItem }: { refreshTrigger?: number, onEditItem?: (item: any) => void, onDeleteItem?: (item: any) => void }) {
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [data, setData] = useState<OutputDyeingRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [companyId, setCompanyId] = useState<string>('')

  const fetchOutputData = async (page: number, company_id: string) => {
    try {
      setLoading(true)
      const res = await fetch(`/api/dyeing/outputDyeing?company_id=${company_id}&current_page=${page}&_t=${Date.now()}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      })
      const result = await res.json()

      const resultList: OutputDyeingRecord[] = Array.isArray(result?.data?.list) ? result.data.list : []

      if (result.status && resultList.length >= 0) {
        setData(resultList)
        setTotalPages(result?.data?.pagination?.total_pages || 1)
        setCurrentPage(result?.data?.pagination?.current_page || page)
      } else {
        setData([])
        setTotalPages(1)
      }
    } catch (error) {
      console.error('Error fetching dyeing output data:', error)
      setData([])
      setTotalPages(1)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const user = localStorage.getItem('user')
    if (user) {
      const userData = JSON.parse(user)
      setCompanyId(String(userData.company_id || ''))
    }
  }, [])

  useEffect(() => {
    if (companyId) {
      fetchOutputData(currentPage, companyId)
    }
  }, [currentPage, companyId, refreshTrigger])

  if (loading) {
    return <div className="py-4 text-center">Loading...</div>
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-slate-200 dark:border-slate-800">
        <Table>
          <TableHeader>
            <TableRow className="border-slate-200 hover:bg-transparent dark:border-slate-800">
              <TableHead className="text-slate-600 dark:text-slate-400">ID</TableHead>
              <TableHead className="text-slate-600 dark:text-slate-400">Machine ID</TableHead>
              <TableHead className="text-slate-600 dark:text-slate-400">Batch ID</TableHead>
              <TableHead className="text-slate-600 dark:text-slate-400">Yarn Type</TableHead>
              <TableHead className="text-slate-600 dark:text-slate-400">Yarn Sub Type</TableHead>
              <TableHead className="text-slate-600 dark:text-slate-400">Color</TableHead>
              <TableHead className="text-slate-600 dark:text-slate-400">Category</TableHead>
              <TableHead className="text-slate-600 dark:text-slate-400">Input Weight</TableHead>
              <TableHead className="text-slate-600 dark:text-slate-400">Output Weight</TableHead>
              <TableHead className="text-slate-600 dark:text-slate-400">Status</TableHead>
              <TableHead className="text-right text-slate-600 dark:text-slate-400">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id} className="border-slate-200 dark:border-slate-800">
                <TableCell className="font-medium">{item.id}</TableCell>
                <TableCell>{item.machine_id}</TableCell>
                <TableCell>{item.batch_id}</TableCell>
                <TableCell>{item.yarn_type}</TableCell>
                <TableCell>{item.yarn_sub_type}</TableCell>
                <TableCell>{item.color}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>{item.input_weight}</TableCell>
                <TableCell>{item.output_weight}</TableCell>
                <TableCell>
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusClasses(item.status)}`}>
                    {item.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => onEditItem?.(item)} className="rounded p-1 hover:bg-slate-100 dark:hover:bg-slate-800">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => onDeleteItem?.(item)} className="rounded p-1 hover:bg-slate-100 dark:hover:bg-slate-800">
                      <Trash2 size={16} className="text-red-600" />
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
            <PaginationPrevious onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'} />
            {Array.from({ length: totalPages }, (_, i) => (
              <PaginationItem key={i}>
                <PaginationLink onClick={() => setCurrentPage(i + 1)} isActive={currentPage === i + 1} className="cursor-pointer">{i + 1}</PaginationLink>
              </PaginationItem>
            ))}
            <PaginationNext onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'} />
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}

function DyeingForm({ type, onSubmitSuccess, editItem, onEditItemChange }: { type: 'input' | 'output', onSubmitSuccess?: () => void, editItem?: any, onEditItemChange?: (item: any | null) => void }) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    batch_id: '',
    yarn_type: '',
    yarn_sub_type: '',
    tpm: '',
    weight: '',
    machine_id: '',
    color: '',
    category: '',
    input_weight: '',
    output_weight: '',
    status: '',
  })

  const [stockData, setStockData] = useState<any[]>([])
  const [batchOptions, setBatchOptions] = useState<string[]>([])
  const [yarnTypeOptions, setYarnTypeOptions] = useState<string[]>([])
  const [yarnSubTypeOptions, setYarnSubTypeOptions] = useState<string[]>([])
  const [tpmOptions, setTpmOptions] = useState<string[]>([])
  const [machineOptions, setMachineOptions] = useState<string[]>([])
  const [companyId, setCompanyId] = useState<string>('')
  const [loadingStock, setLoadingStock] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const isEditing = !!(editItem && editItem.id)

  useEffect(() => {
    if (editItem) {
      if (type === 'input') {
        setFormData((prev) => ({
          ...prev,
          batch_id: editItem.batch_id || '',
          yarn_type: editItem.yarn_type || '',
          yarn_sub_type: editItem.yarn_sub_type || '',
          tpm: String(editItem.tpm) || '',
          weight: String(editItem.weight) || '',
        }))
      } else if (type === 'output') {
        setFormData((prev) => ({
          ...prev,
          machine_id: String(editItem.machine_id) || '',
          batch_id: editItem.batch_id || '',
          yarn_type: editItem.yarn_type || '',
          yarn_sub_type: editItem.yarn_sub_type || '',
          color: editItem.color || '',
          category: editItem.category || '',
          input_weight: String(editItem.input_weight) || '',
          output_weight: String(editItem.output_weight) || '',
          status: editItem.status || '',
        }))
      }
      setOpen(true)
    }
  }, [editItem, type])

  useEffect(() => {
    const user = localStorage.getItem('user')
    if (user) {
      try {
        const userData = JSON.parse(user)
        setCompanyId(String(userData.company_id || ''))
      } catch (e) {
        console.warn('Invalid user in localStorage')
      }
    }
  }, [])

  const fetchMachineData = async (company_id: string) => {
    try {
      const res = await fetch(`/api/machines?company_id=${company_id}`)
      const result = await res.json()

      const machineList: any[] = Array.isArray(result?.data) ? result.data : []
      const filteredMachines = machineList
        .filter((item: any) => item.status === 'active' && item.machine_type === 'Dyeing Machine')
        .map((item: any) => String(item.machine_number))

      setMachineOptions([...new Set(filteredMachines)])
    } catch (error) {
      console.error('Error fetching machine data:', error)
      setMachineOptions([])
    }
  }

  useEffect(() => {
    // fetch stock when dialog opens or companyId changes
    if (!open || !companyId) return

    const fetchStock = async () => {
      setLoadingStock(true)
      try {
        const stockUrl = type === 'output'
          ? `/api/dyeing/outputDyeing/stock?company_id=${companyId}&_t=${Date.now()}`
          : `/api/dyeing/inputTpm/stock?company_id=${companyId}&_t=${Date.now()}`

        const res = await fetch(stockUrl, { cache: 'no-store' })
        const result = await res.json()
        const rows = Array.isArray(result?.data)
          ? result.data
          : Array.isArray(result?.data?.list)
            ? result.data.list
            : []
        setStockData(rows)
        const batches = Array.from(new Set(rows.map((r: any) => String(r.batch_id))))
        setBatchOptions(batches)
        // clear dependent options
        setYarnTypeOptions([])
        setYarnSubTypeOptions([])
        setTpmOptions([])
      } catch (err) {
        console.error('Failed to load stock for dyeing input', err)
        setStockData([])
        setBatchOptions([])
      } finally {
        setLoadingStock(false)
      }
    }

    fetchStock()
  }, [open, companyId])

  useEffect(() => {
    if (open && companyId && type === 'output') {
      fetchMachineData(companyId)
    }
  }, [open, companyId, type])

  // Set default status to 'running' for new output forms when opening
  useEffect(() => {
    if (open && type === 'output' && !isEditing) {
      setFormData((prev) => ({ ...prev, status: prev.status || 'running' }))
    }
  }, [open, type, isEditing])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (isInput) {
      // validate required fields
      if (isEditing) {
        // Edit mode: only require weight
        if (!formData.weight) {
          toast.error('Please fill weight')
          return
        }
      } else {
        // Add mode: all fields required
        if (!formData.batch_id || !formData.yarn_type || !formData.yarn_sub_type || !formData.tpm || !formData.weight) {
          toast.error('Please fill all fields')
          return
        }
      }

      const userRaw = localStorage.getItem('user')
      let company_id = 0
      let admin_id = 1
      if (userRaw) {
        try {
          const user = JSON.parse(userRaw)
          company_id = parseInt(user.company_id) || 0
          admin_id = user.id || 1
        } catch (err) {
          console.warn('Invalid user in localStorage')
        }
      }

      let payload: any = {
        company_id: company_id || 0,
        admin_id: admin_id || 1,
        tpm: Number(formData.tpm),
        yarn_type: formData.yarn_type,
        yarn_sub_type: formData.yarn_sub_type,
        weight: Number(formData.weight),
      }

      // For add mode, include batch_id; for edit mode, only send id
      if (isEditing) {
        payload.id = editItem.id
      } else {
        payload.batch_id = formData.batch_id
      }

      try {
        setSubmitting(true)
        const method = isEditing ? 'PUT' : 'POST'
        const res = await fetch('/api/dyeing/inputTpm', {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        const result = await res.json()
        const success = result?.status === true || result?.status === 1
        if (success) {
          toast.success(isEditing ? 'Dyeing input updated' : 'Dyeing input added')
          // reset and close
          setFormData({ batch_id: '', yarn_type: '', yarn_sub_type: '', tpm: '', weight: '', output_weight: '', loss_weight: '', status: '' })
          setOpen(false)
          // Clear edit state
          if (onEditItemChange) {
            onEditItemChange(null)
          }
          // notify parent/table to refresh via callback
          if (onSubmitSuccess) onSubmitSuccess()
        } else {
          toast.error(result?.message || (isEditing ? 'Failed to update dyeing input' : 'Failed to add dyeing input'))
        }
      } catch (err) {
        console.error('Submit error', err)
        toast.error('Network error')
      } finally {
        setSubmitting(false)
      }
      return
    }

    // output handling
    if (isOutput) {
      // Base required fields for output (category and output_weight are conditional)
      if (!formData.machine_id || !formData.batch_id || !formData.yarn_type || !formData.yarn_sub_type || !formData.color || !formData.input_weight || !formData.status) {
        toast.error('Please fill all required fields')
        return
      }

      // If status is completed, require category and output_weight
      const isCompleted = String(formData.status).toLowerCase() === 'completed'
      if (isCompleted) {
        if (!formData.category || !formData.output_weight) {
          toast.error('Please provide category and output weight for completed status')
          return
        }
      }

      const userRaw = localStorage.getItem('user')
      let company_id = 0
      let admin_id = 1
      if (userRaw) {
        try {
          const user = JSON.parse(userRaw)
          company_id = parseInt(user.company_id) || 0
          admin_id = user.id || 1
        } catch (err) {
          console.warn('Invalid user in localStorage')
        }
      }

      let payload: any = {
        company_id: company_id || 0,
        admin_id: admin_id || 1,
        machine_id: formData.machine_id ? Number(formData.machine_id) : undefined,
        batch_id: formData.batch_id,
        yarn_type: formData.yarn_type,
        yarn_sub_type: formData.yarn_sub_type,
        color: formData.color,
        input_weight: Number(formData.input_weight),
        status: formData.status,
      }

      // include optional fields only when provided
      payload.category = formData.category ?? ''
      payload.output_weight = formData.output_weight !== '' ? Number(formData.output_weight) : ''

      if (isEditing) {
        payload.id = editItem.id
      }

      try {
        setSubmitting(true)
        const method = isEditing ? 'PUT' : 'POST'
        const res = await fetch('/api/dyeing/outputDyeing', {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        const result = await res.json()
        const success = result?.status === true || result?.status === 1
        if (success) {
          toast.success(isEditing ? 'Dyeing output updated' : 'Dyeing output added')
          // reset and close
          setFormData({ batch_id: '', yarn_type: '', yarn_sub_type: '', tpm: '', weight: '', machine_id: '', color: '', category: '', input_weight: '', output_weight: '', status: '' })
          setOpen(false)
          // Clear edit state
          if (onEditItemChange) {
            onEditItemChange(null)
          }
          // notify parent/table to refresh via callback
          if (onSubmitSuccess) onSubmitSuccess()
        } else {
          toast.error(result?.message || (isEditing ? 'Failed to update dyeing output' : 'Failed to add dyeing output'))
        }
      } catch (err) {
        console.error('Submit error', err)
        toast.error('Network error')
      } finally {
        setSubmitting(false)
      }
      return
    }

    // Reset form data
    setFormData({
      batch_id: '',
      yarn_type: '',
      yarn_sub_type: '',
      tpm: '',
      weight: '',
      machine_id: '',
      color: '',
      category: '',
      input_weight: '',
      status: '',
    })
    setOpen(false)
  }

  const handleDialogClose = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      if (onEditItemChange) {
        onEditItemChange(null)
      }
      // Reset form fields
      setFormData({
        batch_id: '',
        yarn_type: '',
        yarn_sub_type: '',
        tpm: '',
        weight: '',
        machine_id: '',
        color: '',
        category: '',
        input_weight: '',
        output_weight: '',
        loss_weight: '',
        status: ''
      })
    }
  }

  const isInput = type === 'input'
  const isOutput = type === 'output'

  return (
    <>
      <Button onClick={() => setOpen(true)} className="gap-2">
        <Plus size={18} /> {isInput ? 'Add Dyeing Input' : 'Add Dyeing Output'}
      </Button>
      <Dialog open={open} onOpenChange={handleDialogClose}>
        <DialogContent className="max-w-md border-slate-200 dark:border-slate-800">
          <DialogHeader>
            <DialogTitle>{isInput ? (isEditing ? 'Edit Dyeing Input' : 'Add New Dyeing Input') : 'Add New Dyeing Output'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {isInput ? (
              <>
                <div className="space-y-2">
                  <Label>Batch ID</Label>
                  <Select value={formData.batch_id} onValueChange={(value) => {
                    // select batch -> populate yarn types
                    setFormData({ ...formData, batch_id: value, yarn_type: '', yarn_sub_type: '', tpm: '' })
                    const yarns = stockData.filter((r) => String(r.batch_id) === String(value)).map((r) => String(r.yarn_type))
                    setYarnTypeOptions(Array.from(new Set(yarns)))
                    setYarnSubTypeOptions([])
                    setTpmOptions([])
                  }} disabled={isEditing || loadingStock}>
                    <SelectTrigger>
                      <SelectValue placeholder={loadingStock ? 'Loading batches...' : 'Select batch'} />
                    </SelectTrigger>
                    <SelectContent>
                      {isEditing && formData.batch_id && !batchOptions.includes(formData.batch_id) && (
                        <SelectItem key={formData.batch_id} value={formData.batch_id}>{formData.batch_id}</SelectItem>
                      )}
                      {batchOptions.map((b) => (
                        <SelectItem key={b} value={b}>{b}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Yarn Type</Label>
                  <Select value={formData.yarn_type} onValueChange={(value) => {
                    setFormData({ ...formData, yarn_type: value, yarn_sub_type: '', tpm: '' })
                    const subs = stockData.filter((r) => String(r.batch_id) === String(formData.batch_id) && String(r.yarn_type) === String(value)).map((r) => String(r.yarn_sub_type))
                    setYarnSubTypeOptions(Array.from(new Set(subs)))
                    setTpmOptions([])
                  }} disabled={isEditing || loadingStock}>
                    <SelectTrigger>
                      <SelectValue placeholder={yarnTypeOptions.length ? 'Select yarn type' : 'Select batch first'} />
                    </SelectTrigger>
                    <SelectContent>
                      {isEditing && formData.yarn_type && !yarnTypeOptions.includes(formData.yarn_type) && (
                        <SelectItem key={formData.yarn_type} value={formData.yarn_type}>{formData.yarn_type}</SelectItem>
                      )}
                      {yarnTypeOptions.map((y) => (
                        <SelectItem key={y} value={y}>{y}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Yarn Sub Type</Label>
                  <Select value={formData.yarn_sub_type} onValueChange={(value) => {
                    setFormData({ ...formData, yarn_sub_type: value, tpm: '' })
                    const tpms = stockData.filter((r) => String(r.batch_id) === String(formData.batch_id) && String(r.yarn_type) === String(formData.yarn_type) && String(r.yarn_sub_type) === String(value)).map((r) => String(r.tpm))
                    setTpmOptions(Array.from(new Set(tpms)))
                  }} disabled={isEditing || loadingStock}>
                    <SelectTrigger>
                      <SelectValue placeholder={yarnSubTypeOptions.length ? 'Select yarn sub type' : 'Select yarn type first'} />
                    </SelectTrigger>
                    <SelectContent>
                      {isEditing && formData.yarn_sub_type && !yarnSubTypeOptions.includes(formData.yarn_sub_type) && (
                        <SelectItem key={formData.yarn_sub_type} value={formData.yarn_sub_type}>{formData.yarn_sub_type}</SelectItem>
                      )}
                      {yarnSubTypeOptions.map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>TPM</Label>
                  <Select value={formData.tpm} onValueChange={(value) => setFormData({ ...formData, tpm: value })} disabled={isEditing || loadingStock}>
                    <SelectTrigger>
                      <SelectValue placeholder={tpmOptions.length ? 'Select TPM' : 'Select sub type first'} />
                    </SelectTrigger>
                    <SelectContent>
                      {isEditing && formData.tpm && !tpmOptions.includes(formData.tpm) && (
                        <SelectItem key={formData.tpm} value={formData.tpm}>{formData.tpm}</SelectItem>
                      )}
                      {tpmOptions.map((t) => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Weight</Label>
                  <Input type="number" placeholder="e.g., 15.00" value={formData.weight} onChange={(e) => setFormData({ ...formData, weight: e.target.value })} required />
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label>Machine ID</Label>
                  <Select value={formData.machine_id} onValueChange={(value) => setFormData({ ...formData, machine_id: value })} disabled={submitting || machineOptions.length === 0 || isEditing}>
                    <SelectTrigger>
                      <SelectValue placeholder={machineOptions.length === 0 ? 'No active Dyeing Machine found' : 'Select machine number'} />
                    </SelectTrigger>
                    <SelectContent>
                      {isEditing && formData.machine_id && !machineOptions.includes(formData.machine_id) && (
                        <SelectItem key={formData.machine_id} value={formData.machine_id}>{formData.machine_id}</SelectItem>
                      )}
                      {machineOptions.map((machineNo) => (
                        <SelectItem key={machineNo} value={machineNo}>{machineNo}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Batch ID</Label>
                  <Select value={formData.batch_id} onValueChange={(value) => {
                    setFormData({ ...formData, batch_id: value, yarn_type: '', yarn_sub_type: '' })
                    const yarnTypes = stockData
                      .filter((r) => String(r.batch_id) === String(value))
                      .map((r) => String(r.yarn_type))
                    setYarnTypeOptions(Array.from(new Set(yarnTypes)))
                    setYarnSubTypeOptions([])
                  }} disabled={isEditing || loadingStock}>
                    <SelectTrigger>
                      <SelectValue placeholder={loadingStock ? 'Loading batches...' : 'Select batch'} />
                    </SelectTrigger>
                    <SelectContent>
                      {isEditing && formData.batch_id && !batchOptions.includes(formData.batch_id) && (
                        <SelectItem key={formData.batch_id} value={formData.batch_id}>{formData.batch_id}</SelectItem>
                      )}
                      {batchOptions.map((batchId) => (
                        <SelectItem key={batchId} value={batchId}>{batchId}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Yarn Type</Label>
                  <Select value={formData.yarn_type} onValueChange={(value) => {
                    setFormData({ ...formData, yarn_type: value, yarn_sub_type: '' })
                    const yarnSubTypes = stockData
                      .filter((r) => String(r.batch_id) === String(formData.batch_id) && String(r.yarn_type) === String(value))
                      .map((r) => String(r.yarn_sub_type))
                    setYarnSubTypeOptions(Array.from(new Set(yarnSubTypes)))
                  }} disabled={isEditing || loadingStock || !formData.batch_id}>
                    <SelectTrigger>
                      <SelectValue placeholder={formData.batch_id ? (yarnTypeOptions.length ? 'Select yarn type' : 'No yarn types found') : 'Select batch first'} />
                    </SelectTrigger>
                    <SelectContent>
                      {isEditing && formData.yarn_type && !yarnTypeOptions.includes(formData.yarn_type) && (
                        <SelectItem key={formData.yarn_type} value={formData.yarn_type}>{formData.yarn_type}</SelectItem>
                      )}
                      {yarnTypeOptions.map((yarnType) => (
                        <SelectItem key={yarnType} value={yarnType}>{yarnType}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Yarn Sub Type</Label>
                  <Select value={formData.yarn_sub_type} onValueChange={(value) => setFormData({ ...formData, yarn_sub_type: value })} disabled={isEditing || loadingStock || !formData.yarn_type}>
                    <SelectTrigger>
                      <SelectValue placeholder={formData.yarn_type ? (yarnSubTypeOptions.length ? 'Select yarn sub type' : 'No yarn sub types found') : 'Select yarn type first'} />
                    </SelectTrigger>
                    <SelectContent>
                      {isEditing && formData.yarn_sub_type && !yarnSubTypeOptions.includes(formData.yarn_sub_type) && (
                        <SelectItem key={formData.yarn_sub_type} value={formData.yarn_sub_type}>{formData.yarn_sub_type}</SelectItem>
                      )}
                      {yarnSubTypeOptions.map((yarnSubType) => (
                        <SelectItem key={yarnSubType} value={yarnSubType}>{yarnSubType}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Color</Label>
                  <Input placeholder="e.g., Red" value={formData.color} onChange={(e) => setFormData({ ...formData, color: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label>Input Weight</Label>
                  <Input type="number" placeholder="e.g., 15" value={formData.input_weight} onChange={(e) => setFormData({ ...formData, input_weight: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label>Output Weight</Label>
                  <Input type="number" placeholder="e.g., 10" value={formData.output_weight} onChange={(e) => setFormData({ ...formData, output_weight: e.target.value })} required={String(formData.status).toLowerCase() === 'completed'} />
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                    <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="running">Running</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {/* Category shown only when status is completed */}
                {String(formData.status).toLowerCase() === 'completed' && (
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Input placeholder="e.g., Dyeing" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} required />
                  </div>
                )}
              </>
            )}
            <Button type="submit" className="w-full" disabled={submitting}>{submitting ? (isEditing ? 'Updating...' : 'Submitting...') : (isEditing ? 'Update' : 'Submit')}</Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default function DyeingPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [deletingItem, setDeletingItem] = useState<any>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const handleEditItem = (item: any) => {
    setEditingItem(item)
  }

  const handleDeleteItem = (item: any) => {
    setDeletingItem(item)
  }

  const handleDelete = async () => {
    if (!deletingItem) return

    const isOutputItem = 'machine_id' in deletingItem || 'output_weight' in deletingItem || deletingItem?.color !== undefined
    const deleteEndpoint = isOutputItem ? '/api/dyeing/outputDyeing' : '/api/dyeing/inputTpm'
    const successMessage = isOutputItem ? 'Output deleted successfully' : 'Input task deleted successfully'
    const errorMessage = isOutputItem ? 'Failed to delete output dyeing' : 'Failed to delete input task'

    setDeleteLoading(true)
    try {
      const res = await fetch(deleteEndpoint, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: deletingItem.id })
      })

      const data = await res.json()

      if (data.status === true || data.status === 1) {
        toast.success(successMessage)
        setDeletingItem(null)
        setRefreshTrigger((prev) => prev + 1)
      } else {
        toast.error(data.message || errorMessage)
      }
    } catch (error) {
      console.error('Error deleting input task:', error)
      toast.error(errorMessage)
    } finally {
      setDeleteLoading(false)
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Dyeing Management</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">Manage dyeing input and output records</p>
      </div>
      <Tabs defaultValue="input" className="w-full">
        <TabsList className="mx-auto flex w-full max-w-lg items-center gap-2 rounded-full bg-gradient-to-r from-sky-50 to-sky-100 p-2 dark:bg-gradient-to-r dark:from-slate-800 dark:to-slate-900">
          <TabsTrigger value="input" className="flex-1 flex items-center justify-center rounded-full px-6 py-3 text-base font-semibold text-slate-700 dark:text-slate-200 transition-colors duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg">
            <div className="flex items-center justify-center gap-3">
              <ArrowUp size={18} className="text-current" />
              <span>Input</span>
            </div>
          </TabsTrigger>
          <TabsTrigger value="output" className="flex-1 flex items-center justify-center rounded-full px-6 py-3 text-base font-semibold text-slate-700 dark:text-slate-200 transition-colors duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg">
            <div className="flex items-center justify-center gap-3">
              <ArrowDown size={18} className="text-current" />
              <span>Output</span>
            </div>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="input" className="space-y-6">
          <Card className="border-slate-200 p-6 dark:border-slate-800">
            <DyeingForm type="input" onSubmitSuccess={() => setRefreshTrigger((p) => p + 1)} editItem={editingItem} onEditItemChange={setEditingItem} />
          </Card>
          <InputTablePagination refreshTrigger={refreshTrigger} onEditItem={handleEditItem} onDeleteItem={handleDeleteItem} />
        </TabsContent>
        <TabsContent value="output" className="space-y-6">
          <Card className="border-slate-200 p-6 dark:border-slate-800">
            <DyeingForm type="output" onSubmitSuccess={() => setRefreshTrigger((p) => p + 1)} editItem={editingItem} onEditItemChange={setEditingItem} />
          </Card>
          <OutputTablePagination refreshTrigger={refreshTrigger} onEditItem={handleEditItem} onDeleteItem={handleDeleteItem} />
        </TabsContent>
      </Tabs>

      <Dialog open={!!deletingItem} onOpenChange={(open) => !open && setDeletingItem(null)}>
        <DialogContent className="max-w-sm border-slate-200 dark:border-slate-800">
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-slate-600 dark:text-slate-400">
              Are you sure you want to delete input task from <strong>{deletingItem?.batch_id}</strong> (Yarn Type: {deletingItem?.yarn_type})?
            </p>
            <p className="text-sm text-red-600 dark:text-red-400">
              This action cannot be undone.
            </p>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeletingItem(null)}
              disabled={deleteLoading}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="bg-red-600 hover:bg-red-700"
              onClick={handleDelete}
              disabled={deleteLoading}
            >
              {deleteLoading ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}