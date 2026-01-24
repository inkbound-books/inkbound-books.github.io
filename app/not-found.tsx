import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, BookOpen } from "lucide-react"

export default function NotFound() {
  return (
    <main className="relative z-10 mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-4 text-center">
      <div className="mb-8 flex h-32 w-32 items-center justify-center rounded-full bg-card">
        <BookOpen className="h-16 w-16 text-primary" />
      </div>

      <h1 className="mb-4 text-6xl font-bold text-foreground md:text-8xl">404</h1>

      <h2 className="mb-4 text-2xl font-semibold text-foreground md:text-3xl">Page Not Found</h2>

      <p className="mb-8 max-w-md text-lg text-muted-foreground">
        Looks like this page got lost between the chapters. The story you&apos;re looking for
        doesn&apos;t exist here.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <Button asChild size="lg">
          <Link href="/">
            <Home className="mr-2 h-5 w-5" />
            Back to Home
          </Link>
        </Button>

        <Button asChild variant="outline" size="lg">
          <Link href="/catalog">
            <BookOpen className="mr-2 h-5 w-5" />
            Browse Catalog
          </Link>
        </Button>
      </div>
    </main>
  )
}
