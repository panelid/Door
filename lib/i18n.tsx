"use client"

import { createContext, useContext, useState, ReactNode } from "react"

type Lang = "id" | "en"

const translations = {
  id: {
    badge: "Platform Link Management #1 di Indonesia",
    heroTitle1: "Satu Link.",
    heroTitle2: "Kemungkinan Tanpa Batas.",
    heroDesc: "Buat link WhatsApp custom, bangun link-in-bio elegan, perpendek URL, dan bagikan teks instan dalam hitungan detik.",
    ctaPrimary: "Mulai Gratis Sekarang",
    ctaSecondary: "Lihat Dashboard",
    featTitle: "Semua yang Anda Butuhkan",
    featDesc: "Dirancang cepat, ringan, dan fokus pada konversi.",
    feat1Title: "WhatsApp Custom",
    feat1Desc: "Buat link chat WA lengkap dengan pesan otomatis yang siap dikirim.",
    feat2Title: "Link-in-Bio",
    feat2Desc: "Kumpulkan semua tautan penting sosial media Anda dalam satu halaman cantik.",
    feat3Title: "URL Shortener",
    feat3Desc: "Perpendek URL panjang menjadi rapi dan mudah dibagikan ke mana saja.",
    feat4Title: "Paste & Secure Text",
    feat4Desc: "Bagikan teks atau catatan penting dengan opsi perlindungan sandi.",
    ctaTitle: "Siap Mengoptimalkan Tautan Anda?",
    ctaDesc: "Bergabunglah sekarang dan kelola semua link Anda dalam satu kendali yang mudah.",
    ctaButton: "Buat Akun Gratis",
    navBuatLink: "Buat Link",
    navDashboard: "Dashboard",
    navMasuk: "Masuk",
    navDaftar: "Daftar",
  },
  en: {
    badge: "#1 Link Management Platform in Indonesia",
    heroTitle1: "One Link.",
    heroTitle2: "Endless Possibilities.",
    heroDesc: "Create custom WhatsApp links, build elegant link-in-bio pages, shorten URLs, and share instant text in seconds.",
    ctaPrimary: "Get Started Free",
    ctaSecondary: "View Dashboard",
    featTitle: "Everything You Need",
    featDesc: "Built fast, lightweight, and conversion-focused.",
    feat1Title: "Custom WhatsApp",
    feat1Desc: "Create WhatsApp chat links with auto-filled messages ready to send.",
    feat2Title: "Link-in-Bio",
    feat2Desc: "Collect all your important social media links in one beautiful page.",
    feat3Title: "URL Shortener",
    feat3Desc: "Shorten long URLs into clean, shareable links anywhere.",
    feat4Title: "Paste & Secure Text",
    feat4Desc: "Share text or important notes with optional password protection.",
    ctaTitle: "Ready to Optimize Your Links?",
    ctaDesc: "Join now and manage all your links in one easy dashboard.",
    ctaButton: "Create Free Account",
    navBuatLink: "Create Link",
    navDashboard: "Dashboard",
    navMasuk: "Login",
    navDaftar: "Sign Up",
  },
} as const

interface I18nContextType {
  lang: Lang
  t: (typeof translations)["id"]
  toggle: () => void
}

const I18nContext = createContext<I18nContextType | null>(null)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("id")
  const t = translations[lang]
  const toggle = () => setLang((prev) => (prev === "id" ? "en" : "id"))
  return (
    <I18nContext.Provider value={{ lang, t, toggle }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error("useI18n must be used within I18nProvider")
  return ctx
}
