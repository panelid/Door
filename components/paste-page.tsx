"use client"

import { useEffect, useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Shield, History, Edit, Copy, Check, Eye, EyeOff, Trash2, X, AlertCircle, Save, RotateCcw, SaveIcon } from "lucide-react"
import PasswordPromptModal from "./password-prompt-modal"

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
  const [requestedAction, setRequestedAction] = useState<"edit" | "history">("edit")
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout>()
  const verifiedPasswordRef = useRef<string>("")
  const [showExitConfirm, setShowExitConfirm] = useState(false)

  // Check localStorage for password verification on mount
  useEffect(() => {
    if (hasPassword && !isPasswordVerified) {
      const storedVerified = localStorage.getItem(`door-paste-${slug}-verified`)
      const verifiedAt = localStorage.getItem(`door-paste-${slug}-verified-at`)
      
      if (storedVerified === 'true' && verifiedAt) {
        const hourAgo = Date.now() - (60 * 60 * 1000) // 1 hour
        if (parseInt(verifiedAt) > hourAgo) {
          setIsPasswordVerified(true)
        }
      }
    }
  }, [slug, hasPassword])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isEditing && e.ctrlKey && e.key === 's') {
        e.preventDefault()
        handleSaveAndExit()
      }
      if (isEditing && e.key === 'Escape') {
        e.preventDefault()
        handleCancelEdit()
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isEditing])

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
      const res = await fetch(`/api/paste/history?slug=${slug}`)
      if (!res.ok) throw new Error("Failed to fetch history")
      const data = await res.json()
      setHistory(data.history || [])
    } catch (err) {
      console.error("History fetch error:", err)
    }
  }

  const handleEditClick = () => {
    if (hasPassword && !isPasswordVerified) {
      setRequestedAction("edit")
      setShowPasswordModal(true)
    } else {
      setIsEditing(true)
      fetchHistory()
    }
  }

  const handleHistoryClick = () => {
    if (hasPassword && !isPasswordVerified) {
      setRequestedAction("history")
      setShowPasswordModal(true)
    } else {
      setShowHistory(!showHistory)
      if (!showHistory) fetchHistory()
    }
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
        
        // Save verification in localStorage (valid for 1 hour)
        localStorage.setItem(`door-paste-${slug}-verified`, 'true')
        localStorage.setItem(`door-paste-${slug}-verified-at`, Date.now().toString())
        
        // Execute the requested action
        if (requestedAction === "edit") {
          setIsEditing(true)
          fetchHistory()
        } else if (requestedAction === "history") {
          setShowHistory(true)
          fetchHistory()
        }
        // Reset requested action to default
        setRequestedAction("edit")
      } else {
        setPasswordError("Password salah. Coba lagi.")
      }
    } catch (err: any) {
      setPasswordError(err.message || "Verifikasi gagal. Coba lagi.")
    } finally {
      setIsVerifying(false)
    }
  }

  const handleSaveAndExit = async () => {
    try {
      setAutoSaveStatus("saving")
      
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
      setIsEditing(false)
      
      // Update history after save
      fetchHistory()
    } catch (err) {
      console.error("Save error:", err)
      setAutoSaveStatus("error")
    }
  }

  const handleCancelEdit = () => {
    if (editContent !== currentContent && !confirm("Edit Anda belum disimpan. Yakin ingin keluar?")) {
      return
    }
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
        title="Masukkan Password"
        description="Paste ini dilindungi password. Masukkan password untuk mengedit."
      />

      <div className="container max-w-4xl py-8 px-4">
        <Card className="shadow-2xl border-border/50 backdrop-blur bg-gradient-to-b from-background to-secondary/20">
          <CardHeader className="border-b border-border/40">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-foreground truncate">door.id/{slug}</h1>
                  {hasPassword && (
                    <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 px-2.5 py-0.5 text-xs font-semibold text-primary bg-primary/10">
                      <Shield className="h-3.5 w-3.5" />
                      Dilindungi
                    </div>
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
                      <div className="flex items-center gap-2 animate-pulse">
                        <div className="h-3 w-3 rounded-full bg-blue-500 animate-ping" />
                        <span className="text-xs text-blue-600 font-medium">
                          Menyimpan...
                        </span>
                      </div>
                    )}
                    {autoSaveStatus === "saved" && (
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500 animate-bounce" />
                        <span className="text-xs text-green-600 font-medium">
                          Tersimpan!
                        </span>
                      </div>
                    )}
                    {autoSaveStatus === "error" && (
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-red-500" />
                        <span className="text-xs text-red-600 font-medium">
                          Gagal menyimpan
                        </span>
                      </div>
                    )}
                    <Button
                      variant="default"
                      size="sm"
                      onClick={handleSaveAndExit}
                      className="gap-2 bg-green-600 hover:bg-green-700"
                      disabled={autoSaveStatus === "saving"}
                    >
                      <Save className="h-4 w-4" />
                      Simpan & Keluar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancelEdit}
                      className="gap-2"
                    >
                      <X className="h-4 w-4" />
                      Batal
                    </Button>
                  </div>
                ) : (
                  <>
                    {hasPassword ? (
                      isPasswordVerified ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleEditClick}
                          className="gap-2 shadow-sm hover:shadow-md transition-all"
                        >
                          <Edit className="h-4 w-4" />
                          Edit
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setRequestedAction("edit")
                            setShowPasswordModal(true)
                          }}
                          className="gap-2 shadow-sm hover:shadow-md transition-all"
                        >
                          <Shield className="h-4 w-4" />
                          Edit (Butuh Password)
                        </Button>
                      )
                    ) : (
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
                    onClick={() => setShowPasswordModal(true)}
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
                  <div className="flex items-center gap-3 text-sm">
                    {autoSaveStatus === "saving" && (
                      <div className="flex items-center gap-2 animate-pulse text-blue-600">
                        <div className="h-3 w-3 rounded-full bg-blue-500 animate-ping" />
                        <span className="font-medium">Menyimpan...</span>
                      </div>
                    )}
                    {autoSaveStatus === "saved" && (
                      <div className="flex items-center gap-2 text-green-600">
                        <Check className="h-4 w-4 text-green-500 animate-bounce" />
                        <span className="font-medium">Tersimpan!</span>
                      </div>
                    )}
                    {autoSaveStatus === "error" && (
                      <div className="flex items-center gap-2 text-red-600">
                        <AlertCircle className="h-4 w-4 text-red-500" />
                        <span className="font-medium">Gagal menyimpan</span>
                      </div>
                    )}
                    {autoSaveStatus === "idle" && editContent !== currentContent && (
                      <div className="flex items-center gap-2 text-amber-600">
                        <div className="h-3 w-3 rounded-full bg-amber-500" />
                        <span className="font-medium">Belum disimpan</span>
                      </div>
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
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-700">
                  Anda sedang melihat versi lama dari {new Date(selectedHistory.created_at).toLocaleString("id-ID")}.
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => setSelectedHistory(null)}
                    className="ml-2 px-0"
                  >
                    Kembali ke versi terbaru
                  </Button>
                </p>
              </div>
            )}

            {showHistory && history.length > 0 && (
              <div className="mt-4 p-4 border rounded-lg bg-muted/50">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-lg">📜 Riwayat Edit</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowHistory(false)}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {history.map((item) => (
                    <div 
                      key={item.id} 
                      className={`p-3 border rounded hover:bg-accent transition-colors ${selectedHistory?.id === item.id ? 'bg-blue-50 border-blue-300' : ''}`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-sm font-medium">
                            {new Date(item.created_at).toLocaleString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {item.content.length > 100 ? item.content.substring(0, 100) + '...' : item.content}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedHistory(item)}
                            className="h-7 text-xs"
                          >
                            Lihat
                          </Button>
                          {selectedHistory?.id === item.id && (
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => {
                                // Restore this version
                                setEditContent(item.content)
                                setCurrentContent(item.content)
                                setSelectedHistory(null)
                              }}
                              className="h-7 text-xs bg-green-600 hover:bg-green-700"
                            >
                              Pulihkan
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t text-sm text-muted-foreground">
                  Total {history.length} versi tersimpan
                </div>
              </div>
            )}

            {!isEditing && !selectedHistory && !hasPassword && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-700 flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  <span>
                    <strong>Siapa saja bisa mengedit</strong> paste ini karena tidak dilindungi password.
                    Untuk melindunginya, klik Edit lalu password akan diminta.
                  </span>
                </p>
              </div>
            )}

            {!isEditing && isPasswordVerified && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-700">
                  ✅ Password terverifikasi. Anda bisa mengedit paste ini.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}