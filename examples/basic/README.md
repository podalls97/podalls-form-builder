# Basic Usage Example

This example shows the simplest way to use `podalls-form-builder`.

## Code

```tsx
// app/builder/page.tsx
'use client'

import { FormBuilder } from 'podalls-form-builder'

export default function FormBuilderPage() {
  return (
    <div className="h-screen">
      <FormBuilder
        onSave={(project) => {
          console.log('Project saved:', project)
          alert('Project saved to console!')
        }}
      />
    </div>
  )
}
```

## Features Demonstrated

- Minimal setup
- Console logging on save
- No persistence (form data lost on refresh)

## Use Case

Perfect for:
- Quick prototyping
- Testing the form builder
- Learning the API
