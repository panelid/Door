"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { DoorOpen, Menu, X } from "lucide-react"
import { useState } from "react"

export function Header() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  const isActive = (path: string) => pathname === path

  return (
    <header className="header-glass">
      <div className="container-wide">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-bg text-white shadow-medium group-hover:shadow-large transition-all duration-200 group-hover:scale-105">
              <DoorOpen className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold gradient-text">
              Door.id
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            <NavLink href="/" active={isActive("/")}>
              Buat Link
            </NavLink>
            <NavLink href="/dashboard" active={isActive("/dashboard")}>
              Dashboard
            </NavLink>
            <NavLink href="/analytics" active={isActive("/analytics")}>
              Analytics
            </NavLink>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="hidden sm:flex text-muted-foreground hover:text-foreground"
            >
              <Link href="/auth/login">Masuk</Link>
            </Button>
            <Button
              size="sm"
              asChild
              className="btn-primary shadow-medium hover:shadow-large"
            >
              <Link href="/auth/register">Daftar</Link>
            </Button>
            
            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-slide-up">
            <nav className="flex flex-col gap-1">
              <MobileNavLink href="/" active={isActive("/")}>
                Buat Link
              </MobileNavLink>
              <MobileNavLink href="/dashboard" active={isActive("/dashboard")}>
                Dashboard
              </MobileNavLink>
              <MobileNavLink href="/analytics" active={isActive("/analytics")}>
                Analytics
              </MobileNavLink>
              <div className="pt-2 mt-2 border-t border-border">
                <MobileNavLink href="/auth/login" active={false}>
                  Masuk
                </MobileNavLink>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
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
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
        active
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:text-foreground hover:bg-muted"
      }`}
    >
      {children}
    </Link>
  )
}

function MobileNavLink({
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
      className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
        active
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:text-foreground hover:bg-muted"
      }`}
    >
      {children}
    </Link>
  )
}
