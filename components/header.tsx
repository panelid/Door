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

  return (
    <>
      <header className="sticky top-0 z-10 bg-[#0A0A0F]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3.5">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-pink-500 flex items-center justify-center text-white text-lg">🚪</div>
            <span className="text-[19px] font-extrabold bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">Door.id</span>
          </Link>

          <div className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-sm text-gray-400 hover:text-white font-medium px-3 py-1.5 transition-colors">{link.label}</Link>
            ))}
            <button onClick={toggle} className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all">
              <Globe className="w-3.5 h-3.5" />
              {lang === "id" ? "EN" : "ID"}
            </button>
            <Button asChild size="sm" className="ml-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl">
              <Link href="/auth/sign-up"><Sparkles className="h-3.5 w-3.5 mr-1" />{t.navDaftar}</Link>
            </Button>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <button onClick={toggle} className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"><Globe className="w-4 h-4" /></button>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
            <div className="absolute right-0 top-0 bottom-0 w-72 bg-[#12121A] border-l border-white/5 shadow-2xl">
              <div className="p-6 pt-20">
                <nav className="space-y-2">
                  {navLinks.map((link) => (
                    <Link key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 rounded-xl text-base font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all">{link.label}</Link>
                  ))}
                </nav>
                <div className="mt-6">
                  <Button asChild className="w-full bg-violet-600 hover:bg-violet-500 text-white rounded-xl">
                    <Link href="/auth/sign-up" onClick={() => setMobileMenuOpen(false)}><Sparkles className="h-4 w-4 mr-2" />{t.navDaftar}</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  )
}
