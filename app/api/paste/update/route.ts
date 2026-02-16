import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { slug, content, password } = await request.json()

    if (!slug || content === undefined) {
      return NextResponse.json({ error: "Slug and content are required" }, { status: 400 })
    }

    const supabase = await createClient()

    // Get the slug data
    const { data: slugData, error: slugError } = await supabase
      .from("slugs")
      .select("id, paste_password, data")
      .eq("slug", slug)
      .eq("type", "paste")
      .maybeSingle()

    if (slugError || !slugData) {
      return NextResponse.json({ error: "Paste not found" }, { status: 404 })
    }

    // Verify password if set
    if (slugData.paste_password && slugData.paste_password !== password) {
      return NextResponse.json({ error: "Password salah" }, { status: 403 })
    }

    // Save current content to history before updating
    const oldContent = slugData.data?.content || ""
    if (oldContent && oldContent !== content) {
      await supabase.from("paste_history").insert({
        slug_id: slugData.id,
        content: oldContent,
      })
    }

    // Update the slug content
    const { error: updateError } = await supabase
      .from("slugs")
      .update({
        data: { content },
        updated_at: new Date().toISOString(),
      })
      .eq("id", slugData.id)

    if (updateError) throw updateError

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Paste update error:", error)
    return NextResponse.json({ error: "Failed to update paste" }, { status: 500 })
  }
}
