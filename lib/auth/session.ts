// lib/auth/session.ts
// HMAC-signed session cookies using Web Crypto API

const SECRET = process.env.SESSION_SECRET || "door-id-session-secret-change-me";
const EXPIRY_DAYS = 30;

export interface SessionData {
    userId: string;
    email: string;
    username?: string;
    expires: number;
}

async function hmacSign(data: string, secret: string): Promise<string> {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
        "raw",
        encoder.encode(secret),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
    );
    const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(data));
    return Array.from(new Uint8Array(signature))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

export async function createSessionToken(data: Omit<SessionData, "expires">): Promise<string> {
    const session: SessionData = {
        ...data,
        expires: Date.now() + EXPIRY_DAYS * 24 * 60 * 60 * 1000,
    };
    const payload = JSON.stringify(session);
    const signature = await hmacSign(payload, SECRET);
    return `${Buffer.from(payload).toString("base64")}.${signature}`;
}

export async function verifySessionToken(token: string): Promise<SessionData | null> {
    try {
        const [payloadB64, signature] = token.split(".");
        const payload = Buffer.from(payloadB64, "base64").toString();
        const expectedSignature = await hmacSign(payload, SECRET);
        
        if (signature !== expectedSignature) return null;
        
        const data = JSON.parse(payload) as SessionData;
        if (data.expires < Date.now()) return null;
        
        return data;
    } catch {
        return null;
    }
}

export function getSessionCookie(sessionToken: string): string {
    return `session=${sessionToken}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${EXPIRY_DAYS * 24 * 60 * 60}`;
}

export async function getSessionUser(request: Request): Promise<SessionData | null> {
    const cookieHeader = request.headers.get("cookie") || "";
    const sessionCookie = cookieHeader.split(";").find(c => c.trim().startsWith("session="));
    
    if (!sessionCookie) return null;
    
    const token = sessionCookie.split("=")[1]?.trim();
    if (!token) return null;
    
    return verifySessionToken(token);
}
