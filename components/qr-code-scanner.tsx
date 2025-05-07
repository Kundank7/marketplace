"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, Check } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export function QrCodeScanner() {
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  // Mock UPI ID
  const upiId = "marketplace@upi"

  const handleCopy = () => {
    navigator.clipboard.writeText(upiId)
    setCopied(true)

    toast({
      title: "UPI ID copied",
      description: "The UPI ID has been copied to your clipboard.",
    })

    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">Scan the QR code or use the UPI ID below to make your payment.</p>

      <Card>
        <CardContent className="p-6 flex flex-col items-center">
          <div className="w-48 h-48 bg-muted flex items-center justify-center mb-4">
            {/* Placeholder for QR code */}
            <img src="/placeholder.svg?height=192&width=192" alt="Payment QR Code" className="w-full h-full" />
          </div>

          <div className="flex items-center gap-2">
            <span className="font-medium">{upiId}</span>
            <Button variant="ghost" size="icon" onClick={handleCopy} className="h-8 w-8">
              {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              <span className="sr-only">Copy UPI ID</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <p className="text-sm text-muted-foreground">
        After making the payment, enter the transaction ID and upload a screenshot for verification.
      </p>
    </div>
  )
}
