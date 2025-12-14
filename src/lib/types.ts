export type FormFieldType =
  | "text"
  | "email"
  | "number"
  | "textarea"
  | "select"
  | "radio"
  | "checkbox"
  | "date"
  | "time"
  | "datetime"
  | "tel"
  | "url"
  | "file"
  | "range"
  | "color"
  | "rating"
  | "label"
  | "heading"
  | "paragraph"
  | "divider"

export interface FormField {
  id: string
  type: FormFieldType
  label: string
  placeholder?: string
  required?: boolean
  options?: string[]
  value?: string | string[]
  min?: number
  max?: number
  step?: number
  accept?: string // for file input
  multiple?: boolean // for file and select
  helperText?: string
  defaultValue?: string
  conditionalLogic?: {
    enabled: boolean
    fieldId: string // The field to watch
    operator: "equals" | "not_equals" | "contains" | "greater_than" | "less_than"
    value: string
  }
}

export interface FormSettings {
  submitButtonText: string
  successMessage: string
  redirectUrl?: string
  allowMultipleSubmissions: boolean
  showProgressBar: boolean
}

export interface Form {
  id: string
  title: string
  description?: string
  fields: FormField[]
  settings: FormSettings
  createdAt: string
  updatedAt: string
}

export interface FormProject {
  id: string
  name: string
  forms: Form[]
  activeFormId: string
  createdAt: string
  updatedAt: string
}

export interface HistoryState {
  past: Form[]
  present: Form
  future: Form[]
}

export interface FormTemplate {
  id: string
  name: string
  description: string
  category: string
  fields: Omit<FormField, "id">[]
  settings: FormSettings
  isCustom?: boolean
}

export interface FormBuilderProps {
  // Initial data
  initialProject?: FormProject

  // Persistence callbacks
  onSave?: (project: FormProject) => void | Promise<void>
  onChange?: (project: FormProject) => void | Promise<void>
  onAutoSave?: (project: FormProject) => void | Promise<void>

  // Template callbacks
  onSaveTemplate?: (template: FormTemplate) => void | Promise<void>
  onLoadTemplates?: () => FormTemplate[] | Promise<FormTemplate[]>
  onDeleteTemplate?: (templateId: string) => void | Promise<void>

  // Configuration
  config?: {
    autoSaveInterval?: number
    enableAutoSave?: boolean
    enableCommandPalette?: boolean
    enableTemplates?: boolean
    enableExport?: boolean
    enableImport?: boolean
  }

  className?: string
}
