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
      const res = await fetch(`/api/tpm/inputYarn?company_id=${company_id}&current_page=${page}&_t=${Date.now()}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      })
      const result = await res.json()

      if (result.status && result.data && result.data.list) {
        setData(result.data.list)
        // Use pagination info from API
        if (result.data.pagination) {
          setTotalPages(result.data.pagination.total_pages || 1)
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
      console.log('Fetching input data for company:', userData.company_id, 'page:', currentPage)
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
              <TableHead className="text-slate-600 dark:text-slate-400">Batch ID</TableHead>
              <TableHead className="text-slate-600 dark:text-slate-400">Yarn Type</TableHead>
              <TableHead className="text-slate-600 dark:text-slate-400">Yarn Sub Type</TableHead>
              <TableHead className="text-slate-600 dark:text-slate-400">Weight</TableHead>
              <TableHead className="text-right text-slate-600 dark:text-slate-400">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id} className="border-slate-200 dark:border-slate-800">
                <TableCell className="font-medium">{item.batch_id}</TableCell>
                <TableCell>{item.yarn_type}</TableCell>
                <TableCell>{item.yarn_sub_type}</TableCell>
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

function OutputTablePagination({ refreshTrigger }: { refreshTrigger: number }) {
  const [currentPage, setCurrentPage] = useState(1)
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [totalPages, setTotalPages] = useState(1)

  const fetchOutputData = async (page: number, company_id: string) => {
    try {
      setLoading(true)
      const res = await fetch(`/api/tpm/outputTpm?company_id=${company_id}&current_page=${page}&_t=${Date.now()}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      })
      const result = await res.json()

      if (result.status && result.data && result.data.list) {
        setData(result.data.list)
        if (result.data.pagination) {
          setTotalPages(result.data.pagination.total_pages || 1)
        }
      } else {
        setData([])
        setTotalPages(1)
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
              <TableHead className="text-slate-600 dark:text-slate-400">Machine No</TableHead>
              <TableHead className="text-slate-600 dark:text-slate-400">Batch ID</TableHead>
              <TableHead className="text-slate-600 dark:text-slate-400">Yarn Type</TableHead>
              <TableHead className="text-slate-600 dark:text-slate-400">Yarn Sub Type</TableHead>
              <TableHead className="text-slate-600 dark:text-slate-400">TPM</TableHead>
              <TableHead className="text-slate-600 dark:text-slate-400">Input Weight</TableHead>
              <TableHead className="text-slate-600 dark:text-slate-400">Output Weight</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id} className="border-slate-200 dark:border-slate-800">
                <TableCell className="font-medium">{item.machine_no}</TableCell>
                <TableCell>{item.batch_id}</TableCell>
                <TableCell>{item.yarn_type}</TableCell>
                <TableCell>{item.yarn_sub_type}</TableCell>
                <TableCell>{item.tpm}</TableCell>
                <TableCell>{item.input_weight}</TableCell>
                <TableCell>{item.output_weight}</TableCell>
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

