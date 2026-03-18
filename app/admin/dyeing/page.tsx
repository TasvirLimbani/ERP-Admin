"use client"

import { useEffect, useState } from "react"
import DataTable, { Column } from "@/components/admin/data-table"
import ItemModal, { FormField } from "@/components/admin/item-modal"
import { getAllItems, addItem, updateItem, deleteItem, StorageItem } from "@/lib/storage"
import { useToast } from "@/hooks/use-toast"

const COLLECTION = "dyeing"

const columns: Column[] = [
  { key: "batchId", label: "Batch ID" },
  { key: "yarnType", label: "Yarn Type" },
  { key: "color", label: "Color" },
  { key: "quantity", label: "Quantity" },
  { key: "status", label: "Status" },
]

const formFields: FormField[] = [
  {
    name: "batchId",
    label: "Batch ID",
    type: "text",
    placeholder: "DYE-001",
    required: true,
  },
  {
    name: "yarnType",
    label: "Yarn Type",
    type: "select",
    options: [
      { value: "Cotton", label: "Cotton" },
      { value: "Polyester", label: "Polyester" },
      { value: "Blend", label: "Blend" },
    ],
    required: true,
  },
  {
    name: "color",
    label: "Color",
    type: "text",
    placeholder: "Blue",
    required: true,
  },
  {
    name: "quantity",
    label: "Quantity",
    type: "text",
    placeholder: "100kg",
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

export default function DyeingPage() {
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
    if (confirm("Are you sure you want to delete this batch?")) {
      deleteItem(COLLECTION, id)
      loadItems()
      toast({
        title: "Success",
        description: "Batch deleted successfully",
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
          description: "Batch updated successfully",
        })
      } else {
        addItem(COLLECTION, data)
        toast({
          title: "Success",
          description: "Batch created successfully",
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
        <h1 className="text-3xl font-bold text-foreground">Dyeing</h1>
        <p className="text-muted-foreground mt-1">
          Manage dyeing process and batches
        </p>
      </div>

      <DataTable
        columns={columns}
        data={items}
        title="Dyeing Batches"
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <ItemModal
        isOpen={isModalOpen}
        title={editingItem ? "Edit Dyeing Batch" : "Add New Dyeing Batch"}
        fields={formFields}
        initialData={editingItem}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  )
}
