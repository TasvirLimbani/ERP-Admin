"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, Edit, Trash2, Plus } from "lucide-react"
import { useState } from "react"

export interface Column {
  key: string
  label: string
  width?: string
}

export interface DataTableProps {
  columns: Column[]
  data: Record<string, any>[]
  title: string
  onAdd: () => void
  onEdit: (item: Record<string, any>) => void
  onDelete: (id: string) => void
  itemsPerPage?: number
}

export default function DataTable({
  columns,
  data,
  title,
  onAdd,
  onEdit,
  onDelete,
  itemsPerPage = 10,
}: DataTableProps) {
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.ceil(data.length / itemsPerPage)
  const startIdx = (currentPage - 1) * itemsPerPage
  const paginatedData = data.slice(startIdx, startIdx + itemsPerPage)

  const formatValue = (value: any) => {
    if (value === null || value === undefined) return "-"
    if (typeof value === "boolean") return value ? "Yes" : "No"
    if (typeof value === "object") return JSON.stringify(value)
    return String(value)
  }

  return (
    <Card className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        <Button
          onClick={onAdd}
          className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
          size="sm"
        >
          <Plus className="w-4 h-4" />
          Add New
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider ${
                    col.width || ""
                  }`}
                >
                  {col.label}
                </th>
              ))}
              <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  No data available. Click "Add New" to create an item.
                </td>
              </tr>
            ) : (
              paginatedData.map((item, idx) => (
                <tr
                  key={item.id || idx}
                  className="border-b border-border hover:bg-secondary/50 transition-colors"
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3 text-sm text-foreground">
                      {formatValue(item[col.key])}
                    </td>
                  ))}
                  <td className="px-4 py-3 text-right flex items-center justify-end gap-2">
                    <Button
                      onClick={() => onEdit(item)}
                      variant="ghost"
                      size="sm"
                      className="text-primary hover:text-primary hover:bg-primary/10"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => onDelete(item.id || idx)}
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {startIdx + 1} to{" "}
            {Math.min(startIdx + itemsPerPage, data.length)} of {data.length}{" "}
            items
          </p>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              variant="outline"
              size="sm"
              className="border-border text-foreground disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm text-muted-foreground px-2">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              variant="outline"
              size="sm"
              className="border-border text-foreground disabled:opacity-50"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </Card>
  )
}
