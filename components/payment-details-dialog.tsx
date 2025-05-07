import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import type { Payment } from "@/lib/types"
import { formatDate } from "@/lib/utils"

interface PaymentDetailsDialogProps {
  payment: Payment
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PaymentDetailsDialog({ payment, open, onOpenChange }: PaymentDetailsDialogProps) {
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Payment Details</DialogTitle>
          <DialogDescription>Detailed information about your payment.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Payment ID</p>
              <p className="font-medium">{payment.id}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Date</p>
              <p>{formatDate(payment.createdAt)}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Method</p>
              <p className="capitalize">{payment.method}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Amount</p>
              <p className="font-medium">${payment.amount.toFixed(2)}</p>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground">Transaction ID</p>
            <p className="break-all font-mono text-sm">{payment.transactionId}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground">Status</p>
            <Badge variant="outline" className={`${getStatusColor(payment.status)} text-white mt-1`}>
              {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
            </Badge>
          </div>

          {payment.notes && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">Notes</p>
              <p className="text-sm">{payment.notes}</p>
            </div>
          )}

          {payment.approvedAt && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">Approved At</p>
              <p>{formatDate(payment.approvedAt)}</p>
            </div>
          )}

          {payment.screenshot && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">Payment Screenshot</p>
              <div className="mt-2 border rounded-md overflow-hidden">
                <img src="/placeholder.svg?height=200&width=400" alt="Payment Screenshot" className="w-full h-auto" />
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
