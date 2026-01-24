import { createClient } from "@/lib/supabase/server"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { PagesManager } from "@/components/admin/pages-manager"

export default async function AdminPagesPage() {
  const supabase = await createClient()
  const { data: pages } = await supabase
    .from("pages")
    .select("*")
    .order("slug", { ascending: true })

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />
      <main className="pl-64">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Pages</h1>
            <p className="text-muted-foreground">Edit the content of your website pages</p>
          </div>

          <PagesManager pages={pages || []} />
        </div>
      </main>
    </div>
  )
}
