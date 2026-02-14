import { notFound, redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import PastePage from "@/components/paste-page"
import LinktreePage from "@/components/linktree-page"
import type { Metadata } from "next"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data: slugData } = await supabase.from("slugs").select("*").eq("slug", slug).maybeSingle()

  if (!slugData) {
    return {
      title: "Link Not Found",
      description: "The requested link could not be found.",
    }
  }

  const titles: Record<string, string> = {
    whatsapp: `WhatsApp Link - ${slug}`,
    paste: `Paste - ${slug}`,
    linktree: `Links - @${slug}`,
    shorturl: `Short URL - ${slug}`,
  }

  return {
    title: titles[slugData.type] || slug,
    description: `View ${slug} on Door.id - Your link management platform`,
  }
}

export default async function SlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  console.log("[v0] SlugPage - Processing slug:", slug)

  // Reserved routes that should not be treated as slugs
  const reservedRoutes = ["dashboard", "auth", "api", "admin", "settings", "_next", "public"]
  if (reservedRoutes.includes(slug.toLowerCase())) {
    console.log("[v0] SlugPage - Reserved route detected")
    // Redirect reserved routes to 404 page instead of treating as slugs
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">404 - Not Found</h1>
          <p className="text-muted-foreground">The page you are looking for does not exist.</p>
        </div>
      </div>
    )
  }

  const supabase = await createClient()

  const { data: slugData, error } = await supabase.from("slugs").select("*").eq("slug", slug).maybeSingle()

  console.log("[v0] SlugPage - Database query result:", { found: !!slugData, error: error?.message })

  if (error || !slugData) {
    console.log("[v0] SlugPage - Slug not found")
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">404 - Not Found</h1>
          <p className="text-muted-foreground">The link you are looking for does not exist.</p>
        </div>
      </div>
    )
  }

  console.log("[v0] SlugPage - Slug type:", slugData.type)

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
      return <PastePage slug={slug} content={slugData.data.content} pastePassword={slugData.paste_password} />

    case "linktree":
      console.log("[v0] SlugPage - Rendering linktree page")
      return <LinktreePage slug={slug} links={slugData.data.links} />

    default:
      console.log("[v0] SlugPage - Unknown type, calling notFound()")
      notFound()
  }
}
