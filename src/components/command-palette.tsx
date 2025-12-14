"use client"

import { useEffect, useState } from "react"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "../ui/command"
import { Plus, Save, Download, Eye, Undo, Redo, Settings, FileJson } from "lucide-react"
import type { FormFieldType } from "../lib/types"

interface CommandPaletteProps {
  onAddField: (type: FormFieldType) => void
  onSave: () => void
  onExport: () => void
  onImport: () => void
  onTogglePreview: () => void
  onToggleSettings: () => void
  onUndo: () => void
  onRedo: () => void
  canUndo: boolean
  canRedo: boolean
}

export default function CommandPalette({
  onAddField,
  onSave,
  onExport,
  onImport,
  onTogglePreview,
  onToggleSettings,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
}: CommandPaletteProps) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const handleAction = (action: () => void) => {
    action()
    setOpen(false)
  }

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Actions">
          <CommandItem onSelect={() => handleAction(onSave)}>
            <Save className="mr-2 h-4 w-4" />
            <span>Save Project</span>
            <span className="ml-auto text-xs text-muted-foreground">Ctrl+S</span>
          </CommandItem>
          <CommandItem onSelect={() => handleAction(onExport)}>
            <Download className="mr-2 h-4 w-4" />
            <span>Export Project</span>
          </CommandItem>
          <CommandItem onSelect={() => handleAction(onImport)}>
            <FileJson className="mr-2 h-4 w-4" />
            <span>Import Form</span>
          </CommandItem>
          <CommandItem onSelect={() => handleAction(onTogglePreview)}>
            <Eye className="mr-2 h-4 w-4" />
            <span>Toggle Preview</span>
          </CommandItem>
          <CommandItem onSelect={() => handleAction(onToggleSettings)}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Form Settings</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Edit">
          <CommandItem onSelect={() => handleAction(onUndo)} disabled={!canUndo}>
            <Undo className="mr-2 h-4 w-4" />
            <span>Undo</span>
            <span className="ml-auto text-xs text-muted-foreground">Ctrl+Z</span>
          </CommandItem>
          <CommandItem onSelect={() => handleAction(onRedo)} disabled={!canRedo}>
            <Redo className="mr-2 h-4 w-4" />
            <span>Redo</span>
            <span className="ml-auto text-xs text-muted-foreground">Ctrl+Y</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Add Field">
          <CommandItem onSelect={() => handleAction(() => onAddField("text"))}>
            <Plus className="mr-2 h-4 w-4" />
            <span>Text Input</span>
          </CommandItem>
          <CommandItem onSelect={() => handleAction(() => onAddField("email"))}>
            <Plus className="mr-2 h-4 w-4" />
            <span>Email Input</span>
          </CommandItem>
          <CommandItem onSelect={() => handleAction(() => onAddField("number"))}>
            <Plus className="mr-2 h-4 w-4" />
            <span>Number Input</span>
          </CommandItem>
          <CommandItem onSelect={() => handleAction(() => onAddField("textarea"))}>
            <Plus className="mr-2 h-4 w-4" />
            <span>Textarea</span>
          </CommandItem>
          <CommandItem onSelect={() => handleAction(() => onAddField("select"))}>
            <Plus className="mr-2 h-4 w-4" />
            <span>Dropdown</span>
          </CommandItem>
          <CommandItem onSelect={() => handleAction(() => onAddField("radio"))}>
            <Plus className="mr-2 h-4 w-4" />
            <span>Radio Buttons</span>
          </CommandItem>
          <CommandItem onSelect={() => handleAction(() => onAddField("checkbox"))}>
            <Plus className="mr-2 h-4 w-4" />
            <span>Checkboxes</span>
          </CommandItem>
          <CommandItem onSelect={() => handleAction(() => onAddField("date"))}>
            <Plus className="mr-2 h-4 w-4" />
            <span>Date Picker</span>
          </CommandItem>
          <CommandItem onSelect={() => handleAction(() => onAddField("file"))}>
            <Plus className="mr-2 h-4 w-4" />
            <span>File Upload</span>
          </CommandItem>
          <CommandItem onSelect={() => handleAction(() => onAddField("rating"))}>
            <Plus className="mr-2 h-4 w-4" />
            <span>Star Rating</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
