"use client"

import { useState, useEffect } from "react"
import { formTemplates } from "../lib/templates"
import type { FormTemplate } from "../lib/types"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Button } from "../ui/button"
import { Card } from "../ui/card"
import { FileText, Users, MessageSquare, Briefcase, Trash2, Sparkles } from "lucide-react"
import { ScrollArea } from "../ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
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
import { toast } from "sonner"

interface FormTemplatesDialogProps {
  onSelectTemplate: (template: FormTemplate) => void
  customTemplates?: FormTemplate[]
  onDeleteTemplate?: (templateId: string) => void | Promise<void>
  onLoadTemplates?: () => FormTemplate[] | Promise<FormTemplate[]>
}

const categoryIcons = {
  General: FileText,
  Events: Users,
  Feedback: MessageSquare,
  HR: Briefcase,
  Marketing: Sparkles,
  Sales: Sparkles,
  Support: MessageSquare,
  Other: FileText,
}

export function FormTemplatesDialog({
  onSelectTemplate,
  customTemplates: customTemplatesProp = [],
  onDeleteTemplate,
  onLoadTemplates
}: FormTemplatesDialogProps) {
  const [open, setOpen] = useState(false)
  const [customTemplates, setCustomTemplates] = useState<FormTemplate[]>(customTemplatesProp)
  const [deleteAlert, setDeleteAlert] = useState<string | null>(null)

  useEffect(() => {
    setCustomTemplates(customTemplatesProp)
  }, [customTemplatesProp])

  const handleSelectTemplate = (template: FormTemplate) => {
    onSelectTemplate(template)
    setOpen(false)
  }

  const handleDeleteTemplate = (templateId: string) => {
    setDeleteAlert(templateId)
  }

  const confirmDelete = async () => {
    if (!deleteAlert || !onDeleteTemplate) return

    try {
      await onDeleteTemplate(deleteAlert)

      // Reload templates if callback provided
      if (onLoadTemplates) {
        const templates = await onLoadTemplates()
        setCustomTemplates(templates)
      }

      setDeleteAlert(null)

      toast.error("Template deleted", {
        description: "Your custom template has been removed.",
      })
    } catch (error) {
      toast.error("Failed to delete template", {
        description: error instanceof Error ? error.message : "An unknown error occurred",
      })
    }
  }

  return (
    <>
      <AlertDialog open={!!deleteAlert} onOpenChange={() => setDeleteAlert(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Template</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this template? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={open} onOpenChange={async (open) => {
        setOpen(open)
        if (open && onLoadTemplates) {
          const templates = await onLoadTemplates()
          setCustomTemplates(templates)
        }
      }}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <FileText className="mr-2 h-4 w-4" />
            Use Template
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Choose a Template</DialogTitle>
            <DialogDescription>
              Start with a pre-built or custom template and customize it to your needs
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="prebuilt" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="prebuilt">Pre-built Templates</TabsTrigger>
              <TabsTrigger value="custom">
                My Templates {customTemplates.length > 0 && `(${customTemplates.length})`}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="prebuilt">
              <ScrollArea className="h-[500px] pr-4">
                <div className="grid grid-cols-2 gap-4">
                  {formTemplates.map((template) => {
                    const Icon = categoryIcons[template.category as keyof typeof categoryIcons] || FileText
                    return (
                      <Card
                        key={template.id}
                        className="p-4 cursor-pointer hover:border-primary transition-colors"
                        onClick={() => handleSelectTemplate(template)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <Icon className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold mb-1">{template.name}</h4>
                            <p className="text-sm text-muted-foreground mb-2">{template.description}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span className="px-2 py-0.5 rounded-full bg-muted">{template.category}</span>
                              <span>{template.fields.length} fields</span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    )
                  })}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="custom">
              <ScrollArea className="h-[500px] pr-4">
                {customTemplates.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-[400px] text-center">
                    <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No custom templates yet</h3>
                    <p className="text-sm text-muted-foreground max-w-sm">
                      Create your first custom template by building a form and clicking "Save as Template"
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    {customTemplates.map((template) => {
                      const Icon = categoryIcons[template.category as keyof typeof categoryIcons] || FileText
                      return (
                        <Card key={template.id} className="p-4 hover:border-primary transition-colors group relative">
                          <div
                            className="flex items-start gap-3 cursor-pointer"
                            onClick={() => handleSelectTemplate(template)}
                          >
                            <div className="p-2 rounded-lg bg-primary/10">
                              <Icon className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold mb-1">{template.name}</h4>
                              <p className="text-sm text-muted-foreground mb-2">{template.description}</p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span className="px-2 py-0.5 rounded-full bg-muted">{template.category}</span>
                                <span>{template.fields.length} fields</span>
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteTemplate(template.id)
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </Card>
                      )
                    })}
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  )
}
