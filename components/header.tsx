"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, Sparkles, Globe } from "lucide-react"
import { useI18n } from "@/lib/i18n"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { t, lang, toggle } = useI18n()

  const navLinks = [
    { href: "/", label: t.navBuatLink },
    { href: "/dashboard", label: t.navDashboard },
    { href: "/auth/login", label: t.navMasuk },
  ]

  const hardBorder = "border-2 border-black"

  return (
    <>
      <header className="sticky top-0 z-50 bg-[#F5F2EC]/90 backdrop-blur-md border-b-2 border-black">
        <div className="max-w-4xl mx-auto flex items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-lg bg-violet-600 ${hardBorder} flex items-center justify-center text-white text-sm font-bold shadow-[2px_2px_0_0_#111]`}>
              🚪
            </div>
            <span className="text-[18px] font-black tracking-tight">
              Door.id
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-bold text-neutral-700 hover:text-violet-600 px-3 py-1.5 transition-colors"
              >
                {link.label}
              </Link>
            ))}

            {/* Language Toggle - High Contrast Neobrutalism */}
            <button
              onClick={toggle}
              className={`flex items-center gap-1.5 text-xs font-black px-3 py-1.5 rounded-lg bg-yellow-300 ${hardBorder} shadow-[2px_2px_0_0_#111] hover:bg-yellow-400 text-black transition-all`}
            >
              <Globe className="w-4 h-4 text-black" />
              <span>{lang === "id" ? "ENGLISH (EN)" : "INDONESIA (ID)"}</span>
            </button>

            <Button asChild size="sm" className={`ml-1 bg-black text-white hover:bg-neutral-800 font-bold rounded-xl ${hardBorder} shadow-[2px_2px_0_0_#111]`}>
              <Link href="/auth/sign-up">
                <Sparkles className="h-3.5 w-3.5 mr-1 text-pink-400" />
                {t.navDaftar}
              </Link>
            </Button>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={toggle}
              className={`w-9 h-9 rounded-lg bg-white ${hardBorder} flex items-center justify-center font-bold text-xs shadow-[2px_2px_0_0_#111]`}
            >
              <Globe className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`w-9 h-9 rounded-lg bg-white ${hardBorder} flex items-center justify-center shadow-[2px_2px_0_0_#111]`}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
            <div className="absolute right-0 top-0 bottom-0 w-72 bg-[#F5F2EC] border-l-2 border-black p-6 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <span className="font-black text-lg">Menu</span>
                <button onClick={() => setMobileMenuOpen(false)} className={`w-8 h-8 rounded-lg bg-white ${hardBorder} flex items-center justify-center`}>
                  <X className="w-4 h-4" />
                </button>
              </div>
              <nav className="space-y-3">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-3 rounded-xl font-bold bg-white border-2 border-black shadow-[2px_2px_0_0_#111]"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <div className="mt-6">
                <Button asChild className="w-full bg-black text-white hover:bg-neutral-800 font-bold rounded-xl border-2 border-black shadow-[2px_2px_0_0_#111] py-3">
                  <Link href="/auth/sign-up" onClick={() => setMobileMenuOpen(false)}>
                    <Sparkles className="h-4 w-4 mr-2 text-pink-400" />
                    {t.navDaftar}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  )
}
