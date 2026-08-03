"use client"

import { Header } from "@/components/header"
import CreateLinkFormPreview from "@/components/link-creator"
import { Footer } from "@/components/footer"
import { Toaster } from "@/components/ui/sonner"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0A0A0F] text-white selection:bg-violet-500 selection:text-white">
      <Header />

      <main className="flex-1">
        {/* Fitur Utama Pembuat Link (Asli) disesuaikan dengan tema gelap */}
        <div className="dark-theme-wrapper">
          <CreateLinkFormPreview />
        </div>
      </main>

      <Footer />
      <Toaster position="top-center" richColors />
    </div>
  )
}
