import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { LinkCreator } from "@/components/link-creator"
import { Footer } from "@/components/footer"
import { Toaster } from "@/components/ui/sonner"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <Hero />
        <LinkCreator />
      </main>
      
      <Footer />
      <Toaster position="top-center" richColors />
    </div>
  )
}
