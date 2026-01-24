import type { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { ContentSection } from "@/components/content-section"
import { FileText, BookOpen } from "lucide-react"

export const metadata: Metadata = {
  title: "Supported Formats",
  description: "View the e-book formats we support for our digital books.",
}

function FormatIcon({ icon }: { icon: string | null }) {
  if (icon) {
    return <span className="text-2xl">{icon}</span>
  }
  return <BookOpen className="h-6 w-6 text-primary" />
}

export default async function FormatsPage() {
  const supabase = await createClient()
  const { data: formats } = await supabase
    .from("formats")
    .select("*")
    .order("name", { ascending: true })

  return (
    <main className="relative z-10 mx-auto min-h-screen max-w-3xl px-4 pt-32 pb-16 md:px-8">
      <h1 className="mb-4 text-4xl font-semibold text-foreground md:text-5xl">
        Supported E-Book Formats
      </h1>
      <p className="mb-12 text-lg font-light text-muted-foreground">
        We offer our books in multiple formats for your convenience
      </p>

      <ContentSection className="mb-8">
        {formats && formats.length > 0 ? (
          <ul className="my-8 space-y-4">
            {formats.map((format) => (
              <li
                key={format.id}
                className="flex items-center gap-4 rounded-lg border-l-4 border-primary bg-background p-5 transition-transform hover:translate-x-2 hover:shadow-md"
              >
                <FormatIcon icon={format.icon} />
                <div>
                  <span className="block text-lg font-semibold text-foreground">
                    {format.name}
                    <span className="ml-2 font-mono text-sm text-muted-foreground">
                      {format.extension}
                    </span>
                  </span>
                  {format.description && (
                    <span className="text-sm text-muted-foreground">{format.description}</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="py-8 text-center text-muted-foreground">
            Format information coming soon.
          </p>
        )}

        <div className="mt-8 rounded-xl border-2 border-primary bg-background p-6">
          <p className="mb-3 text-lg font-semibold text-primary">Recommended Format</p>
          <p className="text-muted-foreground">
            We highly recommend <span className="font-medium text-primary">EPUB</span> as it is the
            most widely supported and reliable format across different devices and e-readers. EPUB
            files maintain proper formatting, support rich text features, and provide the best
            reading experience.
          </p>
        </div>
      </ContentSection>

      <ContentSection>
        <p className="mb-5 leading-relaxed text-muted-foreground">
          If you need a format not listed here, please include your request in your purchase email.
          We will do our best to accommodate your needs.
        </p>
        <p className="leading-relaxed text-muted-foreground">
          If we are unable to provide your requested format, you will receive an EPUB file that you
          can convert using free tools such as Calibre.
        </p>
      </ContentSection>
    </main>
  )
}
