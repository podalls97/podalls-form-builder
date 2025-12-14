# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**podalls-form-builder** is a production-ready, NPM-publishable form builder component for Next.js 13+ App Router. It's built as a library package (not a standalone app) with React 19, TypeScript, Tailwind CSS 4, and shadcn/ui components.

## Build & Development Commands

```bash
# Build library for distribution
npm run build

# Watch mode for development
npm run dev

# Prepare for publishing (runs build automatically)
npm run prepublishOnly
```

## Architecture

### Package Structure

This is a **library package**, not a web application:
- Entry point: `src/index.ts` - exports all public APIs
- Build output: `dist/` directory with CommonJS and ESM bundles
- Distributed files: `dist/`, `styles/`, `scripts/`, README.md, SETUP.md

### Core Components

**Main Exports (src/index.ts):**
- `FormBuilder` - Primary form builder component (builder mode)
- `UserFormView` - Form submission/viewing component (user-facing mode)
- Type exports: `FormFieldType`, `FormField`, `Form`, `FormProject`, `FormSettings`, `FormTemplate`, `FormBuilderProps`, `HistoryState`
- `builtInTemplates` - 4 pre-built form templates (contact, registration, survey, job application)
- `cn` utility from lib/utils

**Component Hierarchy:**

```
FormBuilder (src/components/form-builder.tsx)
├── FormTabs - Multi-form navigation
├── ComponentLibrary - Drag-and-drop field palette (left sidebar on desktop, bottom sheet on mobile)
├── FormPreview - Canvas where fields are displayed and edited
│   └── FormFieldRenderer - Individual field rendering logic
├── FieldConfigurator - Field settings panel (right sidebar on desktop, bottom sheet on mobile)
├── FormSettingsPanel - Form-level settings (submit button text, success message, etc.)
├── CommandPalette - Keyboard shortcuts (Cmd+K)
└── Mobile Sheets - Bottom sheets for mobile responsiveness
```

### State Management

**Project State Structure:**
- `FormProject` contains multiple `Form` objects
- Each `Form` has an array of `FormField` objects and `FormSettings`
- Active form is tracked via `project.activeFormId`
- History management: `{ past: Form[], future: Form[] }` for undo/redo

**State Persistence:**
- The library is **persistence-agnostic** - no built-in database layer
- Consumers provide callbacks: `onSave`, `onChange`, `onAutoSave`, `onSaveTemplate`, `onLoadTemplates`, `onDeleteTemplate`
- `initialProject` prop loads existing data
- Auto-save interval configurable via `config.autoSaveInterval` (default: 30s)

### Field Types (20+ types)

**Input Fields:** text, email, number, tel, url, textarea, file, color, range, date, time, datetime

**Selection Fields:** select, radio, checkbox

**Display Fields:** label, heading, paragraph, divider

**Special Fields:** rating (star rating)

**Field Features:**
- Conditional logic: Show/hide fields based on other field values (operators: equals, not_equals, contains, greater_than, less_than)
- Validation: Required, min/max for numbers, accept for file uploads
- Helper text, placeholder, default values

### Keyboard Shortcuts

- `Cmd/Ctrl + S` - Save project
- `Cmd/Ctrl + Z` - Undo
- `Cmd/Ctrl + Shift + Z` or `Cmd/Ctrl + Y` - Redo
- `Cmd/Ctrl + K` - Open command palette

### Mobile Responsiveness

- **Desktop (lg+):** 3-column layout (component library | form editor | field configurator)
- **Mobile (<lg):** Single column with bottom sheets and floating action button
- Component library and field configurator appear as bottom sheets on mobile
- Auto-opens field configurator sheet when field is selected on mobile

## Build Configuration (tsup.config.ts)

- **Formats:** CommonJS and ESM
- **Entry:** src/index.ts
- **External deps:** react, react-dom, next, lucide-react, sonner (peer dependencies)
- **Bundled deps:** All @radix-ui components, CVA, clsx, tailwind-merge, cmdk
- **Banner:** Adds `"use client";` to all output files (Next.js client components)

## Styling

- **Tailwind CSS 4+** required as peer dependency
- **Uses Tailwind 4's CSS-based config** with `@theme inline` directive in styles/globals.css
- Consumers should import styles using Tailwind 4 approach:
  ```css
  @import "tailwindcss";
  @import "podalls-form-builder/styles";
  @source "../../node_modules/podalls-form-builder/dist";
  ```
- Theme uses modern **OKLCH color space** for all colors
- Uses shadcn/ui component patterns (src/ui/ directory)
- Dark mode support via `.dark` class selector

## Common Development Patterns

### Adding New Field Types

1. Add type to `FormFieldType` union in src/lib/types.ts
2. Update `fieldDefaults` object in FormBuilder's `addField` function (src/components/form-builder.tsx:397)
3. Add rendering logic to FormFieldRenderer (src/components/form-field-renderer.tsx)
4. Add icon and metadata to ComponentLibrary categories (src/components/component-library.tsx)
5. Update FieldConfigurator if special configuration needed

### Modifying Templates

- Built-in templates defined in src/lib/templates.ts
- Each template includes fields (without IDs), settings, name, description, category
- IDs are auto-generated when template is loaded (FormBuilder's loadTemplate function)

### Working with Conditional Logic

- Configured via FieldConfigurator's ConditionalLogicConfig component
- Each field can have one conditional rule: `{ enabled, fieldId, operator, value }`
- Evaluation happens in FormFieldRenderer using evaluateCondition helper

## TypeScript

- Strict mode enabled
- Module resolution: bundler
- Target: ES2020
- All types exported from src/lib/types.ts

## Important Notes

- This is a **component library**, not an application - no Next.js app/ directory
- No test suite currently configured
- Post-install script (scripts/postinstall.js) may display setup instructions
- Exports both types and runtime components - consumers get full TypeScript support
