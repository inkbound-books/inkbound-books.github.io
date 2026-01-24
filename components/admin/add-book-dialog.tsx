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
import { Plus, Loader2 } from "lucide-react"

export function AddBookDialog() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description: "",
    cover_url: "",
    amazon_url: "",
    apple_url: "",
    kobo_url: "",
    price: "",
    is_published: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase.from("books").insert({
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

    if (!error) {
      setOpen(false)
      setFormData({
        title: "",
        author: "",
        description: "",
        cover_url: "",
        amazon_url: "",
        apple_url: "",
        kobo_url: "",
        price: "",
        is_published: false,
      })
      router.refresh()
    }

    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Book
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add New Book</DialogTitle>
          <DialogDescription>
            Add a new book to your catalog. Fill in the details below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="author">Author *</Label>
              <Input
                id="author"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cover_url">Cover Image URL</Label>
            <Input
              id="cover_url"
              type="url"
              value={formData.cover_url}
              onChange={(e) => setFormData({ ...formData, cover_url: e.target.value })}
              placeholder="https://example.com/cover.jpg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price (USD)</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              placeholder="9.99"
            />
          </div>

          <div className="space-y-4">
            <Label className="text-sm font-medium">Purchase Links</Label>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="amazon_url" className="text-xs text-muted-foreground">Amazon</Label>
                <Input
                  id="amazon_url"
                  type="url"
                  value={formData.amazon_url}
                  onChange={(e) => setFormData({ ...formData, amazon_url: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="apple_url" className="text-xs text-muted-foreground">Apple Books</Label>
                <Input
                  id="apple_url"
                  type="url"
                  value={formData.apple_url}
                  onChange={(e) => setFormData({ ...formData, apple_url: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="kobo_url" className="text-xs text-muted-foreground">Kobo</Label>
                <Input
                  id="kobo_url"
                  type="url"
                  value={formData.kobo_url}
                  onChange={(e) => setFormData({ ...formData, kobo_url: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Switch
              id="is_published"
              checked={formData.is_published}
              onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })}
            />
            <Label htmlFor="is_published">Publish immediately</Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Book"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
