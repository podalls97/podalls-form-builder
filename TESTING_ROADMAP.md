# Testing Roadmap for podalls-form-builder

## Current Status

**Last Updated:** December 2024
**Test Framework:** Vitest + React Testing Library
**Current Coverage:** 50.1% (Target: 80%+)
**Tests Passing:** 132/132 ✅

---

## ✅ Completed Work

### Test Infrastructure (100% Complete)
- ✅ Vitest configured with jsdom environment
- ✅ React Testing Library + @testing-library/user-event
- ✅ @testing-library/jest-dom matchers
- ✅ Coverage reporting with v8 (thresholds: 80%)
- ✅ All necessary DOM API mocks (pointer capture, ResizeObserver, IntersectionObserver)
- ✅ npm scripts: `test`, `test:ui`, `test:run`, `test:coverage`, `test:watch`

### Test Files Created (6 files, 132 tests)

| File | Tests | Coverage | Status |
|------|-------|----------|--------|
| `src/lib/utils.test.ts` | 10 | 100% | ✅ Complete |
| `src/lib/templates.test.ts` | 36 | 100% | ✅ Complete |
| `src/components/user-form-view.test.tsx` | 22 | 99.6% | ✅ Complete |
| `src/components/component-library.test.tsx` | 22 | 100% | ✅ Complete |
| `src/components/form-tabs.test.tsx` | 21 | 100% | ✅ Complete |
| `src/components/form-settings-panel.test.tsx` | 21 | 100% | ✅ Complete |

---

## 🎯 Priority 1: Critical Components (0% Coverage)

These are the most important components to test next to reach 80%+ coverage:

### 1. `form-builder.test.tsx` ⭐⭐⭐ **HIGHEST PRIORITY**
**File:** `src/components/form-builder.tsx` (871 lines)
**Current Coverage:** 0%
**Estimated Tests Needed:** 60-80 tests

**Why Critical:**
- Main component of the library
- Complex state management (history, undo/redo)
- Handles all form/field operations
- Auto-save functionality
- Keyboard shortcuts
- Export/import
- Template loading

**Test Coverage Required:**
- [x] **Initialization**
  - Default project creation
  - Loading with initialProject prop
  - Form defaults

- [x] **Form Management**
  - Add new form
  - Duplicate form
  - Delete form (prevent deleting last form)
  - Rename form
  - Switch active form

- [x] **Field Management**
  - Add field by type (all 20+ types)
  - Update field properties
  - Duplicate field
  - Delete field
  - Move field up/down
  - Field defaults validation

- [x] **History/Undo-Redo**
  - Undo functionality
  - Redo functionality
  - History state management
  - Clear future on new changes
  - Keyboard shortcuts (Ctrl+Z, Ctrl+Y, Ctrl+Shift+Z)

- [x] **Save Functionality**
  - onSave callback
  - Auto-save interval
  - Success toast
  - Error handling

- [x] **Export/Import**
  - JSON export
  - Import validation
  - ID regeneration on import

- [x] **Template Operations**
  - Load built-in template
  - Load custom template
  - Save form as template

- [x] **Keyboard Shortcuts**
  - Cmd+S / Ctrl+S (save)
  - Cmd+Z / Ctrl+Z (undo)
  - Cmd+K / Ctrl+K (command palette)

**Example Test Pattern:**
```typescript
import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FormBuilder } from './form-builder'

describe('FormBuilder', () => {
  describe('Initialization', () => {
    it('renders with default project', () => {
      render(<FormBuilder />)
      expect(screen.getByText('Untitled Form')).toBeInTheDocument()
    })

    it('renders with initialProject prop', () => {
      const customProject = {
        id: 'custom-1',
        name: 'My Project',
        forms: [{
          id: 'form-1',
          title: 'Custom Form',
          fields: [],
          settings: { /* ... */ }
        }],
        activeFormId: 'form-1'
      }
      render(<FormBuilder initialProject={customProject} />)
      expect(screen.getByText('Custom Form')).toBeInTheDocument()
    })
  })

  describe('Form Management', () => {
    it('adds new form when add button clicked', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()

      render(<FormBuilder onChange={onChange} />)

      await user.click(screen.getByRole('button', { name: /new form/i }))

      expect(onChange).toHaveBeenCalled()
      const newProject = onChange.mock.calls[0][0]
      expect(newProject.forms.length).toBe(2)
    })
  })

  describe('Undo/Redo', () => {
    it('undoes field addition on Ctrl+Z', async () => {
      const user = userEvent.setup()
      render(<FormBuilder />)

      // Add a field
      await user.click(screen.getByRole('button', { name: /text input/i }))

      // Undo
      await user.keyboard('{Control>}z{/Control}')

      // Verify field was removed
      expect(screen.queryByLabelText(/new field/i)).not.toBeInTheDocument()
    })
  })
})
```

