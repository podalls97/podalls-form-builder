# Setup Guide

This guide provides step-by-step instructions for setting up `podalls-form-builder` in your Next.js project.

## Prerequisites

Before you begin, ensure you have:

- Node.js 18+ installed
- A Next.js 13+ project with App Router
- React 19+
- Tailwind CSS 4+ configured
- TypeScript (recommended)

## Installation Steps

### Step 1: Install the Package

Choose your preferred package manager:

```bash
# npm
npm install podalls-form-builder

# pnpm
pnpm add podalls-form-builder

# bun
bun add podalls-form-builder
```

### Step 2: Install Peer Dependencies

The package requires these peer dependencies:

```bash
npm install lucide-react sonner
```

If you don't have Tailwind CSS 4 installed:

```bash
npm install -D tailwindcss@next @tailwindcss/postcss
```

### Step 3: Configure Tailwind CSS

Add the package's components to your Tailwind CSS content configuration.

**Update `tailwind.config.ts`:**

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    // Add this line:
    './node_modules/podalls-form-builder/dist/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {}
  },
  plugins: []
}

export default config
```

### Step 4: Verify CSS Variables

The postinstall script should have automatically added CSS variables to your `app/globals.css` or `src/app/globals.css`.

Verify that your `globals.css` includes the form builder styles. You should see:

```css
/* podalls-form-builder CSS variables */
:root {
  --radius: 0.625rem;
  --background: oklch(1 0 0);
  /* ... more variables */
}
```

If not present, manually copy from `node_modules/podalls-form-builder/styles/globals.css`.

### Step 5: Create a Form Builder Page

Create a new page to use the form builder:

**`app/builder/page.tsx`:**

```tsx
'use client'

import { FormBuilder } from 'podalls-form-builder'

export default function FormBuilderPage() {
  return (
    <div className="h-screen">
      <FormBuilder
        onSave={(project) => {
          console.log('Project saved:', project)
        }}
      />
    </div>
  )
}
```

### Step 6: Start Your Development Server

```bash
npm run dev
```

Navigate to `http://localhost:3000/builder` to see your form builder in action!

## Advanced Setup

### With Database Persistence

To persist forms to a database, create API routes and wire them up:

**1. Create API Route (`app/api/forms/route.ts`):**

```typescript
import { NextResponse } from 'next/server'
import { db } from '@/lib/db' // Your database instance

export async function POST(request: Request) {
  const project = await request.json()

  await db.formProjects.upsert({
    where: { id: project.id },
    data: project
  })

  return NextResponse.json({ success: true })
}

export async function GET() {
  const project = await db.formProjects.findFirst()
  return NextResponse.json(project)
}
```

**2. Use in Form Builder:**

```tsx
'use client'

import { FormBuilder } from 'podalls-form-builder'
import { useState, useEffect } from 'react'
import type { FormProject } from 'podalls-form-builder'

export default function Page() {
  const [project, setProject] = useState<FormProject>()

  useEffect(() => {
    fetch('/api/forms')
      .then(res => res.json())
      .then(setProject)
  }, [])

  return (
    <FormBuilder
      initialProject={project}
      onSave={async (project) => {
        await fetch('/api/forms', {
          method: 'POST',
          body: JSON.stringify(project)
        })
      }}
    />
  )
}
```

### With Sonner Toast Notifications

The form builder uses `sonner` for toast notifications. Add the Toaster component to your root layout:

**`app/layout.tsx`:**

```tsx
import { Toaster } from 'sonner'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
```

### Custom Theme Colors

The form builder respects your existing Tailwind theme. To customize colors, update your CSS variables:

```css
:root {
  --primary: oklch(0.5 0.2 250); /* Your custom primary color */
  --primary-foreground: oklch(1 0 0);
  /* ... other colors */
}
```

## Troubleshooting

### "Module not found" Errors

If you see module not found errors, ensure:
1. Tailwind content includes the package: `'./node_modules/podalls-form-builder/dist/**/*.{js,jsx,ts,tsx}'`
2. Peer dependencies are installed: `lucide-react`, `sonner`
3. You've restarted the dev server after installation

### Styles Not Applying

If styles aren't working:
1. Check that CSS variables are in `globals.css`
2. Verify `globals.css` is imported in your root layout
3. Clear Next.js cache: `rm -rf .next && npm run dev`

### TypeScript Errors

If you see TypeScript errors:
1. Ensure TypeScript 5+ is installed
2. Check that `"moduleResolution": "bundler"` in `tsconfig.json`
3. Restart your TypeScript server in VS Code

### Build Errors

If builds fail:
1. Check that all peer dependencies are installed
2. Verify Next.js version is 15+ or 16+
3. Try clearing node_modules: `rm -rf node_modules && npm install`

## Next Steps

- Check out the [README.md](./README.md) for API documentation
- See example implementations in `/examples` directory
- Join our community for support

## Need Help?

- 📖 Read the full [API Reference](./README.md#api-reference)
- 💬 Open an issue on GitHub
- 📧 Contact support

Happy form building! 🎉
