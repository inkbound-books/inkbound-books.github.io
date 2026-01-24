import React from "react"
import { cn } from "@/lib/utils"

interface ContentSectionProps {
  children: React.ReactNode
  className?: string
}

export function ContentSection({ children, className }: ContentSectionProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md md:p-10",
        className
      )}
    >
      {children}
    </div>
  )
}
