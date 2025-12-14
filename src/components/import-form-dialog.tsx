"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Button } from "../ui/button"
import { Textarea } from "../ui/textarea"
import { FileJson, Upload } from "lucide-react"
import { toast } from "sonner"
import type { Form } from "../lib/types"

interface ImportFormDialogProps {
  onImport: (form: Form) => void
}

export function ImportFormDialog({ onImport }: ImportFormDialogProps) {
  const [open, setOpen] = useState(false)
  const [jsonInput, setJsonInput] = useState("")

  const handleImport = () => {
    try {
      const parsed = JSON.parse(jsonInput)

      // Validate the structure
      if (!parsed.title || !Array.isArray(parsed.fields)) {
        throw new Error("Invalid form structure")
      }

      const importedForm: Form = {
        id: `form-${Date.now()}`,
        title: parsed.title,
        description: parsed.description || "",
        fields: parsed.fields.map((field: any, index: number) => ({
          ...field,
          id: `field-${Date.now()}-${index}`,
        })),
        settings: parsed.settings || {
          submitButtonText: "Submit",
          successMessage: "Thank you for your submission!",
          allowMultipleSubmissions: true,
          showProgressBar: false,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      onImport(importedForm)
      setOpen(false)
      setJsonInput("")

      toast.success("Form imported", {
        description: "The form has been imported successfully.",
      })
    } catch (error) {
      toast.error("Import failed", {
        description: "Invalid JSON format. Please check your input.",
      })
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result as string
      setJsonInput(content)
    }
    reader.readAsText(file)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <FileJson className="mr-2 h-4 w-4" />
          Import
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Import Form from JSON</DialogTitle>
          <DialogDescription>
            Paste your form JSON or upload a JSON file to import a form into your project.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label htmlFor="file-upload" className="cursor-pointer">
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Click to upload JSON file</p>
              </div>
              <input id="file-upload" type="file" accept=".json" className="hidden" onChange={handleFileUpload} />
            </label>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or paste JSON</span>
            </div>
          </div>

          <Textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder='{"title": "My Form", "fields": [...]}'
            rows={12}
            className="font-mono text-xs"
          />

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleImport} disabled={!jsonInput.trim()}>
              Import Form
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
