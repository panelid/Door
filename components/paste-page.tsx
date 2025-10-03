"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Link2 } from "lucide-react"
import { useState } from "react"

export default function PastePage({ slug, content }: { slug: string; content: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

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
        <div className="mx-auto max-w-4xl">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>door.id/{slug}</CardTitle>
                <Button variant="outline" size="sm" onClick={handleCopy}>
                  {copied ? "Copied!" : "Copy"}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <pre className="whitespace-pre-wrap break-words font-mono text-sm bg-muted p-4 rounded-lg">{content}</pre>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
