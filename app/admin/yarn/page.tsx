'use client'

import { useEffect, useState } from 'react'
import { Edit2, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination'

interface YarnData {
    id: string
    company_id: string
    admin_id: string
    supplier_name: string
    batch_id: string
    yarn_type: string
    yarn_sub_type: string
    weight: string
    created_at: string
}

interface FormData {
    supplier_name: string
    batch_id: string
    yarn_type: string
    yarn_sub_type: string
    weight: string
}

function TablePagination({
    data,
    currentPage,
    totalPages,
    onPageChange,
    onEdit,
    onDelete,
}: {
    data: YarnData[]
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
    onEdit: (item: YarnData) => void
    onDelete: (item: YarnData) => void
}) {
    return (
        <div className="space-y-4">
            <div className="rounded-lg border border-slate-200 dark:border-slate-800">
                <Table>
                    <TableHeader>
                        <TableRow className="border-slate-200 hover:bg-transparent dark:border-slate-800">
                            <TableHead className="text-slate-600 dark:text-slate-400">ID</TableHead>
                            <TableHead className="text-slate-600 dark:text-slate-400">Supplier Name</TableHead>
                            <TableHead className="text-slate-600 dark:text-slate-400">Batch ID</TableHead>
                            <TableHead className="text-slate-600 dark:text-slate-400">Yarn Type</TableHead>
                            <TableHead className="text-slate-600 dark:text-slate-400">Yarn Sub Type</TableHead>
                            <TableHead className="text-slate-600 dark:text-slate-400">Weight (kg)</TableHead>
                            <TableHead className="text-right text-slate-600 dark:text-slate-400">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.length > 0 ? (
                            data.map((item) => (
                                <TableRow key={item.id} className="border-slate-200 dark:border-slate-800">
                                    <TableCell className="font-medium text-slate-900 dark:text-slate-50">{item.id}</TableCell>
                                    <TableCell className="text-slate-600 dark:text-slate-400">{item.supplier_name}</TableCell>
                                    <TableCell className="text-slate-600 dark:text-slate-400">{item.batch_id}</TableCell>
                                    <TableCell className="text-slate-600 dark:text-slate-400">{item.yarn_type}</TableCell>
                                    <TableCell className="text-slate-600 dark:text-slate-400">{item.yarn_sub_type}</TableCell>
                                    <TableCell className="text-slate-600 dark:text-slate-400">{item.weight}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => onEdit(item)} className="rounded p-1 hover:bg-slate-100 dark:hover:bg-slate-800">
                                                <Edit2 size={16} className="text-slate-600 dark:text-slate-400" />
                                            </button>
                                            <button onClick={() => onDelete(item)} className="rounded p-1 hover:bg-slate-100 dark:hover:bg-slate-800">
                                                <Trash2 size={16} className="text-red-600 dark:text-red-400" />
                                            </button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} className="py-8 text-center text-slate-500">
                                    No yarn data found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {totalPages > 1 && (
                <Pagination>
                    <PaginationContent>
                        <PaginationPrevious
                            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                            className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                        {Array.from({ length: totalPages }, (_, i) => (
                            <PaginationItem key={i}>
                                <PaginationLink
                                    onClick={() => onPageChange(i + 1)}
                                    isActive={currentPage === i + 1}
                                    className="cursor-pointer"
                                >
                                    {i + 1}
                                </PaginationLink>
                            </PaginationItem>
                        ))}
                        <PaginationNext
                            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                            className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                    </PaginationContent>
                </Pagination>
            )}
        </div>
    )
}

function YarnForm({ onAddYarn, editingItem, onEditClose }: { onAddYarn: () => void, editingItem?: YarnData | null, onEditClose?: () => void }) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState<FormData>({
        supplier_name: '',
        batch_id: '',
        yarn_type: '',
        yarn_sub_type: '',
        weight: '',
    })

    useEffect(() => {
        if (editingItem) {
            setOpen(true)
            setFormData({
                supplier_name: editingItem.supplier_name,
                batch_id: editingItem.batch_id,
                yarn_type: editingItem.yarn_type,
                yarn_sub_type: editingItem.yarn_sub_type,
                weight: editingItem.weight,
            })
        }
    }, [editingItem])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const user = localStorage.getItem('user')
            if (!user) {
                toast.error('User not found')
                return
            }

            const userData = JSON.parse(user)

            if (editingItem) {
                const payload = {
                    id: editingItem.id,
                    supplier_name: formData.supplier_name,
                    batch_id: formData.batch_id,
                    yarn_type: formData.yarn_type,
                    yarn_sub_type: formData.yarn_sub_type,
                    weight: parseFloat(formData.weight),
                }

                const res = await fetch('/api/yarn/manage', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload),
                })

                const data = await res.json()

                if (data.status) {
                    setFormData({
                        supplier_name: '',
                        batch_id: '',
                        yarn_type: '',
                        yarn_sub_type: '',
                        weight: '',
                    })
                    setOpen(false)
                    setTimeout(() => {
                        onAddYarn()
                    }, 500)
                    toast.success('Yarn updated successfully')
                    if (onEditClose) {
                        onEditClose()
                    }
                } else {
                    toast.error(data.message || 'Failed to update yarn')
                }
            } else {
                const payload = {
                    company_id: userData.company_id,
                    admin_id: userData.id,
                    supplier_name: formData.supplier_name,
                    batch_id: formData.batch_id,
                    yarn_type: formData.yarn_type,
                    yarn_sub_type: formData.yarn_sub_type,
                    weight: parseFloat(formData.weight),
                }

                const res = await fetch('/api/yarn', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload),
                })

                const data = await res.json()

                if (data.status) {
                    setFormData({
                        supplier_name: '',
                        batch_id: '',
                        yarn_type: '',
                        yarn_sub_type: '',
                        weight: '',
                    })
                    setOpen(false)
                    setTimeout(() => {
                        onAddYarn()
                    }, 500)
                    toast.success('Yarn added successfully')
                } else {
                    toast.error(data.message || 'Failed to add yarn')
                }
            }
        } catch (error) {
            console.error('Error:', error)
            toast.error('Error processing request')
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            {!editingItem && (
                <Button onClick={() => setOpen(true)} className="gap-2">
                    <Plus size={18} />
                    Add Yarn
                </Button>
            )}

            <Dialog
                open={open}
                onOpenChange={(isOpen) => {
                    setOpen(isOpen)
                    if (!isOpen && editingItem && onEditClose) {
                        onEditClose()
                    }
                }}
            >
                <DialogContent className="max-w-md border-slate-200 dark:border-slate-800">
                    <DialogHeader>
                        <DialogTitle>{editingItem ? 'Edit Yarn' : 'Add New Yarn'}</DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="supplier_name">Supplier Name</Label>
                            <Input
                                id="supplier_name"
                                placeholder="e.g., Shree Radhe Yarn"
                                value={formData.supplier_name}
                                onChange={(e) => setFormData({ ...formData, supplier_name: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="batch_id">Batch ID</Label>
                            <Input
                                id="batch_id"
                                placeholder="e.g., BATCH-1"
                                value={formData.batch_id}
                                onChange={(e) => setFormData({ ...formData, batch_id: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="yarn_type">Yarn Type</Label>
                            <Input
                                id="yarn_type"
                                placeholder="e.g., Cotton"
                                value={formData.yarn_type}
                                onChange={(e) => setFormData({ ...formData, yarn_type: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="yarn_sub_type">Yarn Sub Type</Label>
                            <Input
                                id="yarn_sub_type"
                                placeholder="e.g., CO-1"
                                value={formData.yarn_sub_type}
                                onChange={(e) => setFormData({ ...formData, yarn_sub_type: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="weight">Weight (kg)</Label>
                            <Input
                                id="weight"
                                type="number"
                                placeholder="e.g., 600.00"
                                value={formData.weight}
                                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                                step="0.01"
                                required
                            />
                        </div>

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? (editingItem ? 'Updating...' : 'Adding...') : (editingItem ? 'Update Yarn' : 'Add Yarn')}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default function YarnPage() {
    const [yarnData, setYarnData] = useState<YarnData[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [companyId, setCompanyId] = useState<string | null>(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [editingItem, setEditingItem] = useState<YarnData | null>(null)
    const [deletingItem, setDeletingItem] = useState<YarnData | null>(null)
    const [deleteLoading, setDeleteLoading] = useState(false)

    const fetchYarnData = async (id: string, page: number) => {
        try {
            setLoading(true)
            setError(null)

            const res = await fetch(`/api/yarn?company_id=${id}&current_page=${page}&_t=${Date.now()}`, {
                cache: 'no-store',
                headers: {
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': '0',
                },
            })
            const result = await res.json()

            const yarnList: YarnData[] = Array.isArray(result?.data?.list)
                ? result.data.list
                : Array.isArray(result?.data)
                    ? result.data
                    : []

            if (result.status && yarnList.length >= 0) {
                setYarnData(yarnList)
                setTotalPages(result?.data?.pagination?.total_pages || 1)
                setCurrentPage(result?.data?.pagination?.current_page || page)
            } else {
                setYarnData([])
                setTotalPages(1)
                setError(result.message || 'Failed to fetch yarn data')
            }
        } catch (err) {
            setError('Error fetching yarn data')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async () => {
        if (!deletingItem) return

        setDeleteLoading(true)
        try {
            const res = await fetch(`/api/yarn/manage?id=${deletingItem.id}`, {
                method: 'DELETE',
            })

            const data = await res.json()

            if (data.status) {
                toast.success('Yarn deleted successfully')
                setDeletingItem(null)
                setTimeout(() => {
                    if (companyId) {
                        fetchYarnData(companyId, currentPage)
                    }
                }, 500)
            } else {
                toast.error(data.message || 'Failed to delete yarn')
            }
        } catch (error) {
            console.error('Error deleting yarn:', error)
            toast.error('Error deleting yarn')
        } finally {
            setDeleteLoading(false)
        }
    }

    useEffect(() => {
        const user = localStorage.getItem('user')
        if (user) {
            const userData = JSON.parse(user)
            setCompanyId(userData.company_id)
        }
    }, [])

    useEffect(() => {
        if (companyId) {
            fetchYarnData(companyId, currentPage)
        }
    }, [companyId, currentPage])

    return (
        <div className="space-y-6 p-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">Yarn Management</h1>
                <p className="mt-2 text-slate-600 dark:text-slate-400">Manage yarn batches and suppliers</p>
            </div>

            <div className="flex items-center justify-end gap-4">
                <YarnForm
                    onAddYarn={() => companyId && fetchYarnData(companyId, currentPage)}
                    editingItem={editingItem}
                    onEditClose={() => setEditingItem(null)}
                />
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="flex flex-col items-center gap-3">
                        <Spinner className="size-8" />
                        <p className="text-slate-600 dark:text-slate-400">Loading yarn data...</p>
                    </div>
                </div>
            ) : error ? (
                <p className="text-center text-red-600">{error}</p>
            ) : (
                <TablePagination
                    data={yarnData}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    onEdit={setEditingItem}
                    onDelete={setDeletingItem}
                />
            )}

            <Dialog open={!!deletingItem} onOpenChange={(open) => !open && setDeletingItem(null)}>
                <DialogContent className="max-w-sm border-slate-200 dark:border-slate-800">
                    <DialogHeader>
                        <DialogTitle>Confirm Delete</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                        <p className="text-slate-600 dark:text-slate-400">
                            Are you sure you want to delete <strong>{deletingItem?.supplier_name}</strong> (Batch: {deletingItem?.batch_id})?
                        </p>
                        <p className="text-sm text-red-600 dark:text-red-400">
                            This action cannot be undone.
                        </p>
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setDeletingItem(null)}
                            disabled={deleteLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            className="bg-red-600 hover:bg-red-700"
                            onClick={handleDelete}
                            disabled={deleteLoading}
                        >
                            {deleteLoading ? 'Deleting...' : 'Delete'}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
