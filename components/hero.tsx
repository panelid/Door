"use client"

import Link from "next/link"
import { Zap, Shield, Sparkles, ArrowRight, Link as LinkIcon, MessageSquare, FileText, Palette } from "lucide-react"
import { Button } from "@/components/ui/button"

const cardColors = [
  { gradient: "from-violet-500 to-purple-600", shadow: "shadow-violet-500/30", card: "card-purple" },
  { gradient: "from-amber-500 to-orange-500", shadow: "shadow-orange-500/30", card: "card-coral" },
  { gradient: "from-pink-500 to-rose-500", shadow: "shadow-rose-500/30", card: "card-pink" },
  { gradient: "from-blue-500 to-cyan-500", shadow: "shadow-blue-500/30", card: "card-blue" },
  { gradient: "from-emerald-500 to-teal-500", shadow: "shadow-emerald-500/30", card: "card-emerald" },
  { gradient: "from-amber-400 to-yellow-500", shadow: "shadow-amber-500/30", card: "card-amber" },
]

const features = [
  {
    icon: MessageSquare,
    title: "WhatsApp Link",
    desc: "Buat link WhatsApp custom dengan pesan otomatis. Pelanggan tinggal klik dan langsung chat.",
  },
  {
    icon: Shield,
    title: "Paste dengan Proteksi",
    desc: "Bagikan teks panjang dengan proteksi password dan riwayat perubahan yang tersimpan otomatis.",
  },
  {
    icon: Palette,
    title: "Link-in-Bio",
    desc: "Satu link elegan untuk semua sosial media, dengan analytics real-time dan tampilan customizable.",
  },
  {
    icon: Zap,
    title: "Short URL",
    desc: "Perpendek URL panjang jadi mudah diingat dan dibagikan ke mana saja.",
  },
  {
    icon: FileText,
    title: "Custom Teks",
    desc: "Buat halaman teks dengan format kaya, password protection, dan versioning.",
  },
  {
    icon: LinkIcon,
    title: "Link Management",
    desc: "Semua link Anda dalam satu dashboard dengan statistik real-time.",
  },
]

export function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden pt-20 md:pt-28">
      {/* Floating decorative blobs */}
      <div className="floating-blob floating-blob-1" />
      <div className="floating-blob floating-blob-2" />
      <div className="floating-blob floating-blob-3" />
      <div className="floating-blob floating-blob-4" />

      {/* Dots pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, #7C3AED 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Content */}
        <div className="max-w-4xl mx-auto text-center pt-8 md:pt-16 pb-12 md:pb-20">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 animate-scale-in border border-purple-200/50 dark:border-purple-500/20">
            <Sparkles className="h-4 w-4 text-purple-500" />
            <span className="text-sm font-semibold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
              Platform Link Management Modern
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1]">
            <span className="block text-foreground">Satu Link,</span>
            <span className="gradient-text-animated block mt-2">
              Kemungkinan Tak Terbatas
            </span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            Buat link WhatsApp custom, bagikan teks dengan proteksi,
            bangun link-in-bio, atau perpendek URL — semua dalam satu dashboard yang elegan.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button
              variant="gradient-rainbow"
              size="xl"
              asChild
              className="w-full sm:w-auto animate-pulse-glow"
            >
              <Link href="/#create">
                Buat Link Sekarang
                <ArrowRight className="h-5 w-5 ml-1" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="xl"
              asChild
              className="w-full sm:w-auto border-2 hover:border-purple-300 dark:hover:border-purple-500"
            >
              <Link href="/dashboard">
                Lihat Dashboard
              </Link>
            </Button>
          </div>
        </div>

        {/* Feature Grid — colorful cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 pb-12">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className={`card-gradient ${cardColors[i].card}`}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${cardColors[i].gradient} flex items-center justify-center mb-5 shadow-lg ${cardColors[i].shadow}`}>
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-8 pb-16 pt-8 border-t border-border/50">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="p-1.5 rounded-full bg-green-100 dark:bg-green-900/30">
              <Shield className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
            <span className="font-medium">SSL Secure</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="p-1.5 rounded-full bg-amber-100 dark:bg-amber-900/30">
              <Zap className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </div>
            <span className="font-medium">Super Cepat</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="p-1.5 rounded-full bg-purple-100 dark:bg-purple-900/30">
              <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
            <span className="font-medium">Gratis Selamanya</span>
          </div>
        </div>
      </div>
    </section>
  )
}