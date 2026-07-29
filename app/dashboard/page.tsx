import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Link2, MessageSquare, FileText, Users, ExternalLink, Mail, Sparkles, BarChart3, Activity, Globe } from "lucide-react"
import { DeleteSlugButton } from "@/components/delete-slug-button"
import { EditSlugDialog } from "@/components/edit-slug-dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const statCardStyles = [
  {
    gradient: "from-purple-500 to-blue-500",
    shadow: "shadow-purple-500/20",
    iconBg: "bg-purple-100 dark:bg-purple-900/30",
    iconColor: "text-purple-600 dark:text-purple-400",
  },
  {
    gradient: "from-pink-500 to-rose-500",
    shadow: "shadow-pink-500/20",
    iconBg: "bg-pink-100 dark:bg-pink-900/30",
    iconColor: "text-pink-600 dark:text-pink-400",
  },
  {
    gradient: "from-emerald-500 to-teal-500",
    shadow: "shadow-emerald-500/20",
    iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
    iconColor: "text-emerald-600 dark:text-emerald-400",
  },
  {
    gradient: "from-amber-500 to-orange-500",
    shadow: "shadow-amber-500/20",
    iconBg: "bg-amber-100 dark:bg-amber-900/30",
    iconColor: "text-amber-600 dark:text-amber-400",
  },
]

