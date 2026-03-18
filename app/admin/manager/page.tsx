"use client"

import { useEffect, useState } from "react"
import DataTable, { Column } from "@/components/admin/data-table"
import ItemModal, { FormField } from "@/components/admin/item-modal"
import { getAllItems, addItem, updateItem, deleteItem, seedDemoData, StorageItem } from "@/lib/storage"
import { useToast } from "@/hooks/use-toast"

const COLLECTION = "managers"

const columns: Column[] = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "status", label: "Status", width: "w-24" },
]

const formFields: FormField[] = [
  {
    name: "name",
    label: "Manager Name",
    type: "text",
    placeholder: "John Smith",
    required: true,
  },
  {
    name: "email",
    label: "Email Address",
    type: "email",
    placeholder: "john@factory.com",
    required: true,
  },
  {
    name: "phone",
    label: "Phone Number",
    type: "text",
    placeholder: "555-0101",
    required: true,
  },
  {
    name: "status",
    label: "Status",
    type: "select",
    options: [
      { value: "active", label: "Active" },
      { value: "inactive", label: "Inactive" },
    ],
    required: true,
  },
]

export default function ManagerPage() {
  const [items, setItems] = useState<StorageItem[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<StorageItem | undefined>()
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // Seed demo data on first load
    seedDemoData()
    loadItems()
  }, [])

  const loadItems = () => {
    const data = getAllItems(COLLECTION)
    setItems(data)
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
    if (confirm("Are you sure you want to delete this item?")) {
      deleteItem(COLLECTION, id)
      loadItems()
      toast({
        title: "Success",
        description: "Item deleted successfully",
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
          description: "Item updated successfully",
        })
      } else {
        addItem(COLLECTION, data)
        toast({
          title: "Success",
          description: "Item created successfully",
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
        <h1 className="text-3xl font-bold text-foreground">Managers</h1>
        <p className="text-muted-foreground mt-1">
          Manage factory managers and personnel
        </p>
      </div>

      <DataTable
        columns={columns}
        data={items}
        title="Manager List"
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <ItemModal
        isOpen={isModalOpen}
        title={editingItem ? "Edit Manager" : "Add New Manager"}
        fields={formFields}
        initialData={editingItem}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  )
}
