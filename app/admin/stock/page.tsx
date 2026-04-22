'use client'

import { useState } from 'react'
import { Plus, Trash2, Edit2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'

const inputData = [
  { id: 1, name: 'Stock Item S001', date: '2024-01-15', quantity: 500, status: 'In Stock' },
  { id: 2, name: 'Stock Item S002', date: '2024-01-16', quantity: 750, status: 'In Stock' },
  { id: 3, name: 'Stock Item S003', date: '2024-01-17', quantity: 200, status: 'Low Stock' },
  { id: 4, name: 'Stock Item S004', date: '2024-01-18', quantity: 600, status: 'In Stock' },
  { id: 5, name: 'Stock Item S005', date: '2024-01-19', quantity: 100, status: 'Critical' },
  { id: 6, name: 'Stock Item S006', date: '2024-01-20', quantity: 800, status: 'In Stock' },
]

const outputData = [
  { id: 1, name: 'Stock Item S001', date: '2024-01-15', quantity: 480, status: 'Updated' },
  { id: 2, name: 'Stock Item S002', date: '2024-01-16', quantity: 720, status: 'Updated' },
  { id: 3, name: 'Stock Item S003', date: '2024-01-17', quantity: 180, status: 'Updated' },
  { id: 4, name: 'Stock Item S004', date: '2024-01-18', quantity: 570, status: 'Updated' },
  { id: 5, name: 'Stock Item S005', date: '2024-01-19', quantity: 80, status: 'Pending' },
]

function TablePagination({ data }: { data: any[] }) {
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = Math.ceil(data.length / 5)
  const currentData = data.slice((currentPage - 1) * 5, currentPage * 5)

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-slate-200 dark:border-slate-800">
        <Table>
          <TableHeader>
            <TableRow className="border-slate-200 hover:bg-transparent dark:border-slate-800">
              <TableHead className="text-slate-600 dark:text-slate-400">Item Name</TableHead>
              <TableHead className="text-slate-600 dark:text-slate-400">Date</TableHead>
              <TableHead className="text-slate-600 dark:text-slate-400">Quantity</TableHead>
              <TableHead className="text-slate-600 dark:text-slate-400">Status</TableHead>
              <TableHead className="text-right text-slate-600 dark:text-slate-400">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentData.map((item) => (
              <TableRow key={item.id} className="border-slate-200 dark:border-slate-800">
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.date}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                    item.status === 'In Stock' || item.status === 'Updated'
                      ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                      : item.status === 'Critical'
                      ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                      : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                  }`}>
                    {item.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <button className="rounded p-1 hover:bg-slate-100 dark:hover:bg-slate-800">
                      <Edit2 size={16} />
                    </button>
                    <button className="rounded p-1 hover:bg-slate-100 dark:hover:bg-slate-800">
                      <Trash2 size={16} className="text-red-600" />
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
            <PaginationPrevious onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'} />
            {Array.from({ length: totalPages }, (_, i) => (
              <PaginationItem key={i}>
                <PaginationLink onClick={() => setCurrentPage(i + 1)} isActive={currentPage === i + 1} className="cursor-pointer">{i + 1}</PaginationLink>
              </PaginationItem>
            ))}
            <PaginationNext onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'} />
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}

function StockForm() {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({ name: '', date: '', quantity: '', status: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormData({ name: '', date: '', quantity: '', status: '' })
    setOpen(false)
  }

  return (
    <>
      <Button onClick={() => setOpen(true)} className="gap-2">
        <Plus size={18} /> Add Stock Item
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md border-slate-200 dark:border-slate-800">
          <DialogHeader>
            <DialogTitle>Add New Stock Item</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Item Name</Label>
              <Input placeholder="e.g., Stock Item S001" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label>Date</Label>
              <Input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label>Quantity</Label>
              <Input type="number" placeholder="Enter quantity" value={formData.quantity} onChange={(e) => setFormData({ ...formData, quantity: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="In Stock">In Stock</SelectItem>
                  <SelectItem value="Low Stock">Low Stock</SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                  <SelectItem value="Updated">Updated</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full">Submit</Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default function StockPage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Stock Management</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">Manage inventory and stock levels</p>
      </div>
      <Tabs defaultValue="input" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="input">Input</TabsTrigger>
          <TabsTrigger value="output">Output</TabsTrigger>
        </TabsList>
        <TabsContent value="input" className="space-y-6">
          <Card className="border-slate-200 p-6 dark:border-slate-800">
            <StockForm />
          </Card>
          <TablePagination data={inputData} />
        </TabsContent>
        <TabsContent value="output" className="space-y-6">
          <Card className="border-slate-200 p-6 dark:border-slate-800">
            <StockForm />
          </Card>
          <TablePagination data={outputData} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
