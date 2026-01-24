import { createClient } from "@/lib/supabase/server"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, FileText, Layers } from "lucide-react"
import Link from "next/link"

export default async function AdminDashboardPage() {
  const supabase = await createClient()
  
  const [booksResult, formatsResult, pagesResult] = await Promise.all([
    supabase.from("books").select("*", { count: "exact", head: true }),
    supabase.from("formats").select("*", { count: "exact", head: true }),
    supabase.from("pages").select("*", { count: "exact", head: true }),
  ])

  const stats = [
    {
      title: "Total Books",
      value: booksResult.count || 0,
      icon: BookOpen,
      href: "/admin/books",
      description: "Books in catalog",
    },
    {
      title: "Formats",
      value: formatsResult.count || 0,
      icon: FileText,
      href: "/admin/formats",
      description: "Supported e-book formats",
    },
    {
      title: "Pages",
      value: pagesResult.count || 0,
      icon: Layers,
      href: "/admin/pages",
      description: "Editable content pages",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />
      <main className="pl-64">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">Welcome to the Inkbound Admin Dashboard</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {stats.map((stat) => {
              const Icon = stat.icon
              return (
                <Link key={stat.title} href={stat.href}>
                  <Card className="transition-colors hover:border-primary">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        {stat.title}
                      </CardTitle>
                      <Icon className="h-5 w-5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{stat.value}</div>
                      <CardDescription>{stat.description}</CardDescription>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>
      </main>
    </div>
  )
}
