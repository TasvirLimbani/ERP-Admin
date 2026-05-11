'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, Edit2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import { useToast } from '@/hooks/use-toast'

function InputTablePagination({ refreshTrigger, onEditItem, onDeleteItem }: { refreshTrigger: number, onEditItem?: (item: any) => void, onDeleteItem?: (item: any) => void }) {
  const [currentPage, setCurrentPage] = useState(1)
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [totalPages, setTotalPages] = useState(1)

  const fetchInputData = async (page: number, company_id: string) => {
    try {
      setLoading(true)
      const res = await fetch(`/api/packing/inputConning?company_id=${company_id}&current_page=${page}&_t=${Date.now()}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      })
      const result = await res.json()

      if (result.status && result.data) {
        setData(result.data)
        if (result.pagination) {
          setTotalPages(result.pagination.total_pages || 1)
        }
      } else {
        console.warn('API response status is false or missing data:', result)
      }
    } catch (error) {
      console.error('Error fetching input data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const user = localStorage.getItem('user')
    if (user) {
      const userData = JSON.parse(user)
      console.log('Fetching packing input data for company:', userData.company_id, 'page:', currentPage)
      fetchInputData(currentPage, userData.company_id)
    }
  }, [currentPage, refreshTrigger])

  if (loading) {
    return <div className="text-center py-4">Loading...</div>
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
              <TableHead className="text-slate-600 dark:text-slate-400">Category</TableHead>
              <TableHead className="text-slate-600 dark:text-slate-400">Cone Size</TableHead>
              <TableHead className="text-slate-600 dark:text-slate-400">Cones</TableHead>
              <TableHead className="text-right text-slate-600 dark:text-slate-400">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id} className="border-slate-200 dark:border-slate-800">
                <TableCell className="font-medium">{item.id}</TableCell>
                <TableCell>{item.yarn_type}</TableCell>
                <TableCell>{item.yarn_sub_type}</TableCell>
                <TableCell>{item.color}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>{item.cone_size}</TableCell>
                <TableCell>{item.cones}</TableCell>
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

function OutputTablePagination({ refreshTrigger, onEditItem, onDeleteItem }: { refreshTrigger: number, onEditItem?: (item: any) => void, onDeleteItem?: (item: any) => void }) {
  const [currentPage, setCurrentPage] = useState(1)
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [totalPages, setTotalPages] = useState(1)

  const fetchOutputData = async (page: number, company_id: string) => {
    try {
      setLoading(true)
      const res = await fetch(`/api/packing/outputPacking?company_id=${company_id}&page=${page}&_t=${Date.now()}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      })
      const result = await res.json()

      if (result.status && result.data) {
        setData(result.data)
        setTotalPages(result.total_pages || 1)
      } else {
        console.warn('API response status is false or missing data:', result)
      }
    } catch (error) {
      console.error('Error fetching output data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const user = localStorage.getItem('user')
    if (user) {
      const userData = JSON.parse(user)
      console.log('Fetching packing output data for company:', userData.company_id, 'page:', currentPage)
      fetchOutputData(currentPage, userData.company_id)
    }
  }, [currentPage, refreshTrigger])

  if (loading) {
    return <div className="text-center py-4">Loading...</div>
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
              <TableHead className="text-slate-600 dark:text-slate-400">Category</TableHead>
              <TableHead className="text-slate-600 dark:text-slate-400">Cone Size</TableHead>
              <TableHead className="text-slate-600 dark:text-slate-400">Box</TableHead>
              <TableHead className="text-slate-600 dark:text-slate-400">Cones Used</TableHead>
              <TableHead className="text-right text-slate-600 dark:text-slate-400">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 && (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-4 text-slate-600 dark:text-slate-400">
                  No output data available
                </TableCell>
              </TableRow>
            )}
            {data.map((item) => (
              <TableRow key={item.id} className="border-slate-200 dark:border-slate-800">
                <TableCell className="font-medium">{item.id}</TableCell>
                <TableCell>{item.machine_id}</TableCell>
                <TableCell>{item.yarn_type}</TableCell>
                <TableCell>{item.yarn_sub_type}</TableCell>
                <TableCell>{item.color}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>{item.cone_size}</TableCell>
                <TableCell>{item.box}</TableCell>
                <TableCell>{item.cones_used}</TableCell>
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

function InputPackingForm({ onSubmitSuccess, editItem, onEditItemChange }: { onSubmitSuccess?: () => void, editItem?: any, onEditItemChange?: (item: any | null) => void }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [companyId, setCompanyId] = useState('')
  const [stockData, setStockData] = useState<any[]>([])
  const [formData, setFormData] = useState({
    yarn_type: '',
    yarn_sub_type: '',
    color: '',
    category: '',
    cone_size: '',
    cones: ''
  })
  const isEditing = !!(editItem && editItem.id)

  const fetchStockData = async (company_id: string) => {
    try {
      setLoading(true)
      const res = await fetch(`/api/packing/inputConning/stock?company_id=${company_id}&_t=${Date.now()}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      })
      const result = await res.json()

      if (result.status && Array.isArray(result.data)) {
        setStockData(result.data)
      } else {
        setStockData([])
      }
    } catch (error) {
      console.error('Error fetching packing stock data:', error)
      setStockData([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const user = localStorage.getItem('user')
    if (user) {
      const userData = JSON.parse(user)
      setCompanyId(userData.company_id)
    }
  }, [])

  useEffect(() => {
    if (editItem) {
      setFormData({
        yarn_type: editItem.yarn_type || '',
        yarn_sub_type: editItem.yarn_sub_type || '',
        color: editItem.color || '',
        category: editItem.category || '',
        cone_size: editItem.cone_size || '',
        cones: String(editItem.cones) || ''
      })
      setOpen(true)
    }
  }, [editItem])

  useEffect(() => {
    if (open && companyId) {
      fetchStockData(companyId)
    }
  }, [open, companyId])

  const yarnTypeOptions = [...new Set(stockData.map((item) => String(item.yarn_type)))]
  const yarnSubTypeOptions = formData.yarn_type
    ? [...new Set(stockData.filter((item) => String(item.yarn_type) === formData.yarn_type).map((item) => String(item.yarn_sub_type)))]
    : []
  const colorOptions = formData.yarn_type && formData.yarn_sub_type
    ? [...new Set(stockData.filter((item) => String(item.yarn_type) === formData.yarn_type && String(item.yarn_sub_type) === formData.yarn_sub_type).map((item) => String(item.color)))]
    : []
  const categoryOptions = formData.yarn_type && formData.yarn_sub_type && formData.color
    ? [...new Set(stockData.filter((item) => String(item.yarn_type) === formData.yarn_type && String(item.yarn_sub_type) === formData.yarn_sub_type && String(item.color) === formData.color).map((item) => String(item.category)))]
    : []
  const coneSizeOptions = formData.yarn_type && formData.yarn_sub_type && formData.color && formData.category
    ? [...new Set(stockData.filter((item) => String(item.yarn_type) === formData.yarn_type && String(item.yarn_sub_type) === formData.yarn_sub_type && String(item.color) === formData.color && String(item.category) === formData.category).map((item) => String(item.cone_size)))]
    : []

  const handleDialogClose = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      if (onEditItemChange) {
        onEditItemChange(null)
      }
      setFormData({
        yarn_type: '',
        yarn_sub_type: '',
        color: '',
        category: '',
        cone_size: '',
        cones: ''
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!companyId || !formData.yarn_type || !formData.yarn_sub_type || !formData.color || !formData.category || !formData.cone_size || !formData.cones) {
      return
    }

    try {
      setSubmitting(true)

      let payload: any = {
        company_id: Number(companyId),
        yarn_type: formData.yarn_type,
        yarn_sub_type: formData.yarn_sub_type,
        color: formData.color,
        category: formData.category,
        cone_size: formData.cone_size,
        cones: Number(formData.cones)
      }

      if (isEditing) {
        payload.id = editItem.id
      }

      const method = isEditing ? 'PUT' : 'POST'

      const res = await fetch('/api/packing/inputConning', {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      const result = await res.json()
      const isSuccess = result.status === true || result.status === 1

      if (isSuccess) {
        setFormData({
          yarn_type: '',
          yarn_sub_type: '',
          color: '',
          category: '',
          cone_size: '',
          cones: ''
        })
        setOpen(false)
        if (onEditItemChange) {
          onEditItemChange(null)
        }
        onSubmitSuccess?.()
      }
    } catch (error) {
      console.error('Error submitting packing input form:', error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <Button onClick={() => setOpen(true)} className="gap-2">
        <Plus size={18} /> Add Input Packing
      </Button>
      <Dialog open={open} onOpenChange={handleDialogClose}>
        <DialogContent className="max-w-md border-slate-200 dark:border-slate-800">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Input Packing' : 'Add New Input Packing'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Yarn Type</Label>
              <Select
                value={formData.yarn_type}
                onValueChange={(value) => setFormData({ yarn_type: value, yarn_sub_type: '', color: '', category: '', cone_size: '', cones: formData.cones })}
                disabled={loading || submitting || isEditing}
              >
                <SelectTrigger>
                  <SelectValue placeholder={loading ? 'Loading...' : 'Select yarn type'} />
                </SelectTrigger>
                <SelectContent>
                  {yarnTypeOptions.map((option) => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Yarn Sub Type</Label>
              <Select
                value={formData.yarn_sub_type}
                onValueChange={(value) => setFormData({ ...formData, yarn_sub_type: value, color: '', category: '', cone_size: '' })}
                disabled={loading || submitting || !formData.yarn_type || isEditing}
              >
                <SelectTrigger>
                  <SelectValue placeholder={!formData.yarn_type ? 'Select yarn type first' : 'Select yarn sub type'} />
                </SelectTrigger>
                <SelectContent>
                  {yarnSubTypeOptions.map((option) => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Color</Label>
              <Select
                value={formData.color}
                onValueChange={(value) => setFormData({ ...formData, color: value, category: '', cone_size: '' })}
                disabled={loading || submitting || !formData.yarn_sub_type || isEditing}
              >
                <SelectTrigger>
                  <SelectValue placeholder={!formData.yarn_sub_type ? 'Select yarn sub type first' : 'Select color'} />
                </SelectTrigger>
                <SelectContent>
                  {colorOptions.map((option) => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value, cone_size: '' })}
                disabled={loading || submitting || !formData.color || isEditing}
              >
                <SelectTrigger>
                  <SelectValue placeholder={!formData.color ? 'Select color first' : 'Select category'} />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((option) => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Cone Size</Label>
              <Select
                value={formData.cone_size}
                onValueChange={(value) => setFormData({ ...formData, cone_size: value })}
                disabled={loading || submitting || !formData.category || isEditing}
              >
                <SelectTrigger>
                  <SelectValue placeholder={!formData.category ? 'Select category first' : 'Select cone size'} />
                </SelectTrigger>
                <SelectContent>
                  {coneSizeOptions.map((option) => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Cones</Label>
              <Input
                type="number"
                placeholder="e.g., 40"
                value={formData.cones}
                onChange={(e) => setFormData({ ...formData, cones: e.target.value })}
                disabled={submitting}
                min="0"
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? (isEditing ? 'Updating...' : 'Submitting...') : (isEditing ? 'Update' : 'Submit')}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

function OutputPackingForm({ onSubmitSuccess, editItem, onEditItemChange }: { onSubmitSuccess?: () => void, editItem?: any, onEditItemChange?: (item: any | null) => void }) {
  const [open, setOpen] = useState(false)
  const [loadingStock, setLoadingStock] = useState(false)
  const [loadingMachines, setLoadingMachines] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [companyId, setCompanyId] = useState('')
  const [stockData, setStockData] = useState<any[]>([])
  const [machineOptions, setMachineOptions] = useState<string[]>([])
  const [formData, setFormData] = useState({
    machine_id: '',
    yarn_type: '',
    yarn_sub_type: '',
    color: '',
    category: '',
    cone_size: '',
    box: ''
  })
  const { toast } = useToast()
  const isEditing = !!(editItem && editItem.id)

  useEffect(() => {
    const user = localStorage.getItem('user')
    if (user) {
      const userData = JSON.parse(user)
      setCompanyId(userData.company_id)
    }
  }, [])

  useEffect(() => {
    if (editItem) {
      setFormData({
        machine_id: String(editItem.machine_id || ''),
        yarn_type: String(editItem.yarn_type || ''),
        yarn_sub_type: String(editItem.yarn_sub_type || ''),
        color: String(editItem.color || ''),
        category: String(editItem.category || ''),
        cone_size: String(editItem.cone_size || ''),
        box: String(editItem.box || '')
      })
      setOpen(true)
    }
  }, [editItem])

  useEffect(() => {
    if (!open || !companyId) {
      return
    }

    const fetchStockData = async () => {
      try {
        setLoadingStock(true)
        const res = await fetch(`/api/packing/outputPacking/stock?company_id=${companyId}&_t=${Date.now()}`)
        const result = await res.json()
        const stockRows = Array.isArray(result?.data?.list) ? result.data.list : []

        setStockData(stockRows)
      } catch (error) {
        console.error('Error fetching output stock data:', error)
        setStockData([])
      } finally {
        setLoadingStock(false)
      }
    }

    const fetchMachineData = async () => {
      try {
        setLoadingMachines(true)
        const res = await fetch(`/api/machines?company_id=${companyId}`)
        const result = await res.json()
        const machineList: any[] = Array.isArray(result?.data) ? result.data : []
        const activeMachines = machineList
          .filter((item: any) => item.status === 'active' && item.machine_type === 'Packaging Machine')
          .map((item: any) => String(item.machine_number))

        setMachineOptions([...new Set(activeMachines)])
      } catch (error) {
        console.error('Error fetching machine data:', error)
        setMachineOptions([])
      } finally {
        setLoadingMachines(false)
      }
    }

    fetchStockData()
    fetchMachineData()
  }, [open, companyId])

  const yarnTypeOptions = [...new Set(stockData.map((item) => String(item.yarn_type)).filter(Boolean))]
  const yarnSubTypeOptions = formData.yarn_type
    ? [...new Set(stockData.filter((item) => String(item.yarn_type) === formData.yarn_type).map((item) => String(item.yarn_sub_type)).filter(Boolean))]
    : []
  const colorOptions = formData.yarn_type && formData.yarn_sub_type
    ? [...new Set(stockData.filter((item) => String(item.yarn_type) === formData.yarn_type && String(item.yarn_sub_type) === formData.yarn_sub_type).map((item) => String(item.color)).filter(Boolean))]
    : []
  const categoryOptions = formData.yarn_type && formData.yarn_sub_type && formData.color
    ? [...new Set(stockData.filter((item) => String(item.yarn_type) === formData.yarn_type && String(item.yarn_sub_type) === formData.yarn_sub_type && String(item.color) === formData.color).map((item) => String(item.category)).filter(Boolean))]
    : []
  const coneSizeOptions = formData.yarn_type && formData.yarn_sub_type && formData.color && formData.category
    ? [...new Set(stockData.filter((item) => String(item.yarn_type) === formData.yarn_type && String(item.yarn_sub_type) === formData.yarn_sub_type && String(item.color) === formData.color && String(item.category) === formData.category).map((item) => String(item.cone_size)).filter(Boolean))]
    : []

  const resetForm = () => {
    setFormData({
      machine_id: '',
      yarn_type: '',
      yarn_sub_type: '',
      color: '',
      category: '',
      cone_size: '',
      box: ''
    })
  }

  const handleDialogClose = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      if (onEditItemChange) {
        onEditItemChange(null)
      }
      resetForm()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!companyId || !formData.machine_id || !formData.yarn_type || !formData.yarn_sub_type || !formData.color || !formData.category || !formData.cone_size || !formData.box) {
      toast({
        title: 'Error',
        description: 'Please fill all output fields',
        variant: 'destructive'
      })
      return
    }

    try {
      setSubmitting(true)

      const payload: any = {
        company_id: Number(companyId),
        machine_id: Number(formData.machine_id),
        yarn_type: formData.yarn_type,
        yarn_sub_type: formData.yarn_sub_type,
        color: formData.color,
        category: formData.category,
        cone_size: Number(formData.cone_size),
        box: Number(formData.box)
      }

      if (isEditing) {
        payload.id = editItem.id
      }

      const res = await fetch('/api/packing/outputPacking', {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      const result = await res.json()
      const isSuccess = result.status === true || result.status === 1

      if (isSuccess) {
        toast({
          title: 'Success',
          description: isEditing ? 'Output packing updated successfully' : 'Output packing added successfully'
        })
        resetForm()
        setOpen(false)
        if (onEditItemChange) {
          onEditItemChange(null)
        }
        onSubmitSuccess?.()
      } else {
        toast({
          title: 'Error',
          description: result.message || (isEditing ? 'Failed to update output packing' : 'Failed to add output packing'),
          variant: 'destructive'
        })
      }
    } catch (error) {
      console.error('Error submitting output packing form:', error)
      toast({
        title: 'Error',
        description: isEditing ? 'Failed to update output packing' : 'Failed to add output packing',
        variant: 'destructive'
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <Button onClick={() => setOpen(true)} className="gap-2">
        <Plus size={18} /> {isEditing ? 'Edit Output Packing' : 'Add Output Packing'}
      </Button>
      <Dialog open={open} onOpenChange={handleDialogClose}>
        <DialogContent className="max-w-md border-slate-200 dark:border-slate-800">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Output Packing' : 'Add New Output Packing'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Machine ID</Label>
              <Select value={formData.machine_id} onValueChange={(value) => setFormData({ ...formData, machine_id: value })} disabled={loadingMachines || submitting || machineOptions.length === 0 || isEditing}>
                <SelectTrigger>
                  <SelectValue placeholder={loadingMachines ? 'Loading machines...' : (machineOptions.length === 0 ? 'No active machines found' : 'Select machine ID')} />
                </SelectTrigger>
                <SelectContent>
                  {isEditing && formData.machine_id && !machineOptions.includes(formData.machine_id) && (
                    <SelectItem key={formData.machine_id} value={formData.machine_id}>{formData.machine_id}</SelectItem>
                  )}
                  {machineOptions.map((machineId) => (
                    <SelectItem key={machineId} value={machineId}>{machineId}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Yarn Type</Label>
              <Select
                value={formData.yarn_type}
                onValueChange={(value) => setFormData({ ...formData, yarn_type: value, yarn_sub_type: '', color: '', category: '', cone_size: '' })}
                disabled={loadingStock || submitting || yarnTypeOptions.length === 0 || isEditing}
              >
                <SelectTrigger>
                  <SelectValue placeholder={loadingStock ? 'Loading stock...' : (yarnTypeOptions.length === 0 ? 'No yarn types found' : 'Select yarn type')} />
                </SelectTrigger>
                <SelectContent>
                  {isEditing && formData.yarn_type && !yarnTypeOptions.includes(formData.yarn_type) && (
                    <SelectItem key={formData.yarn_type} value={formData.yarn_type}>{formData.yarn_type}</SelectItem>
                  )}
                  {yarnTypeOptions.map((option) => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Yarn Sub Type</Label>
              <Select
                value={formData.yarn_sub_type}
                onValueChange={(value) => setFormData({ ...formData, yarn_sub_type: value, color: '', category: '', cone_size: '' })}
                disabled={loadingStock || submitting || !formData.yarn_type || yarnSubTypeOptions.length === 0 || isEditing}
              >
                <SelectTrigger>
                  <SelectValue placeholder={!formData.yarn_type ? 'Select yarn type first' : (yarnSubTypeOptions.length === 0 ? 'No yarn sub types found' : 'Select yarn sub type')} />
                </SelectTrigger>
                <SelectContent>
                  {isEditing && formData.yarn_sub_type && !yarnSubTypeOptions.includes(formData.yarn_sub_type) && (
                    <SelectItem key={formData.yarn_sub_type} value={formData.yarn_sub_type}>{formData.yarn_sub_type}</SelectItem>
                  )}
                  {yarnSubTypeOptions.map((option) => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Color</Label>
              <Select
                value={formData.color}
                onValueChange={(value) => setFormData({ ...formData, color: value, category: '', cone_size: '' })}
                disabled={loadingStock || submitting || !formData.yarn_sub_type || colorOptions.length === 0 || isEditing}
              >
                <SelectTrigger>
                  <SelectValue placeholder={!formData.yarn_sub_type ? 'Select yarn sub type first' : (colorOptions.length === 0 ? 'No colors found' : 'Select color')} />
                </SelectTrigger>
                <SelectContent>
                  {isEditing && formData.color && !colorOptions.includes(formData.color) && (
                    <SelectItem key={formData.color} value={formData.color}>{formData.color}</SelectItem>
                  )}
                  {colorOptions.map((option) => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value, cone_size: '' })}
                disabled={loadingStock || submitting || !formData.color || categoryOptions.length === 0 || isEditing}
              >
                <SelectTrigger>
                  <SelectValue placeholder={!formData.color ? 'Select color first' : (categoryOptions.length === 0 ? 'No categories found' : 'Select category')} />
                </SelectTrigger>
                <SelectContent>
                  {isEditing && formData.category && !categoryOptions.includes(formData.category) && (
                    <SelectItem key={formData.category} value={formData.category}>{formData.category}</SelectItem>
                  )}
                  {categoryOptions.map((option) => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Cone Size</Label>
              <Select
                value={formData.cone_size}
                onValueChange={(value) => setFormData({ ...formData, cone_size: value })}
                disabled={loadingStock || submitting || !formData.category || coneSizeOptions.length === 0 || isEditing}
              >
                <SelectTrigger>
                  <SelectValue placeholder={!formData.category ? 'Select category first' : (coneSizeOptions.length === 0 ? 'No cone sizes found' : 'Select cone size')} />
                </SelectTrigger>
                <SelectContent>
                  {isEditing && formData.cone_size && !coneSizeOptions.includes(formData.cone_size) && (
                    <SelectItem key={formData.cone_size} value={formData.cone_size}>{formData.cone_size}</SelectItem>
                  )}
                  {coneSizeOptions.map((option) => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Box</Label>
              <Input type="number" placeholder="e.g., 1" value={formData.box} onChange={(e) => setFormData({ ...formData, box: e.target.value })} required />
            </div>
            <Button type="submit" className="w-full" disabled={submitting || loadingStock || loadingMachines}>
              {submitting ? 'Submitting...' : 'Submit'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default function PackingPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [editingOutputItem, setEditingOutputItem] = useState<any>(null)
  const [deletingItem, setDeletingItem] = useState<any>(null)
  const [deletingOutputItem, setDeletingOutputItem] = useState<any>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const { toast } = useToast()

  const handleDelete = async () => {
    if (!deletingItem) return

    setDeleteLoading(true)
    try {
      const res = await fetch(`/api/packing/inputConning?id=${deletingItem.id}`, {
        method: 'DELETE',
        cache: 'no-store'
      })

      const data = await res.json()

      if (data.status === true || data.status === 1) {
        toast({
          title: "Success",
          description: "Input packing deleted successfully",
        })
        setDeletingItem(null)
        setRefreshTrigger(prev => prev + 1)
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to delete input packing",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error deleting input packing:', error)
      toast({
        title: "Error",
        description: "Error deleting input packing",
        variant: "destructive"
      })
    } finally {
      setDeleteLoading(false)
    }
  }

  const handleOutputDelete = async () => {
    if (!deletingOutputItem) return

    setDeleteLoading(true)
    try {
      const res = await fetch(`/api/packing/outputPacking?id=${deletingOutputItem.id}`, {
        method: 'DELETE',
        cache: 'no-store'
      })

      const data = await res.json()

      if (data.status === true || data.status === 1) {
        toast({
          title: 'Success',
          description: 'Output packing deleted successfully',
        })
        setDeletingOutputItem(null)
        setRefreshTrigger(prev => prev + 1)
      } else {
        toast({
          title: 'Error',
          description: data.message || 'Failed to delete output packing',
          variant: 'destructive'
        })
      }
    } catch (error) {
      console.error('Error deleting output packing:', error)
      toast({
        title: 'Error',
        description: 'Error deleting output packing',
        variant: 'destructive'
      })
    } finally {
      setDeleteLoading(false)
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Packing Management</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">Manage packing orders and shipments</p>
      </div>
      <Tabs defaultValue="input" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="input">Input</TabsTrigger>
          <TabsTrigger value="output">Output</TabsTrigger>
        </TabsList>
        <TabsContent value="input" className="space-y-6">
          <Card className="border-slate-200 p-6 dark:border-slate-800">
            <InputPackingForm
              onSubmitSuccess={() => setRefreshTrigger((prev) => prev + 1)}
              editItem={editingItem}
              onEditItemChange={setEditingItem}
            />
          </Card>
          <InputTablePagination
            refreshTrigger={refreshTrigger}
            onEditItem={(item) => setEditingItem(item)}
            onDeleteItem={(item) => setDeletingItem(item)}
          />
        </TabsContent>
        <TabsContent value="output" className="space-y-6">
          <Card className="border-slate-200 p-6 dark:border-slate-800">
            <OutputPackingForm
              onSubmitSuccess={() => setRefreshTrigger((prev) => prev + 1)}
              editItem={editingOutputItem}
              onEditItemChange={setEditingOutputItem}
            />
          </Card>
          <OutputTablePagination
            refreshTrigger={refreshTrigger}
            onEditItem={(item) => setEditingOutputItem(item)}
            onDeleteItem={(item) => setDeletingOutputItem(item)}
          />
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deletingItem} onOpenChange={(open) => !open && setDeletingItem(null)}>
        <DialogContent className="max-w-sm border-slate-200 dark:border-slate-800">
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-slate-600 dark:text-slate-400">
              Are you sure you want to delete this input packing record for <strong>{deletingItem?.yarn_type}</strong> ({deletingItem?.color})?
            </p>
            <p className="text-sm text-red-600 dark:text-red-400">
              This action cannot be undone.
            </p>
          </div>

          <div className="flex gap-2 justify-end">
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

      <Dialog open={!!deletingOutputItem} onOpenChange={(open) => !open && setDeletingOutputItem(null)}>
        <DialogContent className="max-w-sm border-slate-200 dark:border-slate-800">
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-slate-600 dark:text-slate-400">
              Are you sure you want to delete this output packing record for <strong>{deletingOutputItem?.yarn_type}</strong> ({deletingOutputItem?.color})?
            </p>
            <p className="text-sm text-red-600 dark:text-red-400">
              This action cannot be undone.
            </p>
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeletingOutputItem(null)}
              disabled={deleteLoading}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="bg-red-600 hover:bg-red-700"
              onClick={handleOutputDelete}
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
