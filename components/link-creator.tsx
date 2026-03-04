"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { 
  MessageSquare, 
  FileText, 
  Users, 
  Link2, 
  Loader2, 
  CheckCircle2,
  Lock,
  Plus,
  X
} from "lucide-react"
import { toast } from "sonner"

export function LinkCreator() {
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (type: string, formData: FormData) => {
    setIsLoading(true)
    setSuccess(null)

    const supabase = createClient()

    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      const slug = formData.get("slug") as string

      // Check if slug exists
      const { data: existingSlug } = await supabase
        .from("slugs")
        .select("slug")
        .eq("slug", slug)
        .single()

      if (existingSlug) {
        toast.error("Slug sudah dipakai. Pilih yang lain.")
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

      const url = `${window.location.origin}/${slug}`
      setSuccess(`Link berhasil dibuat: ${url}`)
      toast.success("Link berhasil dibuat!")
      
      // Copy to clipboard
      navigator.clipboard.writeText(url)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Terjadi kesalahan")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section id="create" className="section-padding">
      <div className="container-tight">
        <Card className="card-door">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl md:text-3xl font-bold">Buat Link Baru</CardTitle>
            <CardDescription className="text-base">
              Pilih tipe link dan buat custom URL Anda
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="whatsapp" className="w-full">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto p-1 bg-muted/50 rounded-lg">
                <TabTrigger value="whatsapp" icon={MessageSquare} label="WhatsApp" />
                <TabTrigger value="paste" icon={FileText} label="Paste" />
                <TabTrigger value="linktree" icon={Users} label="Linktree" />
                <TabTrigger value="shorturl" icon={Link2} label="Short URL" />
              </TabsList>

              <TabsContent value="whatsapp" className="mt-6">
                <WhatsAppForm onSubmit={handleSubmit} isLoading={isLoading} />
              </TabsContent>

              <TabsContent value="paste" className="mt-6">
                <PasteForm onSubmit={handleSubmit} isLoading={isLoading} />
              </TabsContent>

              <TabsContent value="linktree" className="mt-6">
                <LinktreeForm onSubmit={handleSubmit} isLoading={isLoading} />
              </TabsContent>

              <TabsContent value="shorturl" className="mt-6">
                <ShortUrlForm onSubmit={handleSubmit} isLoading={isLoading} />
              </TabsContent>
            </Tabs>

            {success && (
              <div className="mt-6 p-4 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-xl">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-green-800 dark:text-green-200">Berhasil!</p>
                    <p className="text-sm text-green-700 dark:text-green-300 mt-1">{success}</p>
                    <p className="text-xs text-green-600 dark:text-green-400 mt-2">Link sudah disalin ke clipboard</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

function TabTrigger({ 
  value, 
  icon: Icon, 
  label 
}: { 
  value: string
  icon: React.ElementType
  label: string 
}) {
  return (
    <TabsTrigger 
      value={value}
      className="flex items-center gap-2 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-medium transition-all duration-200 rounded-md"
    >
      <Icon className="h-4 w-4" />
      <span className="hidden sm:inline text-sm font-medium">{label}</span>
    </TabsTrigger>
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
    <form onSubmit={handleSubmit} className="space-y-5">
      <SlugInput />
      
      <div className="space-y-2">
        <Label htmlFor="wa-phone" className="text-sm font-medium">
          Nomor WhatsApp
        </Label>
        <Input 
          id="wa-phone" 
          name="phone" 
          placeholder="628123456789" 
          required 
          className="input-door"
        />
        <p className="text-xs text-muted-foreground">Contoh: 628123456789 (kode negara tanpa +)</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="wa-message" className="text-sm font-medium">
          Pesan Default <span className="text-muted-foreground">(opsional)</span>
        </Label>
        <Textarea
          id="wa-message"
          name="message"
          placeholder="Halo, saya tertarik dengan..."
          rows={3}
          className="input-door resize-none"
        />
      </div>

      <SubmitButton isLoading={isLoading} text="Buat Link WhatsApp" />
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
    <form onSubmit={handleSubmit} className="space-y-5">
      <SlugInput />

      <div className="space-y-2">
        <Label htmlFor="paste-content" className="text-sm font-medium">
          Konten
        </Label>
        <Textarea
          id="paste-content"
          name="content"
          placeholder="Tempel atau tulis konten Anda di sini..."
          rows={8}
          required
          className="input-door font-mono text-sm resize-y"
        />
      </div>

      {/* Password Toggle */}
      <div className="space-y-3">
        <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-border">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg transition-colors ${showPassword ? 'bg-primary/10' : 'bg-muted'}`}>
              <Lock className={`h-4 w-4 ${showPassword ? 'text-primary' : 'text-muted-foreground'}`} />
            </div>
            <div>
              <p className="text-sm font-medium">{showPassword ? 'Dilindungi Password' : 'Edit Bebas'}</p>
              <p className="text-xs text-muted-foreground">
                {showPassword ? 'Hanya dengan password bisa edit' : 'Siapa saja bisa mengedit'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className={`relative w-11 h-6 rounded-full transition-colors ${showPassword ? 'bg-primary' : 'bg-muted-foreground/30'}`}
          >
            <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${showPassword ? 'translate-x-5' : ''}`} />
          </button>
        </div>

        {showPassword && (
          <div className="space-y-3 p-4 rounded-lg bg-primary/5 border border-primary/10">
            <Label htmlFor="paste-password" className="text-sm font-medium">
              Password Edit
            </Label>
            <Input
              id="paste-password"
              name="paste_password"
              type="password"
              placeholder="Masukkan password..."
              className="input-door"
              minLength={4}
            />
            <p className="text-xs text-muted-foreground">
              Password ini diperlukan untuk mengedit atau menghapus paste ini nanti.
            </p>
          </div>
        )}
      </div>

      <SubmitButton isLoading={isLoading} text="Buat Paste" />
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
    <form onSubmit={handleSubmit} className="space-y-5">
      <SlugInput />

      <div className="space-y-3">
        <Label className="text-sm font-medium">Daftar Link</Label>
        {links.map((_, index) => (
          <div key={index} className="flex gap-2 p-3 rounded-lg bg-muted/30 border border-border">
            <div className="flex-1 space-y-2">
              <Input
                name={`link-title-${index}`}
                placeholder="Judul Link"
                required
                className="input-door h-9"
              />
              <Input
                name={`link-url-${index}`}
                type="url"
                placeholder="https://example.com"
                required
                className="input-door h-9"
              />
            </div>
            {links.length > 1 && (
              <button
                type="button"
                onClick={() => removeLink(index)}
                className="p-2 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          onClick={addLink}
          className="w-full h-10 border-dashed"
        >
          <Plus className="h-4 w-4 mr-2" />
          Tambah Link
        </Button>
      </div>

      <SubmitButton isLoading={isLoading} text="Buat Linktree" />
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
    <form onSubmit={handleSubmit} className="space-y-5">
      <SlugInput />

      <div className="space-y-2">
        <Label htmlFor="short-url" className="text-sm font-medium">
          URL Tujuan
        </Label>
        <Input 
          id="short-url" 
          name="url" 
          type="url" 
          placeholder="https://example.com/very-long-url" 
          required 
          className="input-door"
        />
      </div>

      <SubmitButton isLoading={isLoading} text="Buat Short URL" />
    </form>
  )
}

function SlugInput() {
  return (
    <div className="space-y-2">
      <Label htmlFor="slug" className="text-sm font-medium">
        Custom Slug
      </Label>
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground font-medium whitespace-nowrap">door.id/</span>
        <Input 
          id="slug" 
          name="slug" 
          placeholder="my-link" 
          required 
          className="input-door"
          pattern="[a-zA-Z0-9-_]+"
          title="Hanya huruf, angka, dash, dan underscore"
        />
      </div>
      <p className="text-xs text-muted-foreground">Hanya huruf, angka, dash (-), dan underscore (_)</p>
    </div>
  )
}

function SubmitButton({ isLoading, text }: { isLoading: boolean; text: string }) {
  return (
    <Button 
      type="submit" 
      className="w-full btn-primary h-11 text-base mt-2" 
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Membuat...
        </>
      ) : (
        text
      )}
    </Button>
  )
}
