'use client'

import { useEffect, useState } from 'react'
import { DataTable } from '@/components/data-table'
import { FormModal } from '@/components/form-modal'
import { toast } from 'sonner'
import type { ManagerEntry } from '@/lib/types'

export default function ManagersPage() {
  const [entries, setEntries] = useState<any[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingEntry, setEditingEntry] = useState<any | null>(null)

  useEffect(() => {
    loadManagers()
  }, [])

  const getUser = () => {
    if (typeof window === 'undefined') return null
    return JSON.parse(localStorage.getItem('user') || '{}')
  }

  const formatDepartmentSafe = (dept: any) => {
    try {
      if (!dept) return ''

      // If already comma separated
      if (typeof dept === 'string' && dept.includes(',')) {
        return dept.split(',').map((d) => d.trim()).join(', ')
      }

      // Handle your weird case: raw_yarntpmdyeing
      const parts = []

      if (dept.includes('raw_yarn')) parts.push('raw_yarn')
      if (dept.includes('tpm')) parts.push('tpm')
      if (dept.includes('dyeing')) parts.push('dyeing')

      return parts.join(', ')
    } catch (e) {
      console.log('Department format error:', e)
      return dept // fallback (VERY IMPORTANT)
    }
  }

  const loadManagers = async () => {
    try {
      const user = getUser()

      const res = await fetch(`/api/managers?company_id=${user.company_id}`)
      const json = await res.json()

      if (json.status) {
        const formatted = json.data.map((item: any) => ({
          manager_id: item.id,
          name: item.name,
          email: item.email,
          department: formatDepartmentSafe(item.department),
          date: item.created_at?.split(' ')[0],
        }))

        setEntries(formatted)
      }
    } catch (error) {
      toast.error('Failed to load managers')
    }
  }

  const handleAddNew = () => {
    setEditingEntry({
      name: '',
      email: '',
      password: '',
      department: '',
    })
    setIsModalOpen(true)
  }

  const handleEdit = (entry: any) => {
    setEditingEntry(entry)
    setIsModalOpen(true)
  }

  const handleDelete = async (entry: any) => {
    if (!confirm('Delete this manager?')) return

    try {
      const res = await fetch(`/api/managers?manager_id=${entry.manager_id}`, {
        method: 'DELETE',
      })

      const json = await res.json()

      if (json.status) {
        toast.success('Deleted successfully')
        loadManagers()
      } else {
        toast.error(json.message || 'Delete failed')
      }
    } catch {
      toast.error('Delete failed')
    }
  }

  const handleSubmit = async (data: any) => {
    const user = getUser()

    const payload: ManagerEntry = {
      manager_id: editingEntry?.manager_id || undefined,
      name: data.name,
      email: data.email,
      password: data.password || '',
      department: data.department,
      company_id: String(user.company_id),
      admin_id: String(user.id),
    }

    try {
      const res = await fetch('/api/managers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const json = await res.json()

      if (json.status) {
        toast.success(editingEntry ? 'Updated' : 'Created')
        setIsModalOpen(false)
        loadManagers()
      } else {
        toast.error(json.message || 'Failed')
      }
    } catch {
      toast.error('Failed to save')
    }
  }

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'department', label: 'Department' },
    { key: 'date', label: 'Created At' },
  ]

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Managers</h1>

      <DataTable
        title="Managers"
        columns={columns}
        data={entries}
        onAddNew={handleAddNew}
        onEdit={handleEdit}
        onDelete={handleDelete}
        emptyState="No managers found"
      />

      <FormModal
        isOpen={isModalOpen}
        title={editingEntry?.manager_id ? 'Edit Manager' : 'Add Manager'}
        fields={[
          { name: 'name', label: 'Name', type: 'text', required: true },
          { name: 'email', label: 'Email', type: 'text', required: true },
          { name: 'password', label: 'Password', type: 'text', required: !editingEntry?.manager_id },
          {
            name: 'department',
            label: 'Department',
            type: 'text',
            placeholder: 'raw_yarn,tpm,dyeing',
            required: true,
          },
        ]}
        initialData={editingEntry || undefined}
        onSubmit={handleSubmit}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}