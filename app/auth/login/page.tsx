"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { DoorOpen, Sparkles } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      router.push("/dashboard")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative min-h-svh w-full flex items-center justify-center p-6 md:p-10 overflow-hidden bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 dark:from-[#0a0a1a] dark:via-[#1a0a1a] dark:to-[#0a0a2a]">
      {/* Floating decorative blobs */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-purple-300/30 dark:bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-pink-300/30 dark:bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/3 w-60 h-60 bg-blue-300/20 dark:bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Dots pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, #7C3AED 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="w-full max-w-sm relative">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 text-white transition-transform group-hover:scale-110">
              <DoorOpen className="h-5 w-5" />
            </div>
            <span className="text-2xl font-bold gradient-text-animated">Door.id</span>
          </Link>
        </div>

        {/* Glassmorphism card */}
        <div className="glass-card rounded-2xl p-8 shadow-xl">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground">Selamat Datang</h1>
            <p className="text-sm text-muted-foreground mt-1">Masuk ke dashboard Door.id Anda</p>
          </div>

          <form onSubmit={handleLogin}>
            <div className="flex flex-col gap-5">
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/50 dark:bg-white/5 border-white/30 dark:border-white/10"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white/50 dark:bg-white/5 border-white/30 dark:border-white/10"
                />
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                variant="gradient"
                size="xl"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Memproses...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    Masuk
                  </span>
                )}
              </Button>
            </div>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Belum punya akun?</span>{" "}
              <Link href="/auth/sign-up" className="font-semibold text-primary hover:text-primary/80 transition-colors underline-offset-4 hover:underline">
                Daftar Sekarang
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}