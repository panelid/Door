import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Link2, Plus, Settings, Globe } from "lucide-react"
import CustomDomainsSettings from "@/components/custom-domains-settings"

export default async function SettingsPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect("/auth/login")
  }

  const hardBorder = "border-[2.5px] border-black"
  const hardShadow = "shadow-[3px_3px_0_0_#111]"

  return (
    <div className="min-h-screen bg-[#F5F2EC] text-neutral-900 pb-20">
      
      {/* Top Header */}
      <header className={`sticky top-0 z-50 bg-[#F5F2EC] border-b-[3px] border-black`}>
        <div className="max-w-5xl mx-auto flex h-14 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-lg bg-violet-600 ${hardBorder} flex items-center justify-center text-white text-sm font-black shadow-[2px_2px_0_0_#111]`}>
              D
            </div>
            <span className="font-black text-lg hidden sm:block">Door.id</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <Link href="/dashboard">
              <Button variant="outline" size="sm" className={`bg-white ${hardBorder} ${hardShadow} font-bold active:translate-x-0.5 active:translate-y-0.5 active:shadow-none`}>
                <Link2 className="w-4 h-4 mr-2" />
                Links
              </Button>
            </Link>
            <Button variant="outline" size="sm" className={`bg-amber-400 ${hardBorder} ${hardShadow} font-bold active:translate-x-0.5 active:translate-y-0.5 active:shadow-none border-amber-500 text-amber-900`}>
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-8 space-y-8">
        
        {/* Page Title */}
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl bg-violet-600 ${hardBorder} flex items-center justify-center text-white shadow-[2px_2px_0_0_#111]`}>
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight">Account Settings</h1>
            <p className="text-neutral-600 font-medium">Manage your profile and custom domain configurations</p>
          </div>
        </div>

        {/* Custom Domains Section */}
        <section>
          <CustomDomainsSettings />
        </section>

      </div>
    </div>
  )
}
