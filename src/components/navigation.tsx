"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "../lib/utils"
import { LayoutDashboard, Users } from "lucide-react"

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="border-b border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <span className="text-sm font-bold text-primary-foreground">FB</span>
              </div>
              <span className="text-lg font-semibold">Form Builder</span>
            </Link>

            <div className="flex gap-1">
              <Link
                href="/admin"
                className={cn(
                  "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                  pathname?.startsWith("/admin")
                    ? "bg-secondary text-secondary-foreground"
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground",
                )}
              >
                <LayoutDashboard className="h-4 w-4" />
                Admin
              </Link>
              <Link
                href="/user"
                className={cn(
                  "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                  pathname?.startsWith("/user")
                    ? "bg-secondary text-secondary-foreground"
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground",
                )}
              >
                <Users className="h-4 w-4" />
                User
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
