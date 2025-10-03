"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { MessageSquare, Link2, FileText, Users } from "lucide-react"

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (type: string, formData: FormData) => {
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    const supabase = createClient()

    try {
      // Check if user is authenticated
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      const slug = formData.get("slug") as string

      // Check if slug already exists
      const { data: existingSlug } = await supabase.from("slugs").select("slug").eq("slug", slug).single()

      if (existingSlug) {
        setError("This slug is already taken. Please choose another one.")
        setIsLoading(false)
        return
      }

      let data: Record<string, unknown> = {}

      switch (type) {
        case "whatsapp":
          data = {
            phone: formData.get("phone") as string,
            message: (formData.get("message") as string) || "",
          }
          break
        case "paste":
          data = { content: formData.get("content") as string }
          break
        case "linktree": {
          const links = []
          let i = 0
          while (formData.get(`link-title-${i}`)) {
            links.push({
              title: formData.get(`link-title-${i}`) as string,
              url: formData.get(`link-url-${i}`) as string,
            })
            i++
          }
          data = { links }
          break
        }
        case "shorturl":
          data = { url: formData.get("url") as string }
          break
      }

      const { error: insertError } = await supabase.from("slugs").insert({
        user_id: user.id,
        slug,
        type,
        data,
      })

      if (insertError) throw insertError

      setSuccess(`Success! Your link is ready at: ${window.location.origin}/${slug}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Link2 className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold">Door.id</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/dashboard">Dashboard</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/login">Login</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-12">
        <div className="mx-auto max-w-4xl space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              One Link, Infinite Possibilities
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Create custom short links for WhatsApp, share text snippets, build your link-in-bio, or shorten any URL.
              All in one place.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Create Your Link</CardTitle>
              <CardDescription>Choose a feature below and create your custom link</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="whatsapp" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="whatsapp" className="gap-2">
                    <MessageSquare className="h-4 w-4" />
                    <span className="hidden sm:inline">WhatsApp</span>
                  </TabsTrigger>
                  <TabsTrigger value="paste" className="gap-2">
                    <FileText className="h-4 w-4" />
                    <span className="hidden sm:inline">Paste</span>
                  </TabsTrigger>
                  <TabsTrigger value="linktree" className="gap-2">
                    <Users className="h-4 w-4" />
                    <span className="hidden sm:inline">Linktree</span>
                  </TabsTrigger>
                  <TabsTrigger value="shorturl" className="gap-2">
                    <Link2 className="h-4 w-4" />
                    <span className="hidden sm:inline">Short URL</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="whatsapp">
                  <WhatsAppForm onSubmit={handleSubmit} isLoading={isLoading} />
                </TabsContent>

                <TabsContent value="paste">
                  <PasteForm onSubmit={handleSubmit} isLoading={isLoading} />
                </TabsContent>

                <TabsContent value="linktree">
                  <LinktreeForm onSubmit={handleSubmit} isLoading={isLoading} />
                </TabsContent>

                <TabsContent value="shorturl">
                  <ShortUrlForm onSubmit={handleSubmit} isLoading={isLoading} />
                </TabsContent>
              </Tabs>

              {error && <div className="mt-4 p-4 bg-destructive/10 text-destructive rounded-lg text-sm">{error}</div>}
              {success && <div className="mt-4 p-4 bg-green-500/10 text-green-600 rounded-lg text-sm">{success}</div>}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

function WhatsAppForm({
  onSubmit,
  isLoading,
}: {
  onSubmit: (type: string, formData: FormData) => void
  isLoading: boolean
}) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    onSubmit("whatsapp", formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
      <div className="space-y-2">
        <Label htmlFor="wa-slug">Custom Slug</Label>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">door.id/</span>
          <Input id="wa-slug" name="slug" placeholder="my-whatsapp" required />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="wa-phone">WhatsApp Number (with country code)</Label>
        <Input id="wa-phone" name="phone" placeholder="628123456789" required />
        <p className="text-xs text-muted-foreground">Example: 628123456789 (without + or spaces)</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="wa-message">Custom Message (optional)</Label>
        <Textarea id="wa-message" name="message" placeholder="Hi, I'm interested in..." rows={3} />
        <p className="text-xs text-muted-foreground">This message will be pre-filled when someone opens WhatsApp</p>
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Creating..." : "Create WhatsApp Link"}
      </Button>
    </form>
  )
}

function PasteForm({
  onSubmit,
  isLoading,
}: {
  onSubmit: (type: string, formData: FormData) => void
  isLoading: boolean
}) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    onSubmit("paste", formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
      <div className="space-y-2">
        <Label htmlFor="paste-slug">Custom Slug</Label>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">door.id/</span>
          <Input id="paste-slug" name="slug" placeholder="my-paste" required />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="paste-content">Content</Label>
        <Textarea
          id="paste-content"
          name="content"
          placeholder="Paste your text here..."
          rows={8}
          required
          className="font-mono text-sm"
        />
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Creating..." : "Create Paste"}
      </Button>
    </form>
  )
}

function LinktreeForm({
  onSubmit,
  isLoading,
}: {
  onSubmit: (type: string, formData: FormData) => void
  isLoading: boolean
}) {
  const [links, setLinks] = useState([{ title: "", url: "" }])

  const addLink = () => {
    setLinks([...links, { title: "", url: "" }])
  }

  const removeLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    onSubmit("linktree", formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
      <div className="space-y-2">
        <Label htmlFor="linktree-slug">Custom Slug</Label>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">door.id/</span>
          <Input id="linktree-slug" name="slug" placeholder="my-links" required />
        </div>
      </div>
      <div className="space-y-4">
        <Label>Links</Label>
        {links.map((link, index) => (
          <div key={index} className="flex gap-2">
            <div className="flex-1 space-y-2">
              <Input name={`link-title-${index}`} placeholder="Link Title" required />
              <Input name={`link-url-${index}`} type="url" placeholder="https://example.com" required />
            </div>
            {links.length > 1 && (
              <Button type="button" variant="outline" size="icon" onClick={() => removeLink(index)}>
                ×
              </Button>
            )}
          </div>
        ))}
        <Button type="button" variant="outline" onClick={addLink} className="w-full bg-transparent">
          + Add Link
        </Button>
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Creating..." : "Create Linktree"}
      </Button>
    </form>
  )
}

function ShortUrlForm({
  onSubmit,
  isLoading,
}: {
  onSubmit: (type: string, formData: FormData) => void
  isLoading: boolean
}) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    onSubmit("shorturl", formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
      <div className="space-y-2">
        <Label htmlFor="short-slug">Custom Slug</Label>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">door.id/</span>
          <Input id="short-slug" name="slug" placeholder="my-link" required />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="short-url">Destination URL</Label>
        <Input id="short-url" name="url" type="url" placeholder="https://example.com" required />
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Creating..." : "Create Short URL"}
      </Button>
    </form>
  )
}
