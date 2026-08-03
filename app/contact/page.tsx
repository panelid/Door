import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export const metadata = {
  title: "Kontak",
  description: "Hubungi tim Door.id untuk dukungan teknis atau pertanyaan.",
}

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F7F6FB]">
      <Header />
      <main className="flex-1 max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-6">Kontak</h1>
        <div className="prose prose-slate max-w-none space-y-6">
          <h2 className="text-xl font-semibold mt-8">Email</h2>
          <p className="text-gray-600">Kirim email ke <a href="mailto:hello@door.id" className="text-violet-600 underline">hello@door.id</a> untuk pertanyaan umum atau dukungan teknis.</p>
          <h2 className="text-xl font-semibold mt-8">Social Media</h2>
          <p className="text-gray-600">Ikuti kami di Instagram <a href="https://instagram.com/doorid" className="text-violet-600 underline">@doorid</a></p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
