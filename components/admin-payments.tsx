"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Payment } from "@/lib/types"
import { MoreHorizontal, CreditCard, Eye } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { getAdminPayments, updatePaymentStatus } from "@/lib/admin"
import { useToast } from "@/components/ui/use-toast"
import { logAdminAction } from "@/lib/logging"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export function AdminPayments() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    async function loadPayments() {
      try {
        const allPayments = await getAdminPayments()
        setPayments(allPayments)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load payments. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadPayments()
  }, [toast])

  const handleStatusUpdate = async (paymentId: string, newStatus: string) => {
    try {
      await updatePaymentStatus(paymentId, newStatus)

      // Log admin action
      await logAdminAction({
        action: "update_payment_status",
        user: "admin",
        timestamp: new Date().toISOString(),
        details: `Updated payment ${paymentId} status to ${newStatus}`,
        paymentId,
        canUndo: true,
      })

      // Update local state
      setPayments(payments.map((payment) => (payment.id === paymentId ? { ...payment, status: newStatus } : payment)))

      toast({
        title: "Payment updated",
        description: `Payment status has been updated to ${newStatus}.`,
      })
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Failed to update payment status. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500"
      case "approved":
        return "bg-green-500"
      case "rejected":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  if (loading) {
    return <div>Loading payments...</div>
  }

  if (payments.length === 0) {
    return (
      <div className="text-center py-12">
        <CreditCard className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold mb-2">No payments found</h3>
        <p className="text-muted-foreground">There are no payments in the system yet.</p>
      </div>
    )
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Payment ID</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell className="font-medium">{payment.id}</TableCell>
                <TableCell>{payment.userId || "Anonymous"}</TableCell>
                <TableCell className="capitalize">{payment.method}</TableCell>
                <TableCell>{formatDate(payment.createdAt)}</TableCell>
                <TableCell>${payment.amount.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={`${getStatusColor(payment.status)} text-white`}>
                    {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setSelectedPayment(payment)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel>Update Status</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => handleStatusUpdate(payment.id, "pending")}>
                        Set as Pending
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStatusUpdate(payment.id, "approved")}>
                        Approve Payment
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStatusUpdate(payment.id, "rejected")}>
                        Reject Payment
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedPayment && (
        <Dialog open={!!selectedPayment} onOpenChange={() => setSelectedPayment(null)}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Payment Verification</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
              <div>
                <h3 className="font-medium mb-2">Payment Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">ID:</span>
                    <span className="font-mono">{selectedPayment.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Method:</span>
                    <span className="capitalize">{selectedPayment.method}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Amount:</span>
                    <span className="font-medium">${selectedPayment.amount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date:</span>
                    <span>{formatDate(selectedPayment.createdAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Transaction ID:</span>
                    <span className="font-mono text-xs">{selectedPayment.transactionId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <Badge variant="outline" className={`${getStatusColor(selectedPayment.status)} text-white`}>
                      {selectedPayment.status.charAt(0).toUpperCase() + selectedPayment.status.slice(1)}
                    </Badge>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-2">Payment Screenshot</h3>
                <div className="border rounded-md overflow-hidden">
                  <img src="/placeholder.svg?height=200&width=300" alt="Payment Screenshot" className="w-full h-auto" />
                </div>
              </div>
            </div>
            <div className="flex justify-between mt-4">
              <Button
                variant="destructive"
                onClick={() => {
                  handleStatusUpdate(selectedPayment.id, "rejected")
                  setSelectedPayment(null)
                }}
              >
                Reject Payment
              </Button>
              <Button
                variant="default"
                onClick={() => {
                  handleStatusUpdate(selectedPayment.id, "approved")
                  setSelectedPayment(null)
                }}
              >
                Approve Payment
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
