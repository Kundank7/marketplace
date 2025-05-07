"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, Check, RefreshCw } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export function CryptoWalletGenerator() {
  const [walletAddress, setWalletAddress] = useState("0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t")
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleCopy = () => {
    navigator.clipboard.writeText(walletAddress)
    setCopied(true)

    toast({
      title: "Wallet address copied",
      description: "The wallet address has been copied to your clipboard.",
    })

    setTimeout(() => setCopied(false), 2000)
  }

  const generateNewAddress = () => {
    setLoading(true)

    // Simulate generating a new address
    setTimeout(() => {
      const characters = "0123456789abcdefghijklmnopqrstuvwxyz"
      let newAddress = "0x"

      for (let i = 0; i < 40; i++) {
        newAddress += characters.charAt(Math.floor(Math.random() * characters.length))
      }

      setWalletAddress(newAddress)
      setLoading(false)

      toast({
        title: "New wallet address generated",
        description: "A new wallet address has been generated for your deposit.",
      })
    }, 1000)
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Send your cryptocurrency to the following wallet address. We accept BTC, ETH, and USDT.
      </p>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Wallet Address:</span>
              <Button variant="outline" size="sm" onClick={generateNewAddress} disabled={loading}>
                <RefreshCw className="mr-2 h-3 w-3" />
                {loading ? "Generating..." : "Generate New"}
              </Button>
            </div>

            <div className="p-3 bg-muted rounded-md flex items-center justify-between break-all">
              <span className="text-xs md:text-sm font-mono mr-2">{walletAddress}</span>
              <Button variant="ghost" size="icon" onClick={handleCopy} className="h-8 w-8 flex-shrink-0">
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                <span className="sr-only">Copy wallet address</span>
              </Button>
            </div>

            <div className="flex justify-center">
              <div className="w-32 h-32 bg-muted flex items-center justify-center">
                {/* Placeholder for QR code */}
                <img src="/placeholder.svg?height=128&width=128" alt="Wallet QR Code" className="w-full h-full" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <p className="text-sm text-muted-foreground">
        After sending the cryptocurrency, enter the transaction hash and upload a screenshot for verification.
      </p>
    </div>
  )
}
