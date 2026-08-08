import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PastePage from "@/components/paste-page";
import LinktreePage from "@/components/linktree-page";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const h = await headers();
  const customDomain = h.get("x-door-custom-domain");
  
  const supabase = await createClient();
  let query = supabase.from("slugs").select("*").eq("slug", slug);
  
  // If custom domain, restrict to that domain owner's user_id
  if (customDomain) {
    const { data: domainData } = await supabase.from("custom_domains").select("user_id").eq("domain", customDomain).single();
    if (domainData) {
      query = query.eq("user_id", domainData.user_id);
    } else {
      return { title: "Link Not Found", description: "The requested link could not be found." };
    }
  }
  
  const { data: slugData } = await query.maybeSingle();

  if (!slugData) {
    return { title: "Link Not Found", description: "The requested link could not be found." };
  }

  const titles: Record<string, string> = {
    whatsapp: `WhatsApp Link - ${slug}`,
    paste: `Paste - ${slug}`,
    linktree: `Links - @${slug}`,
    shorturl: `Short URL - ${slug}`,
  };

  return {
    title: titles[slugData.type] || slug,
    description: `View ${slug} on Door.id - Your link management platform`,
  };
}

export default async function SlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const h = await headers();
  const customDomain = h.get("x-door-custom-domain");

  // Reserved routes that should not be treated as slugs
  const reservedRoutes: Record<string, string> = {
    "dashboard": "/dashboard",
    "settings": "/settings",
    "auth": "/auth/login",
    "admin": "/",
    "_next": "/",
    "public": "/",
    "api": "/",
  };
  
  const lowerSlug = slug.toLowerCase();
  if (reservedRoutes[lowerSlug]) {
    redirect(reservedRoutes[lowerSlug]);
  }

  const supabase = await createClient();
  let query = supabase.from("slugs").select("*").eq("slug", slug);
  
  // If custom domain, restrict to that domain owner's user_id
  if (customDomain) {
    const { data: domainData } = await supabase.from("custom_domains").select("user_id").eq("domain", customDomain).single();
    if (domainData) {
      query = query.eq("user_id", domainData.user_id);
    } else {
      // Domain not found in custom_domains table
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">404 - Domain Not Found</h1>
            <p className="text-muted-foreground">This custom domain is not configured properly.</p>
          </div>
        </div>
      );
    }
  }

  const { data: slugData, error } = await query.maybeSingle();

  if (error || !slugData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">404 - Not Found</h1>
          <p className="text-muted-foreground">The link you are looking for does not exist.</p>
        </div>
      </div>
    );
  }

  switch (slugData.type) {
    case "whatsapp": {
      const phone = slugData.data.phone.replace(/\D/g, "");
      const message = slugData.data.message ? `?text=${encodeURIComponent(slugData.data.message)}` : "";
      const whatsappUrl = `https://wa.me/${phone}${message}`;
      redirect(whatsappUrl);
      break;
    }

    case "shorturl": {
      const targetUrl = slugData.data.url;
      redirect(targetUrl);
      break;
    }

    case "paste": {
      const { data: { user } } = await supabase.auth.getUser();
      const isOwner = user && slugData.user_id && user.id === slugData.user_id;
      
      return (
        <PastePage 
          slug={slug} 
          content={slugData.data.content} 
          hasPassword={!!slugData.paste_password}
          isOwner={isOwner}
        />
      );
    }

    case "linktree":
      return <LinktreePage slug={slug} links={slugData.data.links} />;

    default:
      notFound();
  }
}
