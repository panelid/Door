import Link from "next/link"

export function Footer() {
  const currentYear = new Date().getFullYear()
  return (
    <footer className="border-t border-white/5 bg-[#0A0A0F]">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-pink-500 flex items-center justify-center text-white text-xs">🚪</div>
            <span className="text-sm font-bold bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">Door.id</span>
          </div>
          <div className="flex items-center gap-5 text-xs text-gray-500">
            <Link href="/privacy" className="hover:text-white transition-colors">Privasi</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Syarat</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Kontak</Link>
          </div>
          <p className="text-xs text-gray-600">© {currentYear} Door.id. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
