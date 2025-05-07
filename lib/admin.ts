import { generateId } from "@/lib/utils"
import type { Order, Payment, AdminLog } from "@/lib/types"

// Mock admin verification
export async function verifyAdminCredentials(username: string, password: string): Promise<boolean> {
  // In a real app, this would check against a database
  // For this zero-database architecture, we'll use hardcoded values

  if (username !== "admin") {
    return false
  }

  // Simulate bcrypt verification
  // In a real app, you would use bcrypt.compare
  return password === "Arya123@"
}

// Get all orders for admin
export async function getAdminOrders(): Promise<Order[]> {
  // In a real app, this would fetch from a database
  // For this zero-database architecture, we'll use localStorage

  const storedOrders = localStorage.getItem("orders")
  if (!storedOrders) {
    return []
  }

  try {
    return JSON.parse(storedOrders)
  } catch (error) {
    console.error("Failed to parse orders from localStorage:", error)
    return []
  }
}

// Update order status
export async function updateOrderStatus(orderId: string, status: string): Promise<void> {
  const storedOrders = localStorage.getItem("orders")
  if (!storedOrders) {
    throw new Error("No orders found")
  }

  try {
    const orders: Order[] = JSON.parse(storedOrders)
    const updatedOrders = orders.map((order) => (order.id === orderId ? { ...order, status } : order))

    localStorage.setItem("orders", JSON.stringify(updatedOrders))
  } catch (error) {
    console.error("Failed to update order status:", error)
    throw new Error("Failed to update order status")
  }
}

// Get all payments for admin
export async function getAdminPayments(): Promise<Payment[]> {
  const storedPayments = localStorage.getItem("payments")
  if (!storedPayments) {
    return []
  }

  try {
    return JSON.parse(storedPayments)
  } catch (error) {
    console.error("Failed to parse payments from localStorage:", error)
    return []
  }
}

// Update payment status
export async function updatePaymentStatus(paymentId: string, status: string): Promise<void> {
  const storedPayments = localStorage.getItem("payments")
  if (!storedPayments) {
    throw new Error("No payments found")
  }

  try {
    const payments: Payment[] = JSON.parse(storedPayments)
    const updatedPayments = payments.map((payment) =>
      payment.id === paymentId
        ? {
            ...payment,
            status,
            approvedAt: status === "approved" ? new Date().toISOString() : payment.approvedAt,
          }
        : payment,
    )

    localStorage.setItem("payments", JSON.stringify(updatedPayments))

    // If payment is approved, update user balance
    if (status === "approved") {
      const payment = payments.find((p) => p.id === paymentId)
      if (payment && payment.userId) {
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
          const user = JSON.parse(storedUser)
          const newBalance = (user.balance || 0) + payment.amount
          user.balance = newBalance
          localStorage.setItem("user", JSON.stringify(user))
        }
      }
    }
  } catch (error) {
    console.error("Failed to update payment status:", error)
    throw new Error("Failed to update payment status")
  }
}

// Get admin logs
export async function getAdminLogs(): Promise<AdminLog[]> {
  const storedLogs = localStorage.getItem("adminLogs")
  if (!storedLogs) {
    return []
  }

  try {
    return JSON.parse(storedLogs)
  } catch (error) {
    console.error("Failed to parse admin logs from localStorage:", error)
    return []
  }
}

// Undo admin action
export async function undoAdminAction(logId: string): Promise<void> {
  const storedLogs = localStorage.getItem("adminLogs")
  if (!storedLogs) {
    throw new Error("No admin logs found")
  }

  try {
    const logs: AdminLog[] = JSON.parse(storedLogs)
    const logToUndo = logs.find((log) => log.id === logId)

    if (!logToUndo || !logToUndo.canUndo || logToUndo.undone) {
      throw new Error("Cannot undo this action")
    }

    // Perform the undo action based on the log type
    switch (logToUndo.action) {
      case "update_order_status":
        if (logToUndo.orderId) {
          // Revert the order status (simplified for demo)
          const storedOrders = localStorage.getItem("orders")
          if (storedOrders) {
            const orders: Order[] = JSON.parse(storedOrders)
            const order = orders.find((o) => o.id === logToUndo.orderId)
            if (order) {
              // In a real app, you would have the previous status stored
              const previousStatus = order.status === "completed" ? "running" : "pending"
              await updateOrderStatus(logToUndo.orderId, previousStatus)
            }
          }
        }
        break

      case "update_payment_status":
        if (logToUndo.paymentId) {
          // Revert the payment status (simplified for demo)
          const storedPayments = localStorage.getItem("payments")
          if (storedPayments) {
            const payments: Payment[] = JSON.parse(storedPayments)
            const payment = payments.find((p) => p.id === logToUndo.paymentId)
            if (payment) {
              // In a real app, you would have the previous status stored
              const previousStatus = payment.status === "approved" ? "pending" : "pending"
              await updatePaymentStatus(logToUndo.paymentId, previousStatus)
            }
          }
        }
        break

      // Add more cases for other action types

      default:
        throw new Error(`Unsupported action type: ${logToUndo.action}`)
    }

    // Mark the log as undone
    const updatedLogs = logs.map((log) => (log.id === logId ? { ...log, undone: true } : log))

    localStorage.setItem("adminLogs", JSON.stringify(updatedLogs))

    // Add a new log for the undo action
    await logAdminAction({
      action: "undo",
      user: "admin",
      timestamp: new Date().toISOString(),
      details: `Undid action: ${logToUndo.action} (${logToUndo.details})`,
      canUndo: false,
    })
  } catch (error) {
    console.error("Failed to undo admin action:", error)
    throw new Error("Failed to undo admin action")
  }
}

// Log admin action
export async function logAdminAction(log: Omit<AdminLog, "id">): Promise<void> {
  const storedLogs = localStorage.getItem("adminLogs")
  let logs: AdminLog[] = []

  if (storedLogs) {
    try {
      logs = JSON.parse(storedLogs)
    } catch (error) {
      console.error("Failed to parse admin logs from localStorage:", error)
    }
  }

  const newLog: AdminLog = {
    ...log,
    id: generateId("log"),
  }

  logs.unshift(newLog) // Add to the beginning of the array

  localStorage.setItem("adminLogs", JSON.stringify(logs))
}
