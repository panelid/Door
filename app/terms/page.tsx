import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export const metadata = {
  title: "Syarat & Ketentuan",
  description: "Syarat dan ketentuan penggunaan layanan Door.id.",
}

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F7F6FB]">
      <Header />
      <main className="flex-1 max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-6">Syarat & Ketentuan</h1>
        <div className="prose prose-slate max-w-none space-y-6">
          <p><strong>Berlaku sejak:</strong> 3 Agustus 2026</p>
          <h2 className="text-xl font-semibold mt-8">1. Ketentuan Umum</h2>
          <p className="text-gray-600">Dengan mengakses Door.id, Anda menyetujui seluruh syarat dan ketentuan yang berlaku.</p>
          <h2 className="text-xl font-semibold mt-8">2. Penggunaan Layanan</h2>
          <p className="text-gray-600">Dilarang menggunakan layanan untuk aktivitas ilegal, spam, atau penipuan.</p>
          <h2 className="text-xl font-semibold mt-8">3. Kontak</h2>
          <p className="text-gray-600">Dukungan teknis hubungi <a href="mailto:hello@door.id" className="text-violet-600 underline">hello@door.id</a></p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