function TPMForm({ type, onSubmitSuccess, editItem, onEditItemChange }: { type: 'input' | 'output', onSubmitSuccess?: () => void, editItem?: any, onEditItemChange?: (item: any | null) => void }) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({ batch_id: '', yarn_type: '', yarn_sub_type: '', weight: '' })
  const [yarnData, setYarnData] = useState<any[]>([])
  const [batchOptions, setBatchOptions] = useState<string[]>([])
  const [yarnTypeOptions, setYarnTypeOptions] = useState<string[]>([])
  const [yarnSubTypeOptions, setYarnSubTypeOptions] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [companyId, setCompanyId] = useState<string>('')
  const [submitting, setSubmitting] = useState(false)
  const { toast } = useToast()

  // Open dialog when editItem changes
  useEffect(() => {
    if (editItem) {
      setFormData({
        batch_id: editItem.batch_id || '',
        yarn_type: editItem.yarn_type || '',
        yarn_sub_type: editItem.yarn_sub_type || '',
        weight: String(editItem.weight) || ''
      })
      setOpen(true)
    }
  }, [editItem])

  const fetchYarnData = async (company_id: string) => {
    try {
      setLoading(true)
      const res = await fetch(`/api/yarn/total?company_id=${company_id}`)
      const result = await res.json()

      if (result.status && result.data) {
        // Filter out items with remaining_weight of 0
        const filteredData = result.data.filter((item: any) => item.remaining_weight > 0)

        // Store filtered data
        setYarnData(filteredData)

        // Extract unique batch IDs
        const batchIds = [...new Set(filteredData.map((item: any) => item.batch_id))]
        setBatchOptions(batchIds)

        // Clear other dropdowns initially
        setYarnTypeOptions([])
        setYarnSubTypeOptions([])
      }
    } catch (error) {
      console.error('Error fetching yarn data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Get company ID from localStorage on component mount
  useEffect(() => {
    const user = localStorage.getItem('user')
    if (user) {
      const userData = JSON.parse(user)
      setCompanyId(userData.company_id)
    }
  }, [])

  // Populate dropdown options when editing
  useEffect(() => {
    if (editItem && yarnData.length > 0) {
      // Populate batch options
      const batchIds = [...new Set(yarnData.map((item: any) => item.batch_id))]
      setBatchOptions(batchIds)

      // Populate yarn type options for the selected batch
      const filteredByBatch = yarnData.filter((item: any) => item.batch_id === editItem.batch_id)
      const yarnTypes = [...new Set(filteredByBatch.map((item: any) => item.yarn_type))]
      setYarnTypeOptions(yarnTypes)

      // Populate yarn sub type options for the selected batch and yarn type
      const filteredByBatchAndType = yarnData.filter(
        (item: any) => item.batch_id === editItem.batch_id && item.yarn_type === editItem.yarn_type
      )
      const yarnSubTypes = [...new Set(filteredByBatchAndType.map((item: any) => item.yarn_sub_type))]
      setYarnSubTypeOptions(yarnSubTypes)
    }
  }, [editItem, yarnData])

  // Fetch data when form opens and company ID is available
  useEffect(() => {
    if (open && companyId) {
      fetchYarnData(companyId)
    }
  }, [open, companyId])

  // Update yarn types when batch_id changes
  useEffect(() => {
    if (formData.batch_id && yarnData.length > 0) {
      const filteredByBatch = yarnData.filter((item: any) => item.batch_id === formData.batch_id)
      const yarnTypes = [...new Set(filteredByBatch.map((item: any) => item.yarn_type))]
      setYarnTypeOptions(yarnTypes)

      // Only reset yarn_type and yarn_sub_type if we're not editing
      if (!editItem) {
        setFormData((prev) => ({ ...prev, yarn_type: '', yarn_sub_type: '' }))
        setYarnSubTypeOptions([])
      }
    }
  }, [formData.batch_id, yarnData, editItem])

  // Update yarn sub types when yarn_type changes
  useEffect(() => {
    if (formData.batch_id && formData.yarn_type && yarnData.length > 0) {
      const filteredByBatchAndType = yarnData.filter(
        (item: any) => item.batch_id === formData.batch_id && item.yarn_type === formData.yarn_type
      )
      const yarnSubTypes = [...new Set(filteredByBatchAndType.map((item: any) => item.yarn_sub_type))]
      setYarnSubTypeOptions(yarnSubTypes)

      // Only reset yarn_sub_type if we're not editing
      if (!editItem) {
        setFormData((prev) => ({ ...prev, yarn_sub_type: '' }))
      }
    }
  }, [formData.batch_id, formData.yarn_type, yarnData, editItem])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate all fields are filled
    if (!formData.batch_id || !formData.yarn_type || !formData.yarn_sub_type || !formData.weight) {
      toast({
        title: "Error",
        description: "Please fill all fields",
        variant: "destructive"
      })
      return
    }

    // Validate weight is a positive number
    const weightNum = parseFloat(formData.weight)
    if (isNaN(weightNum) || weightNum <= 0) {
      toast({
        title: "Error",
        description: "Weight must be a positive number",
        variant: "destructive"
      })
      return
    }

    try {
      setSubmitting(true)

      const isEditing = editItem && editItem.id

      let payload: any = {
        company_id: parseInt(companyId),
        batch_id: formData.batch_id,
        yarn_type: formData.yarn_type,
        yarn_sub_type: formData.yarn_sub_type,
        weight: weightNum
      }

      // When editing, add id to payload
      if (isEditing) {
        payload.id = editItem.id
      }

      const url = '/api/tpm/inputYarn'
      const method = isEditing ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      const result = await res.json()

      // Check if the response indicates success
      const isSuccess = result.status === true || result.status === 1

      if (isSuccess) {
        toast({
          title: "Success",
          description: isEditing ? "Input task updated successfully" : "Input task added successfully",
        })

        // Reset form and close dialog
        setFormData({ batch_id: '', yarn_type: '', yarn_sub_type: '', weight: '' })
        setOpen(false)

        // Clear edit item
        if (onEditItemChange) {
          onEditItemChange(null)
        }

        // Trigger refresh of the table
        if (onSubmitSuccess) {
          onSubmitSuccess()
        }
      } else {
        toast({
          title: "Error",
          description: result.message || (isEditing ? "Failed to update input task" : "Failed to add input task"),
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      toast({
        title: "Error",
        description: "An error occurred while submitting the form",
        variant: "destructive"
      })
    } finally {
      setSubmitting(false)
    }
  }

  const isInput = type === 'input'
  const isEditing = editItem && editItem.id
  const buttonText = isInput ? 'Add Input Task' : 'Add Output Task'
  const dialogTitle = isEditing ? (isInput ? 'Edit Input TPM Task' : 'Edit Output TPM Task') : (isInput ? 'Add New Input TPM Task' : 'Add New Output TPM Task')

  const handleDialogClose = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen && onEditItemChange) {
      onEditItemChange(null)
    }
  }

  return (
    <>
      <Button onClick={() => setOpen(true)} className="gap-2">
        <Plus size={18} /> {buttonText}
      </Button>
      <Dialog open={open} onOpenChange={handleDialogClose}>
        <DialogContent className="max-w-md border-slate-200 dark:border-slate-800">
          <DialogHeader>
            <DialogTitle>{dialogTitle}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Batch ID</Label>
              <Select value={formData.batch_id} onValueChange={(value) => setFormData({ ...formData, batch_id: value })} disabled={loading || submitting || isEditing}>
                <SelectTrigger><SelectValue placeholder={loading ? "Loading..." : "Select batch ID"} /></SelectTrigger>
                <SelectContent>
                  {batchOptions.map((option) => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Yarn Type</Label>
              <Select value={formData.yarn_type} onValueChange={(value) => setFormData({ ...formData, yarn_type: value })} disabled={loading || !formData.batch_id || submitting || isEditing}>
                <SelectTrigger><SelectValue placeholder={!formData.batch_id ? "Select batch ID first" : loading ? "Loading..." : "Select yarn type"} /></SelectTrigger>
                <SelectContent>
                  {yarnTypeOptions.map((option) => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Yarn Sub Type</Label>
              <Select value={formData.yarn_sub_type} onValueChange={(value) => setFormData({ ...formData, yarn_sub_type: value })} disabled={loading || !formData.yarn_type || submitting || isEditing}>
                <SelectTrigger><SelectValue placeholder={!formData.yarn_type ? "Select yarn type first" : loading ? "Loading..." : "Select yarn sub type"} /></SelectTrigger>
                <SelectContent>
                  {yarnSubTypeOptions.map((option) => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Weight</Label>
              <Input
                type="number"
                placeholder="e.g., 10"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                disabled={submitting}
                step="0.01"
                min="0"
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? (isEditing ? "Updating..." : "Submitting...") : (isEditing ? "Update" : "Submit")}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default function TPMPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [deletingItem, setDeletingItem] = useState<any>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const { toast } = useToast()

  const handleInputFormSubmit = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  const handleEditItem = (item: any) => {
    setEditingItem(item)
  }

  const handleDeleteItem = (item: any) => {
    setDeletingItem(item)
  }

  const handleDelete = async () => {
    if (!deletingItem) return

    setDeleteLoading(true)
    try {
      const res = await fetch(`/api/tpm/inputYarn?id=${deletingItem.id}`, {
        method: 'DELETE',
      })

      const data = await res.json()

      if (data.status === true || data.status === 1) {
        toast({
          title: "Success",
          description: "Input task deleted successfully",
        })
        setDeletingItem(null)
        // Trigger table refresh
        setRefreshTrigger(prev => prev + 1)
      } else {
        toast({
          title: "Error",
          description: data.message || 'Failed to delete input task',
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error deleting input task:', error)
      toast({
        title: "Error",
        description: "Error deleting input task",
        variant: "destructive"
      })
    } finally {
      setDeleteLoading(false)
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">TPM Management</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">Total Productive Maintenance tracking</p>
      </div>
      <Tabs defaultValue="input" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="input">Input</TabsTrigger>
          <TabsTrigger value="output">Output</TabsTrigger>
        </TabsList>
        <TabsContent value="input" className="space-y-6">
          <Card className="border-slate-200 p-6 dark:border-slate-800">
            <TPMForm
              type="input"
              onSubmitSuccess={handleInputFormSubmit}
              editItem={editingItem}
              onEditItemChange={setEditingItem}
            />
          </Card>
          <InputTablePagination
            refreshTrigger={refreshTrigger}
            onEditItem={handleEditItem}
            onDeleteItem={handleDeleteItem}
          />
        </TabsContent>
        <TabsContent value="output" className="space-y-6">
          <Card className="border-slate-200 p-6 dark:border-slate-800">
            <TPMForm type="output" />
          </Card>
          <OutputTablePagination refreshTrigger={refreshTrigger} />
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
              Are you sure you want to delete input task from <strong>{deletingItem?.batch_id}</strong> (Yarn Type: {deletingItem?.yarn_type})?
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
    </div>
  )
}