"use client"

import { useEffect, useState } from "react"
import DataTable, { Column } from "@/components/admin/data-table"
import ItemModal, { FormField } from "@/components/admin/item-modal"
import { getAllItems, addItem, updateItem, deleteItem, StorageItem } from "@/lib/storage"
import { useToast } from "@/hooks/use-toast"

const COLLECTION = "tpm"

const columns: Column[] = [
  { key: "date", label: "Date" },
  { key: "machine", label: "Machine" },
  { key: "type", label: "Type" },
  { key: "status", label: "Status" },
]

const formFields: FormField[] = [
  {
    name: "date",
    label: "Date",
    type: "text",
    placeholder: "2024-01-15",
    required: true,
  },
  {
    name: "machine",
    label: "Machine",
    type: "text",
    placeholder: "Machine A-1",
    required: true,
  },
  {
    name: "type",
    label: "Maintenance Type",
    type: "select",
    options: [
      { value: "Preventive", label: "Preventive" },
      { value: "Corrective", label: "Corrective" },
      { value: "Breakdown", label: "Breakdown" },
    ],
    required: true,
  },
  {
    name: "status",
    label: "Status",
    type: "select",
    options: [
      { value: "pending", label: "Pending" },
      { value: "in-progress", label: "In Progress" },
      { value: "completed", label: "Completed" },
    ],
    required: true,
  },
]

export default function TPMPage() {
  const [items, setItems] = useState<StorageItem[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<StorageItem | undefined>()
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadItems()
  }, [])

  const loadItems = () => {
    setItems(getAllItems(COLLECTION))
  }

  const handleAdd = () => {
    setEditingItem(undefined)
    setIsModalOpen(true)
  }

  const handleEdit = (item: StorageItem) => {
    setEditingItem(item)
    setIsModalOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this record?")) {
      deleteItem(COLLECTION, id)
      loadItems()
      toast({
        title: "Success",
        description: "Record deleted successfully",
      })
    }
  }

  const handleSubmit = async (data: Record<string, any>) => {
    setIsLoading(true)
    try {
      if (editingItem) {
        updateItem(COLLECTION, editingItem.id, data)
        toast({
          title: "Success",
          description: "Record updated successfully",
        })
      } else {
        addItem(COLLECTION, data)
        toast({
          title: "Success",
          description: "Record created successfully",
        })
      }
      loadItems()
      setIsModalOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">TPM</h1>
        <p className="text-muted-foreground mt-1">
          Total Productive Maintenance records
        </p>
      </div>

      <DataTable
        columns={columns}
        data={items}
        title="TPM Records"
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <ItemModal
        isOpen={isModalOpen}
        title={editingItem ? "Edit TPM Record" : "Add New TPM Record"}
        fields={formFields}
        initialData={editingItem}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  )
}
