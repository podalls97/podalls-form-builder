"use client"

import { useState } from "react"
import { Input } from "../ui/input"
import { Search, X } from "lucide-react"
import { Button } from "../ui/button"
import type { FormField } from "../lib/types"

interface FieldSearchProps {
  fields: FormField[]
  onSelectField: (id: string) => void
}

export function FieldSearch({ fields, onSelectField }: FieldSearchProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredFields = fields.filter(
    (field) =>
      field.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      field.type.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  if (fields.length < 5) return null

  return (
    <div className="mb-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
          placeholder="Search fields..."
          className="pl-9 pr-9"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
            onClick={() => setSearchQuery("")}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {searchQuery && (
        <div className="mt-2 text-sm text-muted-foreground">
          Found {filteredFields.length} field{filteredFields.length !== 1 ? "s" : ""}
          {filteredFields.length > 0 && filteredFields.length < fields.length && (
            <div className="mt-2 space-y-1">
              {filteredFields.map((field) => (
                <button
                  key={field.id}
                  onClick={() => onSelectField(field.id)}
                  className="block w-full text-left px-3 py-2 rounded-md hover:bg-muted transition-colors"
                >
                  <span className="font-medium">{field.label}</span>
                  <span className="ml-2 text-xs text-muted-foreground">({field.type})</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
