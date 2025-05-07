import type { Payment } from "@/lib/types"
import { generateId } from "@/lib/utils"

// Create a new payment
export async function createPayment(paymentData: Omit<Payment, "id">): Promise<Payment> {
  const storedPayments = localStorage.getItem("payments")
  let payments: Payment[] = []

  if (storedPayments) {
    try {
      payments = JSON.parse(storedPayments)
    } catch (error) {
      console.error("Failed to parse payments from localStorage:", error)
    }
  }

  // Get current user ID
  const storedUser = localStorage.getItem("user")
  let userId = undefined

  if (storedUser) {
    try {
      const user = JSON.parse(storedUser)
      userId = user.id
    } catch (error) {
      console.error("Failed to parse user from localStorage:", error)
    }
  }

  const newPayment: Payment = {
    ...paymentData,
    id: generateId("payment"),
    userId,
  }

  payments.push(newPayment)
  localStorage.setItem("payments", JSON.stringify(payments))

  return newPayment
}

// Get all payments for the current user
export async function getPayments(): Promise<Payment[]> {
  const storedUser = localStorage.getItem("user")
  if (!storedUser) {
    return []
  }

  const user = JSON.parse(storedUser)
  const userId = user.id

  const storedPayments = localStorage.getItem("payments")
  if (!storedPayments) {
    return []
  }

  try {
    const payments: Payment[] = JSON.parse(storedPayments)
    return payments.filter((payment) => payment.userId === userId)
  } catch (error) {
    console.error("Failed to parse payments from localStorage:", error)
    return []
  }
}

// Get payment by ID
export async function getPaymentById(id: string): Promise<Payment | null> {
  const storedPayments = localStorage.getItem("payments")
  if (!storedPayments) {
    return null
  }

  try {
    const payments: Payment[] = JSON.parse(storedPayments)
    return payments.find((payment) => payment.id === id) || null
  } catch (error) {
    console.error("Failed to parse payments from localStorage:", error)
    return null
  }
}

// Update payment
export async function updatePayment(payment: Payment): Promise<void> {
  const storedPayments = localStorage.getItem("payments")
  if (!storedPayments) {
    throw new Error("No payments found")
  }

  try {
    const payments: Payment[] = JSON.parse(storedPayments)
    const index = payments.findIndex((p) => p.id === payment.id)

    if (index === -1) {
      throw new Error(`Payment with ID ${payment.id} not found`)
    }

    payments[index] = payment
    localStorage.setItem("payments", JSON.stringify(payments))
  } catch (error) {
    console.error("Failed to update payment:", error)
    throw new Error("Failed to update payment")
  }
}
