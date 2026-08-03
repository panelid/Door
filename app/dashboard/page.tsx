import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Link2, MessageSquare, FileText, Users, ExternalLink, Mail, Sparkles, BarChart3, Plus, Search, QrCode } from "lucide-react"
import { DeleteSlugButton } from "@/components/delete-slug-button"
import { EditSlugDialog } from "@/components/edit-slug-dialog"

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

  const totalSlugs = slugs?.length || 0
  const totalVisits = slugs?.reduce((sum, s) => sum + (s.visit_count || 0), 0) || 0
  
  const whatsappSlugs = slugs?.filter(s => s.type === "whatsapp") || []
  const linktreeSlugs = slugs?.filter(s => s.type === "linktree") || []
  const shorturlSlugs = slugs?.filter(s => s.type === "shorturl") || []
  const pasteSlugs = slugs?.filter(s => s.type === "paste") || []

  const hardBorder = "border-[2.5px] border-black"
  const hardShadow = "shadow-[3px_3px_0_0_#111]"

  return (
    <div className="min-h-screen bg-[#F5F2EC] text-neutral-900 pb-20">
      
      {/* Top Header */}
      <header className={`sticky top-0 z-50 bg-[#F5F2EC]/95 backdrop-blur-md border-b-[3px] border-black`}>
        <div className="max-w-5xl mx-auto flex h-14 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-lg bg-violet-600 ${hardBorder} flex items-center justify-center text-white text-sm font-black shadow-[2px_2px_0_0_#111]`}>
              🚪
            </div>
            <span className="text-[18px] font-black tracking-tight text-black">Door.id</span>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="text-xs font-bold text-neutral-600 hidden sm:inline">{user.email}</span>
            <Button asChild size="sm" className={`bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl border-2 border-black shadow-[2px_2px_0_0_#111] h-8 text-xs px-3`}>
              <Link href="/">
                <Plus className="h-3.5 w-3.5 mr-1" /> Buat Link
              </Link>
            </Button>
            <form action={handleSignOut}>
              <Button type="submit" size="sm" className={`bg-black text-white hover:bg-neutral-800 font-bold rounded-xl border-2 border-black shadow-[2px_2px_0_0_#111] h-8 text-xs px-3`}>
                Keluar
              </Button>
            </form>
          </div>
        </div>
      </header>

      {/* Compact Top Stats Bar */}
      <div className="bg-white border-b-2 border-black py-4 px-4 sm:px-6 mb-6">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <div>
              <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Total Tautan</p>
              <p className="text-xl font-black">{totalSlugs}</p>
            </div>
            <div className="h-8 w-[2px] bg-neutral-200" />
            <div>
              <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Total Kunjungan</p>
              <p className="text-xl font-black text-violet-600">👁️ {totalVisits}</p>
            </div>
          </div>

          <Button asChild className={`bg-yellow-300 hover:bg-yellow-400 text-black font-black text-xs rounded-xl ${hardBorder} ${hardShadow} h-9 px-4`}>
            <Link href="/">✨ Buat & Kustomisasi Link Baru</Link>
          </Button>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6">
        
        {slugsError && (
          <div className="rounded-xl bg-red-100 border-2 border-red-500 p-3 text-red-700 font-bold text-sm mb-6">
            Error: {slugsError.message}
          </div>
        )}

        {slugs && slugs.length === 0 && (
          <div className={`rounded-2xl bg-white p-10 text-center ${hardBorder} ${hardShadow} my-12`}>
            <div className="w-14 h-14 rounded-2xl bg-violet-100 border-2 border-black flex items-center justify-center mx-auto mb-3 shadow-[2px_2px_0_0_#111]">
              <Link2 className="h-6 w-6 text-violet-600" />
            </div>
            <h3 className="text-lg font-black mb-1">Belum ada link dibuat</h3>
            <p className="text-xs text-neutral-600 mb-5 font-medium max-w-xs mx-auto">Mulai buat link pertama Anda untuk WhatsApp, Short URL, atau Link Bio.</p>
            <Button asChild className={`bg-black text-white hover:bg-neutral-800 font-bold rounded-xl ${hardBorder} ${hardShadow} px-5 py-2.5 text-xs`}>
              <Link href="/"><Plus className="h-4 w-4 mr-1.5" /> Buat Link Pertama</Link>
            </Button>
          </div>
        )}

        {slugs && slugs.length > 0 && (
          <div className="space-y-6">
            
            {/* Sticky Floating Category Nav Bar */}
            <div className="sticky top-16 z-40 bg-[#F5F2EC]/90 backdrop-blur-md py-3 -mx-4 px-4 sm:mx-0 sm:px-0">
              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                <a href="#section-whatsapp" className="px-3.5 py-1.5 rounded-xl bg-emerald-100 border-2 border-black font-black text-xs text-emerald-900 shadow-[2px_2px_0_0_#111] shrink-0 hover:translate-y-[-1px]">
                  💬 WhatsApp ({whatsappSlugs.length})
                </a>
                <a href="#section-linktree" className="px-3.5 py-1.5 rounded-xl bg-blue-100 border-2 border-black font-black text-xs text-blue-900 shadow-[2px_2px_0_0_#111] shrink-0 hover:translate-y-[-1px]">
                  🌐 Link Bio ({linktreeSlugs.length})
                </a>
                <a href="#section-shorturl" className="px-3.5 py-1.5 rounded-xl bg-amber-100 border-2 border-black font-black text-xs text-amber-900 shadow-[2px_2px_0_0_#111] shrink-0 hover:translate-y-[-1px]">
                  🔗 Short URL ({shorturlSlugs.length})
                </a>
                <a href="#section-paste" className="px-3.5 py-1.5 rounded-xl bg-purple-100 border-2 border-black font-black text-xs text-purple-900 shadow-[2px_2px_0_0_#111] shrink-0 hover:translate-y-[-1px]">
                  📄 Paste & Notes ({pasteSlugs.length})
                </a>
              </div>
            </div>

            {/* Sections */}
            <div className="space-y-8">
              {whatsappSlugs.length > 0 && (
                <div id="section-whatsapp" className="space-y-2.5 pt-2">
                  <h3 className="text-sm font-black uppercase tracking-wider text-neutral-500 flex items-center gap-2">
                    💬 WhatsApp Links ({whatsappSlugs.length})
                  </h3>
                  <div className="space-y-2">
                    {whatsappSlugs.map(slug => <SlugCompactRow key={slug.id} slug={slug} />)}
                  </div>
                </div>
              )}

              {linktreeSlugs.length > 0 && (
                <div id="section-linktree" className="space-y-2.5 pt-2">
                  <h3 className="text-sm font-black uppercase tracking-wider text-neutral-500 flex items-center gap-2">
                    🌐 Link-in-Bio ({linktreeSlugs.length})
                  </h3>
                  <div className="space-y-2">
                    {linktreeSlugs.map(slug => <SlugCompactRow key={slug.id} slug={slug} />)}
                  </div>
                </div>
              )}

              {shorturlSlugs.length > 0 && (
                <div id="section-shorturl" className="space-y-2.5 pt-2">
                  <h3 className="text-sm font-black uppercase tracking-wider text-neutral-500 flex items-center gap-2">
                    🔗 Short URLs ({shorturlSlugs.length})
                  </h3>
                  <div className="space-y-2">
                    {shorturlSlugs.map(slug => <SlugCompactRow key={slug.id} slug={slug} />)}
                  </div>
                </div>
              )}

              {pasteSlugs.length > 0 && (
                <div id="section-paste" className="space-y-2.5 pt-2">
                  <h3 className="text-sm font-black uppercase tracking-wider text-neutral-500 flex items-center gap-2">
                    📄 Paste & Secure Notes ({pasteSlugs.length})
                  </h3>
                  <div className="space-y-2">
                    {pasteSlugs.map(slug => <SlugCompactRow key={slug.id} slug={slug} />)}
                  </div>
                </div>
              )}
            </div>

          </div>
        )}

      </main>
    </div>
  )
}

