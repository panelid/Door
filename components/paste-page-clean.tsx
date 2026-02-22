"use client"

import { useEffect, useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Shield, History, Edit, Copy, Check, Eye, EyeOff, Trash2, X, AlertCircle } from "lucide-react"
import PasswordPromptModal from "./password-prompt-modal"
import HistoryDrawer from "./history-drawer"

type HistoryItem = {
  id: string
  content: string
  created_at: string
}

type PastePageProps = {
  slug: string
  content: string
  hasPassword: boolean
  type?: string
}

export default function PastePage({ slug, content, hasPassword, type = "paste" }: PastePageProps) {
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
            password: verifiedPasswordRef.current,
          }),
        })

        if (!res.ok) {
          const error = await res.text()
          throw new Error(error)
        }

        const result = await res.json()
        setCurrentContent(editContent)
        setAutoSaveStatus("saved")
      } catch (err) {
        console.error("Auto-save error:", err)
        setAutoSaveStatus("error")
      }
    }, 1000)

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current)
      }
    }
  }, [editContent, isEditing, slug, currentContent])

  const fetchHistory = async () => {
    try {
      const res = await fetch(`/api/paste/history/${slug}`)
      if (!res.ok) throw new Error("Failed to fetch history")
      const data = await res.json()
      setHistory(data.history || [])
    } catch (err) {
      console.error("History fetch error:", err)
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
    setIsVerifying(true)
    setPasswordError("")

    try {
      const res = await fetch("/api/paste/verify-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, password }),
      })

      if (!res.ok) {
        const error = await res.text()
        throw new Error(error)
      }

      const result = await res.json()

      if (result.success) {
        setIsPasswordVerified(true)
        verifiedPasswordRef.current = password
        setShowPasswordModal(false)
        if (modalMode === "verify") {
          setIsEditing(true)
          fetchHistory()
        }
      } else {
        setPasswordError("Password salah. Coba lagi.")
      }
    } catch (err: any) {
      setPasswordError(err.message || "Verifikasi gagal. Coba lagi.")
    } finally {
      setIsVerifying(false)
    }
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditContent(currentContent)
    setAutoSaveStatus("idle")
  }

  const [copied, setCopied] = useState(false)
  const handleCopy = () => {
    navigator.clipboard.writeText(currentContent)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDelete = async () => {
    if (!confirm("Yakin ingin menghapus paste ini?")) return

    try {
      const res = await fetch(`/api/paste/delete/${slug}`, {
        method: "DELETE",
      })

      if (!res.ok) throw new Error("Delete failed")

      // Redirect to home after successful deletion
      window.location.href = "/"
    } catch (err) {
      console.error("Delete error:", err)
      alert("Gagal menghapus paste. Coba lagi.")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/30">
      <PasswordPromptModal
        slug={slug}
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onVerify={handlePasswordVerify}
        title={modalMode === "verify" ? "Masukkan Password" : "Tambahkan Password"}
        description={modalMode === "verify" ? "Paste ini dilindungi password. Masukkan password untuk mengedit." : "Tambahkan password untuk melindungi paste ini dari edit oleh orang lain."}
      />

      <HistoryDrawer
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        history={history}
        selectedHistory={selectedHistory}
        onSelectHistory={(item) => {
          setSelectedHistory(item)
          setEditContent(item.content)
        }}
      />

      <div className="container max-w-4xl py-8 px-4">
        <Card className="shadow-2xl border-border/50 backdrop-blur bg-gradient-to-b from-background to-secondary/20">
          <CardHeader className="border-b border-border/40">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-foreground truncate">door.id/{slug}</h1>
                  {hasPassword && (
                    <Badge variant="outline" className="gap-1.5 border-primary/30 text-primary bg-primary/10">
                      <Shield className="h-3.5 w-3.5" />
                      Dilindungi
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  Paste dibuat pada {new Date().toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {isEditing ? (
                  <div className="flex items-center gap-2">
                    {autoSaveStatus === "saving" && (
                      <span className="text-xs text-yellow-600">
                        Menyimpan...
                      </span>
                    )}
                    {autoSaveStatus === "saved" && (
                      <span className="text-xs text-green-600">
                        Tersimpan
                      </span>
                    )}
                    {autoSaveStatus === "error" && (
                      <span className="text-xs text-red-600">
                        Gagal menyimpan
                      </span>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancelEdit}
                      className="gap-2"
                    >
                      <X className="h-4 w-4" />
                      Batal Edit
                    </Button>
                  </div>
                ) : (
                  <>
                    {hasPassword ? null : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleEditClick}
                        className="gap-2 shadow-sm hover:shadow-md transition-all"
                      >
                        <Edit className="h-4 w-4" />
                        Edit
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleHistoryClick}
                      className="gap-2 shadow-sm hover:shadow-md transition-all"
                    >
                      <History className="h-4 w-4" />
                      Riwayat
                    </Button>
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
                  </>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium">Konten</h2>
                {!isEditing && hasPassword && !isPasswordVerified && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setModalMode("verify")
                      setShowPasswordModal(true)
                    }}
                    className="gap-2"
                  >
                    <Shield className="h-4 w-4" />
                    Edit (Butuh Password)
                  </Button>
                )}
              </div>
              {isEditing ? (
                <div className="space-y-4">
                  <Textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="min-h-[300px] font-mono text-sm"
                    placeholder="Edit paste Anda di sini..."
                  />
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    {autoSaveStatus === "saving" && (
                      <>
                        <div className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Menyimpan...
                      </>
                    )}
                    {autoSaveStatus === "saved" && (
                      <>
                        <Check className="h-3 w-3 text-green-500" />
                        Tersimpan
                      </>
                    )}
                    {autoSaveStatus === "error" && (
                      <>
                        <AlertCircle className="h-3 w-3 text-red-500" />
                        Gagal menyimpan
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <pre className="p-4 bg-muted/50 rounded-lg border text-sm font-mono whitespace-pre-wrap break-words">
                  {selectedHistory ? selectedHistory.content : currentContent}
                </pre>
              )}
            </div>

            {!isEditing && selectedHistory && (
              <Alert>
                <AlertDescription className="text-sm">
                  Anda sedang melihat versi lama dari {new Date(selectedHistory.created_at).toLocaleString("id-ID")}.
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => setSelectedHistory(null)}
                    className="ml-2 px-0"
                  >
                    Kembali ke versi terbaru
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            {!isEditing && !selectedHistory && !hasPassword && (
              <Alert>
                <AlertDescription className="text-sm flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  <span>
                    <strong>Siapa saja bisa mengedit</strong> paste ini karena tidak dilindungi password.
                    Untuk melindunginya, klik Edit lalu password akan diminta.
                  </span>
                </AlertDescription>
              </Alert>
            )}

            {!isEditing && isPasswordVerified && (
              <Alert variant="success">
                <AlertDescription className="text-sm">
                  ✅ Password terverifikasi. Anda bisa mengedit paste ini.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}