import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { slug, type, data } = body

    if (!slug || !type) {
      return NextResponse.json({ error: "Slug and type are required" }, { status: 400 })
    }

    // Cek apakah slug sudah dipakai
    const { data: existing } = await supabase
      .from("slugs")
      .select("id")
      .eq("slug", slug)
      .single()

    if (existing) {
      return NextResponse.json({ error: "Slug already taken" }, { status: 400 })
    }

    // Insert ke tabel slugs
    const { data: newSlug, error } = await supabase
      .from("slugs")
      .insert({
        user_id: user.id,
        slug,
        type,
        data: data || {},
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, slug: newSlug })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 })
  }
}
