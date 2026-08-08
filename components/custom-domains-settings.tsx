"use client";

import { useState, useEffect } from "react";
import { Globe, Plus, Trash2, CheckCircle2, Clock, AlertCircle, Copy, Check, ShieldCheck, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface Domain {
  id: string;
  domain: string;
  is_verified: number;
  verification_token: string;
  verified_at?: string;
  created_at: string;
}

export default function CustomDomainsSettings() {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [newDomain, setNewDomain] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const hardBorder = "border-[2.5px] border-black";
  const hardShadow = "shadow-[4px_4px_0_0_#111]";
  const hardShadowSm = "shadow-[2px_2px_0_0_#111]";

  useEffect(() => {
    fetchDomains();
  }, []);

  const fetchDomains = async () => {
    try {
      const res = await fetch("/api/domains");
      const data = await res.json();
      if (res.ok) {
        setDomains(data.domains || []);
      }
    } catch (error) {
      toast.error("Failed to load custom domains");
    } finally {
      setLoading(false);
    }
  };

  const handleAddDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDomain.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/domains", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: newDomain }),
      });
      const data = await res.json();

      if (res.ok) {
        toast.success("Domain added successfully!");
        setNewDomain("");
        fetchDomains();
      } else {
        toast.error(data.error || "Failed to add domain");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerify = async (domainId: string) => {
    setVerifyingId(domainId);
    try {
      const res = await fetch("/api/domains/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain_id: domainId }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        toast.success("Domain verified successfully!");
        fetchDomains();
      } else {
        toast.error(data.message || "Domain verification failed. DNS propagation can take a few minutes.");
      }
    } catch (error) {
      toast.error("Verification request failed");
    } finally {
      setVerifyingId(null);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedToken(id);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopiedToken(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className={`p-6 bg-white rounded-xl ${hardBorder} ${hardShadow}`}>
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-10 h-10 rounded-lg bg-violet-600 ${hardBorder} flex items-center justify-center text-white`}>
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight">Custom Domains</h2>
            <p className="text-sm text-neutral-600">Connect your own domain name to brand your links and short URLs professionally.</p>
          </div>
        </div>

        <form onSubmit={handleAddDomain} className="flex flex-col sm:flex-row gap-3 mt-6">
          <Input
            type="text"
            placeholder="e.g. links.yourbrand.com"
            value={newDomain}
            onChange={(e) => setNewDomain(e.target.value)}
            className={`bg-[#F5F2EC] ${hardBorder} font-medium`}
          />
          <Button
            type="submit"
            disabled={submitting}
            className={`bg-amber-400 hover:bg-amber-500 text-neutral-900 font-black ${hardBorder} ${hardShadowSm} active:translate-x-0.5 active:translate-y-0.5`}
          >
            <Plus className="w-4 h-4 mr-2" />
            {submitting ? "Adding..." : "Add Domain"}
          </Button>
        </form>
      </div>

      {/* Domain List */}
      <div className="space-y-4">
        <h3 className="text-lg font-black tracking-tight">Your Connected Domains</h3>

        {loading ? (
          <div className="p-8 text-center text-neutral-500 font-medium">Loading custom domains...</div>
        ) : domains.length === 0 ? (
          <div className={`p-8 bg-white rounded-xl ${hardBorder} text-center space-y-2`}>
            <Globe className="w-10 h-10 mx-auto text-neutral-400" />
            <p className="font-bold text-neutral-700">No custom domains added yet</p>
            <p className="text-xs text-neutral-500">Add a domain above to start branding your links.</p>
          </div>
        ) : (
          domains.map((d) => (
            <div key={d.id} className={`p-6 bg-white rounded-xl ${hardBorder} ${hardShadow} space-y-4`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="font-black text-lg">{d.domain}</span>
                  {d.is_verified ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border-2 border-emerald-800">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-800 border-2 border-amber-800">
                      <Clock className="w-3.5 h-3.5" /> Pending Verification
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {!d.is_verified && (
                    <Button
                      onClick={() => handleVerify(d.id)}
                      disabled={verifyingId === d.id}
                      className={`bg-violet-600 hover:bg-violet-700 text-white font-black text-xs ${hardBorder} ${hardShadowSm}`}
                    >
                      {verifyingId === d.id ? "Verifying..." : "Verify DNS"}
                    </Button>
                  )}
                  <a
                    href={`https://${d.domain}`}
                    target="_blank"
                    rel="noreferrer"
                    className={`p-2 bg-neutral-100 hover:bg-neutral-200 rounded-lg ${hardBorder} text-neutral-900`}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {!d.is_verified && (
                <div className={`p-4 bg-[#F5F2EC] rounded-lg ${hardBorder} space-y-3 text-sm`}>
                  <p className="font-bold text-neutral-900 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-violet-600" /> DNS Configuration Instructions
                  </p>
                  <p className="text-xs text-neutral-600">
                    To verify ownership of <span className="font-bold">{d.domain}</span>, add the following TXT record to your DNS provider (Cloudflare, Namecheap, etc.):
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono bg-white p-3 rounded border-2 border-black">
                    <div>
                      <span className="text-neutral-500 block">Type:</span>
                      <strong className="text-neutral-900 font-black">TXT</strong>
                    </div>
                    <div>
                      <span className="text-neutral-500 block">Name / Host:</span>
                      <strong className="text-neutral-900 font-black">@</strong>
                    </div>
                    <div className="sm:col-span-3 flex items-center justify-between gap-2 mt-1 pt-2 border-t border-dashed border-neutral-300">
                      <div>
                        <span className="text-neutral-500 block">Value / Content:</span>
                        <span className="text-violet-700 font-bold break-all">{d.verification_token}</span>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => copyToClipboard(d.verification_token, d.id)}
                        className="bg-amber-400 hover:bg-amber-500 text-neutral-900 font-black text-xs h-7 border border-black shadow-[1px_1px_0_0_#111]"
                      >
                        {copiedToken === d.id ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      </Button>
                    </div>
                  </div>

                  <p className="text-xs text-neutral-500 italic">
                    Also ensure you add a CNAME record pointing your domain to <span className="font-mono font-bold">cname.vercel-dns.com</span> so traffic reaches Door.id.
                  </p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
