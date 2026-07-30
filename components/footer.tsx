import Link from "next/link"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-white border-t border-[#E7E5F0]">
      <div className="max-w-[430px] mx-auto px-4 py-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-pink-500 flex items-center justify-center text-white text-xs flex-shrink-0">
              🚪
            </div>
            <span className="text-sm font-bold bg-gradient-to-r from-violet-600 to-pink-500 bg-clip-text text-transparent">
              Door.id
            </span>
          </Link>
          <p className="text-xs text-[#767489]">
            Platform link management all-in-one untuk Indonesia.
          </p>
          <div className="flex items-center gap-4 text-xs text-[#767489]">
            <Link href="/privacy" className="hover:text-violet-600 transition-colors">Privasi</Link>
            <Link href="/terms" className="hover:text-violet-600 transition-colors">Syarat</Link>
            <Link href="/contact" className="hover:text-violet-600 transition-colors">Kontak</Link>
          </div>
          <p className="text-xs text-[#767489]">
            © {currentYear} Door.id
          </p>
        </div>
      </div>
    </footer>
  )
}