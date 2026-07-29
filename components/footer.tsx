import Link from "next/link"
import { DoorOpen, Github, Twitter } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative overflow-hidden">
      {/* Gradient accent line at top */}
      <div className="h-1 w-full bg-gradient-to-r from-purple-500 via-blue-500 via-cyan-500 via-emerald-500 via-amber-500 to-pink-500" />

      <div className="bg-gradient-to-b from-background to-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
            {/* Brand */}
            <div className="md:col-span-2 space-y-4">
              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 text-white transition-transform group-hover:scale-110 group-hover:rotate-3">
                  <DoorOpen className="h-5 w-5" />
                </div>
                <span className="text-xl font-bold gradient-text-animated">Door.id</span>
              </Link>
              <p className="text-muted-foreground text-sm max-w-sm leading-relaxed">
                Platform link management all-in-one untuk Indonesia.
                Buat, share, dan track link Anda dengan mudah.
              </p>
              <div className="flex items-center gap-3">
                <SocialLink href="https://github.com/panelid" icon={Github} />
                <SocialLink href="https://twitter.com/doorid" icon={Twitter} />
              </div>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">Produk</h4>
              <ul className="space-y-3">
                <FooterLink href="/">Buat Link</FooterLink>
                <FooterLink href="/dashboard">Dashboard</FooterLink>
                <FooterLink href="/analytics">Analytics</FooterLink>
                <FooterLink href="/api">API</FooterLink>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4 bg-gradient-to-r from-pink-500 to-amber-500 bg-clip-text text-transparent">Dukungan</h4>
              <ul className="space-y-3">
                <FooterLink href="/help">Pusat Bantuan</FooterLink>
                <FooterLink href="/privacy">Kebijakan Privasi</FooterLink>
                <FooterLink href="/terms">Syarat Penggunaan</FooterLink>
                <FooterLink href="/contact">Kontak</FooterLink>
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © {currentYear} Door.id. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground">
              Dibuat dengan ❤️ di Indonesia
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        href={href}
        className="text-sm text-muted-foreground hover:text-foreground transition-all duration-200 hover:translate-x-1 inline-block"
      >
        {children}
      </Link>
    </li>
  )
}

function SocialLink({ href, icon: Icon }: { href: string; icon: React.ElementType }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-10 h-10 rounded-lg bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:from-purple-100 hover:to-blue-100 dark:hover:from-purple-900/30 dark:hover:to-blue-900/30 transition-all duration-200 hover:scale-110"
    >
      <Icon className="h-5 w-5" />
    </a>
  )
}