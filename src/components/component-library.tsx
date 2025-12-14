"use client"

import type { FormFieldType } from "../lib/types"
import { Button } from "../ui/button"
import { ScrollArea } from "../ui/scroll-area"
import {
  Type,
  Mail,
  Hash,
  AlignLeft,
  List,
  Circle,
  CheckSquare,
  Calendar,
  Tag,
  Heading1,
  FileText,
  Minus,
  Phone,
  Link2,
  Upload,
  Sliders,
  Palette,
  Star,
  Clock,
} from "lucide-react"

interface ComponentLibraryProps {
  onAddField: (type: FormFieldType) => void
}

const componentCategories = [
  {
    name: "Basic Inputs",
    components: [
      { type: "text" as FormFieldType, icon: Type, label: "Text Input", description: "Single line text" },
      { type: "email" as FormFieldType, icon: Mail, label: "Email", description: "Email address" },
      { type: "number" as FormFieldType, icon: Hash, label: "Number", description: "Numeric input" },
      { type: "tel" as FormFieldType, icon: Phone, label: "Phone", description: "Phone number" },
      { type: "url" as FormFieldType, icon: Link2, label: "URL", description: "Website link" },
      { type: "textarea" as FormFieldType, icon: AlignLeft, label: "Text Area", description: "Multi-line text" },
    ],
  },
  {
    name: "Selection",
    components: [
      { type: "select" as FormFieldType, icon: List, label: "Dropdown", description: "Select from options" },
      { type: "radio" as FormFieldType, icon: Circle, label: "Radio Button", description: "Single choice" },
      { type: "checkbox" as FormFieldType, icon: CheckSquare, label: "Checkbox", description: "Multiple choices" },
    ],
  },
  {
    name: "Date & Time",
    components: [
      { type: "date" as FormFieldType, icon: Calendar, label: "Date Picker", description: "Select date" },
      { type: "time" as FormFieldType, icon: Clock, label: "Time Picker", description: "Select time" },
      { type: "datetime" as FormFieldType, icon: Calendar, label: "Date & Time", description: "Date and time" },
    ],
  },
  {
    name: "Advanced",
    components: [
      { type: "file" as FormFieldType, icon: Upload, label: "File Upload", description: "Upload files" },
      { type: "range" as FormFieldType, icon: Sliders, label: "Slider", description: "Range selector" },
      { type: "color" as FormFieldType, icon: Palette, label: "Color Picker", description: "Choose color" },
      { type: "rating" as FormFieldType, icon: Star, label: "Rating", description: "Star rating" },
    ],
  },
  {
    name: "Layout",
    components: [
      { type: "label" as FormFieldType, icon: Tag, label: "Label", description: "Text label" },
      { type: "heading" as FormFieldType, icon: Heading1, label: "Heading", description: "Section heading" },
      { type: "paragraph" as FormFieldType, icon: FileText, label: "Paragraph", description: "Instruction text" },
      { type: "divider" as FormFieldType, icon: Minus, label: "Divider", description: "Section separator" },
    ],
  },
]

export function ComponentLibrary({ onAddField }: ComponentLibraryProps) {
  return (
    <ScrollArea className="h-full">
      <div className="space-y-6 pr-4">
        {componentCategories.map((category) => (
          <div key={category.name}>
            <h3 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              {category.name}
            </h3>
            <div className="space-y-2">
              {category.components.map((component) => (
                <Button
                  key={component.type}
                  variant="outline"
                  className="w-full justify-start gap-3 h-auto py-3 min-h-[44px] bg-transparent hover:bg-accent hover:border-primary/50 transition-all"
                  onClick={() => onAddField(component.type)}
                >
                  <component.icon className="h-4 w-4 shrink-0" />
                  <div className="flex flex-col items-start gap-0.5">
                    <span className="text-sm font-medium">{component.label}</span>
                    <span className="text-xs text-muted-foreground">{component.description}</span>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}
