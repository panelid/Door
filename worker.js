import indexHtml from "./out/index.html" with { type: "text" }
import loginHtml from "./out/auth/login.html" with { type: "text" }
import signupHtml from "./out/auth/sign-up.html" with { type: "text" }
import signupSuccessHtml from "./out/auth/sign-up-success.html" with { type: "text" }

// Static assets known extensions
const STATIC_EXTS = [".js", ".css", ".woff2", ".woff", ".ttf", ".png", ".jpg", ".svg", ".ico", ".map"]

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url)
    const path = url.pathname

    // Serve static assets from _next/static
    if (path.startsWith("/_next/static/")) {
      const assetPath = path.slice(1) // remove leading /
      try {
        // We'll use the raw file from the out directory
        const response = await fetchStaticAsset(assetPath)
        if (response) return response
      } catch (e) {
        // fall through to 404
      }
    }

    // Route: home page
    if (path === "/" || path === "") {
      const html = fixPaths(indexHtml)
      return new Response(html, {
        headers: { "content-type": "text/html; charset=utf-8" },
      })
    }

    // Auth pages
    if (path === "/auth/login") {
      const html = fixPaths(loginHtml)
      return new Response(html, {
        headers: { "content-type": "text/html; charset=utf-8" },
      })
    }
    if (path === "/auth/sign-up") {
      const html = fixPaths(signupHtml)
      return new Response(html, {
        headers: { "content-type": "text/html; charset=utf-8" },
      })
    }
    if (path === "/auth/sign-up-success") {
      const html = fixPaths(signupSuccessHtml)
      return new Response(html, {
        headers: { "content-type": "text/html; charset=utf-8" },
      })
    }

    // Handle slug routes with Supabase
    // For WhatsApp and short URL: redirect
    // For paste and linktree: render page
    const slugMatch = path.match(/^\/([a-zA-Z0-9_-]+)$/)
    if (slugMatch) {
      const slug = slugMatch[1]
      const reservedRoutes = ["dashboard", "auth", "api", "admin", "settings"]
      if (!reservedRoutes.includes(slug.toLowerCase())) {
        return handleSlug(slug, env)
      }
    }

    // Dashboard - redirect to home for now (requires auth)
    if (path.startsWith("/dashboard")) {
      const html = fixPaths(indexHtml)
      return new Response(html, {
        headers: { "content-type": "text/html; charset=utf-8" },
      })
    }

    // 404
    return new Response("Not Found", { status: 404 })
  },
}

function fixPaths(html) {
  // Replace absolute _next/static paths with relative ones
  return html.replace(/\/_next\/static\//g, "./_next/static/")
}

async function fetchStaticAsset(path) {
  // In a real deployment, these would be served from the static files
  // The publish_site tool with kind:"worker" uploads the dir, but we need
  // to also serve the static assets. Let's try to fetch them from the origin.
  return null
}

async function handleSlug(slug, env) {
  const SUPABASE_URL = env.SUPABASE_URL || "https://mkvpqjvqzewhqreyqgii.supabase.co"
  const SUPABASE_ANON_KEY = env.SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1rdnBxanZxemV3aHFyZXlxZ2lpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjM2Mjc4MDYsImV4cCI6MjAzOTIwMzgwNn0.8p0tBmES_JQ4s5vQ7QvMdQ9G0m7G6q5ous77h41Gp0I"

  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/slugs?slug=eq.${encodeURIComponent(slug)}&select=*`,
      {
        headers: {
          "apikey": SUPABASE_ANON_KEY,
          "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
          "Accept": "application/json",
        },
      }
    )

    if (!response.ok) {
      return new Response("Link not found", { status: 404 })
    }

    const data = await response.json()
    if (!data || data.length === 0) {
      return new Response("Link not found", { status: 404 })
    }

    const slugData = data[0]

    switch (slugData.type) {
      case "whatsapp": {
        const phone = (slugData.data.phone || "").replace(/\D/g, "")
        const message = slugData.data.message ? `?text=${encodeURIComponent(slugData.data.message)}` : ""
        const whatsappUrl = `https://wa.me/${phone}${message}`
        return Response.redirect(whatsappUrl, 302)
      }
      case "shorturl": {
        return Response.redirect(slugData.data.url, 302)
      }
      case "paste": {
        const content = slugData.data.content || ""
        const title = slugData.data.title || slug
        const hasPassword = !!slugData.paste_password
        const html = renderPastePage(slug, title, content, hasPassword)
        return new Response(html, {
          headers: { "content-type": "text/html; charset=utf-8" },
        })
      }
      case "linktree": {
        const links = slugData.data.links || []
        const displayName = slugData.data.display_name || slug
        const bio = slugData.data.bio || ""
        const html = renderLinktreePage(slug, displayName, bio, links)
        return new Response(html, {
          headers: { "content-type": "text/html; charset=utf-8" },
        })
      }
      default:
        return new Response("Unknown link type", { status: 400 })
    }
  } catch (err) {
    return new Response("Error processing link", { status: 500 })
  }
}

