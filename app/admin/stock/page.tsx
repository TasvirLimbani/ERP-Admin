"use client"

import { useEffect, useState } from "react"
import DataTable, { Column } from "@/components/admin/data-table"
import ItemModal, { FormField } from "@/components/admin/item-modal"
import { getAllItems, addItem, updateItem, deleteItem, StorageItem } from "@/lib/storage"
import { useToast } from "@/hooks/use-toast"

const COLLECTION = "stock"

const columns: Column[] = [
  { key: "itemCode", label: "Item Code" },
  { key: "description", label: "Description" },
  { key: "quantity", label: "Quantity" },
  { key: "location", label: "Location" },
  { key: "status", label: "Status" },
]

const formFields: FormField[] = [
  {
    name: "itemCode",
    label: "Item Code",
    type: "text",
    placeholder: "STK-001",
    required: true,
  },
  {
    name: "description",
    label: "Description",
    type: "text",
    placeholder: "Cotton Yarn 20",
    required: true,
  },
  {
    name: "quantity",
    label: "Quantity",
    type: "text",
    placeholder: "500kg",
    required: true,
  },
  {
    name: "location",
    label: "Location",
    type: "text",
    placeholder: "A1",
    required: true,
  },
  {
    name: "status",
    label: "Stock Status",
    type: "select",
    options: [
      { value: "in-stock", label: "In Stock" },
      { value: "low-stock", label: "Low Stock" },
      { value: "out-of-stock", label: "Out of Stock" },
    ],
    required: true,
  },
]

export default function StockPage() {
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
    if (confirm("Are you sure you want to delete this stock item?")) {
      deleteItem(COLLECTION, id)
      loadItems()
      toast({
        title: "Success",
        description: "Stock item deleted successfully",
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
          description: "Stock item updated successfully",
        })
      } else {
        addItem(COLLECTION, data)
        toast({
          title: "Success",
          description: "Stock item created successfully",
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
        <h1 className="text-3xl font-bold text-foreground">Stock</h1>
        <p className="text-muted-foreground mt-1">
          Manage warehouse stock and inventory
        </p>
      </div>

      <DataTable
        columns={columns}
        data={items}
        title="Stock List"
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <ItemModal
        isOpen={isModalOpen}
        title={editingItem ? "Edit Stock Item" : "Add New Stock Item"}
        fields={formFields}
        initialData={editingItem}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  )
}
