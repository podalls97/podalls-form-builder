# Database Persistence Example

This example demonstrates how to persist form projects to a database using API routes.

## Files Structure

```
app/
├── builder/
│   └── page.tsx           # Form builder UI
└── api/
    └── forms/
        ├── route.ts       # GET/POST project
        └── autosave/
            └── route.ts   # Auto-save endpoint
```

## Code

### 1. API Route (`app/api/forms/route.ts`)

```typescript
import { NextResponse } from 'next/server'
import { db } from '@/lib/db' // Your database client (Prisma, Drizzle, etc.)

export async function GET() {
  try {
    const project = await db.formProject.findFirst({
      orderBy: { updatedAt: 'desc' }
    })

    return NextResponse.json(project)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to load project' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const project = await request.json()

    const saved = await db.formProject.upsert({
      where: { id: project.id },
      create: project,
      update: {
        ...project,
        updatedAt: new Date()
      }
    })

    return NextResponse.json(saved)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to save project' },
      { status: 500 }
    )
  }
}
```

### 2. Auto-save Endpoint (`app/api/forms/autosave/route.ts`)

```typescript
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const project = await request.json()

    await db.formProject.update({
      where: { id: project.id },
      data: {
        ...project,
        updatedAt: new Date()
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Auto-save failed' },
      { status: 500 }
    )
  }
}
```

### 3. Form Builder Page (`app/builder/page.tsx`)

```tsx
'use client'

import { FormBuilder } from 'podalls-form-builder'
import { useState, useEffect } from 'react'
import type { FormProject } from 'podalls-form-builder'

export default function FormBuilderPage() {
  const [project, setProject] = useState<FormProject | undefined>()
  const [loading, setLoading] = useState(true)

  // Load project on mount
  useEffect(() => {
    fetch('/api/forms')
      .then(res => res.json())
      .then(data => {
        setProject(data)
        setLoading(false)
      })
      .catch(error => {
        console.error('Failed to load project:', error)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return <div className="flex items-center justify-center h-screen">
      <p>Loading...</p>
    </div>
  }

  return (
    <div className="h-screen">
      <FormBuilder
        initialProject={project}
        onChange={(updated) => {
          // Update local state immediately for responsive UI
          setProject(updated)
        }}
        onSave={async (project) => {
          // Manual save (Cmd+S or Save button)
          const response = await fetch('/api/forms', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(project)
          })

          if (!response.ok) {
            throw new Error('Failed to save project')
          }
        }}
        onAutoSave={async (project) => {
          // Auto-save every minute
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
    </div>
  )
}
```

## Database Schema

Example Prisma schema:

```prisma
model FormProject {
  id          String   @id
  name        String
  forms       Json     // Store forms array as JSON
  activeFormId String
  createdAt   DateTime
  updatedAt   DateTime

  @@map("form_projects")
}
```

Example Drizzle schema:

```typescript
import { pgTable, text, timestamp, jsonb } from 'drizzle-orm/pg-core'

export const formProjects = pgTable('form_projects', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  forms: jsonb('forms').notNull(),
  activeFormId: text('active_form_id').notNull(),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull()
})
```

## Features Demonstrated

- Loading initial project from database
- Manual save on Cmd+S or Save button
- Auto-save every 60 seconds
- Error handling
- Loading states
- Real-time local state updates

## Use Case

Perfect for:
- Production applications
- Multi-user form builders
- Projects requiring persistence
- Long-form builder sessions
