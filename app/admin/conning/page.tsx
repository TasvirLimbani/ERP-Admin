'use client'

import { useEffect, useState } from 'react'
import { Edit2, Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

type ConningInputItem = {
  id: number
  batch_name?: string
  date?: string
  quantity?: number
  status?: string
  yarn_type?: string
  yarn_sub_type?: string
  color?: string
  category?: string
  weight?: string
}

type ConningOutputItem = {
  id: number
  machine_no: string
  batch_name: string
  date: string
  input_quantity: number
  output_quantity: number
  status: string
}

function getStatusBadgeClass(status: string) {
  return status === 'Active' || status === 'Completed'
    ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
    : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
}

function InputTablePagination({ refreshTrigger, onEditItem, onDeleteItem }: { refreshTrigger?: number, onEditItem?: (item: any) => void, onDeleteItem?: (item: any) => void }) {
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [companyId, setCompanyId] = useState<string>('')

  const fetchInputData = async (page: number, company_id: string) => {
    try {
      setLoading(true)
      const res = await fetch(`/api/conning/inputDyeing?company_id=${company_id}&current_page=${page}&_t=${Date.now()}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      })
      const result = await res.json()

      const resultList: any[] = Array.isArray(result?.data?.list) ? result.data.list : []

      if (result.status && resultList.length >= 0) {
        setData(resultList)
        setTotalPages(result?.data?.pagination?.total_pages || 1)
        setCurrentPage(result?.data?.pagination?.current_page || page)
      } else {
        setData([])
        setTotalPages(1)
      }
    } catch (error) {
      console.error('Error fetching conning input data:', error)
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
              <TableHead className="text-slate-600 dark:text-slate-400">Yarn Type</TableHead>
              <TableHead className="text-slate-600 dark:text-slate-400">Yarn Sub Type</TableHead>
              <TableHead className="text-slate-600 dark:text-slate-400">Color</TableHead>
              <TableHead className="text-slate-600 dark:text-slate-400">Weight</TableHead>
              <TableHead className="text-slate-600 dark:text-slate-400">Category</TableHead>
              <TableHead className="text-right text-slate-600 dark:text-slate-400">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id} className="border-slate-200 dark:border-slate-800">
                <TableCell className="font-medium text-slate-900 dark:text-slate-50">{item.id}</TableCell>
                <TableCell className="text-slate-900 dark:text-slate-50">{item.yarn_type}</TableCell>
                <TableCell className="text-slate-900 dark:text-slate-50">{item.yarn_sub_type}</TableCell>
                <TableCell className="text-slate-900 dark:text-slate-50">{item.color}</TableCell>
                <TableCell className="text-slate-900 dark:text-slate-50">{item.weight}</TableCell>
                <TableCell className="text-slate-900 dark:text-slate-50">{item.category}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => onEditItem?.(item)} className="rounded p-1 hover:bg-slate-100 dark:hover:bg-slate-800">
                      <Edit2 size={16} className="text-slate-600 dark:text-slate-400" />
                    </button>
                    <button onClick={() => onDeleteItem?.(item)} className="rounded p-1 hover:bg-slate-100 dark:hover:bg-slate-800">
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
            <PaginationPrevious onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'} />
            {Array.from({ length: totalPages }, (_, i) => (
              <PaginationItem key={i}>
                <PaginationLink onClick={() => setCurrentPage(i + 1)} isActive={currentPage === i + 1} className="cursor-pointer">
                  {i + 1}
                </PaginationLink>
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
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [companyId, setCompanyId] = useState<string>('')

  const fetchOutputData = async (page: number, company_id: string) => {
    try {
      setLoading(true)
      const res = await fetch(`/api/conning/outputConning?company_id=${company_id}&current_page=${page}&_t=${Date.now()}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      })
      const result = await res.json()

      const resultList: any[] = Array.isArray(result?.data?.list) ? result.data.list : []

      if (result.status && resultList.length >= 0) {
        setData(resultList)
        setTotalPages(result?.data?.pagination?.total_pages || 1)
        setCurrentPage(result?.data?.pagination?.current_page || page)
      } else {
        setData([])
        setTotalPages(1)
      }
    } catch (error) {
      console.error('Error fetching conning output data:', error)
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
              <TableHead className="text-slate-600 dark:text-slate-400">Yarn Type</TableHead>
              <TableHead className="text-slate-600 dark:text-slate-400">Yarn Sub Type</TableHead>
              <TableHead className="text-slate-600 dark:text-slate-400">Color</TableHead>
              <TableHead className="text-slate-600 dark:text-slate-400">Weight</TableHead>
              <TableHead className="text-slate-600 dark:text-slate-400">Cones</TableHead>
              <TableHead className="text-slate-600 dark:text-slate-400">Cones Size</TableHead>
              <TableHead className="text-slate-600 dark:text-slate-400">Category</TableHead>
              <TableHead className="text-right text-slate-600 dark:text-slate-400">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id} className="border-slate-200 dark:border-slate-800">
                <TableCell className="font-medium text-slate-900 dark:text-slate-50">{item.id}</TableCell>
                <TableCell className="text-slate-900 dark:text-slate-50">{item.machine_id}</TableCell>
                <TableCell className="text-slate-900 dark:text-slate-50">{item.yarn_type}</TableCell>
                <TableCell className="text-slate-900 dark:text-slate-50">{item.yarn_sub_type}</TableCell>
                <TableCell className="text-slate-900 dark:text-slate-50">{item.color}</TableCell>
                <TableCell className="text-slate-900 dark:text-slate-50">{item.weight}</TableCell>
                <TableCell className="text-slate-900 dark:text-slate-50">{item.cones}</TableCell>
                <TableCell className="text-slate-900 dark:text-slate-50">{item.cones_size}</TableCell>
                <TableCell className="text-slate-900 dark:text-slate-50">{item.category}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => onEditItem?.(item)} className="rounded p-1 hover:bg-slate-100 dark:hover:bg-slate-800">
                      <Edit2 size={16} className="text-slate-600 dark:text-slate-400" />
                    </button>
                    <button onClick={() => onDeleteItem?.(item)} className="rounded p-1 hover:bg-slate-100 dark:hover:bg-slate-800">
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
            <PaginationPrevious onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'} />
            {Array.from({ length: totalPages }, (_, i) => (
              <PaginationItem key={i}>
                <PaginationLink onClick={() => setCurrentPage(i + 1)} isActive={currentPage === i + 1} className="cursor-pointer">
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationNext onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'} />
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}

function ConningForm({
  type,
  batchOptions,
  editItem,
  onEditItemChange,
  onSubmit,
}: {
  type: 'input' | 'output'
  batchOptions: string[]
  editItem?: ConningInputItem | ConningOutputItem | null
  onEditItemChange?: (item: ConningInputItem | ConningOutputItem | null) => void
  onSubmit: (payload: any, isEditing: boolean, formType: 'input' | 'output') => Promise<void> | void
}) {
  const [open, setOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [companyId, setCompanyId] = useState('')
  const [loadingStock, setLoadingStock] = useState(false)
  const [stockData, setStockData] = useState<Array<{
    yarn_type: string
    yarn_sub_type: string
    color: string
    category: string
    total_output_weight: number
    waste: number
  }>>([])
  const [machineOptions, setMachineOptions] = useState<string[]>([])
  const [loadingMachine, setLoadingMachine] = useState(false)
  const [formData, setFormData] = useState({
    batch_name: '',
    date: '',
    quantity: '',
    status: '',
    machine_no: '',
    machine_id: '',
    input_quantity: '',
    output_quantity: '',
    yarn_type: '',
    yarn_sub_type: '',
    color: '',
    category: '',
    weight: '',
    cones: '',
    cones_size: '',
  })

  const isInput = type === 'input'
  const isEditing = !!editItem

  useEffect(() => {
    const user = localStorage.getItem('user')
    if (user) {
      try {
        const userData = JSON.parse(user)
        setCompanyId(String(userData.company_id || ''))
      } catch (_error) {
        setCompanyId('')
      }
    }
  }, [])

  useEffect(() => {
    if (!open || !companyId) {
      return
    }

    const fetchStockData = async () => {
      try {
        setLoadingStock(true)
        const apiEndpoint = isInput
          ? `/api/conning/inputDyeing/stock?company_id=${companyId}&_t=${Date.now()}`
          : `/api/conning/outputConning/stock?company_id=${companyId}&_t=${Date.now()}`
        const res = await fetch(apiEndpoint, {
          cache: 'no-store',
        })
        const result = await res.json()
        const rows = Array.isArray(result?.data?.list) ? result.data.list : Array.isArray(result?.data) ? result.data : []
        setStockData(rows)
      } catch (error) {
        console.error('Error fetching conning stock data:', error)
        setStockData([])
      } finally {
        setLoadingStock(false)
      }
    }

    fetchStockData()
  }, [open, isInput, companyId])

  useEffect(() => {
    if (!open || isInput || !companyId) {
      return
    }

    const fetchMachineData = async (company_id: string) => {
      try {
        setLoadingMachine(true)
        const res = await fetch(`/api/machines?company_id=${company_id}`)
        const result = await res.json()

        const machineList: any[] = Array.isArray(result?.data) ? result.data : []
        const filteredMachines = machineList
          .filter((item: any) => item.status === 'active' && item.machine_type === 'Cone Winding')
          .map((item: any) => String(item.machine_number))

        setMachineOptions([...new Set(filteredMachines)])
      } catch (error) {
        console.error('Error fetching machine data:', error)
        setMachineOptions([])
      } finally {
        setLoadingMachine(false)
      }
    }

    fetchMachineData(companyId)
  }, [open, isInput, companyId])

  useEffect(() => {
    if (!editItem) {
      return
    }

    if (isInput) {
      setFormData({
        batch_name: (editItem as any)?.batch_name || '',
        date: (editItem as any)?.date || '',
        quantity: String((editItem as any)?.quantity || ''),
        status: (editItem as any)?.status || '',
        machine_no: '',
        input_quantity: '',
        output_quantity: '',
        yarn_type: (editItem as any)?.yarn_type || '',
        yarn_sub_type: (editItem as any)?.yarn_sub_type || '',
        color: (editItem as any)?.color || '',
        category: (editItem as any)?.category || '',
        weight: (editItem as any)?.weight || '',
      })
    } else {
      setFormData({
        batch_name: (editItem as ConningOutputItem).batch_name || '',
        date: (editItem as ConningOutputItem).date || '',
        quantity: '',
        status: (editItem as ConningOutputItem).status || '',
        machine_no: '',
        machine_id: String((editItem as any)?.machine_id || ''),
        input_quantity: String((editItem as ConningOutputItem).input_quantity || ''),
        output_quantity: String((editItem as ConningOutputItem).output_quantity || ''),
        yarn_type: (editItem as any)?.yarn_type || '',
        yarn_sub_type: (editItem as any)?.yarn_sub_type || '',
        color: (editItem as any)?.color || '',
        category: (editItem as any)?.category || '',
        weight: (editItem as any)?.weight || '',
        cones: (editItem as any)?.cones || '',
        cones_size: (editItem as any)?.cones_size || '',
      })
    }

    setOpen(true)
  }, [editItem, isInput])

  const resetForm = () => {
    setFormData({
      batch_name: '',
      date: '',
      quantity: '',
      status: '',
      machine_no: '',
      machine_id: '',
      input_quantity: '',
      output_quantity: '',
      yarn_type: '',
      yarn_sub_type: '',
      color: '',
      category: '',
      weight: '',
      cones: '',
      cones_size: '',
    })
  }

  const yarnTypeOptions = Array.from(new Set(stockData.map((item) => item.yarn_type).filter(Boolean)))
  const yarnSubTypeOptions = Array.from(new Set(
    stockData
      .filter((item) => item.yarn_type === formData.yarn_type)
      .map((item) => item.yarn_sub_type)
      .filter(Boolean)
  ))
  const colorOptions = Array.from(new Set(
    stockData
      .filter((item) => item.yarn_type === formData.yarn_type && item.yarn_sub_type === formData.yarn_sub_type)
      .map((item) => item.color)
      .filter(Boolean)
  ))
  const categoryOptions = Array.from(new Set(
    stockData
      .filter((item) => item.yarn_type === formData.yarn_type && item.yarn_sub_type === formData.yarn_sub_type && item.color === formData.color)
      .map((item) => item.category)
      .filter(Boolean)
  ))

  // Keep current edit values visible even when they are missing from stock API options.
  const withCurrentValue = (options: string[], currentValue: string) => {
    const trimmed = (currentValue || '').trim()
    if (!trimmed || options.includes(trimmed)) {
      return options
    }
    return [trimmed, ...options]
  }

  const yarnTypeDisplayOptions = withCurrentValue(yarnTypeOptions, formData.yarn_type)
  const yarnSubTypeDisplayOptions = withCurrentValue(yarnSubTypeOptions, formData.yarn_sub_type)
  const colorDisplayOptions = withCurrentValue(colorOptions, formData.color)
  const categoryDisplayOptions = withCurrentValue(categoryOptions, formData.category)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setSubmitting(true)

    const payload = isInput
      ? {
        id: editItem?.id,
        yarn_type: formData.yarn_type?.trim(),
        yarn_sub_type: formData.yarn_sub_type?.trim(),
        color: formData.color?.trim(),
        category: formData.category?.trim(),
        weight: formData.weight?.toString(),
      }
      : {
        id: editItem?.id,
        machine_id: formData.machine_id?.toString(),
        yarn_type: formData.yarn_type?.trim(),
        yarn_sub_type: formData.yarn_sub_type?.trim(),
        color: formData.color?.trim(),
        category: formData.category?.trim(),
        weight: formData.weight?.toString(),
        cones: formData.cones?.toString(),
        cones_size: formData.cones_size?.toString(),
      }

    try {
      await onSubmit(payload, isEditing, type)
      resetForm()
      setOpen(false)
      onEditItemChange?.(null)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDialogClose = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      onEditItemChange?.(null)
      resetForm()
    }
  }

  return (
    <>
      <Button onClick={() => setOpen(true)} className="gap-2">
        <Plus size={18} /> {isInput ? 'Add Input Batch' : 'Add Output Batch'}
      </Button>
      <Dialog open={open} onOpenChange={handleDialogClose}>
        <DialogContent className="max-w-md border-slate-200 dark:border-slate-800">
          <DialogHeader>
            <DialogTitle>
              {isEditing
                ? isInput
                  ? 'Edit Conning Input Batch'
                  : 'Edit Conning Output Batch'
                : isInput
                  ? 'Add New Conning Input Batch'
                  : 'Add New Conning Output Batch'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isInput ? (
              <>
                {isEditing && (
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Only weight is editable. Other fields are shown as non-editable.
                  </p>
                )}
                <div className="space-y-2">
                  <Label>Yarn Type</Label>
                  <Select
                    value={formData.yarn_type}
                    onValueChange={(value) => setFormData({ ...formData, yarn_type: value, yarn_sub_type: '', color: '', category: '' })}
                    disabled={isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={loadingStock ? 'Loading...' : 'Select yarn type'} />
                    </SelectTrigger>
                    <SelectContent>
                      {yarnTypeDisplayOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Yarn Sub Type</Label>
                  <Select
                    value={formData.yarn_sub_type}
                    onValueChange={(value) => setFormData({ ...formData, yarn_sub_type: value, color: '', category: '' })}
                    disabled={isEditing || !formData.yarn_type}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select yarn sub type" />
                    </SelectTrigger>
                    <SelectContent>
                      {yarnSubTypeDisplayOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Color</Label>
                  <Select
                    value={formData.color}
                    onValueChange={(value) => setFormData({ ...formData, color: value, category: '' })}
                    disabled={isEditing || !formData.yarn_sub_type}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select color" />
                    </SelectTrigger>
                    <SelectContent>
                      {colorDisplayOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                    disabled={isEditing || !formData.color}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryDisplayOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Weight</Label>
                  <Input
                    type="number"
                    placeholder="Enter weight"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label>Machine ID</Label>
                  <Select
                    value={formData.machine_id}
                    onValueChange={(value) => setFormData({ ...formData, machine_id: value })}
                    disabled={loadingMachine || machineOptions.length === 0 || isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={loadingMachine ? 'Loading...' : machineOptions.length === 0 ? 'No active Cone Winding found' : 'Select machine number'} />
                    </SelectTrigger>
                    <SelectContent>
                      {machineOptions.map((machineNo) => (
                        <SelectItem key={machineNo} value={machineNo}>
                          {machineNo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Yarn Type</Label>
                  <Select
                    value={formData.yarn_type}
                    onValueChange={(value) => setFormData({ ...formData, yarn_type: value, yarn_sub_type: '', color: '', category: '' })}
                    disabled={isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={loadingStock ? 'Loading...' : 'Select yarn type'} />
                    </SelectTrigger>
                    <SelectContent>
                      {yarnTypeDisplayOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Yarn Sub Type</Label>
                  <Select
                    value={formData.yarn_sub_type}
                    onValueChange={(value) => setFormData({ ...formData, yarn_sub_type: value, color: '', category: '' })}
                    disabled={!formData.yarn_type || isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select yarn sub type" />
                    </SelectTrigger>
                    <SelectContent>
                      {yarnSubTypeDisplayOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Color</Label>
                  <Select
                    value={formData.color}
                    onValueChange={(value) => setFormData({ ...formData, color: value, category: '' })}
                    disabled={!formData.yarn_sub_type || isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select color" />
                    </SelectTrigger>
                    <SelectContent>
                      {colorDisplayOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                    disabled={!formData.color || isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryDisplayOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Weight</Label>
                  <Input
                    type="number"
                    placeholder="Enter weight"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Cones</Label>
                  <Input
                    type="number"
                    placeholder="Enter cones"
                    value={formData.cones}
                    onChange={(e) => setFormData({ ...formData, cones: e.target.value })}
                    min="0"
                    step="1"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Cones Size</Label>
                  <Input
                    placeholder="e.g., 1500"
                    value={formData.cones_size}
                    onChange={(e) => setFormData({ ...formData, cones_size: e.target.value })}
                  />
                </div>
              </>
            )}

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? 'Saving...' : isEditing ? 'Update' : 'Submit'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default function ConningPage() {
  const [inputData, setInputData] = useState<ConningInputItem[]>([])
  const [outputData, setOutputData] = useState<ConningOutputItem[]>([])
  const [companyId, setCompanyId] = useState('')
  const [adminId, setAdminId] = useState('')
  const [inputRefreshKey, setInputRefreshKey] = useState(0)
  const [outputRefreshKey, setOutputRefreshKey] = useState(0)
  const [editingType, setEditingType] = useState<'input' | 'output' | null>(null)
  const [editingItem, setEditingItem] = useState<ConningInputItem | ConningOutputItem | null>(null)
  const [deletingType, setDeletingType] = useState<'input' | 'output' | null>(null)
  const [deletingItem, setDeletingItem] = useState<ConningInputItem | ConningOutputItem | null>(null)

  useEffect(() => {
    const user = localStorage.getItem('user')
    if (user) {
      try {
        const userData = JSON.parse(user)
        setCompanyId(String(userData.company_id || ''))
        setAdminId(String(userData.id || userData.admin_id || ''))
      } catch (_error) {
        setCompanyId('')
        setAdminId('')
      }
    }
  }, [])

  const batchOptions = Array.from(new Set(inputData.map((item) => item.batch_name)))
  const outputBatchOptions = Array.from(new Set([
    ...(editingItem?.batch_name ? [editingItem.batch_name] : []),
    ...batchOptions,
  ]))

  const nextId = (items: Array<{ id: number }>) => Math.max(0, ...items.map((item) => item.id)) + 1

  const handleEditInputItem = (item: ConningInputItem) => {
    setEditingType('input')
    setEditingItem(item)
  }

  const handleEditOutputItem = (item: ConningOutputItem) => {
    setEditingType('output')
    setEditingItem(item)
  }

  const handleDeleteInputItem = (item: ConningInputItem) => {
    setDeletingType('input')
    setDeletingItem(item)
  }

  const handleDeleteOutputItem = (item: ConningOutputItem) => {
    setDeletingType('output')
    setDeletingItem(item)
  }

  const handleSubmit = async (payload: any, isEditing: boolean, formType: 'input' | 'output') => {
    if (formType === 'input' && !isEditing) {
      const body = {
        company_id: Number(companyId),
        yarn_type: payload.yarn_type,
        yarn_sub_type: payload.yarn_sub_type,
        color: payload.color,
        category: payload.category,
        weight: Number(payload.weight),
      }

      const res = await fetch('/api/conning/inputDyeing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })

      const result = await res.json().catch(() => null)
      if (!res.ok || !result?.status) {
        throw new Error(result?.message || 'Failed to add input data')
      }

      setInputRefreshKey((current) => current + 1)
      setEditingType(null)
      setEditingItem(null)
      return
    }

    if (formType === 'input' && isEditing) {
      const body = {
        id: String(payload.id),
        company_id: String(companyId),
        yarn_type: payload.yarn_type,
        color: payload.color,
        weight: String(payload.weight),
        category: payload.category,
        yarn_sub_type: payload.yarn_sub_type,
      }

      const res = await fetch('/api/conning/inputDyeing', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })

      const result = await res.json().catch(() => null)
      if (!res.ok || !result?.status) {
        throw new Error(result?.message || 'Failed to update input data')
      }

      setInputRefreshKey((current) => current + 1)
      setEditingType(null)
      setEditingItem(null)
      return
    }

    // Handle output create
    if (formType === 'output' && !isEditing) {
      const body = {
        company_id: Number(companyId),
        admin_id: Number(adminId),
        machine_id: payload.machine_id ? Number(payload.machine_id) : undefined,
        yarn_type: payload.yarn_type,
        yarn_sub_type: payload.yarn_sub_type,
        color: payload.color,
        category: payload.category,
        weight: payload.weight !== undefined ? Number(payload.weight) : undefined,
        cones: payload.cones !== undefined ? Number(payload.cones) : undefined,
        cones_size: payload.cones_size || '',
      }

      const res = await fetch('/api/conning/outputConning', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const result = await res.json().catch(() => null)
      if (!res.ok || !result?.status) {
        throw new Error(result?.message || 'Failed to add output data')
      }

      setOutputRefreshKey((c) => c + 1)
      setEditingType(null)
      setEditingItem(null)
      return
    }

    // Handle output edit
    if (formType === 'output' && isEditing) {
      const body = {
        id: Number(payload.id),
        company_id: Number(companyId),
        admin_id: Number(adminId),
        machine_id: payload.machine_id ? Number(payload.machine_id) : undefined,
        yarn_type: payload.yarn_type,
        yarn_sub_type: payload.yarn_sub_type,
        color: payload.color,
        category: payload.category,
        weight: payload.weight !== undefined ? Number(payload.weight) : undefined,
        cones: payload.cones !== undefined ? Number(payload.cones) : undefined,
        cones_size: payload.cones_size || '',
      }

      const res = await fetch('/api/conning/outputConning', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const result = await res.json().catch(() => null)
      if (!res.ok || !result?.status) {
        throw new Error(result?.message || 'Failed to update output data')
      }

      setOutputRefreshKey((c) => c + 1)
      setEditingType(null)
      setEditingItem(null)
      return
    }

    if (editingType === 'input') {
      const normalizedItem: ConningInputItem = {
        id: isEditing ? payload.id : nextId(inputData),
        batch_name: payload.batch_name,
        date: payload.date,
        quantity: Number(payload.quantity),
        status: payload.status,
      }

      setInputData((current) =>
        isEditing
          ? current.map((item) => (item.id === normalizedItem.id ? normalizedItem : item))
          : [...current, normalizedItem]
      )
    }

    if (editingType === 'output') {
      const normalizedItem: ConningOutputItem = {
        id: isEditing ? payload.id : nextId(outputData),
        machine_no: payload.machine_id || payload.machine_no || '',
        batch_name: payload.batch_name || '',
        date: payload.date || '',
        input_quantity: 0,
        output_quantity: 0,
        status: payload.status || '',
      }

      setOutputData((current) =>
        isEditing
          ? current.map((item) => (item.id === normalizedItem.id ? normalizedItem : item))
          : [...current, normalizedItem]
      )
    }

    setEditingType(null)
    setEditingItem(null)
  }

  const handleDelete = async () => {
    if (!deletingItem || !deletingType) {
      return
    }

    if (deletingType === 'input') {
      try {
        const res = await fetch(`/api/conning/inputDyeing?id=${deletingItem.id}`, {
          method: 'DELETE',
          cache: 'no-store',
        })

        const result = await res.json().catch(() => null)

        if (!res.ok || !result?.status) {
          throw new Error(result?.message || 'Failed to delete input data')
        }

        setInputRefreshKey((current) => current + 1)
      } catch (error) {
        console.error('Error deleting input data:', error)
        alert(error instanceof Error ? error.message : 'Failed to delete input data')
        return
      }
    }

    if (deletingType === 'output') {
      try {
        const res = await fetch('/api/conning/outputConning', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: deletingItem.id }),
          cache: 'no-store',
        })

        const result = await res.json().catch(() => null)

        if (!res.ok || !result?.status) {
          throw new Error(result?.message || 'Failed to delete output data')
        }

        setOutputRefreshKey((current) => current + 1)
      } catch (error) {
        console.error('Error deleting output data:', error)
        alert(error instanceof Error ? error.message : 'Failed to delete output data')
        return
      }
    }

    setDeletingType(null)
    setDeletingItem(null)
  }

  const clearEditing = () => {
    setEditingType(null)
    setEditingItem(null)
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Conning Management</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">Manage cone winding input and output records</p>
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
            <ConningForm
              type="input"
              batchOptions={batchOptions}
              editItem={editingType === 'input' ? editingItem : null}
              onEditItemChange={(item) => {
                if (!item) {
                  clearEditing()
                }
              }}
              onSubmit={handleSubmit}
            />
          </Card>
          <InputTablePagination refreshTrigger={inputRefreshKey} onEditItem={handleEditInputItem} onDeleteItem={handleDeleteInputItem} />
        </TabsContent>

        <TabsContent value="output" className="space-y-6">
          <Card className="border-slate-200 p-6 dark:border-slate-800">
            <ConningForm
              type="output"
              batchOptions={batchOptions}
              editItem={editingType === 'output' ? editingItem : null}
              onEditItemChange={(item) => {
                if (!item) {
                  clearEditing()
                }
              }}
              onSubmit={handleSubmit}
            />
          </Card>
          <OutputTablePagination refreshTrigger={outputRefreshKey} onEditItem={handleEditOutputItem} onDeleteItem={handleDeleteOutputItem} />
        </TabsContent>
      </Tabs>

      <Dialog open={!!deletingItem} onOpenChange={(open) => !open && setDeletingItem(null)}>
        <DialogContent className="max-w-sm border-slate-200 dark:border-slate-800">
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-slate-600 dark:text-slate-400">
              Are you sure you want to delete {deletingType === 'output' ? 'output' : 'input'} record from <strong>{deletingItem?.id}</strong>?
            </p>
            <p className="text-sm text-red-600 dark:text-red-400">This action cannot be undone.</p>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setDeletingItem(null)}>
              Cancel
            </Button>
            <Button type="button" className="bg-red-600 hover:bg-red-700" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}