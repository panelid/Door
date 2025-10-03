"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Link2, Copy, Check } from "lucide-react"
import { useState } from "react"

export default function PastePage({ slug, content }: { slug: string; content: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

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
        <div className="mx-auto max-w-4xl">
          <Card className="shadow-2xl border-border/50 backdrop-blur">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl font-bold">door.id/{slug}</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                  className="gap-2 shadow-sm hover:shadow-md transition-all bg-transparent"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4" />
                      Tersalin!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Salin
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <pre className="whitespace-pre-wrap break-words font-mono text-sm bg-muted/50 p-6 rounded-xl border border-border/50 leading-relaxed">
                {content}
              </pre>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
