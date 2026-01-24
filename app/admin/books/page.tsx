import { createClient } from "@/lib/supabase/server"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { BooksTable } from "@/components/admin/books-table"
import { AddBookDialog } from "@/components/admin/add-book-dialog"

export default async function AdminBooksPage() {
  const supabase = await createClient()
  const { data: books } = await supabase
    .from("books")
    .select("*")
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />
      <main className="pl-64">
        <div className="p-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Books</h1>
              <p className="text-muted-foreground">Manage your book catalog</p>
            </div>
            <AddBookDialog />
          </div>

          <BooksTable books={books || []} />
        </div>
      </main>
    </div>
  )
}
