"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { useSession } from "@/lib/session"
import { createPayment } from "@/lib/payments"
import { QrCodeScanner } from "@/components/qr-code-scanner"
import { CryptoWalletGenerator } from "@/components/crypto-wallet-generator"

interface DepositDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DepositDialog({ open, onOpenChange }: DepositDialogProps) {
  const [amount, setAmount] = useState<string>("100")
  const [transactionId, setTransactionId] = useState<string>("")
  const [screenshot, setScreenshot] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [depositMethod, setDepositMethod] = useState<string>("upi")

  const { session, updateBalance } = useSession()
  const { toast } = useToast()

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (/^\d*\.?\d{0,2}$/.test(value) || value === "") {
      setAmount(value)
    }
  }

  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setScreenshot(e.target.files[0])
    }
  }

  const handleSubmit = async () => {
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to make a deposit.",
        variant: "destructive",
      })
      return
    }

    if (!amount || Number.parseFloat(amount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid deposit amount.",
        variant: "destructive",
      })
      return
    }

    if (!transactionId) {
      toast({
        title: "Transaction ID required",
        description: "Please enter the transaction ID from your payment.",
        variant: "destructive",
      })
      return
    }

    if (!screenshot) {
      toast({
        title: "Screenshot required",
        description: "Please upload a screenshot of your payment.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Create payment record
      const payment = await createPayment({
        method: depositMethod,
        amount: Number.parseFloat(amount),
        transactionId,
        status: "pending",
        createdAt: new Date().toISOString(),
      })

      toast({
        title: "Deposit submitted",
        description: "Your deposit has been submitted for verification. It will be processed shortly.",
      })

      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Deposit failed",
        description: "There was an error processing your deposit. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Funds to Your Account</DialogTitle>
          <DialogDescription>
            Choose your preferred payment method and enter the amount you want to deposit.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="upi" onValueChange={setDepositMethod}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upi">UPI / QR</TabsTrigger>
            <TabsTrigger value="crypto">Cryptocurrency</TabsTrigger>
          </TabsList>

          <TabsContent value="upi" className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (USD)</Label>
              <Input id="amount" value={amount} onChange={handleAmountChange} placeholder="Enter amount" />
            </div>

            <QrCodeScanner />

            <div className="space-y-2">
              <Label htmlFor="transaction-id">Transaction ID</Label>
              <Input
                id="transaction-id"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                placeholder="Enter transaction ID"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="screenshot">Payment Screenshot</Label>
              <Input id="screenshot" type="file" accept="image/*" onChange={handleScreenshotChange} />
            </div>
          </TabsContent>

          <TabsContent value="crypto" className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="crypto-amount">Amount (USD)</Label>
              <Input id="crypto-amount" value={amount} onChange={handleAmountChange} placeholder="Enter amount" />
            </div>

            <CryptoWalletGenerator />

            <div className="space-y-2">
              <Label htmlFor="crypto-transaction-id">Transaction Hash</Label>
              <Input
                id="crypto-transaction-id"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                placeholder="Enter transaction hash"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="crypto-screenshot">Payment Screenshot</Label>
              <Input id="crypto-screenshot" type="file" accept="image/*" onChange={handleScreenshotChange} />
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Processing..." : "Submit Deposit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
