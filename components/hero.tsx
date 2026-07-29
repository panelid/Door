"use client"

import Link from "next/link"
import { Zap, Shield, Sparkles, ArrowRight, Link as LinkIcon } from "lucide-react"

export function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden pt-24 md:pt-32">
      <div className="container-modern">
        <div className="section-padding">
          {/* Content */}
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8">
              <Sparkles className="h-4 w-4 text-violet-500" />
              <span className="text-sm font-medium">Platform Link Management Modern</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-8 leading-tight">
              <span className="block">Satu Link,</span>
              <span className="gradient-text-animated block">Kemungkinan Tak Terbatas</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed text-readable">
              Buat link WhatsApp custom, bagikan teks dengan proteksi, 
              bangun link-in-bio, atau perpendek URL — semua dalam satu dashboard yang elegan.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link href="/#create" className="btn-modern-primary w-full sm:w-auto">
                Buat Link Sekarang
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link href="/dashboard" className="btn-modern-secondary w-full sm:w-auto">
                Lihat Dashboard
              </Link>
            </div>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {/* Card 1 */}
            <div className="card-modern p-8 md:p-10">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mb-6 shadow-lg shadow-violet-500/30">
                <LinkIcon className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">WhatsApp Link</h3>
              <p className="text-muted-foreground text-readable">
                Buat link WhatsApp custom dengan pesan otomatis. Pelanggan tinggal klik dan langsung chat dengan Anda.
              </p>
            </div>

            {/* Card 2 */}
            <div className="card-modern p-8 md:p-10">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mb-6 shadow-lg shadow-orange-500/30">
                <Shield className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Paste dengan Password</h3>
              <p className="text-muted-foreground text-readable">
                Bagikan teks panjang dengan proteksi password dan riwayat perubahan yang tersimpan otomatis.
              </p>
            </div>

            {/* Card 3 */}
            <div className="card-modern p-8 md:p-10">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center mb-6 shadow-lg shadow-rose-500/30">
                <Zap className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Link-in-Bio</h3>
              <p className="text-muted-foreground text-readable">
                Satu link elegan untuk semua sosial media Anda, dengan analytics real-time dan tampilan yang customizable.
              </p>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-8 mt-20 pt-12 border-t border-border/50">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="h-5 w-5 text-green-500" />
              <span>SSL Secure</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Zap className="h-5 w-5 text-amber-500" />
              <span>Super Cepat</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Sparkles className="h-5 w-5 text-violet-500" />
              <span>Gratis Selamanya</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
