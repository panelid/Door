"use client"

import { useState } from "react"
import {
  MessageCircle,
  FileText,
  Users,
  Link2,
  ArrowRight,
  Plus,
  X,
  Sparkles,
} from "lucide-react"
import { useI18n } from "@/lib/i18n"

const LINK_TYPES = [
  { key: "whatsapp", label: "WhatsApp", icon: MessageCircle },
  { key: "paste", label: "Paste", icon: FileText },
  { key: "linktree", label: "Linktree", icon: Users },
  { key: "shorturl", label: "Short URL", icon: Link2 },
]

const CTA_LABEL = {
  whatsapp: "Buat Link WhatsApp",
  paste: "Buat Paste",
  linktree: "Buat Linktree",
  shorturl: "Perpendek URL",
}

export default function CreateLinkFormPreview() {
  const [activeType, setActiveType] = useState("whatsapp")
  const [slug, setSlug] = useState("")
  const [phone, setPhone] = useState("")
  const [waMessage, setWaMessage] = useState("")
  const [pasteTitle, setPasteTitle] = useState("")
  const [pasteContent, setPasteContent] = useState("")
  const [pastePassword, setPastePassword] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [bioLinks, setBioLinks] = useState([{ label: "", url: "" }])
  const [longUrl, setLongUrl] = useState("")
  const { t } = useI18n()

  const previewSlug = slug.trim() || "my-link"
  const previewTarget = (() => {
    if (activeType === "whatsapp") return `wa.me/${phone.trim() || "628123456789"}`
    if (activeType === "paste") return pasteTitle.trim() || "teks tersimpan"
    if (activeType === "linktree")
      return displayName.trim() ? `profil ${displayName.trim()}` : "profil bio kamu"
    if (activeType === "shorturl") return longUrl.trim() || "https://tujuan-panjang.kamu"
    return ""
  })()

  const updateBioLink = (i: number, field: string, val: string) =>
    setBioLinks((prev) => prev.map((l, idx) => (idx === i ? { ...l, [field]: val } : l)))
  const addBioLink = () => setBioLinks((prev) => [...prev, { label: "", url: "" }])
  const removeBioLink = (i: number) => setBioLinks((prev) => prev.filter((_, idx) => idx !== i))

  const hardBorder = "border-[3px] border-black"
  const hardShadow = "shadow-[6px_6px_0_0_#111]"
  const softInput =
    "w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-3 text-[14.5px] text-neutral-900 outline-none transition-all focus:border-violet-400 focus:ring-2 focus:ring-violet-100"

  return (
    <div className="min-h-screen bg-[#F5F2EC] text-neutral-900 flex justify-center">
      <div className="w-full max-w-[480px] px-4 py-10">

        {/* Badge */}
        <div className={`inline-flex items-center gap-2 ${hardBorder} bg-white px-3.5 py-1.5 mb-6 shadow-[3px_3px_0_0_#111]`}>
          <span className="text-lg leading-none">🚪</span>
          <span className="text-[11px] font-extrabold tracking-widest uppercase">
            Multi-Link Platform · Gratis Selamanya
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-[36px] leading-[1.1] font-black mb-4">
          Satu Pintu,
          <br />
          <span className="bg-violet-600 text-white px-2 py-0.5 inline-block rotate-[-1deg]">Semua Link Kamu</span>
          <br />
          Nyantol Di Sini.
        </h1>

        <p className="text-[15.5px] text-neutral-700 mb-2 leading-relaxed font-medium">
          Custom link WhatsApp, teks penting antar perangkat, bio sosial media,
          sampe URL panjang yang ribet — Door.id beresin semuanya jadi satu alamat pendek.
        </p>
        <p className="text-[15px] font-bold text-neutral-900 mb-8 leading-relaxed">
          Gampang diinget. Gampang dibagi. Gampang dipake buat jualan atau kerja tim.
        </p>

        {/* CTA row */}
        <div className="flex gap-3 mb-3">
          <button
            className={`flex-1 flex items-center justify-center gap-2 ${hardBorder} ${hardShadow} bg-black text-white font-bold py-3.5 text-[14.5px] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all rounded-xl`}
          >
            Buat Link Gratis <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[12px] text-neutral-500 mb-10 font-medium">
          ✨ Ga perlu kartu kredit. Ga perlu install apa-apa.
        </p>

        {/* Form card */}
        <div className={`rounded-[28px] bg-white p-6 md:p-7 ${hardBorder} ${hardShadow}`}>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-pink-100 px-3 py-1 mb-5 border border-pink-300">
            <Sparkles className="w-3.5 h-3.5 text-pink-600" />
            <span className="text-[11px] font-bold tracking-wide uppercase text-pink-700">
              Coba Sekarang
            </span>
          </div>

          {/* Tabs */}
          <div className="grid grid-cols-4 gap-1.5 mb-6">
            {LINK_TYPES.map(({ key, label, icon: Icon }) => {
              const active = activeType === key
              return (
                <button
                  key={key}
                  onClick={() => setActiveType(key)}
                  className={`flex flex-col items-center gap-1.5 py-3 px-1 rounded-2xl text-[11px] font-bold transition-all ${
                    active
                      ? "bg-violet-600 text-white shadow-md shadow-violet-200 scale-105"
                      : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                  }`}
                >
                  <Icon className="w-[18px] h-[18px]" />
                  {label}
                </button>
              )
            })}
          </div>

          {/* Nama link */}
          {activeType !== "linktree" && (
            <div className="mb-4">
              <label className="block text-[14px] font-bold text-neutral-800 mb-1.5">
                Nama Link Kamu
              </label>
              <div className="flex rounded-xl border-2 border-black overflow-hidden bg-neutral-50 focus-within:ring-2 focus-within:ring-violet-400">
                <span className="flex items-center bg-neutral-200 border-r-2 border-black px-3.5 text-[14px] font-semibold text-neutral-600">
                  door.id/
                </span>
                <input
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="my-link"
                  className="flex-1 min-w-0 px-3.5 py-3 text-[14.5px] bg-white outline-none"
                />
              </div>
            </div>
          )}

          {/* WhatsApp */}
          {activeType === "whatsapp" && (
            <>
              <div className="mb-4">
                <label className="block text-[14px] font-bold text-neutral-800 mb-1.5">
                  Nomor WhatsApp
                </label>
                <div className="flex items-center gap-2 rounded-xl border-2 border-black bg-white px-3.5">
                  <MessageCircle className="w-[18px] h-[18px] shrink-0 text-[#25D366]" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="628123456789"
                    className="flex-1 min-w-0 py-3 text-[14.5px] outline-none bg-transparent"
                  />
                </div>
                <p className="text-[11.5px] text-neutral-500 mt-1">Contoh: 628123456789 (tanpa +)</p>
              </div>
              <div className="mb-5">
                <label className="block text-[14px] font-bold text-neutral-800 mb-1.5">
                  Pesan Default <span className="font-normal text-neutral-400">(opsional)</span>
                </label>
                <textarea
                  value={waMessage}
                  onChange={(e) => setWaMessage(e.target.value)}
                  placeholder="Halo, saya tertarik dengan..."
                  className={`${softInput} min-h-[70px] resize-none`}
                />
              </div>
            </>
          )}

          {/* Paste */}
          {activeType === "paste" && (
            <>
              <div className="mb-4">
                <label className="block text-[14px] font-bold text-neutral-800 mb-1.5">
                  Judul <span className="font-normal text-neutral-400">(opsional)</span>
                </label>
                <input
                  value={pasteTitle}
                  onChange={(e) => setPasteTitle(e.target.value)}
                  placeholder="Contoh: Catatan rapat"
                  className={softInput}
                />
              </div>
              <div className="mb-4">
                <label className="block text-[14px] font-bold text-neutral-800 mb-1.5">
                  Isi Teks
                </label>
                <textarea
                  value={pasteContent}
                  onChange={(e) => setPasteContent(e.target.value)}
                  placeholder="Tulis atau tempel teks kamu..."
                  className={`${softInput} min-h-[100px] resize-none`}
                />
              </div>
              <div className="mb-5">
                <label className="block text-[14px] font-bold text-neutral-800 mb-1.5">
                  Proteksi Password <span className="font-normal text-neutral-400">(opsional)</span>
                </label>
                <input
                  type="password"
                  value={pastePassword}
                  onChange={(e) => setPastePassword(e.target.value)}
                  placeholder="Kosongkan kalau tidak perlu"
                  className={softInput}
                />
              </div>
            </>
          )}

          {/* Linktree */}
          {activeType === "linktree" && (
            <>
              <div className="mb-4">
                <label className="block text-[14px] font-bold text-neutral-800 mb-1.5">
                  Username Bio
                </label>
                <div className="flex rounded-xl border-2 border-black overflow-hidden bg-neutral-50">
                  <span className="flex items-center bg-neutral-200 border-r-2 border-black px-3.5 text-[14px] font-semibold text-neutral-600">
                    door.id/
                  </span>
                  <input
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="username"
                    className="flex-1 min-w-0 px-3.5 py-3 text-[14.5px] bg-white outline-none"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-[14px] font-bold text-neutral-800 mb-1.5">
                  Nama Tampilan
                </label>
                <input
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Nama atau Brand"
                  className={softInput}
                />
              </div>
              <div className="mb-5">
                <label className="block text-[14px] font-bold text-neutral-800 mb-2">
                  Daftar Link
                </label>
                <div className="space-y-2">
                  {bioLinks.map((link, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        value={link.label}
                        onChange={(e) => updateBioLink(i, "label", e.target.value)}
                        placeholder="Judul"
                        className="flex-1 min-w-0 rounded-xl border border-neutral-300 px-3 py-2.5 text-[13.5px] bg-white outline-none"
                      />
                      <input
                        value={link.url}
                        onChange={(e) => updateBioLink(i, "url", e.target.value)}
                        placeholder="https://..."
                        className="flex-[1.4] min-w-0 rounded-xl border border-neutral-300 px-3 py-2.5 text-[13.5px] bg-white outline-none"
                      />
                      {bioLinks.length > 1 && (
                        <button
                          onClick={() => removeBioLink(i)}
                          className="shrink-0 rounded-xl border border-neutral-300 px-2.5 text-neutral-500 hover:bg-neutral-100"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  onClick={addBioLink}
                  className="flex items-center gap-1.5 text-[13.5px] font-bold text-violet-600 mt-2.5 hover:underline"
                >
                  <Plus className="w-4 h-4" /> Tambah Link
                </button>
              </div>
            </>
          )}

          {/* Short URL */}
          {activeType === "shorturl" && (
            <div className="mb-5">
              <label className="block text-[14px] font-bold text-neutral-800 mb-1.5">
                URL Tujuan
              </label>
              <input
                value={longUrl}
                onChange={(e) => setLongUrl(e.target.value)}
                placeholder="https://url-panjang-kamu.com/artikel"
                className={softInput}
              />
            </div>
          )}

          {/* Preview */}
          <div className="mb-5 rounded-2xl border-2 border-dashed border-violet-300 bg-violet-50/60 px-4 py-3.5">
            <p className="text-[11px] uppercase tracking-wider font-bold text-neutral-500 mb-1">
              Preview link kamu
            </p>
            <p className="flex flex-wrap items-center gap-1.5 text-[13px] font-bold break-all">
              <span className="text-violet-700">door.id/{previewSlug}</span>
              <span className="font-normal text-neutral-400">→</span>
              <span className="text-emerald-700">{previewTarget}</span>
            </p>
          </div>

          <button className={`w-full flex items-center justify-center gap-2 rounded-xl ${hardBorder} ${hardShadow} bg-violet-600 hover:bg-violet-500 py-4 text-[15px] font-bold text-white active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all`}>
            <Sparkles className="w-4 h-4" />
            {CTA_LABEL[activeType]}
          </button>
        </div>

        <p className="text-center text-[12px] text-neutral-600 mt-6 font-medium">
          Dipakai buat jualan online, campaign, sampe katalog produk.
        </p>
      </div>
    </div>
  )
}
