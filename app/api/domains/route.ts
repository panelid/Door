import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/domains - List user's custom domains
export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: domains, error } = await supabase
      .from("custom_domains")
      .select("id, domain, is_verified, verification_token, verified_at, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({ domains: domains || [] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal Error" }, { status: 500 });
  }
}

// POST /api/domains - Add a new custom domain
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    let domain = body.domain?.trim().toLowerCase();

    if (!domain) {
      return NextResponse.json({ error: "Domain is required" }, { status: 400 });
    }

    const domainRegex = /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/;
    if (!domainRegex.test(domain)) {
      return NextResponse.json({ error: "Invalid domain format" }, { status: 400 });
    }

    const verificationToken = `door-verify-${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;

    const { data, error } = await supabase
      .from("custom_domains")
      .insert({
        user_id: user.id,
        domain,
        verification_token: verificationToken,
      })
      .select()
      .single();

    if (error) {
      if (error.code === "23505") { // unique_violation
        return NextResponse.json({ error: "Domain already registered" }, { status: 409 });
      }
      throw error;
    }

    return NextResponse.json({
      success: true,
      domain: {
        id: data.id,
        domain,
        is_verified: data.is_verified,
        verification_token: data.verification_token,
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal Error" }, { status: 500 });
  }
}
