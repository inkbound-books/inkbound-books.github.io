import type { Metadata } from "next"
import { EpubViewer } from "@/components/epub-viewer"

export const metadata: Metadata = {
  title: "EPUB Viewer",
  description: "Read your EPUB files directly in the browser.",
}

export default function EpubViewerPage() {
  return (
    <main className="relative z-10 mx-auto min-h-screen max-w-6xl px-4 pt-28 pb-8 md:px-8">
      <h1 className="mb-8 text-center text-3xl font-semibold text-foreground md:text-4xl">
        EPUB Viewer
      </h1>
      <EpubViewer />
    </main>
  )
}
