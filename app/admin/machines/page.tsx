"use client"

import { useEffect, useState } from "react"
import DataTable, { Column } from "@/components/admin/data-table"
import ItemModal, { FormField } from "@/components/admin/item-modal"
import { getAllItems, addItem, updateItem, deleteItem, StorageItem } from "@/lib/storage"
import { useToast } from "@/hooks/use-toast"

const COLLECTION = "machines"

const columns: Column[] = [
  { key: "name", label: "Machine Name" },
  { key: "type", label: "Type" },
  { key: "capacity", label: "Capacity" },
  { key: "status", label: "Status", width: "w-24" },
]

const formFields: FormField[] = [
  {
    name: "name",
    label: "Machine Name",
    type: "text",
    placeholder: "Machine A-1",
    required: true,
  },
  {
    name: "type",
    label: "Machine Type",
    type: "select",
    options: [
      { value: "Spinning", label: "Spinning" },
      { value: "Twisting", label: "Twisting" },
      { value: "Other", label: "Other" },
    ],
    required: true,
  },
  {
    name: "capacity",
    label: "Capacity",
    type: "text",
    placeholder: "100kg/hr",
    required: true,
  },
  {
    name: "status",
    label: "Status",
    type: "select",
    options: [
      { value: "operational", label: "Operational" },
      { value: "maintenance", label: "Maintenance" },
      { value: "down", label: "Down" },
    ],
    required: true,
  },
]

export default function MachinesPage() {
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
    if (confirm("Are you sure you want to delete this machine?")) {
      deleteItem(COLLECTION, id)
      loadItems()
      toast({
        title: "Success",
        description: "Machine deleted successfully",
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
          description: "Machine updated successfully",
        })
      } else {
        addItem(COLLECTION, data)
        toast({
          title: "Success",
          description: "Machine created successfully",
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
        <h1 className="text-3xl font-bold text-foreground">Machines</h1>
        <p className="text-muted-foreground mt-1">
          Manage factory machines and equipment
        </p>
      </div>

      <DataTable
        columns={columns}
        data={items}
        title="Machine List"
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <ItemModal
        isOpen={isModalOpen}
        title={editingItem ? "Edit Machine" : "Add New Machine"}
        fields={formFields}
        initialData={editingItem}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  )
}
