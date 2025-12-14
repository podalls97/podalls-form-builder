// Main components
export { FormBuilder } from './components/form-builder'
export { UserFormView } from './components/user-form-view'

// Types
export type {
  FormFieldType,
  FormField,
  Form,
  FormProject,
  FormSettings,
  FormTemplate,
  FormBuilderProps,
  HistoryState
} from './lib/types'

// Templates
export { formTemplates as builtInTemplates } from './lib/templates'

// Utilities
export { cn } from './lib/utils'
