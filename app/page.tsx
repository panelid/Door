import { Header } from "@/components/header"
import CreateLinkFormPreview from "@/components/link-creator"
import { Footer } from "@/components/footer"
import { Toaster } from "@/components/ui/sonner"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F7F6FB]">
      <Header />

      <main className="flex-1">
        <CreateLinkFormPreview />
      </main>

      <Footer />
      <Toaster position="top-center" richColors />
    </div>
  )
}