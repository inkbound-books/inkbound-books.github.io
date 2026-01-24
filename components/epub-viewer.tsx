"use client"

import React from "react"

import { useState, useCallback, useRef } from "react"
import { Upload, ChevronLeft, ChevronRight, X, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import JSZip from "jszip"

interface BookMetadata {
  title: string
  author: string
}

interface Chapter {
  path: string
  zip: JSZip
}

export function EpubViewer() {
  const [error, setError] = useState<string | null>(null)
  const [isViewerOpen, setIsViewerOpen] = useState(false)
  const [bookMetadata, setBookMetadata] = useState<BookMetadata>({ title: "", author: "" })
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [currentChapter, setCurrentChapter] = useState(0)
  const [chapterContent, setChapterContent] = useState("")
  const [fontSize, setFontSize] = useState(100)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const bookDataRef = useRef<{ zip: JSZip; opfDir: string } | null>(null)

  const resolveRelativePath = (basePath: string, relativePath: string): string => {
    const baseDir = basePath.substring(0, basePath.lastIndexOf("/") + 1)
    const parts = (baseDir + relativePath).split("/")
    const resolved: string[] = []

    for (const part of parts) {
      if (part === "..") {
        resolved.pop()
      } else if (part !== "." && part !== "") {
        resolved.push(part)
      }
    }

    return resolved.join("/")
  }

  const loadChapter = useCallback(
    async (index: number, chaptersData: Chapter[]) => {
      if (index < 0 || index >= chaptersData.length) return

      const chapter = chaptersData[index]
      try {
        const file = chapter.zip.file(chapter.path)
        if (!file) return

        let content = await file.async("text")
        const parser = new DOMParser()
        const doc = parser.parseFromString(content, "text/html")

        // Process images
        const images = doc.querySelectorAll("img")
        for (const img of images) {
          const src = img.getAttribute("src")
          if (src && !src.startsWith("http")) {
            const imgPath = resolveRelativePath(chapter.path, src)
            try {
              const imgFile = chapter.zip.file(imgPath)
              if (imgFile) {
                const blob = await imgFile.async("blob")
                img.src = URL.createObjectURL(blob)
              }
            } catch {
              console.warn("Could not load image:", imgPath)
            }
          }
        }

        const body = doc.querySelector("body")
        setChapterContent(body ? body.innerHTML : content)
        setCurrentChapter(index)
      } catch (err) {
        console.error("Error loading chapter:", err)
      }
    },
    []
  )

  const parseEPUB = async (zip: JSZip): Promise<Chapter[]> => {
    const containerFile = zip.file("META-INF/container.xml")
    if (!containerFile) throw new Error("Invalid EPUB: Missing container.xml")

    const containerXML = await containerFile.async("text")
    const parser = new DOMParser()
    const containerDoc = parser.parseFromString(containerXML, "text/xml")
    const rootfileEl = containerDoc.querySelector("rootfile")
    if (!rootfileEl) throw new Error("Invalid EPUB: Missing rootfile")

    const opfPath = rootfileEl.getAttribute("full-path")
    if (!opfPath) throw new Error("Invalid EPUB: Missing OPF path")

    const opfDir = opfPath.substring(0, opfPath.lastIndexOf("/") + 1)

    const opfFile = zip.file(opfPath)
    if (!opfFile) throw new Error("Invalid EPUB: Missing OPF file")

    const opfContent = await opfFile.async("text")
    const opfDoc = parser.parseFromString(opfContent, "text/xml")

    // Get metadata
    const titleEl = opfDoc.querySelector("title")
    const authorEl = opfDoc.querySelector("creator")
    setBookMetadata({
      title: titleEl?.textContent || "Unknown Title",
      author: authorEl?.textContent || "Unknown Author",
    })

    // Get manifest
    const manifest: Record<string, { href: string; mediaType: string }> = {}
    opfDoc.querySelectorAll("manifest item").forEach((item) => {
      const id = item.getAttribute("id")
      if (id) {
        manifest[id] = {
          href: item.getAttribute("href") || "",
          mediaType: item.getAttribute("media-type") || "",
        }
      }
    })

    // Get spine items (reading order)
    const chaptersData: Chapter[] = []
    opfDoc.querySelectorAll("spine itemref").forEach((itemref) => {
      const idref = itemref.getAttribute("idref")
      if (idref && manifest[idref]) {
        chaptersData.push({
          path: opfDir + manifest[idref].href,
          zip,
        })
      }
    })

    bookDataRef.current = { zip, opfDir }
    return chaptersData
  }

  const handleFile = async (file: File) => {
    if (!file.name.endsWith(".epub")) {
      setError("Please select a valid EPUB file")
      return
    }

    try {
      setError(null)
      const arrayBuffer = await file.arrayBuffer()
      const zip = await JSZip.loadAsync(arrayBuffer)
      const chaptersData = await parseEPUB(zip)
      setChapters(chaptersData)
      setIsViewerOpen(true)
      await loadChapter(0, chaptersData)
    } catch (err) {
      setError(`Error loading EPUB file: ${err instanceof Error ? err.message : "Unknown error"}`)
      console.error(err)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setIsDragging(false)
  }, [])

  const closeBook = () => {
    setIsViewerOpen(false)
    setChapters([])
    setCurrentChapter(0)
    setChapterContent("")
    setBookMetadata({ title: "", author: "" })
    bookDataRef.current = null
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const progress = chapters.length > 0 ? ((currentChapter + 1) / chapters.length) * 100 : 0

  if (!isViewerOpen) {
    return (
      <>
        {error && (
          <div className="mb-4 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
            {error}
          </div>
        )}

        <div
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={cn(
            "cursor-pointer rounded-2xl border-2 border-dashed border-border bg-card p-12 text-center transition-all hover:border-primary hover:bg-background",
            isDragging && "border-primary bg-primary/5"
          )}
        >
          <label className="flex cursor-pointer flex-col items-center gap-4">
            <Upload className="h-16 w-16 text-primary" />
            <span className="text-xl font-medium text-foreground">
              Click to upload or drag & drop
            </span>
            <span className="text-muted-foreground">Select an EPUB file to read</span>
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept=".epub"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      </>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      {/* Progress bar */}
      <div className="h-1 w-full bg-border">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border bg-background p-4">
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold text-foreground">
            {bookMetadata.title} - {bookMetadata.author}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Font size control */}
          <div className="flex items-center gap-1 rounded-lg border border-border bg-card px-2 py-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setFontSize((s) => Math.max(50, s - 10))}
              aria-label="Decrease font size"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="min-w-[3rem] text-center text-sm text-muted-foreground">
              {fontSize}%
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setFontSize((s) => Math.min(200, s + 10))}
              aria-label="Increase font size"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <Button
            onClick={() => loadChapter(currentChapter - 1, chapters)}
            disabled={currentChapter === 0}
            size="sm"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Previous
          </Button>

          <Button
            onClick={() => loadChapter(currentChapter + 1, chapters)}
            disabled={currentChapter >= chapters.length - 1}
            size="sm"
          >
            Next
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>

          <Button variant="outline" size="sm" onClick={closeBook}>
            <X className="mr-1 h-4 w-4" />
            Close
          </Button>
        </div>
      </div>

      {/* Content */}
      <div
        className="max-h-[calc(100vh-300px)] min-h-[500px] overflow-y-auto bg-white p-8 text-gray-900"
        style={{
          fontSize: `${fontSize}%`,
          fontFamily: "Georgia, 'Times New Roman', serif",
          lineHeight: 1.8,
        }}
        // biome-ignore lint/security/noDangerouslySetInnerHtml: EPUB content is user-provided
        dangerouslySetInnerHTML={{ __html: chapterContent }}
      />
    </div>
  )
}
