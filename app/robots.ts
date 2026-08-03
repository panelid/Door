import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/auth/", "/api/", "/dashboard/"],
      },
    ],
    sitemap: "https://door.id/sitemap.xml",
  }
}
