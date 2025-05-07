"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { OrdersTable } from "@/components/orders-table"
import { PaymentsTable } from "@/components/payments-table"
import { getOrders } from "@/lib/orders"
import { getPayments } from "@/lib/payments"
import type { Order, Payment } from "@/lib/types"
import { useSession } from "@/lib/session"

export function DashboardTabs() {
  const [orders, setOrders] = useState<Order[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const { session } = useSession()

  useEffect(() => {
    async function loadData() {
      if (!session) return

      try {
        const userOrders = await getOrders()
        const userPayments = await getPayments()

        setOrders(userOrders)
        setPayments(userPayments)
      } catch (error) {
        console.error("Failed to load dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [session])

  if (loading) {
    return <div>Loading dashboard data...</div>
  }

  return (
    <Tabs defaultValue="orders">
      <TabsList className="grid w-full max-w-md grid-cols-2">
        <TabsTrigger value="orders">Orders</TabsTrigger>
        <TabsTrigger value="payments">Payments</TabsTrigger>
      </TabsList>

      <TabsContent value="orders" className="mt-6">
        <OrdersTable orders={orders} />
      </TabsContent>

      <TabsContent value="payments" className="mt-6">
        <PaymentsTable payments={payments} />
      </TabsContent>
    </Tabs>
  )
}
