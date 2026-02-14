import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { slug, content } = await request.json()

    const supabase = await createClient()

    // Update the slug content
    const { error: updateError } = await supabase
      .from("slugs")
      .update({
        data: { content },
        updated_at: new Date().toISOString(),
      })
      .eq("slug", slug)

    if (updateError) throw updateError

    // Save to history
    const { error: historyError } = await supabase.from("paste_history").insert({
      slug,
      content,
      version: Math.floor(Date.now() / 1000),
    })

    if (historyError) throw historyError

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Paste update error:", error)
    return NextResponse.json(
      { error: "Failed to update paste" },
      { status: 500 }
    )
  }
}
