import type { Order } from "@/lib/types"
import { generateId } from "@/lib/utils"

// Create a new order
export async function createOrder(orderData: Omit<Order, "id">): Promise<Order> {
  const storedOrders = localStorage.getItem("orders")
  let orders: Order[] = []

  if (storedOrders) {
    try {
      orders = JSON.parse(storedOrders)
    } catch (error) {
      console.error("Failed to parse orders from localStorage:", error)
    }
  }

  const newOrder: Order = {
    ...orderData,
    id: generateId("order"),
  }

  orders.push(newOrder)
  localStorage.setItem("orders", JSON.stringify(orders))

  return newOrder
}

// Get all orders for the current user
export async function getOrders(): Promise<Order[]> {
  const storedUser = localStorage.getItem("user")
  if (!storedUser) {
    return []
  }

  const user = JSON.parse(storedUser)
  const userId = user.id

  const storedOrders = localStorage.getItem("orders")
  if (!storedOrders) {
    return []
  }

  try {
    const orders: Order[] = JSON.parse(storedOrders)
    return orders.filter((order) => order.userId === userId)
  } catch (error) {
    console.error("Failed to parse orders from localStorage:", error)
    return []
  }
}

// Get order by ID
export async function getOrderById(id: string): Promise<Order | null> {
  const storedOrders = localStorage.getItem("orders")
  if (!storedOrders) {
    return null
  }

  try {
    const orders: Order[] = JSON.parse(storedOrders)
    return orders.find((order) => order.id === id) || null
  } catch (error) {
    console.error("Failed to parse orders from localStorage:", error)
    return null
  }
}

// Update order
export async function updateOrder(order: Order): Promise<void> {
  const storedOrders = localStorage.getItem("orders")
  if (!storedOrders) {
    throw new Error("No orders found")
  }

  try {
    const orders: Order[] = JSON.parse(storedOrders)
    const index = orders.findIndex((o) => o.id === order.id)

    if (index === -1) {
      throw new Error(`Order with ID ${order.id} not found`)
    }

    orders[index] = order
    localStorage.setItem("orders", JSON.stringify(orders))
  } catch (error) {
    console.error("Failed to update order:", error)
    throw new Error("Failed to update order")
  }
}

// Cancel order
export async function cancelOrder(id: string): Promise<void> {
  const order = await getOrderById(id)
  if (!order) {
    throw new Error(`Order with ID ${id} not found`)
  }

  if (order.status !== "pending") {
    throw new Error("Only pending orders can be cancelled")
  }

  await updateOrder({
    ...order,
    status: "cancelled",
  })
}
