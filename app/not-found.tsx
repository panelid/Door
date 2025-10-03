import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Link2 } from "lucide-react"

export default function NotFound() {
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
        </div>
      </header>

      <main className="container py-12">
        <div className="mx-auto max-w-md">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">404 - Link Not Found</CardTitle>
              <CardDescription>This link doesn&apos;t exist or has been removed</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                The link you&apos;re looking for doesn&apos;t exist. It may have been deleted or the URL might be
                incorrect.
              </p>
              <Button asChild className="w-full">
                <Link href="/">Go to Home</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
