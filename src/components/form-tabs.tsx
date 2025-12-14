"use client"

import { useState } from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { X, Plus, Edit2, Check, Copy } from "lucide-react"
import { cn } from "../lib/utils"
import type { Form } from "../lib/types"

interface FormTabsProps {
  forms: Form[]
  activeFormId: string
  onSelectForm: (formId: string) => void
  onAddForm: () => void
  onDeleteForm: (formId: string) => void
  onRenameForm: (formId: string, newTitle: string) => void
  onDuplicateForm: (formId: string) => void
}

export function FormTabs({
  forms,
  activeFormId,
  onSelectForm,
  onAddForm,
  onDeleteForm,
  onRenameForm,
  onDuplicateForm,
}: FormTabsProps) {
  const [editingFormId, setEditingFormId] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState("")

  const startEditing = (form: Form) => {
    setEditingFormId(form.id)
    setEditingTitle(form.title)
  }

  const finishEditing = () => {
    if (editingFormId && editingTitle.trim()) {
      onRenameForm(editingFormId, editingTitle.trim())
    }
    setEditingFormId(null)
    setEditingTitle("")
  }

  const cancelEditing = () => {
    setEditingFormId(null)
    setEditingTitle("")
  }

  return (
    <div className="flex items-center gap-2 border-b border-border bg-card px-4 overflow-x-auto scrollbar-hide touch-pan-x">
      {forms.map((form) => (
        <div
          key={form.id}
          className={cn(
            "group relative flex items-center gap-2 px-4 py-3 border-b-2 transition-colors shrink-0",
            activeFormId === form.id
              ? "border-primary text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50",
          )}
        >
          {editingFormId === form.id ? (
            <div className="flex items-center gap-2">
              <Input
                value={editingTitle}
                onChange={(e) => setEditingTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") finishEditing()
                  if (e.key === "Escape") cancelEditing()
                }}
                className="h-7 w-32 text-sm"
                autoFocus
                onBlur={finishEditing}
              />
              <Button size="icon" variant="ghost" className="h-6 w-6" onClick={finishEditing}>
                <Check className="h-3 w-3" />
              </Button>
            </div>
          ) : (
            <>
              <button onClick={() => onSelectForm(form.id)} className="text-sm font-medium whitespace-nowrap">
                {form.title}
              </button>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6"
                  onClick={(e) => {
                    e.stopPropagation()
                    startEditing(form)
                  }}
                  title="Rename form"
                >
                  <Edit2 className="h-3 w-3" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDuplicateForm(form.id)
                  }}
                  title="Duplicate form"
                >
                  <Copy className="h-3 w-3" />
                </Button>
                {forms.length > 1 && (
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6 hover:bg-destructive/10 hover:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation()
                      if (confirm(`Delete form "${form.title}"?`)) {
                        onDeleteForm(form.id)
                      }
                    }}
                    title="Delete form"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
      ))}
      <Button size="sm" variant="ghost" onClick={onAddForm} className="ml-2 my-2 gap-2">
        <Plus className="h-4 w-4" />
        New Form
      </Button>
    </div>
  )
}
