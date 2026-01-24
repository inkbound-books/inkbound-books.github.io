import type { Metadata } from "next"
import { ContentSection } from "@/components/content-section"

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about the Inkbound Books team - a two-person team of authors and editors.",
}

const contacts = [
  { title: "Author", email: "inkbound.author@proton.me" },
  { title: "Editor/Developer", email: "inkbound.editor@proton.me" },
  { title: "Business Inquiries", email: "inkbound.business@proton.me" },
]

export default function AboutPage() {
  return (
    <main className="relative z-10 mx-auto min-h-screen max-w-3xl px-4 pt-32 pb-16 md:px-8">
      <h1 className="mb-12 text-4xl font-semibold text-foreground md:text-5xl">About Inkbound</h1>

      <ContentSection className="mb-8">
        <p className="mb-5 leading-relaxed text-muted-foreground">
          We are a two-person team consisting of a main author and an editor/developer.
        </p>
        <p className="leading-relaxed text-muted-foreground">
          Our passion lies in crafting compelling stories and ensuring they are presented with the
          highest quality. Every book we publish goes through a meticulous writing and editing
          process to deliver the best reading experience possible.
        </p>
      </ContentSection>

      <ContentSection className="mb-8">
        <h2 className="mb-6 text-2xl font-semibold text-foreground">Get in Touch</h2>
        <p className="mb-6 text-muted-foreground">You can reach out to us via email:</p>

        <ul className="mb-6 space-y-4">
          {contacts.map((contact) => (
            <li
              key={contact.email}
              className="rounded-lg bg-background p-4 transition-colors hover:bg-border/50"
            >
              <span className="mb-2 block text-lg font-semibold text-foreground">
                {contact.title}
              </span>
              <a href={`mailto:${contact.email}`} className="font-medium text-primary break-all hover:underline">
                {contact.email}
              </a>
            </li>
          ))}
        </ul>

        <p className="text-muted-foreground">
          For <span className="font-medium text-primary">business inquiries and book purchases</span>,
          please use the business email listed above.
        </p>
      </ContentSection>

      <ContentSection>
        <p className="text-muted-foreground">
          We appreciate your interest in Inkbound Books and look forward to sharing our stories with
          you!
        </p>
      </ContentSection>
    </main>
  )
}
