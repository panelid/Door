import Link from "next/link"
import { DoorOpen, Github, Twitter } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container-wide py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-bg text-white">
                <DoorOpen className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold gradient-text">Door.id</span>
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
            <h4 className="font-semibold mb-4">Produk</h4>
            <ul className="space-y-3">
              <FooterLink href="/">Buat Link</FooterLink>
              <FooterLink href="/dashboard">Dashboard</FooterLink>
              <FooterLink href="/analytics">Analytics</FooterLink>
              <FooterLink href="/api">API</FooterLink>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Dukungan</h4>
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
    </footer>
  )
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        href={href}
        className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
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
      className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-all duration-200"
    >
      <Icon className="h-5 w-5" />
    </a>
  )
}
