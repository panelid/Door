"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import {
  MessageCircle,
  FileText,
  Users,
  Link2,
  Sparkles,
  Plus,
  X,
  Loader2,
  CheckCircle2,
} from "lucide-react"
import { toast } from "sonner"

const LINK_TYPES = [
  { key: "whatsapp", label: "WhatsApp", icon: MessageCircle },
  { key: "paste", label: "Paste", icon: FileText },
  { key: "linktree", label: "Linktree", icon: Users },
  { key: "shorturl", label: "Short URL", icon: Link2 },
]

const CTA_LABEL: Record<string, string> = {
  whatsapp: "Buat Link WhatsApp",
  paste: "Buat Paste",
  linktree: "Buat Linktree",
  shorturl: "Perpendek URL",
}

export default function CreateLinkFormPreview() {
  const [activeType, setActiveType] = useState("whatsapp")
  const [slug, setSlug] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const router = useRouter()

  // WhatsApp
  const [phone, setPhone] = useState("")
  const [waMessage, setWaMessage] = useState("")

  // Paste
  const [pasteTitle, setPasteTitle] = useState("")
  const [pasteContent, setPasteContent] = useState("")
  const [pastePassword, setPastePassword] = useState("")

  // Linktree
  const [displayName, setDisplayName] = useState("")
  const [bio, setBio] = useState("")
  const [bioLinks, setBioLinks] = useState([{ label: "", url: "" }])

  // Short URL
  const [longUrl, setLongUrl] = useState("")

  const previewSlug = slug.trim() || "my-link"
  const previewTarget = (() => {
    if (activeType === "whatsapp") return `wa.me/${phone.trim() || "628123456789"}`
    if (activeType === "paste") return pasteTitle.trim() || "teks tersimpan"
    if (activeType === "linktree")
      return displayName.trim() ? `profil ${displayName.trim()}` : "profil bio kamu"
    if (activeType === "shorturl") return longUrl.trim() || "https://tujuan-panjang.kamu"
    return ""
  })()

  const updateBioLink = (index: number, field: "label" | "url", value: string) => {
    setBioLinks((prev) => prev.map((l, i) => (i === index ? { ...l, [field]: value } : l)))
  }
  const addBioLink = () => setBioLinks((prev) => [...prev, { label: "", url: "" }])
  const removeBioLink = (index: number) => setBioLinks((prev) => prev.filter((_, i) => i !== index))

  const handleSubmit = async () => {
    setIsLoading(true)
    setSuccess(null)

    const supabase = createClient()

    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      if (!slug.trim()) {
        toast.error("Nama link harus diisi")
        setIsLoading(false)
        return
      }

      // Check if slug exists
      const { data: existingSlug } = await supabase
        .from("slugs")
        .select("slug")
        .eq("slug", slug.trim())
        .single()

      if (existingSlug) {
        toast.error("Slug sudah dipakai. Pilih yang lain.")
        setIsLoading(false)
        return
      }

      let data: Record<string, unknown> = {}

      switch (activeType) {
        case "whatsapp":
          if (!phone.trim()) {
            toast.error("Nomor WhatsApp harus diisi")
            setIsLoading(false)
            return
          }
          data = {
            phone: phone.trim(),
            message: waMessage || "",
          }
          break
        case "paste":
          if (!pasteContent.trim()) {
            toast.error("Isi teks harus diisi")
            setIsLoading(false)
            return
          }
          data = {
            title: pasteTitle.trim(),
            content: pasteContent,
          }
          break
        case "linktree": {
          const links = bioLinks
            .filter((l) => l.label.trim() && l.url.trim())
            .map((l) => ({ title: l.label.trim(), url: l.url.trim() }))
          if (!links.length) {
            toast.error("Minimal satu link harus diisi")
            setIsLoading(false)
            return
          }
          data = {
            display_name: displayName.trim(),
            bio: bio.trim(),
            links,
          }
          break
        }
        case "shorturl":
          if (!longUrl.trim()) {
            toast.error("URL panjang harus diisi")
            setIsLoading(false)
            return
          }
          data = { url: longUrl.trim() }
          break
      }

      const { error: insertError } = await supabase.from("slugs").insert({
        user_id: user.id,
        slug: slug.trim(),
        type: activeType,
        data,
        ...(activeType === "paste" && pastePassword ? { paste_password: pastePassword } : {}),
      })

      if (insertError) throw insertError

      const url = `${window.location.origin}/${slug.trim()}`
      setSuccess(`Link berhasil dibuat: ${url}`)
      toast.success("Link berhasil dibuat!")

      // Copy to clipboard
      navigator.clipboard.writeText(url)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Terjadi kesalahan")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F7F6FB] flex justify-center py-4">
      <div className="w-full max-w-[430px] bg-[#F7F6FB]">
        <p className="px-5 pt-3.5 pb-1 text-[13.5px] text-[#767489]">
          Pilih jenis link, isi datanya, langsung jadi.
        </p>

        <main className="px-4 pb-8 pt-2">
          <div className="bg-white rounded-[20px] p-[18px] shadow-sm">
            {/* Tabs jenis link */}
            <div className="flex gap-2 overflow-x-auto pb-1 mb-5">
              {LINK_TYPES.map(({ key, label, icon: Icon }) => {
                const active = activeType === key
                return (
                  <button
                    key={key}
                    onClick={() => setActiveType(key)}
                    className={`flex-1 min-w-[78px] flex flex-col items-center gap-1.5 py-3 px-1.5 rounded-2xl border text-[11.5px] font-semibold transition-all ${
                      active
                        ? "bg-gradient-to-br from-violet-600 to-blue-500 border-transparent text-white shadow-[0_4px_14px_rgba(124,58,237,0.3)]"
                        : "bg-white border-[#E7E5F0] text-[#767489]"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {label}
                  </button>
                )
              })}
            </div>

            {/* Nama Link */}
            {activeType !== "linktree" && (
              <div className="mb-4">
                <label className="block text-[14.5px] font-bold mb-1">Nama Link Kamu</label>
                <div className="flex border border-[#E7E5F0] rounded-xl overflow-hidden">
                  <span className="flex items-center whitespace-nowrap bg-[#FBFAFD] border-r border-[#E7E5F0] px-3 text-[14.5px] text-[#767489]">
                    door.id/
                  </span>
                  <input
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="my-link"
                    className="flex-1 min-w-0 px-3 py-3 text-[14.5px] outline-none"
                  />
                </div>
                <p className="text-xs text-[#767489] mt-1.5">
                  Boleh pakai huruf, angka, tanda (-) dan (_), tanpa spasi
                </p>
              </div>
            )}

            {/* WhatsApp */}
            {activeType === "whatsapp" && (
              <>
                <div className="mb-4">
                  <label className="block text-[14.5px] font-bold mb-1">Nomor WhatsApp</label>
                  <div className="flex items-center gap-2 border border-[#E7E5F0] rounded-xl px-3">
                    <MessageCircle className="w-[18px] h-[18px] flex-shrink-0 text-[#25D366]" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="628123456789"
                      className="flex-1 min-w-0 py-3 text-[14.5px] outline-none"
                    />
                  </div>
                  <p className="text-xs text-[#767489] mt-1.5">
                    Contoh: 628123456789 (kode negara tanpa +)
                  </p>
                </div>
                <div className="mb-5">
                  <label className="block text-[14.5px] font-bold mb-1">
                    Pesan Default <span className="font-normal text-[#767489]">(opsional)</span>
                  </label>
                  <textarea
                    value={waMessage}
                    onChange={(e) => setWaMessage(e.target.value)}
                    placeholder="Halo, saya tertarik dengan..."
                    className="w-full min-h-[70px] border border-[#E7E5F0] rounded-xl p-3 text-[14px] outline-none resize-none"
                  />
                </div>
              </>
            )}

            {/* Paste */}
            {activeType === "paste" && (
              <>
                <div className="mb-4">
                  <label className="block text-[14.5px] font-bold mb-1">
                    Judul <span className="font-normal text-[#767489]">(opsional)</span>
                  </label>
                  <input
                    value={pasteTitle}
                    onChange={(e) => setPasteTitle(e.target.value)}
                    placeholder="Contoh: Catatan rapat"
                    className="w-full border border-[#E7E5F0] rounded-xl px-3 py-3 text-[14.5px] outline-none"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-[14.5px] font-bold mb-1">Isi Teks</label>
                  <textarea
                    value={pasteContent}
                    onChange={(e) => setPasteContent(e.target.value)}
                    placeholder="Tulis atau tempel teks kamu di sini..."
                    className="w-full min-h-[120px] border border-[#E7E5F0] rounded-xl p-3 text-[14px] outline-none resize-none"
                  />
                </div>
                <div className="mb-5">
                  <label className="block text-[14.5px] font-bold mb-1">
                    Proteksi Password <span className="font-normal text-[#767489]">(opsional)</span>
                  </label>
                  <input
                    type="password"
                    value={pastePassword}
                    onChange={(e) => setPastePassword(e.target.value)}
                    placeholder="Kosongkan kalau tidak perlu"
                    className="w-full border border-[#E7E5F0] rounded-xl px-3 py-3 text-[14.5px] outline-none"
                  />
                  <p className="text-xs text-[#767489] mt-1.5">
                    Riwayat perubahan teks tersimpan otomatis
                  </p>
                </div>
              </>
            )}

            {/* Linktree */}
            {activeType === "linktree" && (
              <>
                <div className="mb-4">
                  <label className="block text-[14.5px] font-bold mb-1">Username Bio Kamu</label>
                  <div className="flex border border-[#E7E5F0] rounded-xl overflow-hidden">
                    <span className="flex items-center whitespace-nowrap bg-[#FBFAFD] border-r border-[#E7E5F0] px-3 text-[14.5px] text-[#767489]">
                      door.id/
                    </span>
                    <input
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      placeholder="username-kamu"
                      className="flex-1 min-w-0 px-3 py-3 text-[14.5px] outline-none"
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-[14.5px] font-bold mb-1">Nama Tampilan</label>
                  <input
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Nama kamu / brand kamu"
                    className="w-full border border-[#E7E5F0] rounded-xl px-3 py-3 text-[14.5px] outline-none"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-[14.5px] font-bold mb-1">
                    Bio Singkat <span className="font-normal text-[#767489]">(opsional)</span>
                  </label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Ceritakan sedikit tentang kamu..."
                    className="w-full min-h-[60px] border border-[#E7E5F0] rounded-xl p-3 text-[14px] outline-none resize-none"
                  />
                </div>
                <div className="mb-5">
                  <label className="block text-[14.5px] font-bold mb-2">Daftar Link</label>
                  <div className="space-y-2">
                    {bioLinks.map((link, i) => (
                      <div key={i} className="flex gap-2">
                        <input
                          value={link.label}
                          onChange={(e) => updateBioLink(i, "label", e.target.value)}
                          placeholder="Label (mis. Instagram)"
                          className="flex-1 min-w-0 border border-[#E7E5F0] rounded-xl px-2.5 py-2.5 text-[13.5px] outline-none"
                        />
                        <input
                          value={link.url}
                          onChange={(e) => updateBioLink(i, "url", e.target.value)}
                          placeholder="https://..."
                          className="flex-[1.4] min-w-0 border border-[#E7E5F0] rounded-xl px-2.5 py-2.5 text-[13.5px] outline-none"
                        />
                        {bioLinks.length > 1 && (
                          <button onClick={() => removeBioLink(i)} className="p-2 text-red-400 hover:text-red-600">
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={addBioLink}
                    className="mt-2 flex items-center gap-1.5 text-[13px] font-semibold text-violet-600"
                  >
                    <Plus className="w-4 h-4" /> Tambah Link
                  </button>
                </div>
              </>
            )}

            {/* Short URL */}
            {activeType === "shorturl" && (
              <div className="mb-5">
                <label className="block text-[14.5px] font-bold mb-1">URL Panjang</label>
                <div className="flex items-center gap-2 border border-[#E7E5F0] rounded-xl px-3">
                  <Link2 className="w-[18px] h-[18px] flex-shrink-0 text-violet-500" />
                  <input
                    type="url"
                    value={longUrl}
                    onChange={(e) => setLongUrl(e.target.value)}
                    placeholder="https://contoh.com/artikel-panjang-sekali"
                    className="flex-1 min-w-0 py-3 text-[14.5px] outline-none"
                  />
                </div>
                <p className="text-xs text-[#767489] mt-1.5">
                  Tempel URL panjang yang ingin kamu perpendek
                </p>
              </div>
            )}

            {/* CTA Button */}
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-violet-600 to-blue-500 text-white font-bold py-3.5 rounded-xl text-[15px] shadow-[0_4px_14px_rgba(124,58,237,0.3)] hover:shadow-[0_6px_20px_rgba(124,58,237,0.4)] transition-all disabled:opacity-60"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 inline animate-spin mr-1.5 -mt-0.5" />
              ) : (
                <Sparkles className="w-4 h-4 inline mr-1.5 -mt-0.5" />
              )}
              {isLoading ? "Membuat..." : CTA_LABEL[activeType]}
            </button>

            {/* Success Message */}
            {success && (
              <div className="mt-5 p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-green-800">Berhasil!</p>
                    <p className="text-sm text-green-700 mt-1 break-all">{success}</p>
                    <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                      <Sparkles className="h-3 w-3" />
                      Link sudah disalin ke clipboard
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Preview */}
            <div className="mt-5 pt-4 border-t border-[#E7E5F0]">
              <p className="text-xs text-[#767489] mb-1">Preview link kamu:</p>
              <div className="bg-[#FBFAFD] border border-[#E7E5F0] rounded-xl px-3.5 py-3 text-[14px]">
                <span className="font-semibold text-violet-600">door.id/{previewSlug}</span>
                <span className="text-[#767489]"> → {previewTarget}</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}