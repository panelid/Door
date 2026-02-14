"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createClient } from "@/lib/supabase/client"
import { Pencil } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

interface EditSlugDialogProps {
  slug: any
}

export function EditSlugDialog({ slug }: EditSlugDialogProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState(() => {
    switch (slug.type) {
      case "whatsapp":
        return {
          phone: slug.data.phone || "",
          message: slug.data.message || "",
        }
      case "paste":
        return {
          content: slug.data.content || "",
          password: slug.paste_password || "",
        }
      case "shorturl":
        return {
          url: slug.data.url || "",
        }
      case "linktree":
        return {
          links: slug.data.links || [],
        }
      default:
        return {}
    }
  })
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const supabase = createClient()

    try {
      const updateData: any = {
        updated_at: new Date().toISOString(),
      }

      if (slug.type === "paste") {
        const { password, ...dataWithoutPassword } = formData as any
        updateData.data = dataWithoutPassword
        updateData.paste_password = password || null
      } else {
        updateData.data = formData
      }

      const { error } = await supabase
        .from("slugs")
        .update(updateData)
        .eq("id", slug.id)

      if (error) throw error

      toast.success("Link updated successfully!")
      setOpen(false)
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || "Failed to update link")
    } finally {
      setIsLoading(false)
    }
  }

  const renderFormFields = () => {
    switch (slug.type) {
      case "whatsapp":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="628123456789"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Custom Message (Optional)</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Hello! I'm interested in..."
                rows={3}
              />
            </div>
          </>
        )
      case "paste":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Your text content here..."
                rows={8}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Edit Password (Optional)</Label>
              <Input
                id="password"
                type="password"
                value={formData.password || ""}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Leave empty for public editing"
              />
              <p className="text-xs text-muted-foreground">
                Set a password to require authentication before allowing others to edit this paste
              </p>
            </div>
          </div>
        )
      case "shorturl":
        return (
          <div className="space-y-2">
            <Label htmlFor="url">Destination URL</Label>
            <Input
              id="url"
              type="url"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              placeholder="https://example.com"
              required
            />
          </div>
        )
      case "linktree":
        return (
          <div className="space-y-4">
            <Label>Links</Label>
            {formData.links.map((link: any, index: number) => (
              <div key={index} className="space-y-2 p-4 border rounded-lg">
                <Input
                  value={link.title}
                  onChange={(e) => {
                    const newLinks = [...formData.links]
                    newLinks[index].title = e.target.value
                    setFormData({ ...formData, links: newLinks })
                  }}
                  placeholder="Link title"
                />
                <Input
                  value={link.url}
                  onChange={(e) => {
                    const newLinks = [...formData.links]
                    newLinks[index].url = e.target.value
                    setFormData({ ...formData, links: newLinks })
                  }}
                  placeholder="https://..."
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    const newLinks = formData.links.filter((_: any, i: number) => i !== index)
                    setFormData({ ...formData, links: newLinks })
                  }}
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setFormData({
                  ...formData,
                  links: [...formData.links, { title: "", url: "" }],
                })
              }}
            >
              Add Link
            </Button>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Link</DialogTitle>
          <DialogDescription>
            Update the details for your {slug.type} link: {slug.slug}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">{renderFormFields()}</div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
