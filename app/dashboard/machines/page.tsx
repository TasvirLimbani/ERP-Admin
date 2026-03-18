'use client'

import { useEffect, useState } from 'react'
import { DataTable } from '@/components/data-table'
import { FormModal } from '@/components/form-modal'
import { toast } from 'sonner'
import type { MachineEntry } from '@/lib/types'

export default function MachinesPage() {
  const [machines, setMachines] = useState<any[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingMachine, setEditingMachine] = useState<MachineEntry | null>(null)

  const user =
    typeof window !== 'undefined'
      ? JSON.parse(localStorage.getItem('user') || '{}')
      : null

  useEffect(() => {
    loadMachines()
  }, [])

  const loadMachines = async () => {
    try {
      const res = await fetch(
        `/api/machines?company_id=${user?.company_id}`
      )
      const json = await res.json()

      if (json.status) {
        const formatted = json.data.map((item: any) => ({
          id: item.id,
          machine_number: item.machine_number,
          machine_type: item.machine_type,
          status: item.status,
          created_at: item.created_at?.split(' ')[0],
        }))

        setMachines(formatted)
      }
    } catch {
      toast.error('Failed to load machines')
    }
  }

  const handleAddNew = () => {
    setEditingMachine({
      machine_number: '',
      machine_type: '',
      status: 'active',
      company_id: user?.company_id,
    })
    setIsModalOpen(true)
  }

  const handleEdit = (machine: MachineEntry) => {
    setEditingMachine(machine)
    setIsModalOpen(true)
  }

  const handleDelete = async (machine: MachineEntry) => {
    if (!confirm('Delete this machine?')) return

    try {
      const res = await fetch(`/api/machines?id=${machine.id}`, {
        method: 'DELETE',
      })
      const json = await res.json()

      if (json.status) {
        toast.success('Deleted successfully')
        loadMachines()
      } else {
        toast.error(json.message)
      }
    } catch {
      toast.error('Delete failed')
    }
  }

  const handleSubmit = async (data: any) => {
    const payload: MachineEntry = {
      id: editingMachine?.id,
      machine_number: data.machine_number,
      machine_type: data.machine_type,
      status: data.status,
      company_id: user?.company_id,
    }

    try {
      const res = await fetch('/api/machines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const json = await res.json()

      if (json.status) {
        toast.success(editingMachine?.id ? 'Updated' : 'Added')
        setIsModalOpen(false)
        loadMachines()
      } else {
        toast.error(json.message)
      }
    } catch {
      toast.error('Save failed')
    }
  }

  const columns = [
    { key: 'machine_number', label: 'Machine Number' },
    { key: 'machine_type', label: 'Machine Type' },
    {
      key: 'status',
      label: 'Status',
      render: (value: any) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${value === 'active'
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
            }`}
        >
          {value}
        </span>
      ),
    },
    { key: 'created_at', label: 'Date' },
  ]

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Machines</h1>

      <DataTable
        title="Machines"
        columns={columns}
        data={machines}
        onAddNew={handleAddNew}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <FormModal
        isOpen={isModalOpen}
        title={editingMachine?.id ? 'Edit Machine' : 'Add Machine'}
        fields={[
          {
            name: 'machine_number',
            label: 'Machine Number',
            type: 'text',
            required: true,
          },
          {
            name: 'machine_type',
            label: 'Machine Type',
            type: 'select',
            required: true,
            options: [
              'Spinning Machine',
              'Twisting Machine',
              'Warping Machine',
              'Dyeing Machine',
              'Packaging Machine',
              'Cone Winding',
              'Automatic Cone',
            ].map((type) => ({
              label: type,
              value: type,
            })),
          },
          {
            name: 'status',
            label: 'Status',
            type: 'toggle', // IMPORTANT
          },
        ]}
        initialData={editingMachine || undefined}
        onSubmit={handleSubmit}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}