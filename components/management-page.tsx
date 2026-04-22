'use client'

import { useState } from 'react'
import { Plus, Trash2, Edit2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

interface ManagementPageProps {
  title: string
  description: string
  inputData: any[]
  outputData: any[]
  columns: string[]
  formFields: React.ReactNode
  onSubmit?: (data: any) => void
}

function TableWithPagination({ 
  data, 
  columns, 
  pageSize = 5 
}: { 
  data: any[]
  columns: string[]
  pageSize?: number 
}) {
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = Math.ceil(data.length / pageSize)
  const startIdx = (currentPage - 1) * pageSize
  const endIdx = startIdx + pageSize
  const currentData = data.slice(startIdx, endIdx)

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-slate-200 dark:border-slate-800">
        <Table>
          <TableHeader>
            <TableRow className="border-slate-200 hover:bg-transparent dark:border-slate-800">
              {columns.map((col) => (
                <TableHead key={col} className="text-slate-600 dark:text-slate-400">
                  {col}
                </TableHead>
              ))}
              <TableHead className="text-right text-slate-600 dark:text-slate-400">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentData.map((item, idx) => (
              <TableRow key={idx} className="border-slate-200 dark:border-slate-800">
                {columns.map((col) => {
                  const value = item[col.toLowerCase().replace(/\s+/g, '')]
                  return (
                    <TableCell key={col} className="text-slate-900 dark:text-slate-50">
                      {col === 'Status' ? (
                        <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                          value === 'Active' || value === 'Completed'
                            ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                            : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                        }`}>
                          {value}
                        </span>
                      ) : (
                        value
                      )}
                    </TableCell>
                  )
                })}
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <button className="rounded p-1 hover:bg-slate-100 dark:hover:bg-slate-800">
                      <Edit2 size={16} className="text-slate-600 dark:text-slate-400" />
                    </button>
                    <button className="rounded p-1 hover:bg-slate-100 dark:hover:bg-slate-800">
                      <Trash2 size={16} className="text-red-600 dark:text-red-400" />
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
            <PaginationPrevious
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
            />
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const pageNum = i + 1
              return (
                <PaginationItem key={pageNum}>
                  <PaginationLink
                    onClick={() => setCurrentPage(pageNum)}
                    isActive={currentPage === pageNum}
                    className="cursor-pointer"
                  >
                    {pageNum}
                  </PaginationLink>
                </PaginationItem>
              )
            })}
            {totalPages > 5 && <PaginationEllipsis />}
            <PaginationNext
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
            />
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}

export function ManagementPage({
  title,
  description,
  inputData,
  outputData,
  columns,
  formFields,
}: ManagementPageProps) {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">{title}</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">{description}</p>
      </div>

      <Tabs defaultValue="input" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="input">Input</TabsTrigger>
          <TabsTrigger value="output">Output</TabsTrigger>
        </TabsList>

        <TabsContent value="input" className="space-y-6">
          <Card className="border-slate-200 p-6 dark:border-slate-800">
            {formFields}
          </Card>
          <TableWithPagination data={inputData} columns={columns} />
        </TabsContent>

        <TabsContent value="output" className="space-y-6">
          <Card className="border-slate-200 p-6 dark:border-slate-800">
            {formFields}
          </Card>
          <TableWithPagination data={outputData} columns={columns} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
