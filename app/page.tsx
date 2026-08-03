"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sparkles, ArrowRight, MessageSquare, Link2, FileText, Zap } from "lucide-react"
import { useI18n } from "@/lib/i18n"

export default function HomePage() {
  const { t } = useI18n()

  return (
    <div className="min-h-screen flex flex-col bg-[#0A0A0F] text-white">
      <main className="flex-1">
        <section className="relative pt-20 pb-16 md:pt-32 md:pb-24 px-4 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-violet-600/15 blur-[120px] rounded-full pointer-events-none" />
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-violet-400 mb-8">
              <Sparkles className="w-3.5 h-3.5" />{t.badge}
            </div>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-6 leading-[1.05]">
              {t.heroTitle1}<br />
              <span className="bg-gradient-to-r from-violet-400 via-pink-400 to-amber-300 bg-clip-text text-transparent">{t.heroTitle2}</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-xl mx-auto mb-10 leading-relaxed">{t.heroDesc}</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button asChild size="lg" className="w-full sm:w-auto bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-2xl h-13 px-8 text-base shadow-lg shadow-violet-600/25">
                <Link href="/auth/sign-up">{t.ctaPrimary}<ArrowRight className="w-4 h-4 ml-2" /></Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto border-white/10 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-2xl h-13 px-8 text-base">
                <Link href="/dashboard">{t.ctaSecondary}</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="py-20 px-4 border-t border-white/5">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3">{t.featTitle}</h2>
              <p className="text-gray-400 text-sm sm:text-base">{t.featDesc}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
              <div className="group p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-violet-500/30 hover:bg-white/[0.04] transition-all duration-300">
                <div className="w-11 h-11 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-400 mb-5 group-hover:bg-violet-500/20 transition-colors"><MessageSquare className="w-5 h-5" /></div>
                <h3 className="font-semibold text-lg mb-2">{t.feat1Title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{t.feat1Desc}</p>
              </div>
              <div className="group p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-pink-500/30 hover:bg-white/[0.04] transition-all duration-300">
                <div className="w-11 h-11 rounded-xl bg-pink-500/10 flex items-center justify-center text-pink-400 mb-5 group-hover:bg-pink-500/20 transition-colors"><Link2 className="w-5 h-5" /></div>
                <h3 className="font-semibold text-lg mb-2">{t.feat2Title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{t.feat2Desc}</p>
              </div>
              <div className="group p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-amber-500/30 hover:bg-white/[0.04] transition-all duration-300">
                <div className="w-11 h-11 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 mb-5 group-hover:bg-amber-500/20 transition-colors"><Zap className="w-5 h-5" /></div>
                <h3 className="font-semibold text-lg mb-2">{t.feat3Title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{t.feat3Desc}</p>
              </div>
              <div className="group p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-emerald-500/30 hover:bg-white/[0.04] transition-all duration-300">
                <div className="w-11 h-11 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-5 group-hover:bg-emerald-500/20 transition-colors"><FileText className="w-5 h-5" /></div>
                <h3 className="font-semibold text-lg mb-2">{t.feat4Title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{t.feat4Desc}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 px-4">
          <div className="max-w-3xl mx-auto text-center p-8 sm:p-14 rounded-3xl bg-gradient-to-br from-violet-900/30 via-purple-900/10 to-transparent border border-white/10 relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] bg-violet-500/20 blur-[80px] rounded-full pointer-events-none" />
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 relative z-10">{t.ctaTitle}</h2>
            <p className="text-gray-400 text-sm sm:text-base mb-8 max-w-lg mx-auto relative z-10">{t.ctaDesc}</p>
            <Button asChild size="lg" className="bg-white text-black hover:bg-gray-100 font-bold rounded-2xl h-13 px-10 text-base relative z-10 shadow-lg">
              <Link href="/auth/sign-up">{t.ctaButton}</Link>
            </Button>
          </div>
        </section>
      </main>
    </div>
  )
}
