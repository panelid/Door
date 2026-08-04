import { ExternalLink } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { EditSlugDialog } from "@/components/edit-slug-dialog"
import DeleteSlugButton from "@/components/delete-slug-button"

export default function SlugCompactRow({ slug }: { slug: any }) {
  const hardBorder = "border-[2px] border-black"

  const getTargetPreview = () => {
    switch (slug.type) {
      case "whatsapp": return `WA: ${slug.data?.phone || ""}`
      case "paste": return slug.data?.title || "Teks"
      case "linktree": return `Bio: ${slug.data?.displayName || slug.slug}`
      case "shorturl": return slug.data?.url || ""
      default: return ""
    }
  }

  const targetDisplay = getTargetPreview()

  return (
    <div className={`rounded-xl bg-white px-4 py-2.5 ${hardBorder} shadow-[2px_2px_0_0_#111] flex items-center justify-between gap-2 transition-all hover:translate-x-[1px]`}>
      <div className="flex-1 min-w-0">
        <a href={`/${slug.slug}`} target="_blank" className="font-black text-[13px] text-black hover:text-violet-600 truncate block">
          door.id/{slug.slug}
        </a>
        <span className="text-[10px] text-neutral-600 font-semibold block truncate">{targetDisplay}</span>
      </div>
      <span className="text-[11px] font-black text-black shrink-0">{slug.visit_count || 0} views</span>
      <div className="flex items-center gap-1 shrink-0">
        <Button asChild size="sm" className="h-7 w-7 p-0 rounded-lg border-2 border-black shadow-[1.5px_1.5px_0_0_#111] bg-white hover:bg-neutral-100 text-black" title="Buka Link">
          <Link href={`/${slug.slug}`} target="_blank"><ExternalLink className="h-3.5 w-3.5 text-black" /></Link>
        </Button>
        <EditSlugDialog slug={slug} />
        <DeleteSlugButton slugId={slug.id} />
      </div>
    </div>
  )
}