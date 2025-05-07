// Service Types
export interface Service {
  id: string
  name: string
  description: string
  category: string
  price: number
  minOrder: number
  unit: string
  active?: boolean
  targetOptions?: string[]
  deviceTypes?: string[]
}

// Order Types
export interface Order {
  id: string
  userId?: string
  serviceId: string
  serviceName: string
  quantity: number
  deviceType?: string
  targetOption?: string
  link: string
  price: number
  status: string
  createdAt: string
  startCount?: number
  currentCount?: number
  completedAt?: string
  notes?: string
}

// Payment Types
export interface Payment {
  id: string
  userId?: string
  method: string
  amount: number
  transactionId: string
  status: string
  createdAt: string
  approvedAt?: string
  notes?: string
  screenshot?: string
}

// Admin Log Types
export interface AdminLog {
  id: string
  user: string
  action: string
  timestamp: string
  details: string
  orderId?: string
  paymentId?: string
  serviceId?: string
  canUndo?: boolean
  undone?: boolean
}
