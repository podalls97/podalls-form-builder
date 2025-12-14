"use client"

import type { FormField } from "../lib/types"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Textarea } from "../ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { Checkbox } from "../ui/checkbox"
import { Slider } from "../ui/slider"
import { Star } from "lucide-react"
import { useState } from "react"

interface FormFieldRendererProps {
  field: FormField
  previewMode: boolean
}

export function FormFieldRenderer({ field, previewMode }: FormFieldRendererProps) {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)

  const renderField = () => {
    switch (field.type) {
      case "label":
        return (
          <div>
            <h3 className="text-lg font-semibold">{field.label}</h3>
          </div>
        )

      case "heading":
        return (
          <div>
            <h2 className="text-2xl font-bold">{field.label}</h2>
          </div>
        )

      case "paragraph":
        return (
          <div>
            <p className="text-sm text-muted-foreground leading-relaxed">{field.label}</p>
          </div>
        )

      case "divider":
        return (
          <div className="py-2">
            <hr className="border-border" />
          </div>
        )

      case "text":
      case "email":
      case "number":
      case "tel":
      case "url":
        return (
          <div className="space-y-2">
            <Label>
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Input
              type={field.type}
              placeholder={field.placeholder}
              disabled={!previewMode}
              defaultValue={field.defaultValue}
              min={field.min}
              max={field.max}
            />
            {field.helperText && <p className="text-xs text-muted-foreground">{field.helperText}</p>}
          </div>
        )

      case "textarea":
        return (
          <div className="space-y-2">
            <Label>
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Textarea
              placeholder={field.placeholder}
              disabled={!previewMode}
              rows={4}
              defaultValue={field.defaultValue}
            />
            {field.helperText && <p className="text-xs text-muted-foreground">{field.helperText}</p>}
          </div>
        )

      case "select":
        return (
          <div className="space-y-2">
            <Label>
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Select disabled={!previewMode}>
              <SelectTrigger>
                <SelectValue placeholder={field.placeholder || "Select an option"} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option, index) => (
                  <SelectItem key={index} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {field.helperText && <p className="text-xs text-muted-foreground">{field.helperText}</p>}
          </div>
        )

      case "radio":
        return (
          <div className="space-y-3">
            <Label>
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <RadioGroup disabled={!previewMode}>
              {field.options?.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`${field.id}-${index}`} />
                  <Label htmlFor={`${field.id}-${index}`} className="font-normal cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
            {field.helperText && <p className="text-xs text-muted-foreground">{field.helperText}</p>}
          </div>
        )

      case "checkbox":
        return (
          <div className="space-y-3">
            <Label>
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <div className="space-y-2">
              {field.options?.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Checkbox id={`${field.id}-${index}`} disabled={!previewMode} />
                  <Label htmlFor={`${field.id}-${index}`} className="font-normal cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </div>
            {field.helperText && <p className="text-xs text-muted-foreground">{field.helperText}</p>}
          </div>
        )

      case "date":
        return (
          <div className="space-y-2">
            <Label>
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Input type="date" disabled={!previewMode} defaultValue={field.defaultValue} />
            {field.helperText && <p className="text-xs text-muted-foreground">{field.helperText}</p>}
          </div>
        )

      case "time":
        return (
          <div className="space-y-2">
            <Label>
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Input type="time" disabled={!previewMode} defaultValue={field.defaultValue} />
            {field.helperText && <p className="text-xs text-muted-foreground">{field.helperText}</p>}
          </div>
        )

      case "datetime":
        return (
          <div className="space-y-2">
            <Label>
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Input type="datetime-local" disabled={!previewMode} defaultValue={field.defaultValue} />
            {field.helperText && <p className="text-xs text-muted-foreground">{field.helperText}</p>}
          </div>
        )

      case "file":
        return (
          <div className="space-y-2">
            <Label>
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Input type="file" disabled={!previewMode} accept={field.accept} multiple={field.multiple} />
            {field.helperText && <p className="text-xs text-muted-foreground">{field.helperText}</p>}
          </div>
        )

      case "range":
        return (
          <div className="space-y-3">
            <Label>
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <div className="space-y-2">
              <Slider
                disabled={!previewMode}
                min={field.min ?? 0}
                max={field.max ?? 100}
                step={field.step ?? 1}
                defaultValue={[field.defaultValue ? Number(field.defaultValue) : (field.min ?? 0)]}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{field.min ?? 0}</span>
                <span>{field.max ?? 100}</span>
              </div>
            </div>
            {field.helperText && <p className="text-xs text-muted-foreground">{field.helperText}</p>}
          </div>
        )

      case "color":
        return (
          <div className="space-y-2">
            <Label>
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <div className="flex gap-3 items-center">
              <Input
                type="color"
                disabled={!previewMode}
                defaultValue={field.defaultValue || "#000000"}
                className="w-20 h-10 cursor-pointer"
              />
              <Input
                type="text"
                disabled={!previewMode}
                defaultValue={field.defaultValue || "#000000"}
                placeholder="#000000"
                className="flex-1"
              />
            </div>
            {field.helperText && <p className="text-xs text-muted-foreground">{field.helperText}</p>}
          </div>
        )

      case "rating":
        return (
          <div className="space-y-2">
            <Label>
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <div className="flex gap-1">
              {Array.from({ length: field.max ?? 5 }).map((_, index) => (
                <button
                  key={index}
                  type="button"
                  disabled={!previewMode}
                  onClick={() => setRating(index + 1)}
                  onMouseEnter={() => setHoverRating(index + 1)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transition-transform hover:scale-110 disabled:cursor-not-allowed"
                >
                  <Star
                    className={`h-6 w-6 ${
                      (hoverRating || rating) > index ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                    }`}
                  />
                </button>
              ))}
            </div>
            {field.helperText && <p className="text-xs text-muted-foreground">{field.helperText}</p>}
          </div>
        )

      default:
        return null
    }
  }

  return renderField()
}