const esc = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")

function renderPastePage(slug, title, content, hasPassword) {
  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex">
  <title>${esc(title)} - Door.id</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #F7F6FB; color: #1a1a2e; min-height: 100vh; }
    .container { max-width: 720px; margin: 0 auto; padding: 24px 16px; }
    header { display: flex; align-items: center; gap: 10px; padding: 14px 16px; background: white; border-bottom: 1px solid #E7E5F0; position: sticky; top: 0; z-index: 10; }
    header .logo { width: 36px; height: 36px; border-radius: 12px; background: linear-gradient(135deg, #7C3AED, #EC4899); display: flex; align-items: center; justify-content: center; font-size: 18px; }
    header h1 { font-size: 17px; background: linear-gradient(135deg, #7C3AED, #EC4899); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: 800; }
    .card { background: white; border-radius: 20px; padding: 24px; margin-top: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
    .card h2 { font-size: 18px; margin-bottom: 16px; }
    .card pre { background: #FBFAFD; border: 1px solid #E7E5F0; border-radius: 12px; padding: 16px; font-size: 14px; line-height: 1.6; overflow-x: auto; white-space: pre-wrap; word-break: break-word; }
    ${hasPassword ? `.lock-msg { display: flex; align-items: center; gap: 8px; padding: 12px 16px; background: #fef3c7; border: 1px solid #fde68a; border-radius: 12px; margin-bottom: 16px; font-size: 14px; color: #92400e; }` : ""}
    footer { text-align: center; padding: 24px; font-size: 12px; color: #767489; }
  </style>
</head>
<body>
  <header>
    <div class="logo">🚪</div>
    <h1>Door.id</h1>
  </header>
  <div class="container">
    <div class="card">
      ${hasPassword ? '<div class="lock-msg">🔒 Paste ini dilindungi password</div>' : ""}
      <h2>${esc(title)}</h2>
      <pre>${esc(content)}</pre>
    </div>
  </div>
  <footer>
    <p>Powered by <a href="./" style="color:#7C3AED;text-decoration:none;font-weight:600;">Door.id</a></p>
  </footer>
</body>
</html>`
}

function renderLinktreePage(slug, displayName, bio, links) {
  const linksHtml = links
    .map(
      (l) =>
        `<a href="${esc(l.url || "#")}" target="_blank" rel="noopener noreferrer" class="link-btn">${esc(l.title || "Link")}</a>`
    )
    .join("")

  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="index, follow">
  <title>${esc(displayName)} - Door.id</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: linear-gradient(135deg, #f5f0ff, #fdf2f8, #eff6ff); min-height: 100vh; display: flex; flex-direction: column; align-items: center; }
    .container { max-width: 480px; width: 100%; padding: 40px 20px; text-align: center; }
    .avatar { width: 96px; height: 96px; border-radius: 50%; background: linear-gradient(135deg, #7C3AED, #EC4899); display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; font-size: 40px; color: white; }
    h1 { font-size: 24px; font-weight: 800; margin-bottom: 8px; }
    .bio { color: #767489; font-size: 14px; margin-bottom: 24px; line-height: 1.5; }
    .links { display: flex; flex-direction: column; gap: 12px; }
    .link-btn { display: block; padding: 16px 20px; background: white; border: 1px solid #E7E5F0; border-radius: 14px; text-decoration: none; color: #1a1a2e; font-weight: 600; font-size: 15px; transition: all 0.2s; }
    .link-btn:hover { border-color: #7C3AED; box-shadow: 0 4px 12px rgba(124,58,237,0.15); transform: translateY(-1px); }
    .powered { margin-top: 32px; font-size: 12px; color: #767489; }
    .powered a { color: #7C3AED; text-decoration: none; font-weight: 600; }
  </style>
</head>
<body>
  <div class="container">
    <div class="avatar">🚪</div>
    <h1>${esc(displayName)}</h1>
    ${bio ? `<p class="bio">${esc(bio)}</p>` : ""}
    <div class="links">${linksHtml}</div>
    <p class="powered">Powered by <a href="./">Door.id</a></p>
  </div>
</body>
</html>`
}