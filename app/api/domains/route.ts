import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";

// GET /api/domains - List user's custom domains
export async function GET(request: Request) {
  try {
    const user = await getSessionUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = (globalThis as any).process?.env?.DB || (request as any).env?.DB;
    
    if (!db) {
      return NextResponse.json({ domains: [] });
    }

    const { results } = await db.prepare(
      "SELECT id, domain, is_verified, verification_token, verified_at, created_at FROM custom_domains WHERE user_id = ? ORDER BY created_at DESC"
    ).bind(user.id).all();

    return NextResponse.json({ domains: results || [] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal Error" }, { status: 500 });
  }
}

// POST /api/domains - Add a new custom domain
export async function POST(request: Request) {
  try {
    const user = await getSessionUser(request);
    if (!user) {
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

    const db = (globalThis as any).process?.env?.DB || (request as any).env?.DB;
    if (!db) {
      return NextResponse.json({ error: "Database binding not available" }, { status: 500 });
    }

    const verificationToken = `door-verify-${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;

    await db.prepare(
      "INSERT INTO custom_domains (user_id, domain, verification_token) VALUES (?, ?, ?)"
    ).bind(user.id, domain, verificationToken).run();

    return NextResponse.json({
      success: true,
      domain: {
        domain,
        is_verified: 0,
        verification_token: verificationToken,
      }
    });
  } catch (error: any) {
    if (error.message?.includes("UNIQUE")) {
      return NextResponse.json({ error: "Domain already registered" }, { status: 409 });
    }
    return NextResponse.json({ error: error.message || "Internal Error" }, { status: 500 });
  }
}
