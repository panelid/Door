"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ExternalLink, Link2 } from "lucide-react"

export default function LinktreePage({
  slug,
  links,
}: {
  slug: string
  links: Array<{ title: string; url: string }>
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/30">
      <header className="border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground shadow-lg group-hover:shadow-xl transition-all">
              <Link2 className="h-6 w-6" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Door.id
            </span>
          </Link>
          <Button variant="ghost" asChild>
            <Link href="/">Home</Link>
          </Button>
        </div>
      </header>

      <main className="container py-16">
        <div className="mx-auto max-w-lg space-y-8">
          <div className="text-center space-y-4">
            <div className="mx-auto h-24 w-24 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-xl">
              <span className="text-4xl font-bold text-primary-foreground">{slug.charAt(0).toUpperCase()}</span>
            </div>
            <h1 className="text-4xl font-bold">@{slug}</h1>
            <p className="text-lg text-muted-foreground">Lihat semua link saya</p>
          </div>

          <div className="space-y-4">
            {links.map((link, index) => (
              <Button
                key={index}
                asChild
                variant="outline"
                className="w-full h-auto py-5 px-6 justify-between bg-card/80 backdrop-blur border-border/50 hover:border-primary/50 hover:bg-card hover:shadow-lg transition-all text-base font-medium"
                size="lg"
              >
                <a href={link.url} target="_blank" rel="noopener noreferrer">
                  <span>{link.title}</span>
                  <ExternalLink className="h-5 w-5" />
                </a>
              </Button>
            ))}
          </div>

          <div className="text-center pt-8">
            <p className="text-sm text-muted-foreground">
              Dibuat dengan{" "}
              <Link href="/" className="font-medium underline underline-offset-4 hover:text-primary transition-colors">
                Door.id
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
