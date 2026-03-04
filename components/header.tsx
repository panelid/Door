"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { DoorOpen, Menu, X, Sparkles } from "lucide-react"

export function Header() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const isActive = (path: string) => pathname === path

  const navLinks = [
    { href: "/", label: "Buat Link" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/analytics", label: "Analytics" },
  ]

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "glass shadow-lg border-b border-white/20"
            : "bg-transparent"
        }`}
      >
        <div className="container-modern">
          <div className="flex h-16 md:h-20 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative flex h-10 w-10 md:h-11 md:w-11 items-center justify-center rounded-xl overflow-hidden transition-transform duration-300 group-hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500" />
                <div className="absolute inset-0 bg-gradient-to-br from-violet-400/0 via-white/20 to-fuchsia-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <DoorOpen className="relative h-5 w-5 md:h-6 md:w-6 text-white" />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl md:text-2xl font-bold gradient-text-animated">
                  Door.id
                </span>
                <Sparkles className="h-4 w-4 text-violet-500 animate-pulse" />
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.href}
                  href={link.href}
                  active={isActive(link.href)}
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="hidden sm:flex text-muted-foreground hover:text-foreground hover:bg-white/10"
              >
                <Link href="/auth/login">Masuk</Link>
              </Button>
              <Button
                size="sm"
                asChild
                className="btn-modern-primary hidden sm:flex"
              >
                <Link href="/auth/register">Daftar</Link>
              </Button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-80 max-w-full glass-dark transform transition-transform duration-300">
            <div className="p-6 pt-20">
              <nav className="space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-4 py-3 rounded-xl text-lg font-medium transition-all ${
                      isActive(link.href)
                        ? "bg-violet-500/20 text-violet-300 border border-violet-500/30"
                        : "text-white/70 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              <div className="mt-8 pt-8 border-t border-white/10 space-y-3">
                <Button
                  variant="outline"
                  className="w-full h-12 border-white/20 text-white hover:bg-white/10"
                  asChild
                >
                  <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                    Masuk
                  </Link>
                </Button>
                <Button
                  className="w-full h-12 btn-modern-primary"
                  asChild
                >
                  <Link href="/auth/register" onClick={() => setMobileMenuOpen(false)}>
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

function NavLink({
  href,
  active,
  children,
}: {
  href: string
  active: boolean
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
        active
          ? "text-foreground"
          : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {active && (
        <span
          className="absolute inset-0 bg-white/80 rounded-xl -z-10"
          style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
        />
      )}
      {children}
    </Link>
  )
}
