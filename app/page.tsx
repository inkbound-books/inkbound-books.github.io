import Link from "next/link"
import { ContentSection } from "@/components/content-section"

export default function HomePage() {
  return (
    <main className="relative z-10 mx-auto min-h-screen max-w-3xl px-4 pt-32 pb-16 md:px-8">
      <h1 className="mb-4 text-4xl font-semibold leading-tight text-foreground md:text-5xl text-balance">
        Welcome to Inkbound Books
      </h1>
      <p className="mb-12 text-lg font-light text-muted-foreground md:text-xl">
        We are a small team dedicated to writing and editing books.
      </p>

      <ContentSection>
        <p className="mb-5 leading-relaxed text-muted-foreground">
          We currently sell <span className="font-medium text-primary">E-books only</span>. To
          purchase a book, please browse our{" "}
          <Link href="/catalog" className="font-medium text-primary hover:underline">
            catalog
          </Link>{" "}
          and then email us using the format below.
        </p>

        <div className="my-6 rounded-lg border-l-4 border-primary bg-background p-6">
          <p className="mb-3 text-lg font-semibold text-foreground">
            Email:{" "}
            <a
              href="mailto:inkbound.business@proton.me"
              className="font-normal text-primary hover:underline"
            >
              <code className="rounded bg-muted px-2 py-1 text-sm">inkbound.business@proton.me</code>
            </a>
          </p>
          <p className="mb-2 font-semibold text-foreground">Email Subject:</p>
          <p className="mb-4 text-muted-foreground">Purchase Book</p>
          <p className="mb-2 font-semibold text-foreground">Email Content:</p>
          <ul className="space-y-2 pl-4 text-muted-foreground">
            <li className="relative pl-6 before:absolute before:left-0 before:font-bold before:text-primary before:content-['→']">
              Book Name
            </li>
            <li className="relative pl-6 before:absolute before:left-0 before:font-bold before:text-primary before:content-['→']">
              E-book Format
            </li>
            <li className="relative pl-6 before:absolute before:left-0 before:font-bold before:text-primary before:content-['→']">
              Payment ID (if applicable)
            </li>
          </ul>
        </div>

        <p className="mb-5 leading-relaxed text-muted-foreground">
          We support a limited range of E-book formats. You can view the supported formats{" "}
          <Link href="/formats" className="font-medium text-primary hover:underline">
            here
          </Link>
          .
        </p>

        <p className="leading-relaxed text-muted-foreground">
          If you need a different format, include a request in your email and we will try to fulfill
          it. If we are unable to do so, you will be provided with an EPUB file, which you may
          convert on your own.
        </p>
      </ContentSection>
    </main>
  )
}