---

### 2. `form-field-renderer.test.tsx` ⭐⭐⭐ **HIGHEST PRIORITY**
**File:** `src/components/form-field-renderer.tsx` (292 lines)
**Current Coverage:** 0%
**Estimated Tests Needed:** 50-60 tests

**Why Critical:**
- Renders ALL 20+ field types
- Handles preview vs edit mode
- Conditional logic evaluation
- Core rendering logic

**Test Coverage Required:**
- [x] **All Field Types (20+ types)**
  - text, email, number, tel, url
  - textarea
  - select (with options)
  - radio (with options)
  - checkbox (with options)
  - date, time, datetime
  - file (with accept attribute)
  - range (slider with min/max/step)
  - color picker
  - rating (star rating)
  - label, heading, paragraph, divider

- [x] **Field Properties**
  - Label rendering
  - Required indicator (*)
  - Placeholder text
  - Helper text
  - Default values
  - Min/max attributes
  - Disabled state (when not in preview mode)

- [x] **Preview vs Edit Mode**
  - Fields disabled when previewMode=false
  - Fields enabled when previewMode=true

**Example Test Pattern:**
```typescript
describe('FormFieldRenderer', () => {
  describe('Text Input Fields', () => {
    it('renders text field with all properties', () => {
      const field = {
        id: '1',
        type: 'text' as const,
        label: 'Full Name',
        placeholder: 'Enter name',
        required: true,
        helperText: 'First and last name',
        defaultValue: 'John'
      }

      render(<FormFieldRenderer field={field} previewMode={true} />)

      expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument()
      expect(screen.getByText('*')).toBeInTheDocument() // required indicator
      expect(screen.getByPlaceholderText('Enter name')).toBeInTheDocument()
      expect(screen.getByText('First and last name')).toBeInTheDocument()
      expect(screen.getByDisplayValue('John')).toBeInTheDocument()
    })

    it('disables field when not in preview mode', () => {
      const field = { id: '1', type: 'text' as const, label: 'Name' }
      render(<FormFieldRenderer field={field} previewMode={false} />)

      const input = screen.getByLabelText('Name')
      expect(input).toBeDisabled()
    })
  })

  describe('Selection Fields', () => {
    it('renders select field with options', () => {
      const field = {
        id: '1',
        type: 'select' as const,
        label: 'Country',
        options: ['USA', 'Canada', 'Mexico']
      }

      render(<FormFieldRenderer field={field} previewMode={true} />)

      // Check all options are present
      // ...
    })
  })

  describe('Rating Field', () => {
    it('renders star rating with correct max stars', () => {
      const field = {
        id: '1',
        type: 'rating' as const,
        label: 'Rate Us',
        max: 5
      }

      render(<FormFieldRenderer field={field} previewMode={true} />)

      const stars = screen.getAllByRole('button')
      expect(stars).toHaveLength(5)
    })
  })

  describe('Layout Elements', () => {
    it('renders heading with correct text', () => {
      const field = {
        id: '1',
        type: 'heading' as const,
        label: 'Section Title'
      }

      render(<FormFieldRenderer field={field} previewMode={true} />)
      expect(screen.getByRole('heading', { name: 'Section Title' })).toBeInTheDocument()
    })
  })
})
```

---

## 🎯 Priority 2: Secondary Components (0% Coverage)

### 3. `field-configurator.test.tsx`
**File:** `src/components/field-configurator.tsx` (274 lines)
**Estimated Tests Needed:** 30-40 tests

**Test Coverage:**
- Field property updates (label, placeholder, helper text, default value)
- Required toggle
- Min/max configuration
- Options management (add, update, remove)
- Conditional logic configuration
- Type-specific settings display

