import { createClient } from "@/lib/supabase/server"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { FormatsManager } from "@/components/admin/formats-manager"

export default async function AdminFormatsPage() {
  const supabase = await createClient()
  const { data: formats } = await supabase
    .from("formats")
    .select("*")
    .order("name", { ascending: true })

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />
      <main className="pl-64">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Supported Formats</h1>
            <p className="text-muted-foreground">Manage the e-book formats displayed on your website</p>
          </div>

          <FormatsManager formats={formats || []} />
        </div>
      </main>
    </div>
  )
}
