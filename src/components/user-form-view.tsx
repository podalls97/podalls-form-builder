"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "../ui/card"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Textarea } from "../ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { Checkbox } from "../ui/checkbox"
import { toast } from "sonner"
import { FileText } from "lucide-react"

// Sample form data - in a real app, this would come from an API
const sampleForm = {
  id: "sample-form",
  title: "Contact Information Form",
  description: "Please fill out your contact information below",
  fields: [
    {
      id: "field-1",
      type: "label" as const,
      label: "Personal Information",
    },
    {
      id: "field-2",
      type: "text" as const,
      label: "Full Name",
      placeholder: "Enter your full name",
      required: true,
    },
    {
      id: "field-3",
      type: "email" as const,
      label: "Email Address",
      placeholder: "your.email@example.com",
      required: true,
    },
    {
      id: "field-4",
      type: "number" as const,
      label: "Phone Number",
      placeholder: "Enter your phone number",
      required: false,
    },
    {
      id: "field-5",
      type: "label" as const,
      label: "Additional Details",
    },
    {
      id: "field-6",
      type: "select" as const,
      label: "How did you hear about us?",
      placeholder: "Select an option",
      required: true,
      options: ["Social Media", "Search Engine", "Friend Referral", "Advertisement", "Other"],
    },
    {
      id: "field-7",
      type: "radio" as const,
      label: "Preferred Contact Method",
      required: true,
      options: ["Email", "Phone", "Text Message"],
    },
    {
      id: "field-8",
      type: "checkbox" as const,
      label: "Areas of Interest",
      required: false,
      options: ["Product Updates", "Newsletter", "Special Offers", "Events"],
    },
    {
      id: "field-9",
      type: "textarea" as const,
      label: "Additional Comments",
      placeholder: "Tell us more about yourself...",
      required: false,
    },
    {
      id: "field-10",
      type: "date" as const,
      label: "Preferred Contact Date",
      required: false,
    },
  ],
}

export function UserFormView() {
  const [formData, setFormData] = useState<Record<string, string | string[]>>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate required fields
    const requiredFields = sampleForm.fields.filter((field) => field.required)
    const missingFields = requiredFields.filter((field) => !formData[field.id])

    if (missingFields.length > 0) {
      toast.error("Missing Required Fields", {
        description: "Please fill out all required fields marked with *",
      })
      return
    }

    toast.success("Form Submitted Successfully!", {
      description: "Thank you for your submission.",
    })

    console.log("Form Data:", formData)
  }

  const updateField = (fieldId: string, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }))
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <Card className="p-8">
        <div className="mb-8 flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
            <FileText className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-balance">{sampleForm.title}</h1>
            {sampleForm.description && <p className="mt-2 text-muted-foreground">{sampleForm.description}</p>}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {sampleForm.fields.map((field) => {
            switch (field.type) {
              case "label":
                return (
                  <div key={field.id} className="pt-4">
                    <h3 className="text-lg font-semibold border-b border-border pb-2">{field.label}</h3>
                  </div>
                )

              case "text":
              case "email":
              case "number":
                return (
                  <div key={field.id} className="space-y-2">
                    <Label htmlFor={field.id}>
                      {field.label}
                      {field.required && <span className="text-destructive ml-1">*</span>}
                    </Label>
                    <Input
                      id={field.id}
                      type={field.type}
                      placeholder={field.placeholder}
                      value={(formData[field.id] as string) || ""}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField(field.id, e.target.value)}
                      required={field.required}
                    />
                  </div>
                )

              case "textarea":
                return (
                  <div key={field.id} className="space-y-2">
                    <Label htmlFor={field.id}>
                      {field.label}
                      {field.required && <span className="text-destructive ml-1">*</span>}
                    </Label>
                    <Textarea
                      id={field.id}
                      placeholder={field.placeholder}
                      value={(formData[field.id] as string) || ""}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateField(field.id, e.target.value)}
                      required={field.required}
                      rows={4}
                    />
                  </div>
                )

              case "select":
                return (
                  <div key={field.id} className="space-y-2">
                    <Label htmlFor={field.id}>
                      {field.label}
                      {field.required && <span className="text-destructive ml-1">*</span>}
                    </Label>
                    <Select
                      value={(formData[field.id] as string) || ""}
                      onValueChange={(value: string) => updateField(field.id, value)}
                      required={field.required}
                    >
                      <SelectTrigger id={field.id}>
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
                  </div>
                )

              case "radio":
                return (
                  <div key={field.id} className="space-y-3">
                    <Label>
                      {field.label}
                      {field.required && <span className="text-destructive ml-1">*</span>}
                    </Label>
                    <RadioGroup
                      value={(formData[field.id] as string) || ""}
                      onValueChange={(value: string) => updateField(field.id, value)}
                      required={field.required}
                    >
                      {field.options?.map((option, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <RadioGroupItem value={option} id={`${field.id}-${index}`} />
                          <Label htmlFor={`${field.id}-${index}`} className="font-normal cursor-pointer">
                            {option}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                )

              case "checkbox":
                return (
                  <div key={field.id} className="space-y-3">
                    <Label>
                      {field.label}
                      {field.required && <span className="text-destructive ml-1">*</span>}
                    </Label>
                    <div className="space-y-2">
                      {field.options?.map((option, index) => {
                        const checked = ((formData[field.id] as string[]) || []).includes(option)
                        return (
                          <div key={index} className="flex items-center space-x-2">
                            <Checkbox
                              id={`${field.id}-${index}`}
                              checked={checked}
                              onCheckedChange={(isChecked: boolean) => {
                                const currentValues = (formData[field.id] as string[]) || []
                                const newValues = isChecked
                                  ? [...currentValues, option]
                                  : currentValues.filter((v) => v !== option)
                                updateField(field.id, newValues)
                              }}
                            />
                            <Label htmlFor={`${field.id}-${index}`} className="font-normal cursor-pointer">
                              {option}
                            </Label>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )

              case "date":
                return (
                  <div key={field.id} className="space-y-2">
                    <Label htmlFor={field.id}>
                      {field.label}
                      {field.required && <span className="text-destructive ml-1">*</span>}
                    </Label>
                    <Input
                      id={field.id}
                      type="date"
                      value={(formData[field.id] as string) || ""}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField(field.id, e.target.value)}
                      required={field.required}
                    />
                  </div>
                )

              default:
                return null
            }
          })}

          <div className="flex gap-4 pt-4">
            <Button type="submit" size="lg" className="flex-1">
              Submit Form
            </Button>
            <Button type="button" variant="outline" size="lg" onClick={() => setFormData({})}>
              Clear
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
