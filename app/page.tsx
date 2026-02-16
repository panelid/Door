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
import { MessageSquare, Link2, FileText, Users, Sparkles, Zap, Shield } from "lucide-react"

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
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      const slug = formData.get("slug") as string

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

      const pastePassword = type === "paste" ? (formData.get("paste_password") as string) || null : null

      const { error: insertError } = await supabase.from("slugs").insert({
        user_id: user.id,
        slug,
        type,
        data,
        ...(type === "paste" && pastePassword ? { paste_password: pastePassword } : {}),
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
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/30 animate-gradient">
      <header className="border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground shadow-lg group-hover:shadow-xl transition-all group-hover:scale-105">
              <Link2 className="h-6 w-6" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Door.id
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild className="hidden sm:flex">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
            <Button asChild className="shadow-lg hover:shadow-xl transition-all">
              <Link href="/auth/login">Masuk</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-16 md:py-24">
        <div className="mx-auto max-w-6xl space-y-16">
          <div className="text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary mb-4">
              <Sparkles className="h-4 w-4" />
              Platform Link Management Terbaik di Indonesia
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-balance leading-tight">
              Satu Link,{" "}
              <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                Kemungkinan Tak Terbatas
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed text-pretty">
              Buat link WhatsApp custom, bagikan teks, bangun link-in-bio Anda, atau perpendek URL apapun. Semua dalam
              satu platform yang powerful dan mudah digunakan.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto pt-8">
              <div className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-card/50 backdrop-blur border border-border/50 hover:border-primary/50 transition-all hover:shadow-lg">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">Super Cepat</h3>
                <p className="text-sm text-muted-foreground text-center">Buat link custom dalam hitungan detik</p>
              </div>
              <div className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-card/50 backdrop-blur border border-border/50 hover:border-primary/50 transition-all hover:shadow-lg">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">Aman & Terpercaya</h3>
                <p className="text-sm text-muted-foreground text-center">Data Anda dilindungi dengan enkripsi</p>
              </div>
              <div className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-card/50 backdrop-blur border border-border/50 hover:border-primary/50 transition-all hover:shadow-lg">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">Mudah Digunakan</h3>
                <p className="text-sm text-muted-foreground text-center">Interface intuitif untuk semua orang</p>
              </div>
            </div>
          </div>

          <Card className="shadow-2xl border-border/50 backdrop-blur">
            <CardHeader className="space-y-3">
              <CardTitle className="text-3xl">Buat Link Anda</CardTitle>
              <CardDescription className="text-base">
                Pilih fitur di bawah dan buat link custom Anda sekarang
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="whatsapp" className="w-full">
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto p-1 bg-muted/50">
                  <TabsTrigger
                    value="whatsapp"
                    className="gap-2 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    <MessageSquare className="h-4 w-4" />
                    <span className="hidden sm:inline">WhatsApp</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="paste"
                    className="gap-2 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    <FileText className="h-4 w-4" />
                    <span className="hidden sm:inline">Paste</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="linktree"
                    className="gap-2 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    <Users className="h-4 w-4" />
                    <span className="hidden sm:inline">Linktree</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="shorturl"
                    className="gap-2 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
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

              {error && (
                <div className="mt-6 p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-xl text-sm font-medium">
                  {error}
                </div>
              )}
              {success && (
                <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 rounded-xl text-sm font-medium">
                  {success}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="border-t border-border/40 bg-background/80 backdrop-blur-xl mt-24">
        <div className="container py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground">
                <Link2 className="h-6 w-6" />
              </div>
              <div>
                <p className="font-bold text-lg">Door.id</p>
                <p className="text-sm text-muted-foreground">Link Management Platform</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">© 2025 Door.id. All rights reserved.</p>
          </div>
        </div>
      </footer>
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
    <form onSubmit={handleSubmit} className="space-y-6 pt-6">
      <div className="space-y-3">
        <Label htmlFor="wa-slug" className="text-base font-medium">
          Custom Slug
        </Label>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground font-medium">door.id/</span>
          <Input id="wa-slug" name="slug" placeholder="my-whatsapp" required className="text-base" />
        </div>
      </div>
      <div className="space-y-3">
        <Label htmlFor="wa-phone" className="text-base font-medium">
          Nomor WhatsApp (dengan kode negara)
        </Label>
        <Input id="wa-phone" name="phone" placeholder="628123456789" required className="text-base" />
        <p className="text-sm text-muted-foreground">Contoh: 628123456789 (tanpa + atau spasi)</p>
      </div>
      <div className="space-y-3">
        <Label htmlFor="wa-message" className="text-base font-medium">
          Pesan Custom (opsional)
        </Label>
        <Textarea
          id="wa-message"
          name="message"
          placeholder="Halo, saya tertarik dengan..."
          rows={3}
          className="text-base"
        />
        <p className="text-sm text-muted-foreground">Pesan ini akan otomatis terisi saat seseorang membuka WhatsApp</p>
      </div>
      <Button
        type="submit"
        className="w-full h-12 text-base font-medium shadow-lg hover:shadow-xl transition-all"
        disabled={isLoading}
      >
        {isLoading ? "Membuat..." : "Buat Link WhatsApp"}
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
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    onSubmit("paste", formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pt-6">
      <div className="space-y-3">
        <Label htmlFor="paste-slug" className="text-base font-medium">
          Custom Slug
        </Label>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground font-medium">door.id/</span>
          <Input id="paste-slug" name="slug" placeholder="my-paste" required className="text-base" />
        </div>
      </div>
      <div className="space-y-3">
        <Label htmlFor="paste-content" className="text-base font-medium">
          Konten
        </Label>
        <Textarea
          id="paste-content"
          name="content"
          placeholder="Tempel teks Anda di sini..."
          rows={8}
          required
          className="font-mono text-sm"
        />
      </div>
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="paste-use-password"
            checked={showPassword}
            onChange={(e) => setShowPassword(e.target.checked)}
            className="h-4 w-4 rounded border-border"
          />
          <Label htmlFor="paste-use-password" className="text-base font-medium cursor-pointer">
            Lindungi dengan password untuk edit
          </Label>
        </div>
        {showPassword && (
          <div className="space-y-2">
            <Input
              id="paste-password"
              name="paste_password"
              type="password"
              placeholder="Masukkan password untuk edit..."
              className="text-base"
            />
            <p className="text-xs text-muted-foreground">
              Pengunjung harus memasukkan password ini untuk bisa mengedit paste. Kosongkan jika ingin siapa saja bisa mengedit.
            </p>
          </div>
        )}
      </div>
      <Button
        type="submit"
        className="w-full h-12 text-base font-medium shadow-lg hover:shadow-xl transition-all"
        disabled={isLoading}
      >
        {isLoading ? "Membuat..." : "Buat Paste"}
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
    <form onSubmit={handleSubmit} className="space-y-6 pt-6">
      <div className="space-y-3">
        <Label htmlFor="linktree-slug" className="text-base font-medium">
          Custom Slug
        </Label>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground font-medium">door.id/</span>
          <Input id="linktree-slug" name="slug" placeholder="my-links" required className="text-base" />
        </div>
      </div>
      <div className="space-y-4">
        <Label className="text-base font-medium">Links</Label>
        {links.map((link, index) => (
          <div key={index} className="flex gap-2">
            <div className="flex-1 space-y-2">
              <Input name={`link-title-${index}`} placeholder="Judul Link" required className="text-base" />
              <Input
                name={`link-url-${index}`}
                type="url"
                placeholder="https://example.com"
                required
                className="text-base"
              />
            </div>
            {links.length > 1 && (
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => removeLink(index)}
                className="h-10 w-10"
              >
                ×
              </Button>
            )}
          </div>
        ))}
        <Button type="button" variant="outline" onClick={addLink} className="w-full bg-transparent h-11">
          + Tambah Link
        </Button>
      </div>
      <Button
        type="submit"
        className="w-full h-12 text-base font-medium shadow-lg hover:shadow-xl transition-all"
        disabled={isLoading}
      >
        {isLoading ? "Membuat..." : "Buat Linktree"}
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
    <form onSubmit={handleSubmit} className="space-y-6 pt-6">
      <div className="space-y-3">
        <Label htmlFor="short-slug" className="text-base font-medium">
          Custom Slug
        </Label>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground font-medium">door.id/</span>
          <Input id="short-slug" name="slug" placeholder="my-link" required className="text-base" />
        </div>
      </div>
      <div className="space-y-3">
        <Label htmlFor="short-url" className="text-base font-medium">
          URL Tujuan
        </Label>
        <Input id="short-url" name="url" type="url" placeholder="https://example.com" required className="text-base" />
      </div>
      <Button
        type="submit"
        className="w-full h-12 text-base font-medium shadow-lg hover:shadow-xl transition-all"
        disabled={isLoading}
      >
        {isLoading ? "Membuat..." : "Buat Short URL"}
      </Button>
    </form>
  )
}
