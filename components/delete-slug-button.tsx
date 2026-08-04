"use client"

import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export function DeleteSlugButton({ slugId }: { slugId: string }) {
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    setIsDeleting(true)
    const supabase = createClient()

    try {
      const { error } = await supabase.from("slugs").delete().eq("id", slugId)

      if (error) throw error

      router.refresh()
    } catch (error) {
      console.error("Error deleting slug:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm" className="h-7 w-7 p-0">
          <Trash2 className="h-3.5 w-3.5 text-white" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-white text-black border-2 border-black">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-black font-bold">Yakin hapus link ini?</AlertDialogTitle>
          <AlertDialogDescription className="text-neutral-700">
            Tindakan ini tidak dapat dibatalkan. Link akan dihapus permanen dan tidak bisa diakses lagi.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-neutral-100 text-black border-2 border-black hover:bg-neutral-200">Batal</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-red-600 text-white border-2 border-black hover:bg-red-700">
            {isDeleting ? "Menghapus..." : "Hapus"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}