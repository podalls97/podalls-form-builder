"use client"

import type { FormField } from "../lib/types"
import { Card } from "../ui/card"
import { Button } from "../ui/button"
import { cn } from "../lib/utils"
import { Trash2, ChevronUp, ChevronDown, Copy } from "lucide-react"
import { FormFieldRenderer } from "./form-field-renderer"

interface FormPreviewProps {
  fields: FormField[]
  selectedFieldId: string | null
  onSelectField: (id: string) => void
  onDeleteField: (id: string) => void
  onDuplicateField: (id: string) => void
  onMoveField: (id: string, direction: "up" | "down") => void
  previewMode: boolean
}

export function FormPreview({
  fields,
  selectedFieldId,
  onSelectField,
  onDeleteField,
  onDuplicateField,
  onMoveField,
  previewMode,
}: FormPreviewProps) {
  return (
    <div className="space-y-4">
      {fields.map((field, index) => (
        <Card
          key={field.id}
          className={cn(
            "relative p-4 transition-all",
            !previewMode && "cursor-pointer hover:border-primary/50 hover:shadow-sm",
            selectedFieldId === field.id && !previewMode && "border-primary ring-2 ring-primary/20 shadow-md",
          )}
          onClick={() => !previewMode && onSelectField(field.id)}
        >
          <FormFieldRenderer field={field} previewMode={previewMode} />

          {!previewMode && selectedFieldId === field.id && (
            <div className="absolute right-2 top-2 flex gap-1 bg-background/80 backdrop-blur-sm rounded-md p-1 border border-border shadow-sm">
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7"
                onClick={(e) => {
                  e.stopPropagation()
                  onMoveField(field.id, "up")
                }}
                disabled={index === 0}
                title="Move up"
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7"
                onClick={(e) => {
                  e.stopPropagation()
                  onMoveField(field.id, "down")
                }}
                disabled={index === fields.length - 1}
                title="Move down"
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7"
                onClick={(e) => {
                  e.stopPropagation()
                  onDuplicateField(field.id)
                }}
                title="Duplicate field"
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7 text-destructive hover:bg-destructive/10 hover:text-destructive"
                onClick={(e) => {
                  e.stopPropagation()
                  onDeleteField(field.id)
                }}
                title="Delete field"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </Card>
      ))}
    </div>
  )
}
