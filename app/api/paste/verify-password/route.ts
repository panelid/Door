import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { slug, password } = await request.json()

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 })
    }

    const supabase = await createClient()

    const { data: slugData, error } = await supabase
      .from("slugs")
      .select("id, paste_password")
      .eq("slug", slug)
      .eq("type", "paste")
      .maybeSingle()

    if (error || !slugData) {
      return NextResponse.json({ error: "Paste not found" }, { status: 404 })
    }

    // No password set — anyone can edit
    if (!slugData.paste_password) {
      return NextResponse.json({ success: true, hasPassword: false })
    }

    // Password set — verify it
    if (password === slugData.paste_password) {
      return NextResponse.json({ success: true, hasPassword: true })
    }

    return NextResponse.json({ error: "Password salah" }, { status: 403 })
  } catch (error) {
    console.error("Password verify error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
