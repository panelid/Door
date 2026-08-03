import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export const metadata = {
  title: "Kebijakan Privasi",
  description: "Kebijakan privasi Door.id - Bagaimana kami melindungi data Anda.",
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F7F6FB]">
      <Header />
      <main className="flex-1 max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-6">Kebijakan Privasi</h1>
        <div className="prose prose-slate max-w-none space-y-6">
          <p><strong>Terakhir diperbarui:</strong> 3 Agustus 2026</p>
          <h2 className="text-xl font-semibold mt-8">1. Informasi yang Kami Kumpulkan</h2>
          <p className="text-gray-600">Kami mengumpulkan informasi yang Anda berikan secara langsung saat menggunakan Door.id, termasuk:</p>
          <ul className="list-disc pl-6 text-gray-600">
            <li>Alamat email saat mendaftar</li>
            <li>Link yang Anda buat dan bagikan</li>
            <li>Data penggunaan layanan</li>
          </ul>
          <h2 className="text-xl font-semibold mt-8">2. Keamanan & Penggunaan</h2>
          <p className="text-gray-600">Informasi Anda digunakan untuk menyediakan dan meningkatkan layanan kami. Kami melindungi data Anda dengan enkripsi standar industri.</p>
          <h2 className="text-xl font-semibold mt-8">3. Hubungi Kami</h2>
          <p className="text-gray-600">Pertanyaan? Hubungi <a href="mailto:hello@door.id" className="text-violet-600 underline">hello@door.id</a></p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
