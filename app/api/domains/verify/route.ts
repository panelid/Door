import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { resolveTxt } from "dns/promises";

// POST /api/domains/verify - Verify domain ownership via DNS TXT record
export async function POST(request: Request) {
  try {
    const user = await getSessionUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const domainId = body.domain_id;

    if (!domainId) {
      return NextResponse.json({ error: "Domain ID is required" }, { status: 400 });
    }

    const db = (globalThis as any).process?.env?.DB || (request as any).env?.DB;
    if (!db) {
      return NextResponse.json({ error: "Database binding not available" }, { status: 500 });
    }

    // Fetch domain record
    const domainRecord = await db.prepare(
      "SELECT id, domain, verification_token, is_verified FROM custom_domains WHERE id = ? AND user_id = ?"
    ).bind(domainId, user.id).first();

    if (!domainRecord) {
      return NextResponse.json({ error: "Domain not found" }, { status: 404 });
    }

    if (domainRecord.is_verified) {
      return NextResponse.json({ success: true, message: "Domain already verified" });
    }

    // DNS TXT Record verification
    try {
      const txtRecords = await resolveTxt(domainRecord.domain);
      const expectedRecord = domainRecord.verification_token;
      
      // Check if any TXT record matches our verification token
      // resolveTxt returns string[][], where each outer array is a TXT record
      // and each inner string is a chunk of that record
      const verified = txtRecords.some((record: string[]) => {
        // Join all chunks of the TXT record and check if it contains our token
        const fullRecord = record.join('');
        return fullRecord === expectedRecord;
      });

      if (verified) {
        // Update domain as verified
        await db.prepare(
          "UPDATE custom_domains SET is_verified = 1, verified_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
        ).bind(domainId).run();

        return NextResponse.json({ 
          success: true, 
          message: "Domain verified successfully",
          domain: domainRecord.domain
        });
      } else {
        return NextResponse.json({ 
          success: false, 
          message: "TXT record not found. Please add the verification record to your DNS.",
          expected_record: expectedRecord,
          domain: domainRecord.domain
        });
      }
    } catch (dnsError: any) {
      return NextResponse.json({ 
        success: false, 
        message: `DNS lookup failed: ${dnsError.message}`,
        expected_record: domainRecord.verification_token,
        domain: domainRecord.domain
      });
    }

  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal Error" }, { status: 500 });
  }
}
