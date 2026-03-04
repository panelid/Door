"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  MessageSquare, 
  FileText, 
  Users, 
  Link2,
  ExternalLink,
  BarChart3,
  Pencil,
  Trash2,
  Search,
  Filter,
  Copy,
  Check,
  MoreHorizontal,
  ArrowRight,
  Link
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"

interface SlugItem {
  id: string
  slug: string
  type: "whatsapp" | "paste" | "linktree" | "shorturl"
  data: any
  created_at: string
  updated_at: string
  paste_password?: string | null
}

export function DashboardContent() {
  const [slugs, setSlugs] = useState<SlugItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<string | null>(null)

  useEffect(() => {
    fetchSlugs()
  }, [])

  const fetchSlugs = async () => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("slugs")
      .select("*")
      .order("updated_at", { ascending: false })

    if (error) {
      toast.error("Gagal memuat data")
      return
    }

    setSlugs(data || [])
    setLoading(false)
  }

  const filteredSlugs = slugs.filter((slug) => {
    const matchesSearch = slug.slug.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterType ? slug.type === filterType : true
    return matchesSearch && matchesFilter
  })

  const stats = {
    total: slugs.length,
    whatsapp: slugs.filter(s => s.type === "whatsapp").length,
    paste: slugs.filter(s => s.type === "paste").length,
    linktree: slugs.filter(s => s.type === "linktree").length,
    shorturl: slugs.filter(s => s.type === "shorturl").length,
  }

  if (loading) {
    return <DashboardSkeleton />
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard 
          icon={Link} 
          label="Total Links" 
          value={stats.total} 
          color="primary" 
        />
        <StatCard 
          icon={MessageSquare} 
          label="WhatsApp" 
          value={stats.whatsapp} 
          color="blue" 
        />
        <StatCard 
          icon={FileText} 
          label="Paste" 
          value={stats.paste} 
          color="green" 
        />
        <StatCard 
          icon={Users} 
          label="Linktree" 
          value={stats.linktree} 
          color="purple" 
        />
      </div>

      {/* Search & Filter */}
      <Card className="card-door">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari link..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 input-door"
              />
            </div>
            <div className="flex gap-2">
              <FilterButton 
                active={filterType === null} 
                onClick={() => setFilterType(null)}
                label="Semua"
              />
              <FilterButton 
                active={filterType === "whatsapp"} 
                onClick={() => setFilterType("whatsapp")}
                label="WhatsApp"
                icon={MessageSquare}
              />
              <FilterButton 
                active={filterType === "paste"} 
                onClick={() => setFilterType("paste")}
                label="Paste"
                icon={FileText}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Links List */}
      <div className="space-y-3">
        {filteredSlugs.length === 0 ? (
          <EmptyState onCreateClick={() => window.location.href = "/"} />
        ) : (
          filteredSlugs.map((slug) => (
            <LinkCard key={slug.id} slug={slug} onDelete={fetchSlugs} />
          ))
        )}
      </div>
    </div>
  )
}

function StatCard({ 
  icon: Icon, 
  label, 
  value, 
  color 
}: { 
  icon: React.ElementType
  label: string
  value: number
  color: string 
}) {
  const colorClasses: Record<string, string> = {
    primary: "bg-primary/10 text-primary",
    blue: "bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400",
    green: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400",
    purple: "bg-violet-50 text-violet-600 dark:bg-violet-950/50 dark:text-violet-400",
  }

  return (
    <Card className="card-door">
      <CardContent className="p-4 flex items-center gap-4">
        <div className={`w-10 h-10 rounded-lg ${colorClasses[color]} flex items-center justify-center`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  )
}

function FilterButton({ 
  active, 
  onClick, 
  label,
  icon: Icon
}: { 
  active: boolean
  onClick: () => void
  label: string
  icon?: React.ElementType 
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
        active
          ? "bg-primary text-primary-foreground"
          : "bg-muted text-muted-foreground hover:bg-muted/80"
      }`}
    >
      {Icon && <Icon className="h-4 w-4" />}
      {label}
    </button>
  )
}

function LinkCard({ slug, onDelete }: { slug: SlugItem; onDelete: () => void }) {
  const [copied, setCopied] = useState(false)
  const typeIcons = {
    whatsapp: MessageSquare,
    paste: FileText,
    linktree: Users,
    shorturl: Link2,
  }
  const Icon = typeIcons[slug.type]
  const url = typeof window !== 'undefined' ? `${window.location.origin}/${slug.slug}` : `/${slug.slug}`

  const handleCopy = () => {
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast.success("Link disalin!")
  }

  const handleDelete = async () => {
    if (!confirm("Yakin ingin menghapus link ini?")) return

    const supabase = createClient()
    const { error } = await supabase.from("slugs").delete().eq("id", slug.id)

    if (error) {
      toast.error("Gagal menghapus link")
      return
    }

    toast.success("Link dihapus")
    onDelete()
  }

  return (
    <Card className="card-door group hover-lift">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <Icon className="h-5 w-5 text-primary" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold truncate">{slug.slug}</h3>
              <Badge variant="secondary" className="text-xs capitalize">
                {slug.type}
              </Badge>
              {slug.paste_password && (
                <Badge variant="outline" className="text-xs">
                  Protected
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground truncate">
              {url}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Updated {new Date(slug.updated_at).toLocaleDateString("id-ID")}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCopy}
              className="h-9 w-9"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <a href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                    <ExternalLink className="h-4 w-4" />
                    Buka Link
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href={`/analytics/${slug.slug}`} className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Analytics
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2">
                  <Pencil className="h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={handleDelete}
                  className="text-destructive flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Hapus
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function EmptyState({ onCreateClick }: { onCreateClick: () => void }) {
  return (
    <Card className="card-door">
      <CardContent className="p-12 text-center">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
          <Link className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Belum ada link</h3>
        <p className="text-muted-foreground mb-4">
          Buat link pertama Anda sekarang
        </p>
        <Button onClick={onCreateClick} className="btn-primary">
          Buat Link
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  )
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="card-door">
            <CardContent className="p-4">
              <div className="h-10 w-10 rounded-lg bg-muted animate-pulse mb-2" />
              <div className="h-6 w-16 bg-muted animate-pulse rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="card-door">
        <CardContent className="p-4">
          <div className="h-10 bg-muted animate-pulse rounded" />
        </CardContent>
      </Card>
    </div>
  )
}
