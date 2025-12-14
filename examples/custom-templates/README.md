# Custom Templates Example

This example shows how to implement custom template management with database storage.

## Files Structure

```
app/
├── builder/
│   └── page.tsx
└── api/
    └── templates/
        ├── route.ts       # GET/POST templates
        └── [id]/
            └── route.ts   # DELETE template
```

## Code

### 1. Templates API (`app/api/templates/route.ts`)

```typescript
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const templates = await db.formTemplate.findMany({
      where: { isCustom: true },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(templates)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to load templates' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const template = await request.json()

    const saved = await db.formTemplate.create({
      data: template
    })

    return NextResponse.json(saved)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to save template' },
      { status: 500 }
    )
  }
}
```

### 2. Delete Template API (`app/api/templates/[id]/route.ts`)

```typescript
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await db.formTemplate.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete template' },
      { status: 500 }
    )
  }
}
```

### 3. Form Builder with Templates (`app/builder/page.tsx`)

```tsx
'use client'

import { FormBuilder } from 'podalls-form-builder'
import { useState, useEffect } from 'react'
import type { FormTemplate } from 'podalls-form-builder'

export default function FormBuilderPage() {
  const [templates, setTemplates] = useState<FormTemplate[]>([])

  // Load templates on mount
  useEffect(() => {
    loadTemplates()
  }, [])

  const loadTemplates = async () => {
    try {
      const response = await fetch('/api/templates')
      const data = await response.json()
      setTemplates(data)
    } catch (error) {
      console.error('Failed to load templates:', error)
    }
  }

  return (
    <div className="h-screen">
      <FormBuilder
        onSaveTemplate={async (template) => {
          // Save new custom template
          const response = await fetch('/api/templates', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(template)
          })

          if (!response.ok) {
            throw new Error('Failed to save template')
          }

          // Reload templates to show the new one
          await loadTemplates()
        }}
        onLoadTemplates={async () => {
          // Load custom templates (called when template dialog opens)
          const response = await fetch('/api/templates')
          return await response.json()
        }}
        onDeleteTemplate={async (templateId) => {
          // Delete a template
          const response = await fetch(`/api/templates/${templateId}`, {
            method: 'DELETE'
          })

          if (!response.ok) {
            throw new Error('Failed to delete template')
          }

          // Update local state
          setTemplates(templates.filter(t => t.id !== templateId))
        }}
      />
    </div>
  )
}
```

## Database Schema

Example Prisma schema:

```prisma
model FormTemplate {
  id          String   @id
  name        String
  description String
  category    String
  fields      Json     // Array of field definitions
  settings    Json     // Form settings
  isCustom    Boolean  @default(true)
  createdAt   DateTime @default(now())

  @@map("form_templates")
}
```

Example Drizzle schema:

```typescript
import { pgTable, text, boolean, timestamp, jsonb } from 'drizzle-orm/pg-core'

export const formTemplates = pgTable('form_templates', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  category: text('category').notNull(),
  fields: jsonb('fields').notNull(),
  settings: jsonb('settings').notNull(),
  isCustom: boolean('is_custom').default(true),
  createdAt: timestamp('created_at').defaultNow()
})
```

## Features Demonstrated

- Saving custom templates to database
- Loading templates dynamically
- Deleting templates
- Template categorization
- Integration with form builder template system

## Use Case

Perfect for:
- Multi-user platforms where users create reusable forms
- Teams sharing form templates
- Applications with common form patterns
- White-label form builder products
