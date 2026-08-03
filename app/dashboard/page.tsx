import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Link2, MessageSquare, FileText, Users, ExternalLink, Mail, Sparkles, BarChart3, Activity, Globe, Plus, Copy, QrCode, Trash2, Edit } from "lucide-react"
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

  const totalSlugs = slugs?.length || 0
  const totalVisits = slugs?.reduce((sum, s) => sum + (s.visit_count || 0), 0) || 0
  
  const whatsappCount = slugs?.filter(s => s.type === "whatsapp").length || 0
  const linktreeCount = slugs?.filter(s => s.type === "linktree").length || 0
  const pasteCount = slugs?.filter(s => s.type === "paste").length || 0
  const shorturlCount = slugs?.filter(s => s.type === "shorturl").length || 0

  const hardBorder = "border-[3px] border-black"
  const hardShadow = "shadow-[4px_4px_0_0_#111]"

  return (
    <div className="min-h-screen bg-[#F5F2EC] text-neutral-900 pb-16">
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
            <Button asChild size="sm" className={`bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl border-2 border-black shadow-[2px_2px_0_0_#111]`}>
              <Link href="/">
                <Plus className="h-4 w-4 mr-1" /> Buat Link Baru
              </Link>
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
          
          {/* Welcome & Quick Stats */}
          <div className={`rounded-[24px] bg-white p-6 sm:p-7 ${hardBorder} ${hardShadow} flex flex-col md:flex-row items-start md:items-center justify-between gap-6`}>
            <div className="flex items-center gap-4">
              <Avatar className={`h-16 w-16 ${hardBorder} bg-yellow-300 text-black font-black text-xl shadow-[2px_2px_0_0_#111]`}>
                <AvatarFallback className="bg-yellow-300 text-black font-black">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <h2 className="text-2xl font-black">Command Center</h2>
                <div className="flex items-center gap-2 text-sm text-neutral-600 font-medium">
                  <Mail className="h-4 w-4" />
                  <span className="break-all">{user.email}</span>
                </div>
              </div>
            </div>

            {/* Mini Stats inside welcome */}
            <div className="flex gap-3 w-full md:w-auto">
              <div className={`flex-1 md:flex-initial px-4 py-3 rounded-xl bg-violet-100 border-2 border-black shadow-[2px_2px_0_0_#111] text-center`}>
                <p className="text-2xl font-black text-violet-900">{totalSlugs}</p>
                <p className="text-xs font-bold text-violet-700 uppercase">Total Links</p>
              </div>
              <div className={`flex-1 md:flex-initial px-4 py-3 rounded-xl bg-emerald-100 border-2 border-black shadow-[2px_2px_0_0_#111] text-center`}>
                <p className="text-2xl font-black text-emerald-900">{totalVisits}</p>
                <p className="text-xs font-bold text-emerald-700 uppercase">Total Visits</p>
              </div>
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
              <p className="text-sm text-neutral-600 mb-6 font-medium max-w-sm mx-auto">Buat link pertama kamu sekarang dan bagikan ke sosial media.</p>
              <Button asChild className={`bg-black text-white hover:bg-neutral-800 font-bold rounded-xl ${hardBorder} ${hardShadow} px-6 py-3`}>
                <Link href="/">
                  <Plus className="h-4 w-4 mr-2" />
                  Buat Link Pertama
                </Link>
              </Button>
            </div>
          )}

          {slugs && slugs.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-black">Daftar Tautan Aktif</h3>
                <span className="text-xs font-bold bg-neutral-200 px-3 py-1 rounded-lg border border-black">
                  Compact View
                </span>
              </div>

              {/* Compact Rows List */}
              <div className="space-y-3">
                {slugs.map((slug) => (
                  <SlugRow key={slug.id} slug={slug} />
                ))}
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  )
}

function SlugRow({ slug }: { slug: any }) {
  const hardBorder = "border-[2px] border-black"

  const getIcon = () => {
    switch (slug.type) {
      case "whatsapp": return <MessageSquare className="h-4 w-4 text-emerald-600" />
      case "paste": return <FileText className="h-4 w-4 text-purple-600" />
      case "linktree": return <Users className="h-4 w-4 text-blue-600" />
      case "shorturl": return <Link2 className="h-4 w-4 text-amber-600" />
      default: return <Link2 className="h-4 w-4 text-violet-600" />
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

  const getTargetPreview = () => {
    switch (slug.type) {
      case "whatsapp": return `wa.me/${slug.data?.phone || ""}`
      case "paste": return slug.data?.title || "Teks Tersimpan"
      case "linktree": return `${slug.data?.links?.length || 0} links`
      case "shorturl": return slug.data?.url || ""
      default: return ""
    }
  }

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https://door.id/${slug.slug}`

  return (
    <div className={`rounded-2xl bg-white p-3.5 sm:px-5 sm:py-4 ${hardBorder} shadow-[3px_3px_0_0_#111] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all hover:translate-x-[2px]`}>
      
      {/* Left: Icon, Slug, & Target */}
      <div className="flex items-center gap-3.5 min-w-0 flex-1">
        <div className={`p-2.5 rounded-xl bg-neutral-100 border-2 border-black shrink-0`}>
          {getIcon()}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <a href={`/${slug.slug}`} target="_blank" className="font-black text-base text-black hover:text-violet-600 truncate">
              door.id/{slug.slug}
            </a>
            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md border ${getTypeBadgeColor()} shrink-0`}>
              {slug.type}
            </span>
          </div>
          <p className="text-xs text-neutral-500 truncate font-medium mt-0.5">
            {getTargetPreview()}
          </p>
        </div>
      </div>

      {/* Middle: Views count & QR Thumbnail */}
      <div className="flex items-center gap-4 self-end sm:self-center shrink-0">
        <div className="text-right">
          <p className="text-xs font-bold text-neutral-400 uppercase">Views</p>
          <p className="text-sm font-black text-neutral-900">👁️ {slug.visit_count || 0}</p>
        </div>

        {/* Small QR Thumbnail */}
        <div className="w-10 h-10 rounded-lg bg-white border-2 border-black p-0.5 shrink-0 overflow-hidden shadow-[2px_2px_0_0_#111]">
          <img src={qrUrl} alt="QR" className="w-full h-full object-contain" />
        </div>
      </div>

      {/* Right: Quick Action Buttons */}
      <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-100">
        <Button asChild size="sm" className="bg-neutral-100 hover:bg-neutral-200 text-black font-bold text-xs h-9 px-3 rounded-xl border-2 border-black shadow-[2px_2px_0_0_#111]">
          <Link href={`/${slug.slug}`} target="_blank">
            <ExternalLink className="h-3.5 w-3.5 mr-1" />
            Buka
          </Link>
        </Button>
        <EditSlugDialog slug={slug} />
        <DeleteSlugButton slugId={slug.id} />
      </div>

    </div>
  )
}
