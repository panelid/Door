"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import { Link2, Copy, Check, Edit2, Save, RotateCcw, History, X, Lock, Unlock, Eye, Shield, ShieldOff } from "lucide-react"
import { useState, useEffect, useCallback, useRef } from "react"
import PasswordPromptModal from "./password-prompt-modal"

interface HistoryItem {
  id: string
  content: string
  created_at: string
}

interface PastePageProps {
  slug: string
  content: string
  hasPassword: boolean
  isOwner?: boolean  // Tambah prop untuk cek ownership
}

export default function PastePage({ slug, content, hasPassword, isOwner = false }: PastePageProps) {
  const [copied, setCopied] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(content)
  const [showHistory, setShowHistory] = useState(false)
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [currentContent, setCurrentContent] = useState(content)
  const [autoSaveStatus, setAutoSaveStatus] = useState<"saved" | "saving" | "error" | "idle">("idle")
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false)
  const [passwordInput, setPasswordInput] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [isPasswordVerified, setIsPasswordVerified] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [selectedHistory, setSelectedHistory] = useState<HistoryItem | null>(null)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [modalMode, setModalMode] = useState<"verify" | "add">("verify")
  const [isAddingPassword, setIsAddingPassword] = useState(false)
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout>()
  const verifiedPasswordRef = useRef<string>("")

  // Auto-save functionality via API
  useEffect(() => {
    if (!isEditing || editContent === currentContent) return

    setAutoSaveStatus("saving")

    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current)
    }

    autoSaveTimeoutRef.current = setTimeout(async () => {
      try {
        const res = await fetch("/api/paste/update", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            slug,
            content: editContent,
            password: verifiedPasswordRef.current || undefined,
          }),
        })

        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.error || "Failed to save")
        }

        setCurrentContent(editContent)
        setAutoSaveStatus("saved")
        setTimeout(() => setAutoSaveStatus("idle"), 2000)
      } catch (err) {
        console.error("Auto-save error:", err)
        setAutoSaveStatus("error")
        setTimeout(() => setAutoSaveStatus("idle"), 3000)
      }
    }, 1500)

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current)
      }
    }
  }, [editContent, isEditing, currentContent, slug])

  // Fetch history via API
  const fetchHistory = useCallback(async () => {
    try {
      const res = await fetch(`/api/paste/history?slug=${encodeURIComponent(slug)}`)
      if (!res.ok) throw new Error("Failed to fetch history")
      const data = await res.json()
      setHistory(data.history || [])
    } catch (err) {
      console.error("Error fetching history:", err)
    }
  }, [slug])

  const handleCopy = () => {
    navigator.clipboard.writeText(currentContent)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSave = async () => {
    try {
      setAutoSaveStatus("saving")
      const res = await fetch("/api/paste/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          content: editContent,
          password: verifiedPasswordRef.current || undefined,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to save")
      }

      setCurrentContent(editContent)
      setIsEditing(false)
      setAutoSaveStatus("saved")
      setTimeout(() => setAutoSaveStatus("idle"), 2000)
    } catch (err) {
      console.error("Save error:", err)
      setAutoSaveStatus("error")
    }
  }

  const handleRestore = async (historyItem: HistoryItem) => {
    try {
      const res = await fetch("/api/paste/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          content: historyItem.content,
          password: verifiedPasswordRef.current || undefined,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to restore")
      }

      setEditContent(historyItem.content)
      setCurrentContent(historyItem.content)
      setShowHistory(false)
      setSelectedHistory(null)
      fetchHistory()
    } catch (err) {
      console.error("Restore error:", err)
    }
  }

  const handleCancel = () => {
    setEditContent(currentContent)
    setIsEditing(false)
    setAutoSaveStatus("idle")
  }

  const handlePasswordSubmit = async () => {
    setIsVerifying(true)
    setPasswordError("")

    try {
      const res = await fetch("/api/paste/verify-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, password: passwordInput }),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        setIsPasswordVerified(true)
        verifiedPasswordRef.current = passwordInput
        setShowPasswordPrompt(false)
        setPasswordInput("")
        setIsEditing(true)
        fetchHistory()
      } else {
        setPasswordError(data.error || "Password salah!")
      }
    } catch (err) {
      setPasswordError("Terjadi kesalahan. Coba lagi.")
    } finally {
      setIsVerifying(false)
    }
  }

  const handleEditClick = () => {
    if (hasPassword && !isPasswordVerified) {
      setModalMode("verify")
      setShowPasswordModal(true)
    } else {
      setIsEditing(true)
      fetchHistory()
    }
  }

  const handleHistoryClick = () => {
    if (hasPassword && !isPasswordVerified) {
      setModalMode("verify")
      setShowPasswordModal(true)
    } else {
      setShowHistory(!showHistory)
      if (!showHistory) fetchHistory()
    }
  }

  const handleAddPasswordClick = () => {
    setModalMode("add")
    setShowPasswordModal(true)
  }

  const handlePasswordVerify = async (password: string) => {
    if (modalMode === "verify") {
      // Verify existing password
      const res = await fetch("/api/paste/verify-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, password }),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        verifiedPasswordRef.current = password
        setIsPasswordVerified(true)
        setShowPasswordModal(false)
        setIsEditing(true)
        fetchHistory()
      } else {
        throw new Error(data.error || "Password salah!")
      }
    } else {
      // Add new password to existing paste
      setIsAddingPassword(true)
      
      try {
        // First verify we can edit (no password currently)
        const verifyRes = await fetch("/api/paste/verify-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slug, password: "" }),
        })

        const verifyData = await verifyRes.json()

        if (verifyRes.ok && verifyData.success) {
          // Update paste with new password
          const updateRes = await fetch("/api/paste/update", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              slug,
              content: currentContent,
              password: password, // New password
            }),
          })

          if (updateRes.ok) {
            verifiedPasswordRef.current = password
            setIsPasswordVerified(true)
            setShowPasswordModal(false)
            alert("✅ Password berhasil ditambahkan ke paste ini!")
          } else {
            const updateData = await updateRes.json()
            throw new Error(updateData.error || "Gagal menambahkan password")
          }
        } else {
          throw new Error("Paste sudah dilindungi password. Gunakan mode verifikasi.")
        }
      } catch (err: any) {
        throw new Error(err.message || "Gagal menambahkan password")
      } finally {
        setIsAddingPassword(false)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/30">
      <header className="border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
        <div className="container flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground shadow-lg group-hover:shadow-xl transition-all">
              <Link2 className="h-6 w-6" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Door.id
            </span>
          </Link>
          <Button variant="ghost" asChild>
            <Link href="/">Home</Link>
          </Button>
        </div>
      </header>

      <main className="container py-8 px-4">
        <div className="mx-auto max-w-4xl">
          <Card className="shadow-2xl border-border/50 backdrop-blur">
            <CardHeader>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-2xl sm:text-3xl font-bold">door.id/{slug}</CardTitle>
                    {hasPassword ? (
                      <Lock className="h-4 w-4 text-muted-foreground" title="Dilindungi password" />
                    ) : (
                      <Unlock className="h-4 w-4 text-muted-foreground" title="Edit bebas" />
                    )}
                  </div>
                  {autoSaveStatus === "saving" && (
                    <p className="text-sm text-muted-foreground mt-1 animate-pulse">⏳ Menyimpan otomatis...</p>
                  )}
                  {autoSaveStatus === "saved" && (
                    <p className="text-sm text-green-600 dark:text-green-400 mt-1">✓ Tersimpan</p>
                  )}
                  {autoSaveStatus === "error" && (
                    <p className="text-sm text-red-600 dark:text-red-400 mt-1">✗ Gagal menyimpan</p>
                  )}
                </div>
                <div className="flex gap-2 flex-wrap sm:flex-nowrap">
                  {!isEditing ? (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleEditClick}
                        className="gap-2 shadow-sm hover:shadow-md transition-all"
                        title={hasPassword ? "Edit (perlu password)" : "Edit paste"}
                      >
                        <Edit2 className="h-4 w-4" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleHistoryClick}
                        className="gap-2 shadow-sm hover:shadow-md transition-all"
                        title="Lihat riwayat edit"
                      >
                        <History className="h-4 w-4" />
                        Riwayat
                      </Button>
                      {/* Set Password button REMOVED - Only available in dashboard during creation */}
                    </>
                  ) : null}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopy}
                    className="gap-2 shadow-sm hover:shadow-md transition-all"
                    title="Salin konten ke clipboard"
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4" />
                        Tersalin!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        Salin
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {isEditing ? (
                <div className="space-y-4">
                  <Textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    placeholder="Masukkan konten di sini..."
                    className="min-h-96 font-mono text-sm p-4 resize-vertical"
                    autoFocus
                  />
                  <div className="flex gap-2 flex-wrap">
                    <Button onClick={handleSave} className="gap-2">
                      <Save className="h-4 w-4" />
                      Simpan & Tutup
                    </Button>
                    <Button variant="outline" onClick={handleCancel} className="gap-2">
                      <X className="h-4 w-4" />
                      Batal
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowHistory(!showHistory)
                        if (!showHistory) fetchHistory()
                      }}
                      className="gap-2"
                    >
                      <History className="h-4 w-4" />
                      Riwayat
                    </Button>
                  </div>
                </div>
              ) : (
                <pre className="whitespace-pre-wrap break-words font-mono text-sm bg-muted/50 p-6 rounded-xl border border-border/50 leading-relaxed max-h-[600px] overflow-auto">
                  {currentContent}
                </pre>
              )}
            </CardContent>
          </Card>

          {/* Password Prompt Modal */}
          <PasswordPromptModal
            slug={slug}
            isOpen={showPasswordModal}
            onClose={() => setShowPasswordModal(false)}
            onVerify={handlePasswordVerify}
            title={modalMode === "verify" ? "Masukkan Password" : "🔒 Tambah Password"}
            description={
              modalMode === "verify" 
                ? "Paste ini dilindungi password. Masukkan password untuk mengedit."
                : "Tambahkan password untuk melindungi paste ini dari edit oleh orang lain."
            }
          />

          {/* History Panel */}
          {showHistory && (
            <Card className="shadow-2xl border-border/50 backdrop-blur mt-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <History className="h-5 w-5" />
                    Riwayat Edit
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setShowHistory(false)
                      setSelectedHistory(null)
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-[500px] overflow-y-auto">
                  {history.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">Belum ada riwayat perubahan</p>
                  ) : (
                    history.map((item, idx) => (
                      <div
                        key={item.id}
                        className={`p-4 border rounded-lg transition-colors cursor-pointer ${
                          selectedHistory?.id === item.id
                            ? "border-primary bg-primary/5"
                            : "border-border/50 hover:bg-muted/50"
                        }`}
                        onClick={() => setSelectedHistory(selectedHistory?.id === item.id ? null : item)}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">
                              Versi {history.length - idx}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(item.created_at).toLocaleString("id-ID", {
                                dateStyle: "medium",
                                timeStyle: "short",
                              })}
                            </p>
                            {selectedHistory?.id === item.id ? (
                              <pre className="text-sm mt-3 text-muted-foreground font-mono whitespace-pre-wrap break-words bg-muted/50 p-3 rounded-lg max-h-48 overflow-auto">
                                {item.content}
                              </pre>
                            ) : (
                              <p className="text-sm mt-2 text-muted-foreground line-clamp-2 font-mono">
                                {item.content.substring(0, 120)}
                                {item.content.length > 120 ? "..." : ""}
                              </p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                setSelectedHistory(selectedHistory?.id === item.id ? null : item)
                              }}
                              className="gap-1 whitespace-nowrap"
                            >
                              <Eye className="h-3 w-3" />
                              Lihat
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleRestore(item)
                              }}
                              className="gap-1 whitespace-nowrap"
                            >
                              <RotateCcw className="h-3 w-3" />
                              Kembalikan
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