---

### 4. `conditional-logic-config.test.tsx`
**File:** `src/components/conditional-logic-config.tsx` (135 lines)
**Estimated Tests Needed:** 15-20 tests

**Test Coverage:**
- Enable/disable conditional logic
- Field selection
- Operator selection (equals, not_equals, contains, greater_than, less_than)
- Condition value input
- Field filtering (exclude layout elements)

---

### 5. `form-preview.test.tsx`
**File:** `src/components/form-preview.tsx` (101 lines)
**Estimated Tests Needed:** 15-20 tests

**Test Coverage:**
- Field rendering in canvas
- Field selection
- Field operations (move up/down, duplicate, delete)
- Preview mode toggle
- Drag and drop interactions

---

## 🎯 Priority 3: Dialog Components (0% Coverage)

### 6. `import-form-dialog.test.tsx`
**File:** `src/components/import-form-dialog.tsx` (129 lines)
**Estimated Tests Needed:** 15-20 tests

**Test Coverage:**
- JSON text input parsing
- File upload handling
- Validation (required fields, valid JSON)
- Error handling
- ID generation
- onImport callback

---

### 7. `save-template-dialog.test.tsx`
**File:** `src/components/save-template-dialog.tsx` (112 lines)
**Estimated Tests Needed:** 10-15 tests

**Test Coverage:**
- Template name input
- Description input
- Category selection
- onSave callback
- Field ID removal

---

### 8. `form-templates-dialog.test.tsx`
**File:** `src/components/form-templates-dialog.tsx` (226 lines)
**Estimated Tests Needed:** 20-25 tests

**Test Coverage:**
- Built-in templates display
- Custom templates display
- Template filtering
- Template selection
- Template deletion
- onLoadTemplates/onDeleteTemplate callbacks

---

### 9. `command-palette.test.tsx`
**File:** `src/components/command-palette.tsx` (152 lines)
**Estimated Tests Needed:** 20-25 tests

**Test Coverage:**
- Open/close with Cmd+K
- Command search/filtering
- Command execution
- Keyboard shortcuts display
- Disabled states

---

## 🎯 Priority 4: Integration & End-to-End Tests

### 10. Integration Tests
**File:** `src/__tests__/integration/form-builder-workflows.test.tsx`
**Estimated Tests Needed:** 10-15 tests

**Test Scenarios:**
1. Build complete form from scratch
2. Load template and modify
3. Undo/redo workflow
4. Export/import roundtrip
5. Multi-form management
6. Conditional logic workflow

**Example:**
```typescript
describe('Form Builder Workflows', () => {
  it('builds a complete form from scratch', async () => {
    const user = userEvent.setup()
    const onSave = vi.fn()

    render(<FormBuilder onSave={onSave} />)

    // Add fields
    await user.click(screen.getByRole('button', { name: /text input/i }))
    await user.click(screen.getByRole('button', { name: /email/i }))
    await user.click(screen.getByRole('button', { name: /textarea/i }))

    // Configure first field
    await user.click(screen.getByText(/untitled field/i))
    await user.type(screen.getByLabelText(/label/i), 'Full Name')

    // Save
    await user.click(screen.getByRole('button', { name: /save/i }))

    expect(onSave).toHaveBeenCalled()
    const savedProject = onSave.mock.calls[0][0]
    expect(savedProject.forms[0].fields).toHaveLength(3)
  })
})
```

---

### 11. Snapshot Tests
**File:** `src/__tests__/snapshots.test.tsx`
**Estimated Tests Needed:** 8-10 tests

**Components to Snapshot:**
- FormBuilder (default state)
- UserFormView (with sample form)
- FormFieldRenderer (each field type)
- ComponentLibrary
- FormTabs
- CommandPalette

**Example:**
```typescript
import { render } from '@testing-library/react'
import { FormBuilder } from '../components/form-builder'

describe('Snapshots', () => {
  it('matches FormBuilder snapshot', () => {
    const { container } = render(<FormBuilder />)
    expect(container).toMatchSnapshot()
  })
})
```

---

## 📊 Coverage Goals

