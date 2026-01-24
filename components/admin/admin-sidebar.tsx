"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { logoutAdmin } from "@/app/admin/login/actions"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  BookOpen,
  FileText,
  LayoutDashboard,
  LogOut,
  Settings,
  Home,
} from "lucide-react"

const sidebarLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/books", label: "Books", icon: BookOpen },
  { href: "/admin/formats", label: "Formats", icon: FileText },
  { href: "/admin/pages", label: "Pages", icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    await logoutAdmin()
    router.push("/admin/login")
    router.refresh()
  }

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-card">
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center border-b border-border px-6">
          <Link href="/admin" className="font-[family-name:var(--font-display)] text-2xl text-primary">
            Inkbound Admin
          </Link>
        </div>
        
        <nav className="flex-1 space-y-1 p-4">
          {sidebarLinks.map((link) => {
            const Icon = link.icon
            const isActive = pathname === link.href || 
              (link.href !== "/admin" && pathname.startsWith(link.href))
            
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-border p-4 space-y-2">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Home className="h-4 w-4" />
            View Website
          </Link>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 px-3"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>
    </aside>
  )
}
