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
          <div className="text-center space-y-10 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/30 rounded-3xl -z-10 blur-3xl opacity-50" />
            
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-primary/20 to-primary/10 border border-primary/30 text-sm font-semibold text-primary mb-6 shadow-lg">
              <Sparkles className="h-4 w-4 animate-pulse" />
              Platform All-in-One Link Pintar Indonesia
            </div>
            
            <h1 className="text-5xl md:text-8xl font-black tracking-tight text-balance leading-tight">
              <span className="bg-gradient-to-r from-primary via-primary/90 to-accent bg-clip-text text-transparent animate-gradient">
                Door.id
              </span>
            </h1>
            
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-balance leading-tight">
              Satu Link,{" "}
              <span className="bg-gradient-to-r from-accent via-accent/80 to-accent/60 bg-clip-text text-transparent">
                Segala Kebutuhan
              </span>
            </h2>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed text-pretty bg-gradient-to-br from-foreground/80 to-foreground/60 bg-clip-text text-transparent">
              Platform <strong>all-in-one</strong> untuk link pintar: WhatsApp, teks rahasia, linktree, dan short URL.
              Semua dalam satu tempat yang powerful dan mudah digunakan.
            </p>

            <div className="flex gap-4 justify-center pt-6">
              <Button 
                size="lg" 
                className="px-8 py-6 text-lg font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-xl hover:shadow-2xl transition-all hover:scale-105"
                onClick={() => document.getElementById('create-link-section')?.scrollIntoView({ behavior: 'smooth' })}
              >
                🚀 Buat Link Pertama Anda
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto pt-8" id="create-link-section">
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

          <Card className="shadow-2xl border-border/50 backdrop-blur" id="create-link-section">
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
                    <span className="hidden sm:inline">Teks Rahasia</span>
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
          Nama Link Custom
        </Label>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground font-medium">door.id/</span>
          <Input id="wa-slug" name="slug" placeholder="link-whatsapp-saya" required className="text-base" />
        </div>
        <p className="text-sm text-muted-foreground">
          Buat link custom yang mudah diingat. Contoh: kontak-wa, hubungi-saya, whatsapp-bisnis
        </p>
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
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold text-blue-800 mb-2">[🔒] Simpan & Bagikan Teks</h3>
        <p className="text-sm text-blue-700">
          Bagikan dan pindahkan teks antar perangkat atau antar orang/team hanya dengan link, 
          Edit dan bagikan text tanpa login. Lindungi dengan password opsional.
        </p>
      </div>
      
      <div className="space-y-3">
        <Label htmlFor="paste-slug" className="text-base font-medium">
          Nama Link Custom
        </Label>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground font-medium">door.id/</span>
          <Input id="paste-slug" name="slug" placeholder="catatan-rahasia" required className="text-base" />
        </div>
        <p className="text-sm text-muted-foreground">
          Buat link custom yang mudah diingat. Contoh: catatan-rahasia, draft-proyek, kode-backend
        </p>
      </div>
      <div className="space-y-3">
        <Label htmlFor="paste-content" className="text-base font-medium">
          Teks Anda
        </Label>
        <Textarea
          id="paste-content"
          name="content"
          placeholder="Tempel teks di sini... kode program, konfigurasi, catatan rahasia, atau apapun"
          rows={8}
          required
          className="font-mono text-sm"
        />
        <p className="text-sm text-muted-foreground">
          Markdown didukung. Format teks akan tetap terjaga.
        </p>
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
          <div className="flex items-center gap-3">
            <div className={`p-1.5 rounded-full ${showPassword ? 'bg-green-100' : 'bg-gray-200'}`}>
              {showPassword ? (
                <div className="h-5 w-5 flex items-center justify-center text-green-600">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </div>
              ) : (
                <div className="h-5 w-5 flex items-center justify-center text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 7h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2"></path>
                    <path d="M6 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h1"></path>
                    <path d="m8 7 3-3 3 3"></path>
                    <path d="m8 21 3-3 3 3"></path>
                  </svg>
                </div>
              )}
            </div>
            <div>
              <Label htmlFor="paste-use-password" className="text-base font-medium cursor-pointer">
                {showPassword ? '🔒 Dilindungi Password' : '🔓 Bebas Edit'}
              </Label>
              <p className="text-xs text-muted-foreground">
                {showPassword ? 'Hanya yang tahu password bisa edit' : 'Siapa saja bisa edit paste ini'}
              </p>
            </div>
          </div>
          <label className="flex items-center cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                className="sr-only"
                id="paste-use-password"
                checked={showPassword}
                onChange={(e) => setShowPassword(e.target.checked)}
              />
              <div className={`block w-12 h-6 rounded-full transition-colors ${
                showPassword ? 'bg-green-500' : 'bg-gray-300'
              }`}></div>
              <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
                showPassword ? 'transform translate-x-6' : ''
              }`}></div>
            </div>
          </label>
        </div>
        
        {showPassword && (
          <div className="space-y-3 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div>
              <Label htmlFor="paste-password" className="text-sm font-medium text-gray-700 mb-1">
                Password Edit
              </Label>
              <Input
                id="paste-password"
                name="paste_password"
                type="password"
                placeholder="Masukkan password untuk edit..."
                className="text-base border-green-300 focus:border-green-500 focus:ring-green-500"
                minLength={4}
              />
            </div>
            <div>
              <Label htmlFor="paste-confirm-password" className="text-sm font-medium text-gray-700 mb-1">
                Konfirmasi Password
              </Label>
              <Input
                id="paste-confirm-password"
                type="password"
                placeholder="Konfirmasi password..."
                className="text-base border-green-300 focus:border-green-500 focus:ring-green-500"
                onChange={(e) => {
                  const passwordInput = document.getElementById('paste-password') as HTMLInputElement;
                  if (e.target.value !== passwordInput.value) {
                    e.target.classList.add('border-red-500');
                  } else {
                    e.target.classList.remove('border-red-500');
                  }
                }}
              />
            </div>
            <p className="text-xs text-green-700">
              🔐 Hanya orang yang tahu password ini yang bisa mengedit atau menghapus paste ini.
              Kosongkan jika ingin siapa saja bisa mengedit.
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
          Nama Link Custom
        </Label>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground font-medium">door.id/</span>
          <Input id="linktree-slug" name="slug" placeholder="linktree-saya" required className="text-base" />
        </div>
        <p className="text-sm text-muted-foreground">
          Buat link bio Anda sendiri. Contoh: linktree-saya, semua-link, bio-instagram
        </p>
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
          Nama Link Custom
        </Label>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground font-medium">door.id/</span>
          <Input id="short-slug" name="slug" placeholder="link-pendek" required className="text-base" />
        </div>
        <p className="text-sm text-muted-foreground">
          Buat link pendek yang mudah diingat dan di-share. Contoh: promo-saya, artikel-terbaru, link-penting
        </p>
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
