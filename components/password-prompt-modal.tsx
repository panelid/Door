"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Lock, X, Eye, EyeOff } from "lucide-react"

interface PasswordPromptModalProps {
  slug: string
  isOpen: boolean
  onClose: () => void
  onVerify: (password: string) => Promise<void>
  title?: string
  description?: string
}

export default function PasswordPromptModal({
  slug,
  isOpen,
  onClose,
  onVerify,
  title = "Masukkan Password",
  description = "Paste ini dilindungi password. Masukkan password untuk mengedit."
}: PasswordPromptModalProps) {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [mode, setMode] = useState<"verify" | "add">("verify")

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    if (mode === "add") {
      // Add password mode
      if (!password.trim()) {
        setError("Password tidak boleh kosong")
        return
      }
      
      if (password !== confirmPassword) {
        setError("Password dan konfirmasi tidak cocok")
        return
      }
      
      if (password.length < 4) {
        setError("Password minimal 4 karakter")
        return
      }
    } else {
      // Verify mode
      if (!password.trim()) {
        setError("Silakan masukkan password")
        return
      }
    }
    
    setLoading(true)
    
    try {
      await onVerify(password)
      // Reset form jika berhasil
      setPassword("")
      setConfirmPassword("")
      setMode("verify")
    } catch (err: any) {
      setError(err.message || "Verifikasi gagal. Coba lagi.")
    } finally {
      setLoading(false)
    }
  }

  const handleAddPassword = () => {
    setMode("add")
    setPassword("")
    setConfirmPassword("")
    setError("")
  }

  const handleBackToVerify = () => {
    setMode("verify")
    setPassword("")
    setConfirmPassword("")
    setError("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose()
    }
  }

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200"
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div 
        className="absolute inset-0" 
        onClick={onClose}
        aria-hidden="true"
      />
      
      <Card className="w-full max-w-md shadow-2xl border-border/70 bg-background/95 backdrop-blur-sm animate-in slide-in-from-bottom-4 duration-300">
        <CardHeader className="pb-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/10">
                <Lock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl">
                  {mode === "verify" ? title : "🔒 Tambah Password"}
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {mode === "verify" ? description : "Tambahkan password untuk melindungi paste ini"}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 rounded-full hover:bg-muted"
              aria-label="Tutup modal"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === "add" && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg mb-4">
                <p className="text-sm text-blue-700">
                  📝 Anda akan menambahkan password ke paste: <strong>door.id/{slug}</strong>
                  <br />
                  Setelah password ditambahkan, hanya orang yang tahu password yang bisa mengedit.
                </p>
              </div>
            )}
            
            <div className="space-y-3">
              <Label htmlFor="password-input" className="text-sm font-medium">
                {mode === "verify" ? "Password" : "Password Baru"}
              </Label>
              <div className="relative">
                <Input
                  id="password-input"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setError("")
                  }}
                  placeholder={mode === "verify" ? "Masukkan password..." : "Masukkan password baru..."}
                  className="pr-10 text-base"
                  autoFocus
                  aria-describedby={error ? "password-error" : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {mode === "add" && (
              <div className="space-y-3">
                <Label htmlFor="confirm-password-input" className="text-sm font-medium">
                  Konfirmasi Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirm-password-input"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value)
                      setError("")
                    }}
                    placeholder="Konfirmasi password baru..."
                    className="pr-10 text-base"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label={showConfirmPassword ? "Sembunyikan password" : "Tampilkan password"}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg" id="password-error">
                <p className="text-sm text-red-700 flex items-center gap-2">
                  <Lock className="h-3 w-3" />
                  {error}
                </p>
              </div>
            )}

            <div className="flex flex-col gap-3 pt-2">
              <Button
                type="submit"
                disabled={loading}
                className="h-11 text-base font-medium gap-2 shadow-md hover:shadow-lg transition-all"
              >
                {loading ? (
                  <>
                    <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    {mode === "verify" ? "Memverifikasi..." : "Menambahkan..."}
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4" />
                    {mode === "verify" ? "Verifikasi & Edit" : "Tambahkan Password"}
                  </>
                )}
              </Button>

              {mode === "verify" ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddPassword}
                  className="h-10 text-sm gap-2"
                >
                  <Lock className="h-3 w-3" />
                  Tambah Password ke Paste Ini
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBackToVerify}
                  className="h-10 text-sm"
                >
                  Kembali ke Verifikasi
                </Button>
              )}

              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                className="h-9 text-sm"
              >
                Batal
              </Button>
            </div>

            <div className="text-xs text-muted-foreground pt-2 border-t">
              <p>
                {mode === "verify" ? (
                  <>
                    🔐 <strong>Paste ini dilindungi password.</strong> Hanya orang yang tahu password yang bisa mengedit atau menghapus.
                    <br />
                    💡 <em>Lupa password? Paste tidak bisa diedit tanpa password yang benar.</em>
                  </>
                ) : (
                  <>
                    🛡️ <strong>Password akan melindungi paste ini dari edit oleh orang lain.</strong>
                    <br />
                    📝 Anda masih bisa edit kapan saja dengan password ini.
                  </>
                )}
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}