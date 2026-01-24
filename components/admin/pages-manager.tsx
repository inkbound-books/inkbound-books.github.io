"use client"

import React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Pencil, Loader2, ExternalLink } from "lucide-react"
import Link from "next/link"

interface Page {
  id: string
  slug: string
  title: string
  content: string | null
  meta_description: string | null
  updated_at: string
}

interface PagesManagerProps {
  pages: Page[]
}

export function PagesManager({ pages }: PagesManagerProps) {
  const router = useRouter()
  const [editOpen, setEditOpen] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [editPage, setEditPage] = useState<Page | null>(null)

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editPage) return
    setLoading(true)
    const supabase = createClient()
    await supabase
      .from("pages")
      .update({
        title: editPage.title,
        content: editPage.content,
        meta_description: editPage.meta_description,
      })
      .eq("id", editPage.id)
    setEditOpen(null)
    setEditPage(null)
    setLoading(false)
    router.refresh()
  }

  const getPageUrl = (slug: string) => {
    switch (slug) {
      case "home":
        return "/"
      case "about":
        return "/about"
      case "catalog":
        return "/catalog"
      case "formats":
        return "/formats"
      default:
        return `/${slug}`
    }
  }

  return (
    <div className="space-y-4">
      {pages.map((page) => (
        <Card key={page.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">{page.title}</CardTitle>
                <CardDescription className="font-mono text-sm">/{page.slug}</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Link href={getPageUrl(page.slug)} target="_blank">
                  <Button variant="outline" size="sm">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View
                  </Button>
                </Link>
                <Dialog
                  open={editOpen === page.id}
                  onOpenChange={(open) => {
                    setEditOpen(open ? page.id : null)
                    if (open) setEditPage(page)
                  }}
                >
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Edit Page: {page.title}</DialogTitle>
                      <DialogDescription>Update the page content and metadata.</DialogDescription>
                    </DialogHeader>
                    {editPage && (
                      <form onSubmit={handleEdit} className="space-y-4">
                        <div className="space-y-2">
                          <Label>Page Title</Label>
                          <Input
                            value={editPage.title}
                            onChange={(e) => setEditPage({ ...editPage, title: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Meta Description (SEO)</Label>
                          <Textarea
                            value={editPage.meta_description || ""}
                            onChange={(e) => setEditPage({ ...editPage, meta_description: e.target.value })}
                            rows={2}
                            placeholder="Brief description for search engines..."
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Content (HTML supported)</Label>
                          <Textarea
                            value={editPage.content || ""}
                            onChange={(e) => setEditPage({ ...editPage, content: e.target.value })}
                            rows={12}
                            className="font-mono text-sm"
                            placeholder="Enter page content..."
                          />
                        </div>
                        <DialogFooter>
                          <Button type="button" variant="outline" onClick={() => setEditOpen(null)}>
                            Cancel
                          </Button>
                          <Button type="submit" disabled={loading}>
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Save Changes
                          </Button>
                        </DialogFooter>
                      </form>
                    )}
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {page.meta_description || "No description set"}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              Last updated: {new Date(page.updated_at).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>
      ))}

      {pages.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">No pages found.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
