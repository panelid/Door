import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// POST /api/domains/verify - Verify domain ownership via DNS TXT record
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const domainId = body.domain_id;

    if (!domainId) {
      return NextResponse.json({ error: "Domain ID is required" }, { status: 400 });
    }

    // Fetch domain record owned by current user
    const { data: domainRecord, error: fetchError } = await supabase
      .from("custom_domains")
      .select("id, domain, verification_token, is_verified")
      .eq("id", domainId)
      .eq("user_id", user.id)
      .single();

    if (fetchError || !domainRecord) {
      return NextResponse.json({ error: "Domain not found" }, { status: 404 });
    }

    if (domainRecord.is_verified) {
      return NextResponse.json({ success: true, message: "Domain already verified" });
    }

    // DNS TXT Record verification
    try {
      // Dynamic import for DNS resolution
      const dns = await import("dns/promises");
      
      // Note: resolveTxt returns string[][], where each inner string[] is a TXT record
      // and each string is a chunk of that record
      const txtRecords = await dns.resolveTxt(domainRecord.domain);
      const expectedRecord = domainRecord.verification_token;
      
      // Check if any TXT record matches our verification token
      const verified = txtRecords.some((record: string[]) => {
        // Join all chunks of the TXT record and check if it contains our token
        const fullRecord = record.join('');
        return fullRecord === expectedRecord;
      });

      if (verified) {
        // Update domain as verified
        const { error: updateError } = await supabase
          .from("custom_domains")
          .update({ 
            is_verified: true, 
            verified_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq("id", domainId);

        if (updateError) throw updateError;

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
