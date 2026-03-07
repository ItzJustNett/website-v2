"use client"

import { cn } from "@/lib/utils"
import { ReactNode } from "react"

interface EditorialCardProps {
  children: ReactNode
  className?: string
  compact?: boolean
}

export function EditorialCard({
  children,
  className,
  compact = false,
}: EditorialCardProps) {
  return (
    <div
      className={cn(
        compact ? "editorial-card-compact" : "editorial-card",
        className
      )}
    >
      {children}
    </div>
  )
}
