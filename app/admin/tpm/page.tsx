'use client'

import { useState, useEffect, useRef } from 'react'
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

function OutputTablePagination({ refreshTrigger, onEditItem, onDeleteItem }: { refreshTrigger: number, onEditItem?: (item: any) => void, onDeleteItem?: (item: any) => void }) {
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
      const resultList: any[] = Array.isArray(result?.data)
        ? result.data
        : Array.isArray(result?.data?.list)
          ? result.data.list
          : []

      if (result.status && resultList.length >= 0) {
        setData(resultList)
        if (result?.data?.pagination) {
          setTotalPages(result.data.pagination.total_pages || 1)
        } else {
          setTotalPages(1)
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
              <TableHead className="text-slate-600 dark:text-slate-400 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, index) => (
              <TableRow key={item.id || `${item.batch_id}-${item.tpm}-${item.yarn_type}-${item.yarn_sub_type}-${index}`} className="border-slate-200 dark:border-slate-800">
                <TableCell className="font-medium">{item.machine_no}</TableCell>
                <TableCell>{item.batch_id}</TableCell>
                <TableCell>{item.yarn_type}</TableCell>
                <TableCell>{item.yarn_sub_type}</TableCell>
                <TableCell>{item.tpm}</TableCell>
                <TableCell>{item.input_weight}</TableCell>
                <TableCell>{item.output_weight}</TableCell>
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

function TPMForm({ type, onSubmitSuccess, editItem, onEditItemChange, refreshTrigger = 0 }: { type: 'input' | 'output', onSubmitSuccess?: () => void, editItem?: any, onEditItemChange?: (item: any | null) => void, refreshTrigger?: number }) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    machine_no: '',
    batch_id: '',
    yarn_type: '',
    yarn_sub_type: '',
    tpm: '',
    input_weight: '',
    output_weight: '',
    weight: ''
  })
  const [yarnData, setYarnData] = useState<any[]>([])
  const [outputData, setOutputData] = useState<any[]>([])
  const [yarnTypeOptions, setYarnTypeOptions] = useState<string[]>([])
  const [yarnSubTypeOptions, setYarnSubTypeOptions] = useState<string[]>([])
  const [batchOptions, setBatchOptions] = useState<string[]>([])
  const [machineOptions, setMachineOptions] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [companyId, setCompanyId] = useState<string>('')
  const [submitting, setSubmitting] = useState(false)
  const generatedBatchIds = useRef<Set<string>>(new Set())
  const isEditing = !!(editItem && editItem.id)

  const generateUniqueBatchId = () => {
    const existingBatchIds = new Set<string>([
      ...yarnData.map((item: any) => String(item.batch_id)),
      ...generatedBatchIds.current
    ])

    let nextBatchId = ''
    do {
      // Keep the ID in the B-xxxx style while adding entropy for collision safety.
      const timePart = Date.now().toString().slice(-6)
      const randomPart = Math.floor(Math.random() * 10).toString()
      nextBatchId = `B-${timePart}${randomPart}`
    } while (existingBatchIds.has(nextBatchId))

    generatedBatchIds.current.add(nextBatchId)
    return nextBatchId
  }

  // Open dialog when editItem changes
  useEffect(() => {
    if (editItem) {
      if (type === 'input') {
        setFormData((prev) => ({
          ...prev,
          batch_id: editItem.batch_id || '',
          yarn_type: editItem.yarn_type || '',
          yarn_sub_type: editItem.yarn_sub_type || '',
          weight: String(editItem.weight) || ''
        }))
      } else {
        setFormData((prev) => ({
          ...prev,
          machine_no: editItem.machine_no || '',
          batch_id: editItem.batch_id || '',
          yarn_type: editItem.yarn_type || '',
          yarn_sub_type: editItem.yarn_sub_type || '',
          tpm: String(editItem.tpm) || '',
          input_weight: String(editItem.input_weight) || '',
          output_weight: String(editItem.output_weight) || ''
        }))
      }
      setOpen(true)
    }
  }, [editItem, type])

  const fetchYarnData = async (company_id: string) => {
    try {
      setLoading(true)
      const res = await fetch(`/api/yarn/total?company_id=${company_id}`)
      const result = await res.json()

      if (result.status && result.data) {
        // Filter out items with remaining_weight of 0
        const resultList: any[] = Array.isArray(result.data) ? result.data : []
        const filteredData = resultList.filter((item: any) => item.remaining_weight > 0)

        // Store filtered data
        setYarnData(filteredData)

        // Yarn type is now selected directly without batch selection.
        const yarnTypes: string[] = [...new Set(filteredData.map((item: any) => String(item.yarn_type)))]
        setYarnTypeOptions(yarnTypes)
        setYarnSubTypeOptions([])
      }
    } catch (error) {
      console.error('Error fetching yarn data:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchOutputData = async (company_id: string) => {
    try {
      setLoading(true)
      // Reset state immediately before fetching
      setOutputData([])
      setBatchOptions([])
      setYarnTypeOptions([])
      setYarnSubTypeOptions([])

      const res = await fetch(`/api/tpm/outputTpm/stock?company_id=${company_id}&_t=${Date.now()}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      })
      const result = await res.json()
      const resultList: any[] = Array.isArray(result?.data)
        ? result.data
        : Array.isArray(result?.data?.list)
          ? result.data.list
          : []

      if (result.status && resultList.length >= 0) {
        const filteredData = resultList.filter((item: any) => String(item?.batch_id || '').trim() !== '')
        setOutputData(filteredData)
        setBatchOptions([...new Set(filteredData.map((item: any) => String(item.batch_id)))])
      } else {
        setOutputData([])
        setBatchOptions([])
      }
    } catch (error) {
      console.error('Error fetching output data:', error)
      setOutputData([])
      setBatchOptions([])
    } finally {
      setLoading(false)
    }
  }

  const fetchMachineData = async (company_id: string) => {
    try {
      const res = await fetch(`/api/machines?company_id=${company_id}`)
      const result = await res.json()

      const machineList: any[] = Array.isArray(result?.data) ? result.data : []
      const filteredMachines = machineList
        .filter((item: any) => item.status === 'active' && item.machine_type === 'Twisting Machine')
        .map((item: any) => String(item.machine_number))

      setMachineOptions([...new Set(filteredMachines)])
    } catch (error) {
      console.error('Error fetching machine data:', error)
      setMachineOptions([])
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
      // Populate yarn type options.
      const yarnTypes: string[] = [...new Set(yarnData.map((item: any) => String(item.yarn_type)))]
      setYarnTypeOptions(yarnTypes)

      // Populate yarn sub type options for the selected yarn type.
      const filteredByType = yarnData.filter((item: any) => item.yarn_type === editItem.yarn_type)
      const yarnSubTypes: string[] = [...new Set(filteredByType.map((item: any) => String(item.yarn_sub_type)))]
      setYarnSubTypeOptions(yarnSubTypes)
    }
  }, [editItem, yarnData])

  useEffect(() => {
    if (editItem && outputData.length > 0 && type === 'output') {
      const batchRows = outputData.filter((item: any) => String(item.batch_id) === String(editItem.batch_id))
      const yarnTypes: string[] = [...new Set(batchRows.map((item: any) => String(item.yarn_type)))]
      const yarnSubTypes: string[] = [...new Set(batchRows
        .filter((item: any) => String(item.yarn_type) === String(editItem.yarn_type))
        .map((item: any) => String(item.yarn_sub_type)))]

      setBatchOptions([...new Set(outputData.map((item: any) => String(item.batch_id)))])
      setYarnTypeOptions(yarnTypes)
      setYarnSubTypeOptions(yarnSubTypes)
    }
  }, [editItem, outputData, type])

  // Fetch data when form opens and company ID is available
  useEffect(() => {
    if (open && companyId) {
      if (type === 'input') {
        fetchYarnData(companyId)
      } else {
        fetchOutputData(companyId)
        fetchMachineData(companyId)
      }
    }
  }, [open, companyId, type])

  // For editing output: ensure dropdown options show the current values
  useEffect(() => {
    if (editItem && type === 'output' && isEditing) {
      // Ensure batch option is available
      setBatchOptions((prev) => {
        const set = new Set(prev)
        set.add(String(editItem.batch_id))
        return Array.from(set)
      })
      // Ensure yarn types option is available
      setYarnTypeOptions((prev) => {
        const set = new Set(prev)
        set.add(String(editItem.yarn_type))
        return Array.from(set)
      })
      // Ensure yarn sub types option is available
      setYarnSubTypeOptions((prev) => {
        const set = new Set(prev)
        set.add(String(editItem.yarn_sub_type))
        return Array.from(set)
      })
    }
  }, [editItem, type])

  // Refetch output data when table refreshes (after successful submit/delete)
  useEffect(() => {
    if (open && companyId && type === 'output') {
      fetchOutputData(companyId)
    }
  }, [open, companyId, type, refreshTrigger])

  // Update yarn sub types when yarn_type changes
  useEffect(() => {
    if (formData.yarn_type && yarnData.length > 0) {
      const filteredByType = yarnData.filter((item: any) => item.yarn_type === formData.yarn_type)
      const yarnSubTypes: string[] = [...new Set(filteredByType.map((item: any) => String(item.yarn_sub_type)))]
      setYarnSubTypeOptions(yarnSubTypes)

      // Only reset yarn_sub_type if we're not editing
      if (!editItem) {
        setFormData((prev) => ({ ...prev, yarn_sub_type: '' }))
      }
    } else if (!formData.yarn_type) {
      setYarnSubTypeOptions([])
    }
  }, [formData.yarn_type, yarnData, editItem])

  useEffect(() => {
    if (type !== 'output') {
      return
    }

    if (!formData.batch_id) {
      setYarnTypeOptions([])
      setYarnSubTypeOptions([])
      if (!editItem) {
        setFormData((prev) => ({ ...prev, yarn_type: '', yarn_sub_type: '' }))
      }
      return
    }

    const batchRows = outputData.filter((item: any) => String(item.batch_id) === String(formData.batch_id))
    const yarnTypes: string[] = [...new Set(batchRows.map((item: any) => String(item.yarn_type)))]
    setYarnTypeOptions(yarnTypes)

    if (!isEditing && !batchRows.some((item: any) => String(item.yarn_type) === String(formData.yarn_type))) {
      setFormData((prev) => ({ ...prev, yarn_type: '', yarn_sub_type: '' }))
      setYarnSubTypeOptions([])
    }
  }, [formData.batch_id, outputData, type, editItem, isEditing])

  useEffect(() => {
    if (type !== 'output') {
      return
    }

    if (formData.batch_id && formData.yarn_type) {
      const filteredRows = outputData.filter((item: any) =>
        String(item.batch_id) === String(formData.batch_id) &&
        String(item.yarn_type) === String(formData.yarn_type)
      )

      const yarnSubTypes: string[] = [...new Set(filteredRows.map((item: any) => String(item.yarn_sub_type)))]
      setYarnSubTypeOptions(yarnSubTypes)

      if (!isEditing && !filteredRows.some((item: any) => String(item.yarn_sub_type) === String(formData.yarn_sub_type))) {
        setFormData((prev) => ({ ...prev, yarn_sub_type: '' }))
      }
    } else {
      setYarnSubTypeOptions([])
    }
  }, [formData.batch_id, formData.yarn_type, outputData, type, isEditing])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const isInputForm = type === 'input'

    // Validate all fields are filled
    if (isInputForm && (!formData.yarn_type || !formData.yarn_sub_type || !formData.weight)) {
      toast.error('Please fill all fields')
      return
    }

    // For output form: during edit, only require editable fields (input_weight, output_weight)
    // During add, require all fields
    if (!isInputForm) {
      if (isEditing) {
        // Edit mode: only validate editable fields
        if (!formData.input_weight || !formData.output_weight) {
          toast.error('Please fill input weight and output weight')
          return
        }
      } else {
        // Add mode: validate all fields
        if (!formData.machine_no || !formData.batch_id || !formData.yarn_type || !formData.yarn_sub_type || !formData.tpm || !formData.input_weight || !formData.output_weight) {
          toast.error('Please fill all output fields')
          return
        }
      }
    }

    // Validate weight is a positive number
    const weightNum = parseFloat(formData.weight)
    const tpmNum = parseFloat(formData.tpm)
    const inputWeightNum = parseFloat(formData.input_weight)
    const outputWeightNum = parseFloat(formData.output_weight)

    if (isInputForm) {
      if (isNaN(weightNum) || weightNum <= 0) {
        toast.error('Weight must be a positive number')
        return
      }
    } else {
      // For output: validate numeric fields
      if (isEditing) {
        // Edit mode: only validate input and output weights
        if (isNaN(inputWeightNum) || inputWeightNum <= 0 || isNaN(outputWeightNum) || outputWeightNum <= 0) {
          toast.error('Input weight and output weight must be positive numbers')
          return
        }
      } else {
        // Add mode: validate all numeric fields
        if (isNaN(tpmNum) || tpmNum <= 0 || isNaN(inputWeightNum) || inputWeightNum <= 0 || isNaN(outputWeightNum) || outputWeightNum <= 0) {
          toast.error('TPM, input weight and output weight must be positive numbers')
          return
        }
      }
    }

    try {
      setSubmitting(true)

      const isEditing = editItem && editItem.id
      const payloadBatchId = isInputForm && !isEditing ? generateUniqueBatchId() : formData.batch_id

      let payload: any
      if (isInputForm) {
        payload = {
          company_id: parseInt(companyId),
          batch_id: payloadBatchId,
          yarn_type: formData.yarn_type,
          yarn_sub_type: formData.yarn_sub_type,
          weight: weightNum
        }
      } else {
        const user = JSON.parse(localStorage.getItem('user') || '{}')
        payload = {
          company_id: parseInt(companyId),
          admin_id: user.id || editItem?.admin_id,
          machine_no: formData.machine_no || editItem?.machine_no || '',
          batch_id: formData.batch_id || editItem?.batch_id || '',
          yarn_type: formData.yarn_type || editItem?.yarn_type || '',
          yarn_sub_type: formData.yarn_sub_type || editItem?.yarn_sub_type || '',
          tpm: tpmNum || Number(editItem?.tpm) || 0,
          input_weight: inputWeightNum,
          output_weight: outputWeightNum
        }
      }

      // When editing, add id to payload
      if (isEditing) {
        payload.id = editItem.id
      }

      const url = isInputForm ? '/api/tpm/inputYarn' : '/api/tpm/outputTpm'
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
        toast.success(
          isEditing
            ? (isInputForm ? 'Input task updated successfully' : 'Output task updated successfully')
            : (isInputForm ? 'Input task added successfully' : 'Output task added successfully')
        )

        // Reset form and close dialog
        setFormData({
          machine_no: '',
          batch_id: '',
          yarn_type: '',
          yarn_sub_type: '',
          tpm: '',
          input_weight: '',
          output_weight: '',
          weight: ''
        })
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
        toast.error(
          result.message || (isEditing
            ? (isInputForm ? 'Failed to update input task' : 'Failed to update output task')
            : (isInputForm ? 'Failed to add input task' : 'Failed to add output task'))
        )
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      toast.error('An error occurred while submitting the form')
    } finally {
      setSubmitting(false)
    }
  }

  const isInput = type === 'input'
  const buttonText = isInput ? 'Add Input Task' : 'Add Output Task'
  const dialogTitle = isEditing ? (isInput ? 'Edit Input TPM Task' : 'Edit Output TPM Task') : (isInput ? 'Add New Input TPM Task' : 'Add New Output TPM Task')

  const handleDialogClose = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      // Clear edit item and reset form data
      if (onEditItemChange) {
        onEditItemChange(null)
      }
      // For output form, clear dropdowns to force fresh fetch
      if (type === 'output') {
        setFormData({
          machine_no: '',
          batch_id: '',
          yarn_type: '',
          yarn_sub_type: '',
          tpm: '',
          input_weight: '',
          output_weight: '',
          weight: ''
        })
        setYarnTypeOptions([])
        setYarnSubTypeOptions([])
      }
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
            {isInput ? (
              <>
                <div className="space-y-2">
                  <Label>Yarn Type</Label>
                  <Select value={formData.yarn_type} onValueChange={(value) => setFormData({ ...formData, yarn_type: value })} disabled={loading || submitting || isEditing}>
                    <SelectTrigger><SelectValue placeholder={loading ? "Loading..." : "Select yarn type"} /></SelectTrigger>
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
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label>Machine No</Label>
                  <Select value={formData.machine_no} onValueChange={(value) => setFormData({ ...formData, machine_no: value })} disabled={submitting || machineOptions.length === 0 || isEditing}>
                    <SelectTrigger>
                      <SelectValue placeholder={machineOptions.length === 0 ? 'No active Twisting Machine found' : 'Select machine number'} />
                    </SelectTrigger>
                    <SelectContent>
                      {machineOptions.map((machineNo) => (
                        <SelectItem key={machineNo} value={machineNo}>{machineNo}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Batch ID</Label>
                  <Select
                    value={formData.batch_id}
                    onValueChange={(value) => setFormData({ ...formData, batch_id: value, yarn_type: '', yarn_sub_type: '' })}
                    disabled={loading || submitting || batchOptions.length === 0 || isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={batchOptions.length === 0 ? 'No batches available' : 'Select batch id'} />
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
                  <Select value={formData.yarn_type} onValueChange={(value) => setFormData({ ...formData, yarn_type: value, yarn_sub_type: '' })} disabled={loading || !formData.batch_id || submitting || isEditing}>
                    <SelectTrigger><SelectValue placeholder={!formData.batch_id ? "Select batch id first" : loading ? "Loading..." : "Select yarn type"} /></SelectTrigger>
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
                  <Select value={formData.yarn_sub_type} onValueChange={(value) => setFormData({ ...formData, yarn_sub_type: value })} disabled={loading || !formData.yarn_type || submitting || isEditing}>
                    <SelectTrigger><SelectValue placeholder={!formData.yarn_type ? "Select yarn type first" : loading ? "Loading..." : "Select yarn sub type"} /></SelectTrigger>
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
                  <Label>TPM</Label>
                  <Input
                    type="number"
                    placeholder="e.g., 28"
                    value={formData.tpm}
                    onChange={(e) => setFormData({ ...formData, tpm: e.target.value })}
                    disabled={submitting || isEditing}
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Input Weight</Label>
                  <Input
                    type="number"
                    placeholder="e.g., 10"
                    value={formData.input_weight}
                    onChange={(e) => setFormData({ ...formData, input_weight: e.target.value })}
                    disabled={submitting}
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Output Weight</Label>
                  <Input
                    type="number"
                    placeholder="e.g., 9.5"
                    value={formData.output_weight}
                    onChange={(e) => setFormData({ ...formData, output_weight: e.target.value })}
                    disabled={submitting}
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
              </>
            )}
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
      const isOutputItem = deletingItem.tpm !== undefined
      const url = isOutputItem ? '/api/tpm/outputTpm' : '/api/tpm/inputYarn'
      const itemType = isOutputItem ? 'Output' : 'Input'

      const res = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: deletingItem.id })
      })

      const data = await res.json()

      if (data.status === true || data.status === 1) {
        toast.success(`${itemType} task deleted successfully`)
        setDeletingItem(null)
        // Trigger table refresh
        setRefreshTrigger(prev => prev + 1)
      } else {
        toast.error(data.message || `Failed to delete ${itemType} task`)
      }
    } catch (error) {
      console.error('Error deleting task:', error)
      toast.error('Error deleting task')
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
            <TPMForm type="output" onSubmitSuccess={handleInputFormSubmit} editItem={editingItem} onEditItemChange={setEditingItem} refreshTrigger={refreshTrigger} />
          </Card>
          <OutputTablePagination refreshTrigger={refreshTrigger} onEditItem={handleEditItem} onDeleteItem={handleDeleteItem} />
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
              Are you sure you want to delete {deletingItem?.tpm !== undefined ? 'output' : 'input'} task from <strong>{deletingItem?.batch_id}</strong> (Yarn Type: {deletingItem?.yarn_type})?
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