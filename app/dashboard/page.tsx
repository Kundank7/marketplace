export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <DashboardClient />
    </div>
  )
}
// Create a client component that will handle the session check
;("use client")

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardTabs } from "@/components/dashboard-tabs"
import { DashboardSkeleton } from "@/components/dashboard-skeleton"
import { useSession } from "@/lib/session"

function DashboardClient() {
  const { session } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (!session) {
      router.push("/login")
    }
  }, [session, router])

  if (!session) {
    return <DashboardSkeleton />
  }

  return (
    <>
      <DashboardHeader />
      <DashboardTabs />
    </>
  )
}
