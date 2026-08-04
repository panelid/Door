"use client"

import type React from "react"
import { useState } from "react"
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
import { Pencil, QrCode, Eye } from "lucide-react"
import { useRouter } from "next/navigation"
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
        return { phone: slug.data.phone || "", message: slug.data.message || "" }
      case "paste":
        return { content: slug.data.content || "", password: slug.paste_password || "" }
      case "shorturl":
        return { url: slug.data.url || "" }
      case "linktree":
        return { links: slug.data.links || [] }
      default:
        return {}
    }
  })
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (slug.type === "paste") {
        const { password, content } = formData as any
        const res = await fetch("/api/paste/update", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slug: slug.slug, content, password: password || undefined }),
        })
        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.error || "Failed to update paste")
        }
        if (password !== slug.paste_password) {
          const supabase = createClient()
          const { error } = await supabase.from("slugs").update({ paste_password: password || null }).eq("id", slug.id)
          if (error) throw error
        }
      } else {
        const supabase = createClient()
        const updateData: any = { updated_at: new Date().toISOString(), data: formData }
        const { error } = await supabase.from("slugs").update(updateData).eq("id", slug.id)
        if (error) throw error
      }

      toast.success("Link updated successfully!")
      setOpen(false)
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || "Failed to update link")
    } finally {
      setIsLoading(false)
    }
  }

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://door.id/${slug.slug}`
  const viewCount = slug.visit_count || 0

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
              <p className="text-xs text-muted-foreground">Set a password to require authentication before allowing others to edit this paste</p>
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
            <div className="flex items-center gap-4 text-sm">
              <span>door.id/{slug.slug}</span>
              <span className="flex items-center gap-1">
                <Eye className="h-3.5 w-3.5" />
                {viewCount} views
              </span>
            </div>
            <span className="text-xs">Update the details for your {slug.type} link</span>
          </DialogDescription>
        </DialogHeader>

        {/* QR Code Preview Section */}
        <div className="border-2 border-dashed border-neutral-300 rounded-2xl p-5 mb-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <QrCode className="h-4 w-4 text-violet-600" />
            <span className="font-bold text-neutral-900">QR Code untuk door.id/{slug.slug}</span>
          </div>
          <img src={qrUrl} alt="QR Code" className="mx-auto w-24 h-24 object-contain rounded border-2 border-black shadow-[2px_2px_0_0_#111]" />
          <a 
            href={qrUrl} 
            download={`door-${slug.slug}-qr.png`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-3 text-xs font-bold text-violet-600 hover:underline"
          >
            ⬇️ Download QR (PNG)
          </a>
        </div>

        {/* Edit Form */}
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