const linkCardColors = [
  { gradient: "from-violet-500/10 to-purple-500/10", border: "border-violet-200 dark:border-violet-800/40", dot: "bg-violet-500" },
  { gradient: "from-blue-500/10 to-cyan-500/10", border: "border-blue-200 dark:border-blue-800/40", dot: "bg-blue-500" },
  { gradient: "from-pink-500/10 to-rose-500/10", border: "border-pink-200 dark:border-pink-800/40", dot: "bg-pink-500" },
  { gradient: "from-amber-500/10 to-orange-500/10", border: "border-amber-200 dark:border-amber-800/40", dot: "bg-amber-500" },
  { gradient: "from-emerald-500/10 to-teal-500/10", border: "border-emerald-200 dark:border-emerald-800/40", dot: "bg-emerald-500" },
  { gradient: "from-cyan-500/10 to-sky-500/10", border: "border-cyan-200 dark:border-cyan-800/40", dot: "bg-cyan-500" },
]

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect("/auth/login")
  }

  const { data: slugs, error: slugsError } = await supabase
    .from("slugs")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  const handleSignOut = async () => {
    "use server"
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect("/auth/login")
  }

  const getUserInitials = () => {
    if (user.email) {
      return user.email.substring(0, 2).toUpperCase()
    }
    return "U"
  }

  const totalSlugs = slugs?.length || 0
  const types = slugs?.reduce((acc: Record<string, number>, s) => {
    acc[s.type] = (acc[s.type] || 0) + 1
    return acc
  }, {}) || {}
  const activeTypes = Object.keys(types).length

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-purple-50/30 to-pink-50/30 dark:from-background dark:via-purple-950/10 dark:to-pink-950/10">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 text-white shadow-lg shadow-purple-500/30">
              <Link2 className="h-5 w-5" />
            </div>
            <span className="text-lg sm:text-xl font-bold gradient-text">Door.id</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <Button variant="ghost" size="sm" asChild className="hidden sm:flex">
              <Link href="/">Home</Link>
            </Button>
            <form action={handleSignOut}>
              <Button variant="gradient" size="sm" type="submit">
                <span className="hidden sm:inline">Sign Out</span>
                <span className="sm:hidden">Out</span>
              </Button>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:py-12 px-4 sm:px-6">
        <div className="space-y-6 sm:space-y-8">
          {/* Welcome Card */}
          <Card className="border-0 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 shadow-lg shadow-purple-500/10">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                {/* Gradient ring avatar */}
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-500 via-blue-500 to-pink-500 p-[2px]">
                    <div className="h-full w-full rounded-full bg-background" />
                  </div>
                  <Avatar className="h-16 w-16 ring-2 ring-purple-200 dark:ring-purple-800">
                    <AvatarFallback className="text-xl">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex-1 space-y-1">
                  <h2 className="text-xl sm:text-2xl font-bold">Selamat Datang!</h2>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span className="break-all">{user.email}</span>
                  </div>
                </div>
                <Button variant="gradient-rainbow" asChild size="sm" className="w-full sm:w-auto animate-pulse-glow">
                  <Link href="/">
                    <Sparkles className="h-4 w-4 mr-1" />
                    Create New Link
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Total Links", value: totalSlugs, icon: Link2, ...statCardStyles[0] },
              { label: "Active Types", value: activeTypes, icon: Activity, ...statCardStyles[1] },
              { label: "Total Visits", value: slugs?.reduce((sum, s) => sum + (s.visit_count || 0), 0) || 0, icon: BarChart3, ...statCardStyles[2] },
              { label: "Link Types", value: Object.keys(types).length, icon: Globe, ...statCardStyles[3] },
            ].map((stat) => (
              <div
                key={stat.label}
                className={`relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br ${stat.gradient} ${stat.shadow} shadow-lg transition-all duration-300 hover:scale-[1.03] hover:shadow-xl`}
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-8 translate-x-8" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2 rounded-lg ${stat.iconBg} backdrop-blur-sm`}>
                      <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                  <p className="text-sm text-white/80 mt-1">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Section header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-2">
                My Links
                <span className="gradient-text-animated text-lg">✦</span>
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground">Manage all your Door.id links</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-4 py-2 rounded-full">
              <span>Total:</span>
              <span className="font-semibold text-foreground">{totalSlugs}</span>
              <span>link{totalSlugs !== 1 ? "s" : ""}</span>
            </div>
          </div>

          {slugsError && (
            <Card className="border-destructive/50 bg-destructive/5">
              <CardContent className="pt-6">
                <p className="text-sm text-destructive">Error loading slugs: {slugsError.message}</p>
              </CardContent>
            </Card>
          )}

          {slugs && slugs.length === 0 && (
            <Card className="border-2 border-dashed border-muted-foreground/20 hover:border-muted-foreground/40 transition-colors">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 flex items-center justify-center mb-4">
                  <Link2 className="h-8 w-8 text-purple-500" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No links yet</h3>
                <p className="text-sm text-muted-foreground mb-6 text-center max-w-xs">Create your first link to get started with Door.id</p>
                <Button variant="gradient-rainbow" asChild>
                  <Link href="/">
                    <Sparkles className="h-4 w-4 mr-1" />
                    Create Link
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {slugs && slugs.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {slugs.map((slug, index) => (
                <SlugCard key={slug.id} slug={slug} colorIndex={index % linkCardColors.length} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

function SlugCard({ slug, colorIndex }: { slug: any; colorIndex: number }) {
  const color = linkCardColors[colorIndex]

  const getIcon = () => {
    switch (slug.type) {
      case "whatsapp":
        return <MessageSquare className="h-5 w-5" />
      case "paste":
        return <FileText className="h-5 w-5" />
      case "linktree":
        return <Users className="h-5 w-5" />
      case "shorturl":
        return <Link2 className="h-5 w-5" />
      default:
        return <Link2 className="h-5 w-5" />
    }
  }

  const getTypeLabel = () => {
    switch (slug.type) {
      case "whatsapp":
        return "WhatsApp"
      case "paste":
        return "Paste"
      case "linktree":
        return "Linktree"
      case "shorturl":
        return "Short URL"
      default:
        return slug.type
    }
  }

  const getTypeBadgeColor = () => {
    switch (slug.type) {
      case "whatsapp":
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
      case "paste":
        return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
      case "linktree":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
      case "shorturl":
        return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getDescription = () => {
    switch (slug.type) {
      case "whatsapp":
        return slug.data.message
          ? `Phone: ${slug.data.phone} — "${slug.data.message.substring(0, 40)}${slug.data.message.length > 40 ? "..." : ""}"`
          : `Phone: ${slug.data.phone}`
      case "paste":
        return `${slug.data.content.substring(0, 60)}${slug.data.content.length > 60 ? "..." : ""}`
      case "linktree":
        return `${slug.data.links.length} link${slug.data.links.length !== 1 ? "s" : ""}`
      case "shorturl":
        return slug.data.url
      default:
        return ""
    }
  }

  return (
    <div className={`relative rounded-2xl p-5 bg-gradient-to-br ${color.gradient} border ${color.border} transition-all duration-300 hover:scale-[1.02] hover:shadow-lg group`}>
      {/* Accent dot */}
      <div className={`absolute top-3 right-3 w-2 h-2 rounded-full ${color.dot} opacity-50`} />

      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-xl ${color.dot.replace('bg-', 'bg-')}/10`}>
            {getIcon()}
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-lg truncate">{slug.slug}</h3>
          </div>
        </div>
      </div>

      <span className={`inline-block text-xs font-medium px-2.5 py-0.5 rounded-full ${getTypeBadgeColor()} mb-3`}>
        {getTypeLabel()}
      </span>

      <p className="text-sm text-muted-foreground break-all line-clamp-2 mb-4 min-h-[2.5rem]">
        {getDescription()}
      </p>

      <div className="flex items-center gap-2">
        <Button asChild variant="outline" size="sm" className="flex-1 bg-background/50 hover:bg-background">
          <Link href={`/${slug.slug}`} target="_blank">
            <ExternalLink className="h-4 w-4 mr-1.5" />
            <span className="hidden sm:inline">Visit</span>
          </Link>
        </Button>
        <EditSlugDialog slug={slug} />
        <DeleteSlugButton slugId={slug.id} />
      </div>
      <div className="mt-3 text-xs text-muted-foreground/70">
        Created {new Date(slug.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
      </div>
    </div>
  )
}