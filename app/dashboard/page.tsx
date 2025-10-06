import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Link2, MessageSquare, FileText, Users, ExternalLink, Mail } from "lucide-react"
import { DeleteSlugButton } from "@/components/delete-slug-button"
import { EditSlugDialog } from "@/components/edit-slug-dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Link2 className="h-5 w-5" />
            </div>
            <span className="text-lg sm:text-xl font-bold">Door.id</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <Button variant="ghost" size="sm" asChild className="hidden sm:flex">
              <Link href="/">Home</Link>
            </Button>
            <form action={handleSignOut}>
              <Button variant="outline" size="sm" type="submit">
                <span className="hidden sm:inline">Sign Out</span>
                <span className="sm:hidden">Out</span>
              </Button>
            </form>
          </div>
        </div>
      </header>

      <main className="container py-6 sm:py-12 px-4">
        <div className="mx-auto max-w-6xl space-y-6 sm:space-y-8">
          <Card className="border-2">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <h2 className="text-xl sm:text-2xl font-bold">Welcome back!</h2>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span className="break-all">{user.email}</span>
                  </div>
                </div>
                <Button asChild size="sm" className="w-full sm:w-auto">
                  <Link href="/">Create New Link</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">My Links</h1>
              <p className="text-sm sm:text-base text-muted-foreground">Manage all your Door.id links</p>
            </div>
            <div className="text-sm text-muted-foreground">
              Total: <span className="font-semibold">{slugs?.length || 0}</span> link
              {slugs?.length !== 1 ? "s" : ""}
            </div>
          </div>

          {slugsError && (
            <Card className="border-destructive">
              <CardContent className="pt-6">
                <p className="text-sm text-destructive">Error loading slugs: {slugsError.message}</p>
              </CardContent>
            </Card>
          )}

          {slugs && slugs.length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Link2 className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No links yet</h3>
                <p className="text-sm text-muted-foreground mb-4 text-center">Create your first link to get started</p>
                <Button asChild>
                  <Link href="/">Create Link</Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {slugs && slugs.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {slugs.map((slug) => (
                <SlugCard key={slug.id} slug={slug} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

function SlugCard({ slug }: { slug: any }) {
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

  const getDescription = () => {
    switch (slug.type) {
      case "whatsapp":
        return slug.data.message
          ? `Phone: ${slug.data.phone} - "${slug.data.message.substring(0, 40)}${slug.data.message.length > 40 ? "..." : ""}"`
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
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {getIcon()}
            <div className="min-w-0">
              <CardTitle className="text-lg truncate">{slug.slug}</CardTitle>
              <CardDescription>{getTypeLabel()}</CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground break-all line-clamp-2">{getDescription()}</p>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm" className="flex-1 bg-transparent">
            <Link href={`/${slug.slug}`} target="_blank">
              <ExternalLink className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Visit</span>
            </Link>
          </Button>
          <EditSlugDialog slug={slug} />
          <DeleteSlugButton slugId={slug.id} />
        </div>
        <div className="text-xs text-muted-foreground">Created {new Date(slug.created_at).toLocaleDateString()}</div>
      </CardContent>
    </Card>
  )
}
