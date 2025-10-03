import { notFound, redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import PastePage from "@/components/paste-page"
import LinktreePage from "@/components/linktree-page"

export default async function SlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  console.log("[v0] SlugPage - Processing slug:", slug)

  const supabase = await createClient()

  const { data: slugData, error } = await supabase.from("slugs").select("*").eq("slug", slug).maybeSingle()

  console.log("[v0] SlugPage - Database query result:", { found: !!slugData, error: error?.message })

  if (error || !slugData) {
    console.log("[v0] SlugPage - Slug not found, calling notFound()")
    notFound()
  }

  console.log("[v0] SlugPage - Slug type:", slugData.type)

  // Handle different slug types
  switch (slugData.type) {
    case "whatsapp": {
      const phone = slugData.data.phone.replace(/\D/g, "")
      const message = slugData.data.message ? `?text=${encodeURIComponent(slugData.data.message)}` : ""
      const whatsappUrl = `https://wa.me/${phone}${message}`
      console.log("[v0] SlugPage - Redirecting to WhatsApp:", whatsappUrl)
      redirect(whatsappUrl)
      break
    }

    case "shorturl": {
      const targetUrl = slugData.data.url
      console.log("[v0] SlugPage - Redirecting to short URL:", targetUrl)
      redirect(targetUrl)
      break
    }

    case "paste":
      console.log("[v0] SlugPage - Rendering paste page")
      return <PastePage slug={slug} content={slugData.data.content} />

    case "linktree":
      console.log("[v0] SlugPage - Rendering linktree page")
      return <LinktreePage slug={slug} links={slugData.data.links} />

    default:
      console.log("[v0] SlugPage - Unknown type, calling notFound()")
      notFound()
  }
}
