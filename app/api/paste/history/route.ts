import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const slug = request.nextUrl.searchParams.get("slug")

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 })
    }

    const supabase = await createClient()

    // Get slug ID
    const { data: slugData, error: slugError } = await supabase
      .from("slugs")
      .select("id")
      .eq("slug", slug)
      .eq("type", "paste")
      .maybeSingle()

    if (slugError || !slugData) {
      return NextResponse.json({ error: "Paste not found" }, { status: 404 })
    }

    // Fetch history
    const { data: history, error: historyError } = await supabase
      .from("paste_history")
      .select("id, content, created_at")
      .eq("slug_id", slugData.id)
      .order("created_at", { ascending: false })
      .limit(50)

    if (historyError) throw historyError

    return NextResponse.json({ history: history || [] })
  } catch (error) {
    console.error("History fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch history" }, { status: 500 })
  }
}
