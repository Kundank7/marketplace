"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { LogOut, Users, ShoppingCart, CreditCard } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { logAdminAction } from "@/lib/logging"

export function AdminHeader() {
  const router = useRouter()
  const { toast } = useToast()

  const handleLogout = async () => {
    try {
      // Log admin logout action
      await logAdminAction({
        action: "logout",
        user: "admin",
        timestamp: new Date().toISOString(),
        details: "Admin logout",
      })

      // Clear admin session
      localStorage.removeItem("adminSession")

      toast({
        title: "Logged out",
        description: "You have been logged out of the admin panel.",
      })

      router.push("/admin-access")
    } catch (error) {
      console.error("Error logging out:", error)
    }
  }

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button variant="outline" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6 flex items-center">
            <Users className="h-8 w-8 mr-4 text-primary" />
            <div>
              <div className="text-sm text-muted-foreground">Total Users</div>
              <div className="text-2xl font-bold">124</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 flex items-center">
            <ShoppingCart className="h-8 w-8 mr-4 text-primary" />
            <div>
              <div className="text-sm text-muted-foreground">Pending Orders</div>
              <div className="text-2xl font-bold">18</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 flex items-center">
            <CreditCard className="h-8 w-8 mr-4 text-primary" />
            <div>
              <div className="text-sm text-muted-foreground">Pending Payments</div>
              <div className="text-2xl font-bold">7</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
