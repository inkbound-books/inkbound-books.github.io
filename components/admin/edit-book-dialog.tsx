"use client"

import React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Pencil, Loader2 } from "lucide-react"

interface Book {
  id: string
  title: string
  author: string
  description: string | null
  cover_url: string | null
  amazon_url: string | null
  apple_url: string | null
  kobo_url: string | null
  price: number | null
  is_published: boolean
}

export function EditBookDialog({ book }: { book: Book }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: book.title,
    author: book.author,
    description: book.description || "",
    cover_url: book.cover_url || "",
    amazon_url: book.amazon_url || "",
    apple_url: book.apple_url || "",
    kobo_url: book.kobo_url || "",
    price: book.price?.toString() || "",
    is_published: book.is_published,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase
      .from("books")
      .update({
        title: formData.title,
        author: formData.author,
        description: formData.description || null,
        cover_url: formData.cover_url || null,
        amazon_url: formData.amazon_url || null,
        apple_url: formData.apple_url || null,
        kobo_url: formData.kobo_url || null,
        price: formData.price ? parseFloat(formData.price) : null,
        is_published: formData.is_published,
      })
      .eq("id", book.id)

    if (!error) {
      setOpen(false)
      router.refresh()
    }

    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Book</DialogTitle>
          <DialogDescription>
            Update the book details below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Title *</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-author">Author *</Label>
              <Input
                id="edit-author"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-description">Description</Label>
            <Textarea
              id="edit-description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-cover_url">Cover Image URL</Label>
            <Input
              id="edit-cover_url"
              type="url"
              value={formData.cover_url}
              onChange={(e) => setFormData({ ...formData, cover_url: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-price">Price (USD)</Label>
            <Input
              id="edit-price"
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            />
          </div>

          <div className="space-y-4">
            <Label className="text-sm font-medium">Purchase Links</Label>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="edit-amazon_url" className="text-xs text-muted-foreground">Amazon</Label>
                <Input
                  id="edit-amazon_url"
                  type="url"
                  value={formData.amazon_url}
                  onChange={(e) => setFormData({ ...formData, amazon_url: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-apple_url" className="text-xs text-muted-foreground">Apple Books</Label>
                <Input
                  id="edit-apple_url"
                  type="url"
                  value={formData.apple_url}
                  onChange={(e) => setFormData({ ...formData, apple_url: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-kobo_url" className="text-xs text-muted-foreground">Kobo</Label>
                <Input
                  id="edit-kobo_url"
                  type="url"
                  value={formData.kobo_url}
                  onChange={(e) => setFormData({ ...formData, kobo_url: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Switch
              id="edit-is_published"
              checked={formData.is_published}
              onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })}
            />
            <Label htmlFor="edit-is_published">Published</Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
