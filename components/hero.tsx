"use client"

import { Zap, Shield, Sparkles, ArrowRight } from "lucide-react"
import Link from "next/link"

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 gradient-subtle pointer-events-none" />
      
      <div className="container-tight section-padding relative">
        <div className="text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 text-sm font-medium text-primary animate-fade-in">
            <Sparkles className="h-4 w-4" />
            Platform Link Management Terbaik Indonesia
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.1]">
            Satu Link,{" "}
            <span className="gradient-text">
              Kemungkinan Tak Terbatas
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Buat link WhatsApp custom, bagikan teks dengan password, 
            bangun link-in-bio, atau perpendek URL. Semua dalam satu platform.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/#create"
              className="btn-primary inline-flex items-center gap-2 text-base px-6 py-3 shadow-large"
            >
              Buat Link Sekarang
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/dashboard"
              className="btn-secondary inline-flex items-center gap-2 text-base px-6 py-3"
            >
              Lihat Dashboard
            </Link>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-16 md:mt-24">
          <FeatureCard
            icon={Zap}
            title="Super Cepat"
            description="Buat link custom dalam hitungan detik. Interface intuitif untuk semua orang."
            color="blue"
          />
          <FeatureCard
            icon={Shield}
            title="Aman & Privat"
            description="Password protection, analytics lengkap, dan data terenkripsi."
            color="green"
          />
          <FeatureCard
            icon={Sparkles}
            title="Semua Fitur"
            description="WhatsApp, Paste, Linktree, Short URL dalam satu dashboard."
            color="purple"
          />
        </div>
      </div>
    </section>
  )
}

function FeatureCard({
  icon: Icon,
  title,
  description,
  color,
}: {
  icon: React.ElementType
  title: string
  description: string
  color: "blue" | "green" | "purple"
}) {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400",
    green: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400",
    purple: "bg-violet-50 text-violet-600 dark:bg-violet-950/50 dark:text-violet-400",
  }

  return (
    <div className="card-door p-6 md:p-8 hover-lift group">
      <div className={`w-12 h-12 rounded-xl ${colorClasses[color]} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
    </div>
  )
}
