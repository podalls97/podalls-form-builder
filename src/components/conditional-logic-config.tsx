"use client"

import { Label } from "../ui/label"
import { Switch } from "../ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Input } from "../ui/input"
import type { FormField } from "../lib/types"

interface ConditionalLogicConfigProps {
  field: FormField
  allFields: FormField[]
  onUpdate: (updates: Partial<FormField>) => void
}

export function ConditionalLogicConfig({ field, allFields, onUpdate }: ConditionalLogicConfigProps) {
  const availableFields = allFields.filter(
    (f) => f.id !== field.id && !["heading", "paragraph", "divider", "label"].includes(f.type),
  )

  const enabled = field.conditionalLogic?.enabled || false

  const handleToggle = (checked: boolean) => {
    if (checked && availableFields.length > 0) {
      onUpdate({
        conditionalLogic: {
          enabled: true,
          fieldId: availableFields[0].id,
          operator: "equals",
          value: "",
        },
      })
    } else {
      onUpdate({
        conditionalLogic: {
          enabled: false,
          fieldId: "",
          operator: "equals",
          value: "",
        },
      })
    }
  }

  if (availableFields.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-muted/30 p-3">
        <p className="text-xs text-muted-foreground">Add more fields to enable conditional logic</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="conditional-enabled">Conditional Logic</Label>
        <Switch id="conditional-enabled" checked={enabled} onCheckedChange={handleToggle} />
      </div>

      {enabled && (
        <div className="space-y-3 pl-4 border-l-2 border-primary/20">
          <p className="text-xs text-muted-foreground">Show this field when:</p>

          <div>
            <Label className="text-xs">Field</Label>
            <Select
              value={field.conditionalLogic?.fieldId}
              onValueChange={(value) =>
                onUpdate({
                  conditionalLogic: {
                    ...field.conditionalLogic!,
                    fieldId: value,
                  },
                })
              }
            >
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Select field" />
              </SelectTrigger>
              <SelectContent>
                {availableFields.map((f) => (
                  <SelectItem key={f.id} value={f.id}>
                    {f.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs">Condition</Label>
            <Select
              value={field.conditionalLogic?.operator}
              onValueChange={(value: any) =>
                onUpdate({
                  conditionalLogic: {
                    ...field.conditionalLogic!,
                    operator: value,
                  },
                })
              }
            >
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="equals">Equals</SelectItem>
                <SelectItem value="not_equals">Not Equals</SelectItem>
                <SelectItem value="contains">Contains</SelectItem>
                <SelectItem value="greater_than">Greater Than</SelectItem>
                <SelectItem value="less_than">Less Than</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs">Value</Label>
            <Input
              value={field.conditionalLogic?.value || ""}
              onChange={(e) =>
                onUpdate({
                  conditionalLogic: {
                    ...field.conditionalLogic!,
                    value: e.target.value,
                  },
                })
              }
              placeholder="Enter value"
              className="h-9"
            />
          </div>
        </div>
      )}
    </div>
  )
}
