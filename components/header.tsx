"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, Sparkles } from "lucide-react"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { href: "/", label: "Buat Link" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/auth/login", label: "Masuk" },
  ]

  return (
    <>
      <header className="sticky top-0 z-10 bg-white flex items-center justify-between px-4 py-3.5 border-b border-[#E7E5F0]">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-pink-500 flex items-center justify-center text-white text-lg flex-shrink-0">
            🚪
          </div>
          <span className="text-[19px] font-extrabold bg-gradient-to-r from-violet-600 to-pink-500 bg-clip-text text-transparent">
            Door.id
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-[#767489] hover:text-violet-600 font-medium px-3 py-1.5 transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Button
            variant="gradient"
            size="sm"
            asChild
            className="ml-2"
          >
            <Link href="/auth/sign-up">
              <Sparkles className="h-3.5 w-3.5 mr-1" />
              Daftar
            </Link>
          </Button>
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="w-9 h-9 rounded-lg bg-violet-50 flex items-center justify-center text-violet-600 md:hidden"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-72 max-w-full bg-white shadow-xl">
            <div className="p-6 pt-20">
              <nav className="space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-3 rounded-xl text-base font-medium text-[#767489] hover:text-violet-600 hover:bg-violet-50 transition-all"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <div className="mt-8 pt-6 border-t border-[#E7E5F0]">
                <Button
                  variant="gradient"
                  className="w-full"
                  asChild
                >
                  <Link href="/auth/sign-up" onClick={() => setMobileMenuOpen(false)}>
                    <Sparkles className="h-4 w-4 mr-1.5" />
                    Daftar Gratis
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}