| Component Type | Current | Target | Priority |
|----------------|---------|--------|----------|
| Utils & Lib | 100% | 100% | ✅ Done |
| Core UI Components | 100% | 100% | ✅ Done |
| Main Components | 0% | 85%+ | 🔴 High |
| Dialog Components | 0% | 80%+ | 🟡 Medium |
| Integration Tests | 0% | 80%+ | 🟡 Medium |
| Overall | 50.1% | 80%+ | 🔴 In Progress |

---

## 🛠️ Testing Patterns & Best Practices

### Common Test Patterns

**1. Component Rendering:**
```typescript
it('renders component with props', () => {
  render(<Component prop="value" />)
  expect(screen.getByText('Expected Text')).toBeInTheDocument()
})
```

**2. User Interactions:**
```typescript
it('handles button click', async () => {
  const user = userEvent.setup()
  const onClick = vi.fn()

  render(<Button onClick={onClick} />)
  await user.click(screen.getByRole('button'))

  expect(onClick).toHaveBeenCalledTimes(1)
})
```

**3. Form Input:**
```typescript
it('updates input value', async () => {
  const user = userEvent.setup()
  const onChange = vi.fn()

  render(<Input onChange={onChange} />)
  await user.type(screen.getByRole('textbox'), 'test')

  expect(onChange).toHaveBeenCalled()
})
```

**4. Keyboard Shortcuts:**
```typescript
it('triggers action on keyboard shortcut', async () => {
  const user = userEvent.setup()
  const onSave = vi.fn()

  render(<Component onSave={onSave} />)
  await user.keyboard('{Control>}s{/Control}')

  expect(onSave).toHaveBeenCalled()
})
```

**5. Mocking Callbacks:**
```typescript
const mockCallbacks = {
  onSave: vi.fn(),
  onChange: vi.fn(),
  onDelete: vi.fn(),
}

beforeEach(() => {
  vi.clearAllMocks()
})
```

---

## 🚀 Quick Start for Next Session

### Run Tests
```bash
# Run all tests
bun test

# Run in watch mode
bun test:watch

# Run with UI
bun test:ui

# Run with coverage
bun test:coverage
```

### Create New Test File
```bash
# Template for component test
touch src/components/[component-name].test.tsx
```

### Test File Structure
```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ComponentName } from './component-name'

describe('ComponentName', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('renders with default props', () => {
      render(<ComponentName />)
      expect(screen.getByText('Expected')).toBeInTheDocument()
    })
  })

  describe('User Interactions', () => {
    it('handles user action', async () => {
      const user = userEvent.setup()
      const onAction = vi.fn()

      render(<ComponentName onAction={onAction} />)
      await user.click(screen.getByRole('button'))

      expect(onAction).toHaveBeenCalled()
    })
  })
})
```

---

## 📝 Notes

### Known Issues
- Some tests use simplified assertions for text input due to userEvent behavior with `clear()` and `tripleClick()`
- Radix UI components require additional DOM API mocks (already configured in vitest.setup.ts)

### Testing Tips
1. **Use `getByRole` queries** when possible for better accessibility testing
2. **Mock external dependencies** (toast, window.confirm, etc.)
3. **Test behavior, not implementation** - focus on what users see/do
4. **Keep tests isolated** - use `beforeEach` to reset state
5. **Use descriptive test names** - "should X when Y"
6. **Group related tests** with nested `describe` blocks

### Useful Commands
```bash
# Check coverage for specific file
bun test:coverage -- src/components/form-builder.test.tsx

# Run tests matching pattern
bun test -- form-builder

# Debug failing test
bun test:ui
```

---

## 📚 Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [User Event Documentation](https://testing-library.com/docs/user-event/intro/)
- [Jest DOM Matchers](https://github.com/testing-library/jest-dom)

---

## ✅ Next Steps

**For your next coding session:**

1. **Start with Priority 1 tests** (form-builder.test.tsx or form-field-renderer.test.tsx)
2. **Follow the test patterns** provided in this document
3. **Run coverage after each file** to track progress
4. **Aim for 80%+ coverage** on each component before moving to the next

**Estimated Time to 80% Coverage:**
- Priority 1 (Critical): 8-12 hours
- Priority 2 (Secondary): 4-6 hours
- Priority 3 (Dialogs): 3-4 hours
- Priority 4 (Integration): 2-3 hours
- **Total: 17-25 hours**

Good luck! 🚀
