import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { slug, password } = await request.json()

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 })
    }

    if (!password || password.trim().length < 4) {
      return NextResponse.json({ error: "Password minimal 4 karakter" }, { status: 400 })
    }

    const supabase = await createClient()

    // Get the current paste data
    const { data: slugData, error: fetchError } = await supabase
      .from("slugs")
      .select("id, paste_password, data")
      .eq("slug", slug)
      .eq("type", "paste")
      .maybeSingle()

    if (fetchError || !slugData) {
      return NextResponse.json({ error: "Paste tidak ditemukan" }, { status: 404 })
    }

    // Check if paste already has password
    if (slugData.paste_password) {
      return NextResponse.json({ 
        error: "Paste sudah dilindungi password. Gunakan endpoint verify-password untuk edit." 
      }, { status: 400 })
    }

    // Update paste with new password
    const { error: updateError } = await supabase
      .from("slugs")
      .update({
        paste_password: password,
        updated_at: new Date().toISOString()
      })
      .eq("id", slugData.id)

    if (updateError) {
      console.error("Add password error:", updateError)
      throw updateError
    }

    // Save current content to history before any future edits
    if (slugData.data?.content) {
      await supabase.from("paste_history").insert({
        slug_id: slugData.id,
        content: slugData.data.content,
      })
    }

    return NextResponse.json({ 
      success: true,
      message: "Password berhasil ditambahkan ke paste ini.",
      editUrl: `/pastes/${slug}/edit?password=${encodeURIComponent(password)}`
    })

  } catch (error) {
    console.error("Add password endpoint error:", error)
    return NextResponse.json({ 
      error: "Gagal menambahkan password. Silakan coba lagi." 
    }, { status: 500 })
  }
}