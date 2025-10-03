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
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Link2 className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold">Door.id</span>
          </div>
          <Button variant="ghost" asChild>
            <Link href="/">Home</Link>
          </Button>
        </div>
      </header>

      <main className="container py-12">
        <div className="mx-auto max-w-md space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">@{slug}</h1>
            <p className="text-muted-foreground">Check out my links</p>
          </div>

          <div className="space-y-3">
            {links.map((link, index) => (
              <Button
                key={index}
                asChild
                variant="outline"
                className="w-full h-auto py-4 justify-between bg-transparent"
                size="lg"
              >
                <a href={link.url} target="_blank" rel="noopener noreferrer">
                  <span className="text-base">{link.title}</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            ))}
          </div>

          <div className="text-center pt-4">
            <p className="text-sm text-muted-foreground">
              Powered by{" "}
              <Link href="/" className="underline">
                Door.id
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
