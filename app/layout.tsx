import "./globals.css"
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google"
import type { Metadata } from "next"
import type { ReactNode } from "react"

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: "Door.id - Satu Link, Kemungkinan Tak Terbatas",
    template: "%s | Door.id",
  },
  description:
    "Buat link WhatsApp custom, bagikan teks, bangun link-in-bio Anda, atau perpendek URL apapun. Platform link management all-in-one untuk Indonesia.",
  keywords: [
    "short link",
    "url shortener",
    "linktree indonesia",
    "link in bio",
    "whatsapp link generator",
    "paste text",
    "indonesia",
    "door.id",
  ],
  authors: [{ name: "Door.id" }],
  creator: "Door.id",
  publisher: "Door.id",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://door.id"),
  openGraph: {
    title: "Door.id - Satu Link, Kemungkinan Tak Terbatas",
    description:
      "Buat link WhatsApp custom, bagikan teks, bangun link-in-bio Anda, atau perpendek URL apapun.",
    url: "https://door.id",
    siteName: "Door.id",
    locale: "id_ID",
    type: "website",
    images: [
      {
        url: "https://door.id/og-image.png",
        width: 1200,
        height: 630,
        alt: "Door.id - Link Management Indonesia",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Door.id - Satu Link, Kemungkinan Tak Terbatas",
    description:
      "Buat link WhatsApp custom, bagikan teks, bangun link-in-bio Anda, atau perpendek URL apapun.",
    creator: "@doorid",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id" className={`${plusJakartaSans.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased min-h-screen bg-[#F7F6FB] dark:bg-[#0a0a1a]">
        {children}
      
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Door.id",
          "url": "https://door.id",
          "description": "Platform link management all-in-one untuk Indonesia. Buat link WhatsApp, link-in-bio, dan short link.",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://door.id/?q={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        })
      }}
    />

      </body>
    </html>
  )
}