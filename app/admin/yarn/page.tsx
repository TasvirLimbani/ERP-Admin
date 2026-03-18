"use client"

import { useEffect, useState } from "react"
import DataTable, { Column } from "@/components/admin/data-table"
import ItemModal, { FormField } from "@/components/admin/item-modal"
import { getAllItems, addItem, updateItem, deleteItem, StorageItem } from "@/lib/storage"
import { useToast } from "@/hooks/use-toast"

const COLLECTION = "yarn"

const columns: Column[] = [
  { key: "name", label: "Name" },
  { key: "type", label: "Type" },
  { key: "count", label: "Count" },
  { key: "color", label: "Color" },
  { key: "quantity", label: "Quantity" },
]

const formFields: FormField[] = [
  {
    name: "name",
    label: "Yarn Name",
    type: "text",
    placeholder: "Cotton Yarn 20",
    required: true,
  },
  {
    name: "type",
    label: "Yarn Type",
    type: "select",
    options: [
      { value: "Cotton", label: "Cotton" },
      { value: "Polyester", label: "Polyester" },
      { value: "Blend", label: "Blend" },
      { value: "Wool", label: "Wool" },
    ],
    required: true,
  },
  {
    name: "count",
    label: "Count",
    type: "text",
    placeholder: "20",
    required: true,
  },
  {
    name: "color",
    label: "Color",
    type: "text",
    placeholder: "White",
    required: true,
  },
  {
    name: "quantity",
    label: "Quantity",
    type: "text",
    placeholder: "500",
    required: true,
  },
]

export default function YarnPage() {
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
    if (confirm("Are you sure you want to delete this yarn?")) {
      deleteItem(COLLECTION, id)
      loadItems()
      toast({
        title: "Success",
        description: "Yarn deleted successfully",
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
          description: "Yarn updated successfully",
        })
      } else {
        addItem(COLLECTION, data)
        toast({
          title: "Success",
          description: "Yarn created successfully",
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
        <h1 className="text-3xl font-bold text-foreground">Yarn</h1>
        <p className="text-muted-foreground mt-1">
          Manage yarn inventory and variants
        </p>
      </div>

      <DataTable
        columns={columns}
        data={items}
        title="Yarn List"
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <ItemModal
        isOpen={isModalOpen}
        title={editingItem ? "Edit Yarn" : "Add New Yarn"}
        fields={formFields}
        initialData={editingItem}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  )
}
