import type { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Catalog",
  description: "Browse our collection of e-books available for purchase.",
}

export default async function CatalogPage() {
  const supabase = await createClient()
  const { data: books } = await supabase
    .from("books")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false })

  if (!books || books.length === 0) {
    return (
      <main className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-4 pt-32 pb-16 md:px-8">
        <div className="text-center">
          <h1 className="mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-5xl font-bold text-transparent md:text-7xl">
            Coming Soon!
          </h1>
          <p className="text-lg text-muted-foreground md:text-xl">
            Our catalog is currently being prepared. Check back soon for available books.
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="relative z-10 mx-auto min-h-screen max-w-7xl px-4 pt-32 pb-16 md:px-8">
      <h1 className="mb-4 text-4xl font-bold text-foreground md:text-5xl">
        Our Books
      </h1>
      <p className="mb-12 text-lg text-muted-foreground">
        Browse our collection of quality e-books
      </p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {books.map((book) => (
          <Card key={book.id} className="flex flex-col overflow-hidden transition-shadow hover:shadow-lg">
            {book.cover_url && (
              <div className="relative aspect-[2/3] w-full bg-muted">
                <Image
                  src={book.cover_url || "/placeholder.svg"}
                  alt={book.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <CardHeader className="flex-1">
              <CardTitle className="line-clamp-2">{book.title}</CardTitle>
              <CardDescription className="text-sm">by {book.author}</CardDescription>
              {book.price && (
                <p className="mt-2 text-lg font-semibold text-primary">
                  ${book.price.toFixed(2)}
                </p>
              )}
            </CardHeader>
            <CardContent>
              {book.description && (
                <p className="mb-4 text-sm text-muted-foreground line-clamp-3">
                  {book.description}
                </p>
              )}
              <div className="flex flex-wrap gap-2">
                {book.amazon_url && (
                  <Link href={book.amazon_url} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Amazon
                    </Button>
                  </Link>
                )}
                {book.apple_url && (
                  <Link href={book.apple_url} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Apple
                    </Button>
                  </Link>
                )}
                {book.kobo_url && (
                  <Link href={book.kobo_url} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Kobo
                    </Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  )
}
