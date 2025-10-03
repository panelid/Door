import "./globals.css"
import type { Metadata } from "next"
import type { ReactNode } from "react"

export const metadata: Metadata = {
  title: {
    default: "Door.id - One Link, Infinite Possibilities",
    template: "%s | Door.id",
  },
  description:
    "Create custom short links for WhatsApp, share text snippets, build your link-in-bio, or shorten any URL. The all-in-one link management platform for Indonesia.",
  keywords: [
    "short link",
    "url shortener",
    "linktree",
    "link in bio",
    "whatsapp link",
    "paste bin",
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
    title: "Door.id - One Link, Infinite Possibilities",
    description:
      "Create custom short links for WhatsApp, share text snippets, build your link-in-bio, or shorten any URL.",
    url: "https://door.id",
    siteName: "Door.id",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Door.id - One Link, Infinite Possibilities",
    description:
      "Create custom short links for WhatsApp, share text snippets, build your link-in-bio, or shorten any URL.",
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
    generator: 'v0.app'
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id">
      <head />
      <body>{children}</body>
    </html>
  )
}
