# podalls-form-builder

A production-ready, feature-rich form builder component for Next.js 13+ App Router. Built with React 19, TypeScript, Tailwind CSS, and shadcn/ui.

## Features

- 🎨 **20+ Field Types** - Text, email, number, textarea, select, radio, checkbox, date, time, datetime, tel, url, file, range, color, rating, label, heading, paragraph, divider
- 🎯 **Drag-and-Drop Interface** - Intuitive form building experience
- 📱 **Mobile Responsive** - Optimized for desktop and mobile with bottom sheets
- ⌨️ **Keyboard Shortcuts** - Command palette (Cmd+K), Save (Cmd+S), Undo (Cmd+Z), Redo (Cmd+Shift+Z)
- 🎨 **4 Built-in Templates** - Contact form, event registration, survey, job application
- 🔧 **Conditional Field Logic** - Show/hide fields based on other field values
- 📤 **JSON Import/Export** - Share and backup forms as JSON
- 🌗 **Dark Mode Support** - Automatic dark mode theming
- ♿ **Accessible** - Built with Radix UI primitives
- 🔄 **Undo/Redo** - Full history management
- ⚙️ **Highly Configurable** - Customize behavior via props
- 💾 **Bring Your Own Storage** - No opinionated persistence layer

## Installation

```bash
npm install podalls-form-builder
# or
pnpm add podalls-form-builder
# or
bun add podalls-form-builder
```

## Quick Start

### 1. Import Styles

Add the package styles to your root CSS file:

```css
/* app/globals.css or src/app/globals.css */
@import "tailwindcss";
@import "podalls-form-builder/styles";

@source "../../node_modules/podalls-form-builder/dist";
```

**Alternative:** If you still use a config file (legacy compatibility):

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/podalls-form-builder/dist/**/*.{js,jsx,ts,tsx}'
  ]
}

export default config
```

### 2. Use the Component

```tsx
// app/builder/page.tsx
'use client'

import { FormBuilder } from 'podalls-form-builder'
import type { FormProject } from 'podalls-form-builder'

export default function FormBuilderPage() {
  return (
    <FormBuilder
      onSave={async (project) => {
        console.log('Save:', project)
        // Save to your database, API, etc.
      }}
    />
  )
}
```

## Examples

### Basic Usage

```tsx
'use client'

import { FormBuilder } from 'podalls-form-builder'

export default function Page() {
  return <FormBuilder />
}
```

### With Database Persistence

```tsx
'use client'

import { FormBuilder } from 'podalls-form-builder'
import { useState, useEffect } from 'react'
import type { FormProject } from 'podalls-form-builder'

export default function Page() {
  const [project, setProject] = useState<FormProject | undefined>()

  // Load project from database on mount
  useEffect(() => {
    fetch('/api/forms/project')
      .then(res => res.json())
      .then(setProject)
  }, [])

  return (
    <FormBuilder
      initialProject={project}
      onChange={(updated) => {
        // Called on every change (for real-time sync)
        setProject(updated)
      }}
      onSave={async (project) => {
        // Called when user clicks Save or presses Cmd+S
        await fetch('/api/forms/project', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(project)
        })
      }}
      onAutoSave={async (project) => {
        // Auto-save every 30s if enabled
        await fetch('/api/forms/autosave', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(project)
        })
      }}
      config={{
        autoSaveInterval: 60000, // 1 minute
        enableAutoSave: true
      }}
    />
  )
}
```

### With Custom Templates

```tsx
'use client'

import { FormBuilder } from 'podalls-form-builder'
import { useState } from 'react'
import type { FormTemplate } from 'podalls-form-builder'

export default function Page() {
  const [templates, setTemplates] = useState<FormTemplate[]>([])

  return (
    <FormBuilder
      onSaveTemplate={async (template) => {
        // Save template to database
        await fetch('/api/templates', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(template)
        })

        // Refresh templates
        const res = await fetch('/api/templates')
        setTemplates(await res.json())
      }}
      onLoadTemplates={async () => {
        // Load templates from database
        const res = await fetch('/api/templates')
        return await res.json()
      }}
      onDeleteTemplate={async (templateId) => {
        // Delete template from database
        await fetch(`/api/templates/${templateId}`, {
          method: 'DELETE'
        })
      }}
    />
  )
}
```

## API Reference

### FormBuilderProps

| Prop | Type | Description |
|------|------|-------------|
| `initialProject` | `FormProject \| undefined` | Initial form project data |
| `onSave` | `(project: FormProject) => void \| Promise<void>` | Called when user saves (Cmd+S or Save button) |
| `onChange` | `(project: FormProject) => void \| Promise<void>` | Called on every project change |
| `onAutoSave` | `(project: FormProject) => void \| Promise<void>` | Called at auto-save interval |
| `onSaveTemplate` | `(template: FormTemplate) => void \| Promise<void>` | Called when user saves a template |
| `onLoadTemplates` | `() => FormTemplate[] \| Promise<FormTemplate[]>` | Called to load custom templates |
| `onDeleteTemplate` | `(templateId: string) => void \| Promise<void>` | Called when user deletes a template |
| `config` | `FormBuilderConfig` | Configuration options |
| `className` | `string` | Additional CSS classes |

### FormBuilderConfig

```typescript
{
  autoSaveInterval?: number          // Default: 30000 (30 seconds)
  enableAutoSave?: boolean           // Default: false
  enableCommandPalette?: boolean     // Default: true
  enableTemplates?: boolean          // Default: true
  enableExport?: boolean             // Default: true
  enableImport?: boolean             // Default: true
}
```

## TypeScript Types

All TypeScript types are exported for your convenience:

```typescript
import type {
  FormBuilderProps,
  FormProject,
  Form,
  FormField,
  FormFieldType,
  FormTemplate,
  FormSettings
} from 'podalls-form-builder'
```

## Built-in Templates

The package includes 4 pre-built templates:
- **Contact Form** - Simple contact form with name, email, message
- **Event Registration** - Event registration with attendee details
- **Customer Survey** - Feedback form with rating and comments
- **Job Application** - Job application with resume upload

Access them via:
```typescript
import { builtInTemplates } from 'podalls-form-builder'
```

## Keyboard Shortcuts

- `Cmd/Ctrl + S` - Save project
- `Cmd/Ctrl + Z` - Undo
- `Cmd/Ctrl + Shift + Z` or `Cmd/Ctrl + Y` - Redo
- `Cmd/Ctrl + K` - Open command palette

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Requirements

- Next.js 15+ or 16+
- React 19+
- Tailwind CSS 4+
- TypeScript 5+ (recommended)

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## Support

For support, please open an issue on GitHub.

---

Built with ❤️ by [podalls](https://github.com/podalls)