function SlugCompactRow({ slug }: { slug: any }) {
  const hardBorder = "border-[2px] border-black"

  const getIcon = () => {
    switch (slug.type) {
      case "whatsapp": return <MessageSquare className="h-3.5 w-3.5 text-emerald-700" />
      case "paste": return <FileText className="h-3.5 w-3.5 text-purple-700" />
      case "linktree": return <Users className="h-3.5 w-3.5 text-blue-700" />
      case "shorturl": return <Link2 className="h-3.5 w-3.5 text-amber-700" />
      default: return <Link2 className="h-3.5 w-3.5 text-violet-700" />
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

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=https://door.id/${slug.slug}`

  return (
    <div className={`rounded-xl bg-white px-4 py-2.5 ${hardBorder} shadow-[2px_2px_0_0_#111] flex items-center justify-between gap-3 transition-all hover:translate-x-[1px]`}>
      
      {/* Left: Icon & Slug */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className={`p-1.5 rounded-lg bg-neutral-100 border border-black shrink-0`}>
          {getIcon()}
        </div>
        <div className="min-w-0 flex items-center gap-2.5">
          <a href={`/${slug.slug}`} target="_blank" className="font-bold text-sm text-black hover:text-violet-600 truncate">
            door.id/{slug.slug}
          </a>
          <span className="text-[11px] text-neutral-400 truncate hidden sm:inline font-medium">
            ({getTargetPreview()})
          </span>
        </div>
      </div>

      {/* Middle: Views & QR Thumbnail */}
      <div className="flex items-center gap-3 shrink-0">
        <span className="text-xs font-black text-neutral-700 bg-neutral-100 px-2 py-0.5 rounded-md border border-neutral-300">
          👁️ {slug.visit_count || 0}
        </span>
        <div className="w-8 h-8 rounded-md bg-white border border-black p-0.5 shrink-0 overflow-hidden shadow-[1px_1px_0_0_#111]">
          <img src={qrUrl} alt="QR" className="w-full h-full object-contain" />
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1.5 shrink-0">
        <Button asChild size="sm" className="bg-neutral-100 hover:bg-neutral-200 text-black font-bold text-[11px] h-7 px-2.5 rounded-lg border border-black shadow-[1px_1px_0_0_#111]">
          <Link href={`/${slug.slug}`} target="_blank">
            <ExternalLink className="h-3 w-3 mr-1" /> Buka
          </Link>
        </Button>
        <EditSlugDialog slug={slug} />
        <DeleteSlugButton slugId={slug.id} />
      </div>

    </div>
  )
}
