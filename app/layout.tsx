import "./globals.css"
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google"
import type { Metadata } from "next"
import type { ReactNode } from "react"
import { I18nProvider } from "@/lib/i18n"

const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-plus-jakarta", display: "swap" })
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains-mono", display: "swap" })

export const metadata: Metadata = {
  title: { default: "Door.id - Satu Link, Kemungkinan Tak Terbatas", template: "%s | Door.id" },
  description: "Buat link WhatsApp custom, bagikan teks, bangun link-in-bio Anda, atau perpendek URL apapun.",
  keywords: ["short link", "url shortener", "linktree indonesia", "link in bio", "whatsapp link generator", "door.id"],
  authors: [{ name: "Door.id" }],
  metadataBase: new URL("https://door.id"),
  openGraph: {
    title: "Door.id - Satu Link, Kemungkinan Tak Terbatas",
    description: "Buat link WhatsApp custom, bagikan teks, bangun link-in-bio Anda, atau perpendek URL apapun.",
    url: "https://door.id", siteName: "Door.id", locale: "id_ID", type: "website",
    images: [{ url: "https://door.id/og-image.svg", width: 1200, height: 630, alt: "Door.id" }],
  },
  twitter: { card: "summary_large_image", title: "Door.id", description: "Platform link management all-in-one.", creator: "@doorid" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id" className={`${plusJakartaSans.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased min-h-screen bg-[#0A0A0F] text-white selection:bg-violet-500 selection:text-white">
        <I18nProvider>{children}</I18nProvider>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({"@context":"https://schema.org","@type":"WebSite","name":"Door.id","url":"https://door.id","potentialAction":{"@type":"SearchAction","target":"https://door.id/?q={search_term_string}","query-input":"required name=search_term_string"}}) }} />
      </body>
    </html>
  )
}
