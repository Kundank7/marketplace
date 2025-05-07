"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import type { Service } from "@/lib/types"
import { useSession } from "@/lib/session"
import { createOrder } from "@/lib/orders"

interface ServiceCalculatorProps {
  service: Service
  onClose: () => void
}

export function ServiceCalculator({ service, onClose }: ServiceCalculatorProps) {
  const [quantity, setQuantity] = useState<number>(service.minOrder)
  const [deviceType, setDeviceType] = useState<string>("all")
  const [targetOption, setTargetOption] = useState<string>(
    service.targetOptions && service.targetOptions.length > 0 ? service.targetOptions[0] : "global",
  )
  const [link, setLink] = useState<string>("")
  const [totalPrice, setTotalPrice] = useState<number>(0)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const { session, updateBalance } = useSession()
  const { toast } = useToast()

  // Calculate price based on quantity and modifiers
  useEffect(() => {
    let price = service.price * quantity

    // Apply device type modifier
    if (deviceType === "mobile") price *= 1.1
    if (deviceType === "tablet") price *= 1.2

    // Apply targeting modifier
    if (targetOption && targetOption !== "global") {
      price *= 1.15
    }

    setTotalPrice(Number.parseFloat(price.toFixed(2)))
  }, [quantity, deviceType, targetOption, service.price])

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value)
    if (isNaN(value) || value < service.minOrder) {
      setQuantity(service.minOrder)
    } else {
      setQuantity(value)
    }
  }

  const handleSubmit = async () => {
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to place an order.",
        variant: "destructive",
      })
      return
    }

    if (!link) {
      toast({
        title: "Link required",
        description: "Please enter a valid link for your order.",
        variant: "destructive",
      })
      return
    }

    // Check if user has enough balance
    const userBalance = session.balance || 0
    if (userBalance < totalPrice) {
      toast({
        title: "Insufficient balance",
        description: `Your balance ($${userBalance.toFixed(2)}) is less than the order total ($${totalPrice.toFixed(2)}). Please add funds to your account.`,
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Create order
      await createOrder({
        serviceId: service.id,
        serviceName: service.name,
        quantity,
        deviceType,
        targetOption,
        link,
        price: totalPrice,
        status: "pending",
        createdAt: new Date().toISOString(),
      })

      // Update user balance
      const newBalance = userBalance - totalPrice
      updateBalance(newBalance)

      toast({
        title: "Order placed successfully",
        description: `Your order for ${service.name} has been placed. You can track its progress in your dashboard.`,
      })

      onClose()
    } catch (error) {
      toast({
        title: "Order failed",
        description: "There was an error placing your order. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{service.name}</DialogTitle>
          <DialogDescription>Calculate the price and place your order.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="quantity" className="text-right">
              Quantity
            </Label>
            <Input
              id="quantity"
              type="number"
              min={service.minOrder}
              value={quantity}
              onChange={handleQuantityChange}
              className="col-span-3"
            />
          </div>

          {service.deviceTypes && service.deviceTypes.length > 0 && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="device-type" className="text-right">
                Device Type
              </Label>
              <Select value={deviceType} onValueChange={setDeviceType}>
                <SelectTrigger id="device-type" className="col-span-3">
                  <SelectValue placeholder="Select device type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Devices</SelectItem>
                  <SelectItem value="desktop">Desktop</SelectItem>
                  <SelectItem value="mobile">Mobile</SelectItem>
                  <SelectItem value="tablet">Tablet</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {service.targetOptions && service.targetOptions.length > 0 && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="target-option" className="text-right">
                Targeting
              </Label>
              <Select value={targetOption} onValueChange={setTargetOption}>
                <SelectTrigger id="target-option" className="col-span-3">
                  <SelectValue placeholder="Select targeting option" />
                </SelectTrigger>
                <SelectContent>
                  {service.targetOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="link" className="text-right">
              Link
            </Label>
            <Input
              id="link"
              type="url"
              placeholder="https://..."
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <div className="text-right font-medium">Total Price:</div>
            <div className="col-span-3 text-xl font-bold">${totalPrice.toFixed(2)}</div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Processing..." : "Place Order"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
