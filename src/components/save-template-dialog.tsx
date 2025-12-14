"use client"

import { useState } from "react"
import type { Form, FormTemplate } from "../lib/types"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Textarea } from "../ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Save } from "lucide-react"

interface SaveTemplateDialogProps {
  form: Form
  onSave: (template: FormTemplate) => void
}

export function SaveTemplateDialog({ form, onSave }: SaveTemplateDialogProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState(form.title)
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState<string>("General")

  const handleSave = () => {
    if (!name.trim()) return

    const template: FormTemplate = {
      id: `custom-${Date.now()}`,
      name: name.trim(),
      description: description.trim(),
      category,
      fields: form.fields.map((field) => {
        const { id, ...fieldWithoutId } = field
        return fieldWithoutId
      }),
      settings: form.settings,
      isCustom: true,
    }

    onSave(template)
    setOpen(false)
    setName(form.title)
    setDescription("")
    setCategory("General")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Save className="mr-2 h-4 w-4" />
          Save as Template
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save as Template</DialogTitle>
          <DialogDescription>
            Save this form as a reusable template that you can use in future projects
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="template-name">Template Name</Label>
            <Input
              id="template-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Customer Feedback Form"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="template-description">Description</Label>
            <Textarea
              id="template-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what this template is for..."
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="template-category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="template-category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="General">General</SelectItem>
                <SelectItem value="Events">Events</SelectItem>
                <SelectItem value="Feedback">Feedback</SelectItem>
                <SelectItem value="HR">HR</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
                <SelectItem value="Sales">Sales</SelectItem>
                <SelectItem value="Support">Support</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!name.trim()}>
            Save Template
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
