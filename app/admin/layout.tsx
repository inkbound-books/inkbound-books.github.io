import React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Inkbound Books Admin Dashboard",
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
