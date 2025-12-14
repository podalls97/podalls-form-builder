"use client"

import type { FormField } from "../lib/types"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Switch } from "../ui/switch"
import { Textarea } from "../ui/textarea"
import { Plus, X } from "lucide-react"
import { ScrollArea } from "../ui/scroll-area"
import { ConditionalLogicConfig } from "./conditional-logic-config"
import { Separator } from "../ui/separator"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible"
import { ChevronDown } from "lucide-react"
import { useState } from "react"

interface FieldConfiguratorProps {
  field: FormField
  allFields: FormField[]
  onUpdate: (updates: Partial<FormField>) => void
}

export function FieldConfigurator({ field, allFields, onUpdate }: FieldConfiguratorProps) {
  const [advancedOpen, setAdvancedOpen] = useState(false)

  const hasOptions = field.type === "select" || field.type === "radio" || field.type === "checkbox"
  const hasMinMax = field.type === "number" || field.type === "range"
  const hasFileConfig = field.type === "file"
  const isLayoutElement =
    field.type === "label" || field.type === "heading" || field.type === "paragraph" || field.type === "divider"

  const addOption = () => {
    const currentOptions = field.options || []
    onUpdate({ options: [...currentOptions, `Option ${currentOptions.length + 1}`] })
  }

  const updateOption = (index: number, value: string) => {
    const newOptions = [...(field.options || [])]
    newOptions[index] = value
    onUpdate({ options: newOptions })
  }

  const removeOption = (index: number) => {
    const newOptions = field.options?.filter((_: unknown, i: number) => i !== index)
    onUpdate({ options: newOptions })
  }

  return (
    <ScrollArea className="h-full">
      <div className="space-y-6 pr-4">
        <div>
          <h3 className="mb-1 text-lg font-semibold">Field Settings</h3>
          <p className="text-xs text-muted-foreground">Configure the selected field</p>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="field-label">{field.type === "paragraph" ? "Content" : "Label"}</Label>
            {field.type === "paragraph" ? (
              <Textarea
                id="field-label"
                value={field.label}
                onChange={(e) => onUpdate({ label: e.target.value })}
                placeholder="Enter paragraph text"
                rows={4}
              />
            ) : (
              <Input
                id="field-label"
                value={field.label}
                onChange={(e) => onUpdate({ label: e.target.value })}
                placeholder="Enter field label"
              />
            )}
          </div>

          {!isLayoutElement && field.type !== "rating" && field.type !== "color" && field.type !== "range" && (
            <div>
              <Label htmlFor="field-placeholder">Placeholder</Label>
              <Input
                id="field-placeholder"
                value={field.placeholder || ""}
                onChange={(e) => onUpdate({ placeholder: e.target.value })}
                placeholder="Enter placeholder text"
              />
            </div>
          )}

          {!isLayoutElement && (
            <div>
              <Label htmlFor="field-helper">Helper Text</Label>
              <Input
                id="field-helper"
                value={field.helperText || ""}
                onChange={(e) => onUpdate({ helperText: e.target.value })}
                placeholder="Additional help text (optional)"
              />
            </div>
          )}

          {!isLayoutElement && !hasOptions && field.type !== "file" && field.type !== "rating" && (
            <div>
              <Label htmlFor="field-default">Default Value</Label>
              <Input
                id="field-default"
                type={field.type === "number" ? "number" : "text"}
                value={field.defaultValue || ""}
                onChange={(e) => onUpdate({ defaultValue: e.target.value })}
                placeholder="Default value (optional)"
              />
            </div>
          )}

          {!isLayoutElement && (
            <div className="flex items-center justify-between">
              <Label htmlFor="field-required">Required Field</Label>
              <Switch
                id="field-required"
                checked={field.required || false}
                onCheckedChange={(checked) => onUpdate({ required: checked })}
              />
            </div>
          )}

          {hasMinMax && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="field-min">Min Value</Label>
                  <Input
                    id="field-min"
                    type="number"
                    value={field.min ?? ""}
                    onChange={(e) => onUpdate({ min: e.target.value ? Number(e.target.value) : undefined })}
                    placeholder="Min"
                  />
                </div>
                <div>
                  <Label htmlFor="field-max">Max Value</Label>
                  <Input
                    id="field-max"
                    type="number"
                    value={field.max ?? ""}
                    onChange={(e) => onUpdate({ max: e.target.value ? Number(e.target.value) : undefined })}
                    placeholder="Max"
                  />
                </div>
              </div>
              {field.type === "range" && (
                <div>
                  <Label htmlFor="field-step">Step</Label>
                  <Input
                    id="field-step"
                    type="number"
                    value={field.step ?? 1}
                    onChange={(e) => onUpdate({ step: e.target.value ? Number(e.target.value) : 1 })}
                    placeholder="Step value"
                  />
                </div>
              )}
            </>
          )}

          {hasFileConfig && (
            <>
              <div>
                <Label htmlFor="field-accept">Accepted File Types</Label>
                <Input
                  id="field-accept"
                  value={field.accept || ""}
                  onChange={(e) => onUpdate({ accept: e.target.value })}
                  placeholder="e.g., .pdf,.doc,.jpg"
                />
                <p className="mt-1 text-xs text-muted-foreground">Leave empty to accept all file types</p>
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="field-multiple">Allow Multiple Files</Label>
                <Switch
                  id="field-multiple"
                  checked={field.multiple || false}
                  onCheckedChange={(checked) => onUpdate({ multiple: checked })}
                />
              </div>
            </>
          )}

          {field.type === "rating" && (
            <div>
              <Label htmlFor="field-max-rating">Maximum Stars</Label>
              <Input
                id="field-max-rating"
                type="number"
                value={field.max ?? 5}
                onChange={(e) => onUpdate({ max: e.target.value ? Number(e.target.value) : 5 })}
                placeholder="Max stars"
                min={1}
                max={10}
              />
            </div>
          )}

          {hasOptions && (
            <div>
              <div className="mb-2 flex items-center justify-between">
                <Label>Options</Label>
                <Button size="sm" variant="outline" onClick={addOption}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
              <div className="space-y-2">
                {field.options?.map((option: string, index: number) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={option}
                      onChange={(e) => updateOption(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => removeOption(index)}
                      disabled={(field.options?.length || 0) <= 1}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              {field.type === "select" && (
                <div className="mt-3 flex items-center justify-between">
                  <Label htmlFor="field-multiple-select">Allow Multiple Selection</Label>
                  <Switch
                    id="field-multiple-select"
                    checked={field.multiple || false}
                    onCheckedChange={(checked) => onUpdate({ multiple: checked })}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {!isLayoutElement && (
          <>
            <Separator />
            <Collapsible open={advancedOpen} onOpenChange={setAdvancedOpen}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between p-0 h-auto font-semibold">
                  Advanced Settings
                  <ChevronDown className={`h-4 w-4 transition-transform ${advancedOpen ? "rotate-180" : ""}`} />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-4">
                <ConditionalLogicConfig field={field} allFields={allFields} onUpdate={onUpdate} />
              </CollapsibleContent>
            </Collapsible>
          </>
        )}

        <Separator />

        <div className="rounded-lg border border-border bg-muted/30 p-3 space-y-1">
          <p className="text-xs text-muted-foreground">
            <span className="font-medium">Type:</span> {field.type}
          </p>
          <p className="text-xs text-muted-foreground">
            <span className="font-medium">ID:</span> {field.id}
          </p>
        </div>
      </div>
    </ScrollArea>
  )
}
