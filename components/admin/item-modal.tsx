"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react"

export interface FormField {
  name: string
  label: string
  type: "text" | "email" | "number" | "textarea" | "select"
  placeholder?: string
  required?: boolean
  options?: { value: string; label: string }[]
}

export interface ItemModalProps {
  isOpen: boolean
  title: string
  fields: FormField[]
  initialData?: Record<string, any>
  onClose: () => void
  onSubmit: (data: Record<string, any>) => void
  isLoading?: boolean
}

export default function ItemModal({
  isOpen,
  title,
  fields,
  initialData,
  onClose,
  onSubmit,
  isLoading = false,
}: ItemModalProps) {
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (initialData) {
      setFormData(initialData)
    } else {
      const newData: Record<string, any> = {}
      fields.forEach((field) => {
        newData[field.name] = ""
      })
      setFormData(newData)
    }
    setErrors({})
  }, [isOpen, initialData, fields])

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, string> = {}

    // Validate required fields
    fields.forEach((field) => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `${field.label} is required`
      }
    })

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    onSubmit(formData)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-card">
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-1 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-foreground disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {fields.map((field) => (
            <div key={field.name} className="space-y-2">
              <Label
                htmlFor={field.name}
                className="text-foreground text-sm font-medium"
              >
                {field.label}
                {field.required && <span className="text-destructive ml-1">*</span>}
              </Label>

              {field.type === "textarea" ? (
                <textarea
                  id={field.name}
                  name={field.name}
                  placeholder={field.placeholder}
                  value={formData[field.name] || ""}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 resize-none h-20"
                />
              ) : field.type === "select" ? (
                <select
                  id={field.name}
                  name={field.name}
                  value={formData[field.name] || ""}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                >
                  <option value="">Select {field.label}</option>
                  {field.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : (
                <Input
                  id={field.name}
                  name={field.name}
                  type={field.type}
                  placeholder={field.placeholder}
                  value={formData[field.name] || ""}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="bg-background border-border text-foreground placeholder:text-muted-foreground"
                />
              )}

              {errors[field.name] && (
                <p className="text-destructive text-sm">{errors[field.name]}</p>
              )}
            </div>
          ))}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              variant="outline"
              className="flex-1 border-border text-foreground hover:bg-secondary disabled:opacity-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50"
            >
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
