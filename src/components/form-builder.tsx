"use client"

import { useState, useEffect, useCallback } from "react"
import type { FormFieldType, FormField, Form, FormProject, FormTemplate, FormBuilderProps } from "../lib/types"
import { ComponentLibrary } from "./component-library"
import { FormPreview } from "./form-preview"
import { FieldConfigurator } from "./field-configurator"
import { FormTabs } from "./form-tabs"
import { FormSettingsPanel } from "./form-settings-panel"
import { ImportFormDialog } from "./import-form-dialog"
import { FormTemplatesDialog } from "./form-templates-dialog"
import { SaveTemplateDialog } from "./save-template-dialog"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Textarea } from "../ui/textarea"
import { Card } from "../ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog"
import { Save, Eye, Download, Undo, Redo, Settings, Monitor, Smartphone, Plus, X } from "lucide-react"
import { toast } from "sonner"
import { cn } from "../lib/utils"
import CommandPalette from "./command-palette"
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet"

export function FormBuilder({
  initialProject,
  onSave,
  onChange,
  onAutoSave,
  onSaveTemplate,
  onLoadTemplates,
  onDeleteTemplate,
  config,
  className,
}: FormBuilderProps = {}) {
  const defaultProject: FormProject = {
    id: "project-1",
    name: "My Form Project",
    forms: [
      {
        id: "form-1",
        title: "Untitled Form",
        description: "",
        fields: [],
        settings: {
          submitButtonText: "Submit",
          successMessage: "Thank you for your submission!",
          allowMultipleSubmissions: true,
          showProgressBar: false,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
    activeFormId: "form-1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  const [project, setProject] = useState<FormProject>(initialProject || defaultProject)

  const [history, setHistory] = useState<{
    past: Form[]
    future: Form[]
  }>({
    past: [],
    future: [],
  })

  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null)
  const [previewMode, setPreviewMode] = useState(false)
  const [deviceMode, setDeviceMode] = useState<"desktop" | "mobile">("desktop")
  const [showSettings, setShowSettings] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [deleteFieldAlert, setDeleteFieldAlert] = useState<string | null>(null)
  const [deleteFormAlert, setDeleteFormAlert] = useState<string | null>(null)
  const [showComponentSheet, setShowComponentSheet] = useState(false)
  const [showConfiguratorSheet, setShowConfiguratorSheet] = useState(false)
  const [clearFormAlert, setClearFormAlert] = useState(false)

  const activeForm = project.forms.find((form) => form.id === project.activeFormId)

  const saveProject = useCallback(async () => {
    if (onSave) {
      try {
        await onSave(project)
        setLastSaved(new Date())
        toast.success("Project saved", {
          description: `All ${project.forms.length} form(s) have been saved successfully.`,
        })
      } catch (error) {
        toast.error("Failed to save project", {
          description: error instanceof Error ? error.message : "An unknown error occurred",
        })
      }
    }
  }, [project, onSave])

  const undo = useCallback(() => {
    if (!activeForm || history.past.length === 0) return

    const newPast = history.past.slice(0, -1)
    const newFuture = [...history.future, activeForm]
    const previousForm = history.past[history.past.length - 1]

    setProject((prev) => ({
      ...prev,
      forms: prev.forms.map((form) => (form.id === activeForm.id ? { ...form, ...previousForm } : form)),
      updatedAt: new Date().toISOString(),
    }))
    setHistory({ past: newPast, future: newFuture })

    toast.success("Undo", {
      description: "Previous action has been undone.",
    })
  }, [activeForm, history])

  const redo = useCallback(() => {
    if (!activeForm || history.future.length === 0) return

    const newFuture = history.future.slice(0, -1)
    const newPast = [...history.past, activeForm]
    const nextForm = history.future[history.future.length - 1]

    setProject((prev) => ({
      ...prev,
      forms: prev.forms.map((form) => (form.id === activeForm.id ? { ...form, ...nextForm } : form)),
      updatedAt: new Date().toISOString(),
    }))
    setHistory({ past: newPast, future: newFuture })

    toast.success("Redo", {
      description: "Action has been redone.",
    })
  }, [activeForm, history])

  const updateActiveForm = (updates: Partial<Form>) => {
    if (!activeForm) return

    // Save current state to history before making changes
    setHistory((prev) => ({
      past: [...prev.past, activeForm],
      future: [] // Clear future when new changes are made
    }))

    const updatedForm = { ...activeForm, ...updates }
    const newForms = project.forms.map((form) => (form.id === activeForm.id ? updatedForm : form))

    setProject((prev) => ({
      ...prev,
      forms: newForms,
      updatedAt: new Date().toISOString(),
    }))
  }

  // Load initial project
  useEffect(() => {
    if (initialProject) {
      const formsWithSettings = initialProject.forms.map((form: Form) => ({
        ...form,
        settings: form.settings || {
          submitButtonText: "Submit",
          successMessage: "Thank you for your submission!",
          allowMultipleSubmissions: true,
          showProgressBar: false,
        },
      }))
      setProject({ ...initialProject, forms: formsWithSettings })
    }
  }, [initialProject])

  // Call onChange callback whenever project changes
  useEffect(() => {
    if (onChange) {
      onChange(project)
    }
  }, [project, onChange])

  // Auto-save functionality
  useEffect(() => {
    if (!config?.enableAutoSave || !onAutoSave) return

    const interval = setInterval(async () => {
      try {
        await onAutoSave(project)
        setLastSaved(new Date())
      } catch (error) {
        console.error('Auto-save failed:', error)
      }
    }, config.autoSaveInterval || 30000)

    return () => clearInterval(interval)
  }, [project, config, onAutoSave])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault()
        undo()
      } else if ((e.metaKey || e.ctrlKey) && (e.key === "y" || (e.key === "z" && e.shiftKey))) {
        e.preventDefault()
        redo()
      } else if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault()
        saveProject()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [history])

  const addForm = () => {
    const newForm: Form = {
      id: `form-${Date.now()}`,
      title: `Form ${project.forms.length + 1}`,
      description: "",
      fields: [],
      settings: {
        submitButtonText: "Submit",
        successMessage: "Thank you for your submission!",
        allowMultipleSubmissions: true,
        showProgressBar: false,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    setProject((prev) => ({
      ...prev,
      forms: [...prev.forms, newForm],
      activeFormId: newForm.id,
      updatedAt: new Date().toISOString(),
    }))

    setSelectedFieldId(null)
    setHistory({ past: [], future: [] })

    toast.success("Form created", {
      description: "A new form has been added to your project.",
    })
  }

  const duplicateForm = (formId: string) => {
    const formToDuplicate = project.forms.find((f) => f.id === formId)
    if (!formToDuplicate) return

    const newForm: Form = {
      ...formToDuplicate,
      id: `form-${Date.now()}`,
      title: `${formToDuplicate.title} (Copy)`,
      fields: formToDuplicate.fields.map((field) => ({
        ...field,
        id: `field-${Date.now()}-${Math.random()}`,
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    setProject((prev) => ({
      ...prev,
      forms: [...prev.forms, newForm],
      activeFormId: newForm.id,
      updatedAt: new Date().toISOString(),
    }))

    setSelectedFieldId(null)
    setHistory({ past: [], future: [] })

    toast.success("Form duplicated", {
      description: "The form has been duplicated successfully.",
    })
  }

  const importForm = (form: Form) => {
    setProject((prev) => ({
      ...prev,
      forms: [...prev.forms, form],
      activeFormId: form.id,
      updatedAt: new Date().toISOString(),
    }))

    setSelectedFieldId(null)
    setHistory({ past: [], future: [] })
  }

  const loadTemplate = (template: FormTemplate) => {
    const newFields: FormField[] = template.fields.map((field, index) => ({
      ...field,
      id: `field-${Date.now()}-${index}`,
    }))

    updateActiveForm({
      fields: newFields,
      settings: template.settings,
      title: template.name,
    })

    toast.success("Template loaded", {
      description: `${template.name} has been loaded into your form.`,
    })
  }

  const clearForm = () => {
    setClearFormAlert(true)
  }

  const confirmClearForm = () => {
    if (!activeForm) return

    updateActiveForm({
      fields: [],
      title: "Untitled Form",
      description: "",
      settings: {
        submitButtonText: "Submit",
        successMessage: "Thank you for your submission!",
        allowMultipleSubmissions: true,
        showProgressBar: false,
      },
    })

    setSelectedFieldId(null)
    setHistory({ past: [], future: [] })
    setClearFormAlert(false)

    toast.success("Form cleared", {
      description: "All fields have been removed from your form.",
    })
  }

  const deleteForm = (formId: string) => {
    if (project.forms.length === 1) {
      toast.error("Cannot delete", {
        description: "You must have at least one form in your project.",
      })
      return
    }
    setDeleteFormAlert(formId)
  }

  const confirmDeleteForm = () => {
    if (!deleteFormAlert) return

    const formIndex = project.forms.findIndex((f) => f.id === deleteFormAlert)
    const newForms = project.forms.filter((f) => f.id !== deleteFormAlert)
    const newActiveFormId =
      project.activeFormId === deleteFormAlert ? newForms[Math.max(0, formIndex - 1)].id : project.activeFormId

    setProject((prev) => ({
      ...prev,
      forms: newForms,
      activeFormId: newActiveFormId,
      updatedAt: new Date().toISOString(),
    }))

    setSelectedFieldId(null)
    setHistory({ past: [], future: [] })
    setDeleteFormAlert(null)

    toast.error("Form deleted", {
      description: "The form has been removed from your project.",
    })
  }

  const renameForm = (formId: string, newTitle: string) => {
    setProject((prev) => ({
      ...prev,
      forms: prev.forms.map((form) =>
        form.id === formId ? { ...form, title: newTitle, updatedAt: new Date().toISOString() } : form,
      ),
      updatedAt: new Date().toISOString(),
    }))
  }

  const selectForm = (formId: string) => {
    setProject((prev) => ({
      ...prev,
      activeFormId: formId,
    }))
    setSelectedFieldId(null)
    setHistory({ past: [], future: [] })
  }

  const addField = (type: FormFieldType) => {
    if (!activeForm) return
    
    const fieldDefaults: Record<FormFieldType, Partial<FormField>> = {
      text: { placeholder: "Enter text" },
      email: { placeholder: "Enter email address" },
      number: { placeholder: "Enter number", min: 0 },
      textarea: { placeholder: "Enter detailed text" },
      select: { placeholder: "Select an option", options: ["Option 1", "Option 2", "Option 3"] },
      radio: { options: ["Option 1", "Option 2", "Option 3"] },
      checkbox: { options: ["Option 1", "Option 2", "Option 3"] },
      date: {},
      time: {},
      datetime: {},
      tel: { placeholder: "Enter phone number" },
      url: { placeholder: "https://example.com" },
      file: { accept: "" },
      range: { min: 0, max: 100, step: 1 },
      color: { defaultValue: "#000000" },
      rating: { max: 5 },
      label: {},
      heading: { label: "Section Heading" },
      paragraph: { label: "Add instructions or description text here." },
      divider: { label: "Divider" },
    }

    const newField: FormField = {
      id: `field-${Date.now()}`,
      type,
      label:
        type === "heading"
          ? "Section Heading"
          : type === "paragraph"
            ? "Add instructions or description text here."
            : type === "divider"
              ? "Divider"
              : `${type.charAt(0).toUpperCase() + type.slice(1)} Field`,
      required: false,
      ...fieldDefaults[type],
    }

    updateActiveForm({
      fields: [...activeForm.fields, newField],
    })
    setSelectedFieldId(newField.id)

    toast.success("Field added", {
      description: `${type.charAt(0).toUpperCase() + type.slice(1)} field has been added to your form.`,
    })
  }

  const updateField = (id: string, updates: Partial<FormField>) => {
    if (!activeForm) return
    
    updateActiveForm({
      fields: activeForm.fields.map((field) => (field.id === id ? { ...field, ...updates } : field)),
    })
  }

  const duplicateField = (id: string) => {
    if (!activeForm) return
    
    const fieldToDuplicate = activeForm.fields.find((field) => field.id === id)
    if (fieldToDuplicate) {
      const newField: FormField = {
        ...fieldToDuplicate,
        id: `field-${Date.now()}`,
        label: `${fieldToDuplicate.label} (Copy)`,
      }
      const index = activeForm.fields.findIndex((field) => field.id === id)
      const newFields = [...activeForm.fields]
      newFields.splice(index + 1, 0, newField)
      updateActiveForm({ fields: newFields })
      setSelectedFieldId(newField.id)

      toast.success("Field duplicated", {
        description: "The field has been duplicated successfully.",
      })
    }
  }

  const deleteField = (id: string) => {
    setDeleteFieldAlert(id)
  }

  const confirmDeleteField = () => {
    if (!deleteFieldAlert || !activeForm) return

    updateActiveForm({
      fields: activeForm.fields.filter((field) => field.id !== deleteFieldAlert),
    })
    if (selectedFieldId === deleteFieldAlert) {
      setSelectedFieldId(null)
    }
    setDeleteFieldAlert(null)

    toast.error("Field deleted", {
      description: "The field has been removed from your form.",
    })
  }

  const moveField = (id: string, direction: "up" | "down") => {
    if (!activeForm) return
    
    const index = activeForm.fields.findIndex((field) => field.id === id)
    if (index === -1) return

    if (direction === "up" && index > 0) {
      const newFields = [...activeForm.fields]
      ;[newFields[index - 1], newFields[index]] = [newFields[index], newFields[index - 1]]
      updateActiveForm({ fields: newFields })
    } else if (direction === "down" && index < activeForm.fields.length - 1) {
      const newFields = [...activeForm.fields]
      ;[newFields[index], newFields[index + 1]] = [newFields[index + 1], newFields[index]]
      updateActiveForm({ fields: newFields })
    }
  }

  const exportProject = () => {
    const exportData = {
      ...project,
      exportedAt: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${project.name.toLowerCase().replace(/\s+/g, "-")}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast.success("Project exported", {
      description: `All ${project.forms.length} form(s) have been exported as JSON.`,
    })
  }

  const handleSaveAsTemplate = async (template: FormTemplate) => {
    if (onSaveTemplate) {
      try {
        await onSaveTemplate(template)

        toast.success("Template saved", {
          description: `"${template.name}" has been saved to your custom templates.`,
        })
      } catch (error) {
        toast.error("Failed to save template", {
          description: error instanceof Error ? error.message : "An unknown error occurred",
        })
      }
    }
  }

  const selectedField = activeForm?.fields.find((field) => field.id === selectedFieldId)

  // Auto-open field configurator sheet on mobile when field is selected
  useEffect(() => {
    if (selectedFieldId && !previewMode && window.innerWidth < 1024) {
      // Use setTimeout to avoid synchronous setState in effect
      const timer = setTimeout(() => {
        setShowConfiguratorSheet(true)
      }, 0)
      return () => clearTimeout(timer)
    }
  }, [selectedFieldId, previewMode])

  return (
    <div className="flex flex-col h-full -mx-8 -my-4">
      <CommandPalette
        onAddField={addField}
        onSave={saveProject}
        onExport={exportProject}
        onImport={() => {}}
        onTogglePreview={() => setPreviewMode(!previewMode)}
        onToggleSettings={() => setShowSettings(!showSettings)}
        onUndo={undo}
        onRedo={redo}
        canUndo={history.past.length > 0}
        canRedo={history.future.length > 0}
      />

      <AlertDialog open={!!deleteFieldAlert} onOpenChange={() => setDeleteFieldAlert(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Field</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this field? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteField}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!deleteFormAlert} onOpenChange={() => setDeleteFormAlert(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Form</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this form? All fields and settings will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteForm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Form
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={clearFormAlert} onOpenChange={() => setClearFormAlert(false)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear Form</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to clear this form? All fields will be removed and the form will be reset to empty state.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmClearForm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Clear Form
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <FormTabs
        forms={project.forms}
        activeFormId={project.activeFormId}
        onSelectForm={selectForm}
        onAddForm={addForm}
        onDeleteForm={deleteForm}
        onRenameForm={renameForm}
        onDuplicateForm={duplicateForm}
      />

      <div className="flex flex-1 overflow-hidden h-full">
        {/* Left Sidebar - Component Library - Hidden on mobile, visible on desktop */}
        <div className="hidden lg:block w-72 border-r border-border bg-card p-4 overflow-y-auto">
          <div className="mb-4">
            <h2 className="text-lg font-semibold">Components</h2>
            <p className="text-sm text-muted-foreground">Click to add to form</p>
            <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
              <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border">
                <Undo className="h-3 w-3 inline" />K
              </kbd>
              <span>for quick actions</span>
            </div>
          </div>
          <ComponentLibrary onAddField={addField} />
        </div>

        {/* Center - Form Editor */}
        <div className="flex-1 overflow-y-auto p-6 bg-muted/20 h-full">
          <div className={cn("mx-auto transition-all", deviceMode === "desktop" ? "max-w-3xl" : "max-w-md")}>
            <Card className="mb-6 p-6 shadow-sm">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="form-title">Form Title</Label>
                  <Input
                    id="form-title"
                    value={activeForm?.title || ""}
                    onChange={(e) => updateActiveForm({ title: e.target.value })}
                    className="text-2xl font-bold border-0 px-0 focus-visible:ring-0"
                    placeholder="Enter form title"
                  />
                </div>
                <div>
                  <Label htmlFor="form-description">Form Description</Label>
                  <Textarea
                    id="form-description"
                    value={activeForm?.description || ""}
                    onChange={(e) => updateActiveForm({ description: e.target.value })}
                    placeholder="Enter form description (optional)"
                    rows={2}
                    className="resize-none"
                  />
                </div>
              </div>
            </Card>

            <div className="mb-4 flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">
                  Form Fields{" "}
                  {activeForm?.fields.length && activeForm.fields.length > 0 && (
                    <span className="text-muted-foreground">({activeForm.fields.length})</span>
                  )}
                </h3>
                {lastSaved && (
                  <span className="text-xs text-muted-foreground">Saved {lastSaved.toLocaleTimeString()}</span>
                )}
              </div>
              <div className="flex gap-2 flex-wrap">
                <FormTemplatesDialog onSelectTemplate={loadTemplate} />
                {activeForm && activeForm.fields.length > 0 && <SaveTemplateDialog form={activeForm} onSave={handleSaveAsTemplate} />}
                <ImportFormDialog onImport={importForm} />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={undo}
                  disabled={history.past.length === 0}
                  title="Undo (Ctrl+Z)"
                  className="lg:px-3"
                >
                  <Undo className="h-4 w-4" />
                  <span className="hidden lg:inline ml-2">Undo</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={redo}
                  disabled={history.future.length === 0}
                  title="Redo (Ctrl+Y)"
                  className="lg:px-3"
                >
                  <Redo className="h-4 w-4" />
                  <span className="hidden lg:inline ml-2">Redo</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDeviceMode(deviceMode === "desktop" ? "mobile" : "desktop")}
                  title="Toggle device preview"
                  className="lg:px-3"
                >
                  {deviceMode === "desktop" ? <Monitor className="h-4 w-4" /> : <Smartphone className="h-4 w-4" />}
                  <span className="hidden lg:inline ml-2">Device</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSettings(!showSettings)}
                  title="Form settings"
                  className="lg:px-3"
                >
                  <Settings className="h-4 w-4" />
                  <span className="hidden lg:inline ml-2">Settings</span>
                </Button>
                <Button variant="outline" size="sm" onClick={() => setPreviewMode(!previewMode)} className="lg:px-3">
                  <Eye className="h-4 w-4" />
                  <span className="hidden lg:inline ml-2">{previewMode ? "Edit" : "Preview"}</span>
                </Button>
                <Button variant="outline" size="sm" onClick={exportProject} className="lg:px-3">
                  <Download className="h-4 w-4" />
                  <span className="hidden lg:inline ml-2">Export</span>
                </Button>
                <Button size="sm" onClick={saveProject} className="lg:px-3">
                  <Save className="h-4 w-4" />
                  <span className="hidden lg:inline ml-2">Save</span>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={clearForm}
                  className="lg:px-3 text-destructive hover:bg-destructive/10 hover:text-destructive"
                  title="Clear form and remove all fields"
                >
                  <X className="h-4 w-4" />
                  <span className="hidden lg:inline ml-2">Clear</span>
                </Button>
              </div>
            </div>

            {showSettings && (
              <div className="mb-4">
                {activeForm && (
                  <FormSettingsPanel
                    settings={activeForm.settings}
                    onUpdate={(settings) => updateActiveForm({ settings })}
                  />
                )}
              </div>
            )}

            <div className="mb-4">{/* Field Search Component */}</div>

            {!activeForm || activeForm.fields.length === 0 ? (
              <Card className="p-12 text-center border-dashed">
                <p className="text-muted-foreground mb-2">No fields added yet</p>
                <p className="text-sm text-muted-foreground">
                  Click on components from the left sidebar to start building your form
                </p>
              </Card>
            ) : (
              activeForm && (
                <FormPreview
                  fields={activeForm.fields}
                  selectedFieldId={selectedFieldId}
                  onSelectField={setSelectedFieldId}
                  onDeleteField={deleteField}
                  onDuplicateField={duplicateField}
                  onMoveField={moveField}
                  previewMode={previewMode}
                />
              )
            )}
          </div>
        </div>

        {/* Right Sidebar - Field Configurator - Hidden on mobile, visible on desktop */}
        {selectedField && !previewMode && activeForm && (
          <div className="hidden lg:block w-80 border-l border-border bg-card p-4 overflow-y-auto">
            <FieldConfigurator
              field={selectedField}
              allFields={activeForm.fields}
              onUpdate={(updates) => updateField(selectedField.id, updates)}
            />
          </div>
        )}
      </div>

      {/* Mobile Bottom Sheets */}
      {/* Component Library Sheet for Mobile */}
      <Sheet open={showComponentSheet} onOpenChange={setShowComponentSheet}>
        <SheetContent side="bottom" className="h-[80vh] p-0">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Components</h2>
            <p className="text-sm text-muted-foreground">Click to add to form</p>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <ComponentLibrary onAddField={(type) => {
              addField(type)
              setShowComponentSheet(false)
            }} />
          </div>
        </SheetContent>
      </Sheet>

      {/* Field Configurator Sheet for Mobile */}
      {selectedField && !previewMode && activeForm && (
        <Sheet open={showConfiguratorSheet} onOpenChange={setShowConfiguratorSheet}>
          <SheetContent side="bottom" className="h-[80vh] p-0">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">Field Settings</h2>
              <p className="text-sm text-muted-foreground">Configure {selectedField.label}</p>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <FieldConfigurator
                field={selectedField}
                allFields={activeForm.fields}
                onUpdate={(updates) => updateField(selectedField.id, updates)}
              />
            </div>
          </SheetContent>
        </Sheet>
      )}

      {/* Floating Action Button for Mobile - Component Library */}
      <div className="lg:hidden fixed bottom-6 right-6 z-50">
        <Button
          size="lg"
          className="h-14 w-14 rounded-full shadow-lg"
          onClick={() => setShowComponentSheet(true)}
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>
    </div>
  )
}
