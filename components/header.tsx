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

  const hardBorder = "border-[2.5px] border-black"
  const hardShadow = "shadow-[3px_3px_0_0_#111]"

  return (
    <>
      <header className="sticky top-0 z-50 bg-[#F5F2EC] backdrop-blur-md border-b-[3px] border-black">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className={`w-9 h-9 rounded-xl bg-violet-600 ${hardBorder} flex items-center justify-center text-white text-base font-black ${hardShadow}`}>
              🚪
            </div>
            <span className="text-[20px] font-black tracking-tight text-black">
              Door.id
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-bold text-neutral-800 hover:text-violet-600 px-3 py-1.5 transition-colors"
              >
                {link.label}
              </Link>
            ))}

            {/* Language Toggle Desktop */}
            <button
              onClick={toggle}
              className={`flex items-center gap-1.5 text-xs font-black px-3.5 py-2 rounded-xl bg-yellow-300 ${hardBorder} ${hardShadow} hover:bg-yellow-400 text-black active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all`}
            >
              <Globe className="w-4 h-4 text-black" />
              <span>{lang === "id" ? "EN" : "ID"}</span>
            </button>

            {/* Daftar Button */}
            <Button asChild size="sm" className={`ml-1 bg-black text-white hover:bg-neutral-800 font-bold rounded-xl ${hardBorder} ${hardShadow} active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all`}>
              <Link href="/auth/sign-up">
                <Sparkles className="h-3.5 w-3.5 mr-1 text-pink-400" />
                {t.navDaftar}
              </Link>
            </Button>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex items-center gap-2.5 md:hidden">
            {/* Language Toggle Mobile (Jelas & Kontras) */}
            <button
              onClick={toggle}
              className={`flex items-center gap-1 text-xs font-black px-2.5 py-2 rounded-xl bg-yellow-300 ${hardBorder} ${hardShadow} text-black active:translate-x-[1px] active:translate-y-[1px] active:shadow-none`}
            >
              <Globe className="w-3.5 h-3.5 text-black" />
              <span>{lang === "id" ? "EN" : "ID"}</span>
            </button>

            {/* Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`w-10 h-10 rounded-xl bg-white ${hardBorder} ${hardShadow} flex items-center justify-center text-black active:translate-x-[1px] active:translate-y-[1px] active:shadow-none`}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
            <div className="absolute right-0 top-0 bottom-0 w-72 bg-[#F5F2EC] border-l-[3px] border-black p-6 shadow-2xl flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-6">
                  <span className="font-black text-lg">Menu</span>
                  <button onClick={() => setMobileMenuOpen(false)} className={`w-9 h-9 rounded-xl bg-white ${hardBorder} ${hardShadow} flex items-center justify-center`}>
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <nav className="space-y-3">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-4 py-3 rounded-xl font-bold text-neutral-900 bg-white border-2 border-black shadow-[3px_3px_0_0_#111]"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </div>

              <div className="mt-6">
                <Button asChild className={`w-full bg-black text-white hover:bg-neutral-800 font-bold rounded-xl ${hardBorder} ${hardShadow} py-3.5`}>
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
