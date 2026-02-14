"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import { Link2, Copy, Check, Edit2, Save, RotateCcw, History, X } from "lucide-react"
import { useState, useEffect, useCallback, useRef } from "react"
import { createClient } from "@/lib/supabase/client"

interface HistoryItem {
  id: string
  content: string
  created_at: string
  version: number
}

interface PastePageProps {
  slug: string
  content: string
  pastePassword?: string | null
}

export default function PastePage({ slug, content, pastePassword }: PastePageProps) {
  const [copied, setCopied] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(content)
  const [isSaving, setIsSaving] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [currentContent, setCurrentContent] = useState(content)
  const [isOwner, setIsOwner] = useState(false)
  const [autoSaveStatus, setAutoSaveStatus] = useState<"saved" | "saving" | "idle">("idle")
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false)
  const [passwordInput, setPasswordInput] = useState("")
  const [isPasswordVerified, setIsPasswordVerified] = useState(!pastePassword)
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout>()

  const supabase = createClient()

  // Check if user is owner (has edit token in URL or local storage)
  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("edit")
    if (token) {
      localStorage.setItem(`edit_${slug}`, token)
      setIsOwner(true)
    } else {
      const savedToken = localStorage.getItem(`edit_${slug}`)
      if (savedToken) {
        setIsOwner(true)
      }
    }
  }, [slug])

  // Auto-save functionality
  useEffect(() => {
    if (!isEditing || editContent === currentContent) return

    setAutoSaveStatus("saving")

    // Clear previous timeout
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current)
    }

    // Set new timeout for auto-save
    autoSaveTimeoutRef.current = setTimeout(async () => {
      try {
        // Get slug ID first
        const { data: slugData, error: slugError } = await supabase
          .from("slugs")
          .select("id")
          .eq("slug", slug)
          .maybeSingle()

        if (slugError || !slugData) throw slugError

        // Save to database
        const { error } = await supabase
          .from("slugs")
          .update({
            data: { content: editContent },
            updated_at: new Date().toISOString(),
          })
          .eq("slug", slug)

        if (error) throw error

        // Save to history with slug_id
        await supabase.from("paste_history").insert({
          slug_id: slugData.id,
          content: editContent,
        })

        setCurrentContent(editContent)
        setAutoSaveStatus("saved")
        setTimeout(() => setAutoSaveStatus("idle"), 2000)
      } catch (err) {
        console.error("Auto-save error:", err)
        setAutoSaveStatus("idle")
      }
    }, 1500) // Save after 1.5 seconds of inactivity

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current)
      }
    }
  }, [editContent, isEditing, currentContent, slug, supabase])

  // Fetch history
  const fetchHistory = useCallback(async () => {
    try {
      // First get the slug ID
      const { data: slugData, error: slugError } = await supabase
        .from("slugs")
        .select("id")
        .eq("slug", slug)
        .maybeSingle()

      if (slugError || !slugData) {
        console.error("Error fetching slug:", slugError)
        return
      }

      // Then fetch history using slug_id
      const { data, error } = await supabase
        .from("paste_history")
        .select("*")
        .eq("slug_id", slugData.id)
        .order("created_at", { ascending: false })
        .limit(10)

      if (error) throw error
      setHistory(data || [])
    } catch (err) {
      console.error("Error fetching history:", err)
    }
  }, [slug, supabase])

  const handleCopy = () => {
    navigator.clipboard.writeText(currentContent)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // Get slug ID first
      const { data: slugData, error: slugError } = await supabase
        .from("slugs")
        .select("id")
        .eq("slug", slug)
        .maybeSingle()

      if (slugError || !slugData) throw slugError

      const { error } = await supabase
        .from("slugs")
        .update({
          data: { content: editContent },
          updated_at: new Date().toISOString(),
        })
        .eq("slug", slug)

      if (error) throw error

      // Save to history with slug_id
      await supabase.from("paste_history").insert({
        slug_id: slugData.id,
        content: editContent,
      })

      setCurrentContent(editContent)
      setIsEditing(false)
      setAutoSaveStatus("saved")
      setTimeout(() => setAutoSaveStatus("idle"), 2000)
    } catch (err) {
      console.error("Save error:", err)
    } finally {
      setIsSaving(false)
    }
  }

  const handleRestore = async (historyItem: HistoryItem) => {
    setEditContent(historyItem.content)
    setCurrentContent(historyItem.content)
    setShowHistory(false)

    try {
      // Get slug ID first
      const { data: slugData, error: slugError } = await supabase
        .from("slugs")
        .select("id")
        .eq("slug", slug)
        .maybeSingle()

      if (slugError || !slugData) throw slugError

      const { error } = await supabase
        .from("slugs")
        .update({
          data: { content: historyItem.content },
          updated_at: new Date().toISOString(),
        })
        .eq("slug", slug)

      if (error) throw error

      await supabase.from("paste_history").insert({
        slug_id: slugData.id,
        content: historyItem.content,
      })
    } catch (err) {
      console.error("Restore error:", err)
    }
  }

  const handleCancel = () => {
    setEditContent(currentContent)
    setIsEditing(false)
  }

  const handlePasswordSubmit = () => {
    if (passwordInput === pastePassword) {
      setIsPasswordVerified(true)
      setShowPasswordPrompt(false)
      setPasswordInput("")
      setIsEditing(true)
      fetchHistory()
    } else {
      alert("Password salah!")
      setPasswordInput("")
    }
  }

  const handleEditClick = () => {
    if (pastePassword && !isPasswordVerified) {
      setShowPasswordPrompt(true)
    } else {
      setIsEditing(true)
      fetchHistory()
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
                  <CardTitle className="text-2xl sm:text-3xl font-bold">door.id/{slug}</CardTitle>
                  {autoSaveStatus === "saving" && (
                    <p className="text-sm text-muted-foreground mt-1">Menyimpan otomatis...</p>
                  )}
                  {autoSaveStatus === "saved" && (
                    <p className="text-sm text-green-600 dark:text-green-400 mt-1">✓ Tersimpan</p>
                  )}
                </div>
                <div className="flex gap-2 flex-wrap sm:flex-nowrap">
                  {(isOwner || isPasswordVerified || !pastePassword) && (
                    <>
                      {!isEditing ? (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleEditClick}
                            className="gap-2 shadow-sm hover:shadow-md transition-all"
                          >
                            <Edit2 className="h-4 w-4" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setShowHistory(!showHistory)
                              if (!showHistory) fetchHistory()
                            }}
                            className="gap-2 shadow-sm hover:shadow-md transition-all"
                          >
                            <History className="h-4 w-4" />
                            Riwayat
                          </Button>
                        </>
                      ) : null}
                    </>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopy}
                    className="gap-2 shadow-sm hover:shadow-md transition-all"
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
                  />
                  <div className="flex gap-2 flex-wrap">
                    <Button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="gap-2"
                    >
                      <Save className="h-4 w-4" />
                      {isSaving ? "Menyimpan..." : "Simpan"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleCancel}
                      className="gap-2"
                    >
                      <X className="h-4 w-4" />
                      Batal
                    </Button>
                  </div>
                </div>
              ) : (
                <pre className="whitespace-pre-wrap break-words font-mono text-sm bg-muted/50 p-6 rounded-xl border border-border/50 leading-relaxed max-h-96 overflow-auto">
                  {currentContent}
                </pre>
              )}
            </CardContent>
          </Card>

          {/* Password Prompt Modal */}
          {showPasswordPrompt && (
            <Card className="shadow-2xl border-border/50 backdrop-blur mt-6">
              <CardHeader>
                <CardTitle>Masukkan Password</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Paste ini dilindungi dengan password. Masukkan password untuk mengedit.
                </p>
                <div className="space-y-2">
                  <input
                    type="password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        handlePasswordSubmit()
                      }
                    }}
                    placeholder="Masukkan password..."
                    className="w-full px-4 py-2 border border-border/50 rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    autoFocus
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handlePasswordSubmit}
                    className="gap-2"
                  >
                    Verifikasi
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowPasswordPrompt(false)
                      setPasswordInput("")
                    }}
                    className="gap-2"
                  >
                    Batal
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* History Modal */}
          {showHistory && (
            <Card className="shadow-2xl border-border/50 backdrop-blur mt-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Riwayat Edit</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowHistory(false)}
                    className="gap-2"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {history.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">Belum ada riwayat</p>
                  ) : (
                    history.map((item, idx) => (
                      <div
                        key={item.id}
                        className="p-4 border border-border/50 rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">
                              Versi {history.length - idx}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(item.created_at).toLocaleString("id-ID")}
                            </p>
                            <p className="text-sm mt-2 text-muted-foreground line-clamp-2 font-mono">
                              {item.content.substring(0, 100)}
                              {item.content.length > 100 ? "..." : ""}
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRestore(item)}
                            className="gap-2 whitespace-nowrap"
                          >
                            <RotateCcw className="h-4 w-4" />
                            Kembalikan
                          </Button>
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
