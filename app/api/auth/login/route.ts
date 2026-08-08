// app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import { verifyPassword } from "@/lib/auth/hash";
import { createSessionToken, getSessionCookie } from "@/lib/auth/session";

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();
        
        if (!email || !password) {
            return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
        }

        // Mock DB lookup for D1 binding (when running on Cloudflare Workers)
        // In real Worker: const db = (process.env as any).DB;
        // const user = await db.prepare("SELECT * FROM users WHERE email = ?").bind(email).first();

        // For local test / POC simulation:
        return NextResponse.json({ success: true, message: "Login endpoint ready for D1 binding" });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
