import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import type { Order } from "@/lib/types"
import { formatDate } from "@/lib/utils"

interface OrderDetailsDialogProps {
  order: Order
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function OrderDetailsDialog({ order, open, onOpenChange }: OrderDetailsDialogProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500"
      case "processing":
        return "bg-blue-500"
      case "running":
        return "bg-purple-500"
      case "completed":
        return "bg-green-500"
      case "cancelled":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
          <DialogDescription>Detailed information about your order.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Order ID</p>
              <p className="font-medium">{order.id}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Date</p>
              <p>{formatDate(order.createdAt)}</p>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground">Service</p>
            <p className="font-medium">{order.serviceName}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground">Link</p>
            <p className="break-all">{order.link}</p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Quantity</p>
              <p>{order.quantity}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Device Type</p>
              <p className="capitalize">{order.deviceType || "All"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Target</p>
              <p className="capitalize">{order.targetOption || "Global"}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Price</p>
              <p className="font-medium">${order.price.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Status</p>
              <Badge variant="outline" className={`${getStatusColor(order.status)} text-white mt-1`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Badge>
            </div>
          </div>

          {order.startCount !== undefined && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Start Count</p>
                <p>{order.startCount}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Current Count</p>
                <p>{order.currentCount || order.startCount}</p>
              </div>
            </div>
          )}

          {order.notes && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">Notes</p>
              <p className="text-sm">{order.notes}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
