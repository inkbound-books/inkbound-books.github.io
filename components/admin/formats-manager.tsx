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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react"

interface Format {
  id: string
  name: string
  extension: string
  description: string | null
  icon: string | null
}

interface FormatsManagerProps {
  formats: Format[]
}

export function FormatsManager({ formats }: FormatsManagerProps) {
  const router = useRouter()
  const [addOpen, setAddOpen] = useState(false)
  const [editOpen, setEditOpen] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [newFormat, setNewFormat] = useState({
    name: "",
    extension: "",
    description: "",
    icon: "",
  })
  const [editFormat, setEditFormat] = useState<Format | null>(null)

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    await supabase.from("formats").insert({
      name: newFormat.name,
      extension: newFormat.extension,
      description: newFormat.description || null,
      icon: newFormat.icon || null,
    })
    setAddOpen(false)
    setNewFormat({ name: "", extension: "", description: "", icon: "" })
    setLoading(false)
    router.refresh()
  }

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editFormat) return
    setLoading(true)
    const supabase = createClient()
    await supabase
      .from("formats")
      .update({
        name: editFormat.name,
        extension: editFormat.extension,
        description: editFormat.description || null,
        icon: editFormat.icon || null,
      })
      .eq("id", editFormat.id)
    setEditOpen(null)
    setEditFormat(null)
    setLoading(false)
    router.refresh()
  }

  const handleDelete = async (id: string) => {
    const supabase = createClient()
    await supabase.from("formats").delete().eq("id", id)
    router.refresh()
  }

  return (
    <div className="space-y-6">
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogTrigger asChild>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Format
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Format</DialogTitle>
            <DialogDescription>Add a new e-book format to the supported formats list.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Format Name *</Label>
                <Input
                  id="name"
                  value={newFormat.name}
                  onChange={(e) => setNewFormat({ ...newFormat, name: e.target.value })}
                  placeholder="EPUB"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="extension">Extension *</Label>
                <Input
                  id="extension"
                  value={newFormat.extension}
                  onChange={(e) => setNewFormat({ ...newFormat, extension: e.target.value })}
                  placeholder=".epub"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newFormat.description}
                onChange={(e) => setNewFormat({ ...newFormat, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="icon">Icon (emoji or text)</Label>
              <Input
                id="icon"
                value={newFormat.icon}
                onChange={(e) => setNewFormat({ ...newFormat, icon: e.target.value })}
                placeholder="📖"
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setAddOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Add Format
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {formats.map((format) => (
          <Card key={format.id}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg">
                  {format.icon && <span>{format.icon}</span>}
                  {format.name}
                </CardTitle>
                <div className="flex items-center gap-1">
                  <Dialog
                    open={editOpen === format.id}
                    onOpenChange={(open) => {
                      setEditOpen(open ? format.id : null)
                      if (open) setEditFormat(format)
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Format</DialogTitle>
                        <DialogDescription>Update the format details.</DialogDescription>
                      </DialogHeader>
                      {editFormat && (
                        <form onSubmit={handleEdit} className="space-y-4">
                          <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                              <Label>Format Name *</Label>
                              <Input
                                value={editFormat.name}
                                onChange={(e) => setEditFormat({ ...editFormat, name: e.target.value })}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Extension *</Label>
                              <Input
                                value={editFormat.extension}
                                onChange={(e) => setEditFormat({ ...editFormat, extension: e.target.value })}
                                required
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea
                              value={editFormat.description || ""}
                              onChange={(e) => setEditFormat({ ...editFormat, description: e.target.value })}
                              rows={3}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Icon</Label>
                            <Input
                              value={editFormat.icon || ""}
                              onChange={(e) => setEditFormat({ ...editFormat, icon: e.target.value })}
                            />
                          </div>
                          <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setEditOpen(null)}>
                              Cancel
                            </Button>
                            <Button type="submit" disabled={loading}>
                              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                              Save
                            </Button>
                          </DialogFooter>
                        </form>
                      )}
                    </DialogContent>
                  </Dialog>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Format</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{format.name}"?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(format.id)}>Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
              <CardDescription className="font-mono text-sm">{format.extension}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{format.description || "No description"}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {formats.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">No formats added yet.</p>
            <p className="text-sm text-muted-foreground">Add your first format to get started.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
