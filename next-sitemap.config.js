/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://door.id",
  generateRobotsTxt: true,
  sitemapSize: 5000,
  exclude: ["/auth/*", "/api/*", "/dashboard/*"],
  robotsTxtOptions: {
    policies: [
      { userAgent: "*", allow: "/" },
      { userAgent: "Googlebot", allow: "/" },
    ],
  },
}
