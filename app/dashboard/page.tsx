import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Link2, MessageSquare, FileText, Users, ExternalLink, Mail, Sparkles, BarChart3, Activity, Globe, Plus } from "lucide-react"
import { DeleteSlugButton } from "@/components/delete-slug-button"
import { EditSlugDialog } from "@/components/edit-slug-dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const statCards = [
  { label: "Total Links", bg: "bg-violet-100", border: "border-violet-600", text: "text-violet-900", icon: Link2 },
  { label: "Active Types", bg: "bg-pink-100", border: "border-pink-600", text: "text-pink-900", icon: Activity },
  { label: "Total Visits", bg: "bg-emerald-100", border: "border-emerald-600", text: "text-emerald-900", icon: BarChart3 },
  { label: "Link Categories", bg: "bg-amber-100", border: "border-amber-600", text: "text-amber-900", icon: Globe },
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
  const totalVisits = slugs?.reduce((sum, s) => sum + (s.visit_count || 0), 0) || 0

  const hardBorder = "border-[3px] border-black"
  const hardShadow = "shadow-[4px_4px_0_0_#111]"

  return (
    <div className="min-h-screen bg-[#F5F2EC] text-neutral-900">
      {/* Header */}
      <header className={`sticky top-0 z-50 bg-[#F5F2EC]/90 backdrop-blur-md border-b-[3px] border-black`}>
        <div className="max-w-6xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-xl bg-violet-600 ${hardBorder} flex items-center justify-center text-white text-base font-black shadow-[2px_2px_0_0_#111]`}>
              🚪
            </div>
            <span className="text-[20px] font-black tracking-tight text-black">Door.id</span>
          </div>
          <div className="flex items-center gap-3">
            <Button asChild variant="outline" size="sm" className={`bg-white font-bold rounded-xl border-2 border-black shadow-[2px_2px_0_0_#111] hover:bg-neutral-100`}>
              <Link href="/">✨ Buat Link Baru</Link>
            </Button>
            <form action={handleSignOut}>
              <Button type="submit" size="sm" className={`bg-black text-white hover:bg-neutral-800 font-bold rounded-xl border-2 border-black shadow-[2px_2px_0_0_#111]`}>
                Sign Out
              </Button>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto py-8 px-4 sm:px-6">
        <div className="space-y-8">
          
          {/* Welcome Card Neobrutalism */}
          <div className={`rounded-[24px] bg-white p-6 sm:p-8 ${hardBorder} ${hardShadow} flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6`}>
            <div className="flex items-center gap-4">
              <Avatar className={`h-16 w-16 ${hardBorder} bg-yellow-300 text-black font-black text-xl`}>
                <AvatarFallback className="bg-yellow-300 text-black font-black">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <h2 className="text-2xl font-black">Dashboard Kamu</h2>
                <div className="flex items-center gap-2 text-sm text-neutral-600 font-medium">
                  <Mail className="h-4 w-4" />
                  <span className="break-all">{user.email}</span>
                </div>
              </div>
            </div>
            <Button asChild className={`w-full sm:w-auto bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl ${hardBorder} ${hardShadow} py-6 px-6 text-base`}>
              <Link href="/">
                <Plus className="h-5 w-5 mr-2" />
                Buat Link Baru
              </Link>
            </Button>
          </div>

          {/* Stats Grid Neobrutalism */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Total Links", value: totalSlugs, ...statCards[0] },
              { label: "Active Types", value: activeTypes, ...statCards[1] },
              { label: "Total Visits", value: totalVisits, ...statCards[2] },
              { label: "Categories", value: Object.keys(types).length, ...statCards[3] },
            ].map((stat) => (
              <div
                key={stat.label}
                className={`rounded-2xl p-5 ${stat.bg} ${hardBorder} ${hardShadow} transition-all hover:-translate-y-1`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-xl bg-white ${hardBorder} shadow-[2px_2px_0_0_#111]`}>
                    <stat.icon className="h-5 w-5 text-black" />
                  </div>
                </div>
                <p className="text-3xl font-black text-black">{stat.value}</p>
                <p className={`text-sm font-bold ${stat.text} mt-1`}>{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Section Header */}
          <div className="flex items-center justify-between pt-4">
            <div>
              <h1 className="text-2xl font-black text-black">Daftar Link Saya</h1>
              <p className="text-sm text-neutral-600 font-medium">Kelola semua tautan dan shortlink Door.id Anda</p>
            </div>
            <div className="bg-white px-4 py-2 rounded-xl border-2 border-black font-bold text-sm shadow-[2px_2px_0_0_#111]">
              Total: {totalSlugs} link
            </div>
          </div>

          {slugsError && (
            <div className="rounded-2xl bg-red-100 border-2 border-red-500 p-4 text-red-700 font-bold">
              Error loading slugs: {slugsError.message}
            </div>
          )}

          {slugs && slugs.length === 0 && (
            <div className={`rounded-[24px] bg-white p-12 text-center ${hardBorder} ${hardShadow}`}>
              <div className="w-16 h-16 rounded-2xl bg-violet-100 border-2 border-black flex items-center justify-center mx-auto mb-4 shadow-[3px_3px_0_0_#111]">
                <Link2 className="h-8 w-8 text-violet-600" />
              </div>
              <h3 className="text-xl font-black mb-2">Belum ada link dibuat</h3>
              <p className="text-sm text-neutral-600 mb-6 font-medium max-w-sm mx-auto">Buat link pertama kamu sekarang dan bagikan ke sosial media atau pelanggan.</p>
              <Button asChild className={`bg-black text-white hover:bg-neutral-800 font-bold rounded-xl ${hardBorder} ${hardShadow} px-6 py-3`}>
                <Link href="/">
                  <Plus className="h-4 w-4 mr-2" />
                  Buat Link Pertama
                </Link>
              </Button>
            </div>
          )}

          {slugs && slugs.length > 0 && (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
  const hardBorder = "border-[2.5px] border-black"
  const hardShadow = "shadow-[4px_4px_0_0_#111]"

  const getIcon = () => {
    switch (slug.type) {
      case "whatsapp": return <MessageSquare className="h-5 w-5 text-emerald-600" />
      case "paste": return <FileText className="h-5 w-5 text-purple-600" />
      case "linktree": return <Users className="h-5 w-5 text-blue-600" />
      case "shorturl": return <Link2 className="h-5 w-5 text-amber-600" />
      default: return <Link2 className="h-5 w-5 text-violet-600" />
    }
  }

  const getTypeBadgeColor = () => {
    switch (slug.type) {
      case "whatsapp": return "bg-emerald-100 text-emerald-800 border-emerald-400"
      case "paste": return "bg-purple-100 text-purple-800 border-purple-400"
      case "linktree": return "bg-blue-100 text-blue-800 border-blue-400"
      case "shorturl": return "bg-amber-100 text-amber-800 border-amber-400"
      default: return "bg-neutral-100 text-neutral-800 border-neutral-400"
    }
  }

  const getDescription = () => {
    switch (slug.type) {
      case "whatsapp":
        return slug.data?.message ? `WhatsApp: ${slug.data.phone} — "${slug.data.message}"` : `WhatsApp: ${slug.data?.phone}`
      case "paste":
        return slug.data?.content ? slug.data.content.substring(0, 50) + "..." : "Teks tersimpan"
      case "linktree":
        return `${slug.data?.links?.length || 0} tautan bio`
      case "shorturl":
        return slug.data?.url || "Short URL"
      default:
        return ""
    }
  }

  return (
    <div className={`rounded-2xl bg-white p-5 ${hardBorder} ${hardShadow} flex flex-col justify-between transition-all hover:-translate-y-1`}>
      <div>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl bg-neutral-100 border-2 border-black shadow-[2px_2px_0_0_#111]`}>
              {getIcon()}
            </div>
            <div>
              <h3 className="font-black text-lg text-black truncate max-w-[180px]">/{slug.slug}</h3>
            </div>
          </div>
          <span className={`text-[11px] font-black uppercase px-2.5 py-1 rounded-lg border-2 ${getTypeBadgeColor()}`}>
            {slug.type}
          </span>
        </div>

        <p className="text-xs text-neutral-600 font-medium break-all line-clamp-2 mb-4">
          {getDescription()}
        </p>
      </div>

      <div>
        <div className="flex items-center gap-2 pt-3 border-t border-neutral-200">
          <Button asChild variant="outline" size="sm" className="flex-1 bg-neutral-50 hover:bg-neutral-100 font-bold border-2 border-black shadow-[2px_2px_0_0_#111] text-xs">
            <Link href={`/${slug.slug}`} target="_blank">
              <ExternalLink className="h-3.5 w-3.5 mr-1" />
              Buka
            </Link>
          </Button>
          <EditSlugDialog slug={slug} />
          <DeleteSlugButton slugId={slug.id} />
        </div>
        <div className="mt-2.5 text-[11px] text-neutral-400 font-medium">
          Dibuat: {new Date(slug.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
        </div>
      </div>
    </div>
  )
}
