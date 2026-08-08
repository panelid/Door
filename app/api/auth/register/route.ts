// app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import { hashPassword } from "@/lib/auth/hash";
import { createSessionToken, getSessionCookie } from "@/lib/auth/session";

export async function POST(request: Request) {
    try {
        const { email, password, username } = await request.json();

        if (!email || !password) {
            return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
        }

        const passwordHash = await hashPassword(password);

        // Mock D1 insertion
        // const db = (process.env as any).DB;
        // await db.prepare("INSERT INTO users (email, username, password_hash) VALUES (?, ?, ?)").bind(email, username, passwordHash).run();

        return NextResponse.json({ success: true, message: "Registration endpoint ready for D1 binding" });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
