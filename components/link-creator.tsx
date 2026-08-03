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
  const [includeQr, setIncludeQr] = useState(false)
  const { lang } = useI18n()

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

  const t = {
    badge: lang === "id" ? "Multi-Link Platform · Gratis Selamanya" : "Multi-Link Platform · Free Forever",
    h1_1: lang === "id" ? "Satu Pintu," : "One Door,",
    h1_2: lang === "id" ? "Semua Link Kamu" : "All Your Links",
    h1_3: lang === "id" ? "Nyantol Di Sini." : "Hang Right Here.",
    desc1: lang === "id"
      ? "Custom link WhatsApp, Bagikan/Pindahkan teks penting antar perangkat, bio sosial media, sampe URL panjang yang ribet — Door.id beresin semuanya jadi satu alamat pendek."
      : "Custom WhatsApp links, cross-device text sharing, social media bio, and long messy URLs — Door.id packs it all into one short address.",
    desc2: lang === "id"
      ? "Gampang diinget. Gampang dibagi. Gampang dipake buat jualan atau kerja tim."
      : "Easy to remember. Easy to share. Easy to use for selling or teamwork.",
    ctaBtn: lang === "id" ? "Buat Link Gratis" : "Create Link For Free",
    subCta: lang === "id" ? "✨ Ga perlu kartu kredit. Ga perlu install apa-apa." : "✨ No credit card needed. No installation required.",
    tryNow: lang === "id" ? "Coba Sekarang" : "Try Now",
    linkName: lang === "id" ? "Nama Link Kamu" : "Your Link Name",
    whatsappNum: lang === "id" ? "Nomor WhatsApp" : "WhatsApp Number",
    whatsappHint: lang === "id" ? "Contoh: 628123456789 (tanpa +)" : "Example: 628123456789 (without +)",
    defaultMsg: lang === "id" ? "Pesan Default (opsional)" : "Default Message (optional)",
    defaultMsgPh: lang === "id" ? "Halo, saya tertarik dengan..." : "Hi, I am interested in...",
    titleLabel: lang === "id" ? "Judul (opsional)" : "Title (optional)",
    titlePh: lang === "id" ? "Contoh: Catatan rapat" : "e.g. Meeting notes",
    textCont: lang === "id" ? "Isi Teks" : "Text Content",
    textPh: lang === "id" ? "Tulis atau tempel teks kamu..." : "Write or paste your text...",
    passLabel: lang === "id" ? "Proteksi Password (opsional)" : "Password Protection (optional)",
    passPh: lang === "id" ? "Kosongkan kalau tidak perlu" : "Leave blank if not needed",
    bioUser: lang === "id" ? "Username Bio" : "Bio Username",
    bioName: lang === "id" ? "Nama Tampilan" : "Display Name",
    bioNamePh: lang === "id" ? "Nama atau Brand" : "Name or Brand",
    bioList: lang === "id" ? "Daftar Link" : "Link List",
    addLink: lang === "id" ? "Tambah Link" : "Add Link",
    targetUrl: lang === "id" ? "URL Tujuan" : "Target URL",
    previewTitle: lang === "id" ? "Preview link kamu" : "Your link preview",
    qrLabel: lang === "id" ? "Buat QR Code untuk link ini" : "Create QR Code for this link",
    qrSubOn: lang === "id" ? "QR Code akan ditampilkan setelah link dibuat" : "QR Code will be shown after link is created",
    qrSubOff: lang === "id" ? "Aktifkan untuk mendapatkan QR Code gratis" : "Enable to get a free QR Code",
    qrPreview: lang === "id" ? "QR Code Preview" : "QR Code Preview",
    qrHint: lang === "id" ? "QR Code akan muncul setelah link berhasil dibuat" : "QR Code will appear after link is created",
    qrDownload: lang === "id" ? "Download QR Code (PNG)" : "Download QR Code (PNG)",
    footerDesc: lang === "id" ? "Dipakai buat jualan online, campaign, sampe katalog produk." : "Used for online selling, campaigns, and product catalogs.",
    btnWhatsapp: lang === "id" ? "Buat Link WhatsApp" : "Create WhatsApp Link",
    btnPaste: lang === "id" ? "Buat Paste" : "Create Paste",
    btnLinktree: lang === "id" ? "Buat Linktree" : "Create Linktree",
    btnShorturl: lang === "id" ? "Perpendek URL" : "Shorten URL",
  }

  const ctaButtonLabels: Record<string, string> = {
    whatsapp: t.btnWhatsapp,
    paste: t.btnPaste,
    linktree: t.btnLinktree,
    shorturl: t.btnShorturl,
  }

  return (
    <div className="min-h-screen bg-[#F5F2EC] text-neutral-900 flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

        {/* Kolom Kiri: Headline & Penjelasan (Lebih luas di Desktop) */}
        <div className="lg:col-span-6 text-left">
          <div className={`inline-flex items-center gap-2 ${hardBorder} bg-white px-3.5 py-1.5 mb-6 shadow-[3px_3px_0_0_#111]`}>
            <span className="text-lg leading-none">🚪</span>
            <span className="text-[11px] font-extrabold tracking-widest uppercase">
              {t.badge}
            </span>
          </div>

          <h1 className="text-[40px] sm:text-[50px] lg:text-[56px] leading-[1.08] font-black mb-6">
            {t.h1_1}
            <br />
            <span className="bg-violet-600 text-white px-3 py-1 inline-block rotate-[-1deg] shadow-[4px_4px_0_0_#111]">{t.h1_2}</span>
            <br />
            {t.h1_3}
          </h1>

          <p className="text-[17px] text-neutral-700 mb-3 leading-relaxed font-medium">
            {t.desc1}
          </p>
          <p className="text-[16px] font-bold text-neutral-900 mb-8 leading-relaxed">
            {t.desc2}
          </p>

          <p className="text-[13px] text-neutral-500 font-medium">
            {t.subCta}
          </p>
        </div>

        {/* Kolom Kanan: Form Card Neobrutalism (Proporsional di Desktop) */}
        <div className="lg:col-span-6 w-full max-w-[500px] mx-auto lg:max-w-none">
          <div className={`rounded-[28px] bg-white p-6 sm:p-8 ${hardBorder} ${hardShadow}`}>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-pink-100 px-3 py-1 mb-5 border border-pink-300">
              <Sparkles className="w-3.5 h-3.5 text-pink-600" />
              <span className="text-[11px] font-bold tracking-wide uppercase text-pink-700">
                {t.tryNow}
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
                    className={`flex flex-col items-center gap-1.5 py-3 px-1 rounded-2xl text-[11px] sm:text-[12px] font-bold transition-all ${
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
            {(activeType === "whatsapp" || activeType === "paste" || activeType === "shorturl") && (
              <div className="mb-4">
                <label className="block text-[14px] font-bold text-neutral-800 mb-1.5">
                  {t.linkName}
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
                    {t.whatsappNum}
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
                  <p className="text-[11.5px] text-neutral-500 mt-1">{t.whatsappHint}</p>
                </div>
                <div className="mb-5">
                  <label className="block text-[14px] font-bold text-neutral-800 mb-1.5">
                    {t.defaultMsg}
                  </label>
                  <textarea
                    value={waMessage}
                    onChange={(e) => setWaMessage(e.target.value)}
                    placeholder={t.defaultMsgPh}
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
                    {t.titleLabel}
                  </label>
                  <input
                    value={pasteTitle}
                    onChange={(e) => setPasteTitle(e.target.value)}
                    placeholder={t.titlePh}
                    className={softInput}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-[14px] font-bold text-neutral-800 mb-1.5">
                    {t.textCont}
                  </label>
                  <textarea
                    value={pasteContent}
                    onChange={(e) => setPasteContent(e.target.value)}
                    placeholder={t.textPh}
                    className={`${softInput} min-h-[100px] resize-none`}
                  />
                </div>
                <div className="mb-5">
                  <label className="block text-[14px] font-bold text-neutral-800 mb-1.5">
                    {t.passLabel}
                  </label>
                  <input
                    type="password"
                    value={pastePassword}
                    onChange={(e) => setPastePassword(e.target.value)}
                    placeholder={t.passPh}
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
                    {t.bioUser}
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
                    {t.bioName}
                  </label>
                  <input
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder={t.bioNamePh}
                    className={softInput}
                  />
                </div>
                <div className="mb-5">
                  <label className="block text-[14px] font-bold text-neutral-800 mb-2">
                    {t.bioList}
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
                    <Plus className="w-4 h-4" /> {t.addLink}
                  </button>
                </div>
              </>
            )}

            {/* Short URL */}
            {activeType === "shorturl" && (
              <div className="mb-5">
                <label className="block text-[14px] font-bold text-neutral-800 mb-1.5">
                  {t.targetUrl}
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
                {t.previewTitle}
              </p>
              <p className="flex flex-wrap items-center gap-1.5 text-[13px] font-bold break-all">
                <span className="text-violet-700">door.id/{previewSlug}</span>
                <span className="font-normal text-neutral-400">→</span>
                <span className="text-emerald-700">{previewTarget}</span>
              </p>
            </div>

            {/* QR Code Option Box - Large & Visible */}
            <div 
              onClick={() => setIncludeQr(!includeQr)}
              className={`mb-5 p-4 rounded-2xl cursor-pointer transition-all ${
                includeQr 
                  ? `bg-yellow-300 ${hardBorder} ${hardShadow} ring-2 ring-yellow-400` 
                  : `bg-neutral-50 border-2 border-dashed border-neutral-300 hover:border-violet-300 hover:bg-violet-50/30`
              }`}
            >
              <div className="flex items-center gap-3">
                {/* Custom Checkbox */}
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${
                  includeQr 
                    ? 'bg-violet-600 border-2 border-black shadow-[2px_2px_0_0_#111]' 
                    : 'bg-white border-2 border-neutral-300'
                }`}>
                  {includeQr && (
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-[14px] font-bold text-neutral-900">
                    📱 Buat QR Code untuk link ini
                  </p>
                  <p className="text-[12px] text-neutral-500 font-medium">
                    {includeQr ? "QR Code akan ditampilkan setelah link dibuat" : "Aktifkan untuk mendapatkan QR Code gratis"}
                  </p>
                </div>
                {/* QR Icon */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  includeQr ? 'bg-white border-2 border-black' : 'bg-neutral-200 border border-neutral-300'
                }`}>
                  <svg className={`w-6 h-6 ${includeQr ? 'text-violet-600' : 'text-neutral-500'}`} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 11h2v2H3v-2zm0-4h2v2H3V7zm4 0h2v2H7V7zm0 4h2v2H7v-2zm0 4h2v2H7v-2zm-4 0h2v2H3v-2zm0-8h2v2H3V7zm8 0h2v2h-2V7zm4 0h4v2h-4V7zm0 4h2v2h-2v-2zm0 4h4v2h-4v-2zm0-8h4v2h-4V7zm-4 0h2v2h-2V7zm0 8h2v2h-2v-2zm4 0h2v2h-2v-2zm4-12h2v2h-2V3zm0 4h2v2h-2V7zm0 4h2v2h-2v-2zm0 4h2v2h-2v-2zm0 4h2v2h-2v-2z"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Generate Button */}
            <button className={`w-full flex items-center justify-center gap-2 rounded-xl ${hardBorder} ${hardShadow} bg-violet-600 hover:bg-violet-500 py-4 text-[15px] font-bold text-white active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all`}>
              <Sparkles className="w-4 h-4" />
              {ctaButtonLabels[activeType]}
            </button>

            {/* QR Code Preview Box - Appears after generation (placeholder for now) */}
            {includeQr && (
              <div className={`mt-5 p-5 rounded-2xl bg-white ${hardBorder} ${hardShadow} text-center`}>
                <p className="text-[11px] uppercase tracking-wider font-bold text-neutral-500 mb-3">
                  QR Code Preview
                </p>
                <div className="inline-flex p-3 bg-white border-2 border-black rounded-xl shadow-[3px_3px_0_0_#111]">
                  <div className="w-[140px] h-[140px] bg-neutral-100 rounded-lg flex items-center justify-center">
                    <svg className="w-20 h-20 text-neutral-300" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3 11h2v2H3v-2zm0-4h2v2H3V7zm4 0h2v2H7V7zm0 4h2v2H7v-2zm0 4h2v2H7v-2zm-4 0h2v2H3v-2zm0-8h2v2H3V7zm8 0h2v2h-2V7zm4 0h4v2h-4V7zm0 4h2v2h-2v-2zm0 4h4v2h-4v-2zm0-8h4v2h-4V7zm-4 0h2v2h-2V7zm0 8h2v2h-2v-2zm4 0h2v2h-2v-2zm4-12h2v2h-2V3zm0 4h2v2h-2V7zm0 4h2v2h-2v-2zm0 4h2v2h-2v-2zm0 4h2v2h-2v-2z"/>
                    </svg>
                  </div>
                </div>
                <p className="text-[12px] text-neutral-500 mt-3 font-medium">
                  QR Code akan muncul setelah link berhasil dibuat
                </p>
                <button className="mt-3 text-[12px] font-bold text-violet-600 hover:underline">
                  ⬇️ Download QR Code (PNG)
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
