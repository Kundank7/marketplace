"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminHeader } from "@/components/admin-header"
import { AdminOrders } from "@/components/admin-orders"
import { AdminPayments } from "@/components/admin-payments"
import { AdminServices } from "@/components/admin-services"
import { AdminLogs } from "@/components/admin-logs"
import { useToast } from "@/components/ui/use-toast"

export default function AdminDashboardPage() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Check if user is admin
    const adminSession = localStorage.getItem("adminSession")
    if (!adminSession) {
      toast({
        title: "Access denied",
        description: "You must be logged in as an admin to view this page.",
        variant: "destructive",
      })
      router.push("/admin-access")
      return
    }

    try {
      const session = JSON.parse(adminSession)
      if (!session.isAdmin) {
        router.push("/admin-access")
      } else {
        setIsAdmin(true)
      }
    } catch (error) {
      localStorage.removeItem("adminSession")
      router.push("/admin-access")
    }
  }, [router, toast])

  // Show nothing while checking admin status
  if (isAdmin === null) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <AdminHeader />

      <Tabs defaultValue="orders" className="mt-6">
        <TabsList className="grid grid-cols-4 w-full max-w-3xl">
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="logs">Action Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="mt-6">
          <AdminOrders />
        </TabsContent>

        <TabsContent value="payments" className="mt-6">
          <AdminPayments />
        </TabsContent>

        <TabsContent value="services" className="mt-6">
          <AdminServices />
        </TabsContent>

        <TabsContent value="logs" className="mt-6">
          <AdminLogs />
        </TabsContent>
      </Tabs>
    </div>
  )
}
