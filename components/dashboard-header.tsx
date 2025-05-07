"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useSession } from "@/lib/session"
import { PlusCircle } from "lucide-react"
import { useState } from "react"
import { DepositDialog } from "@/components/deposit-dialog"

export function DashboardHeader() {
  const { session } = useSession()
  const [depositDialogOpen, setDepositDialogOpen] = useState(false)

  if (!session) {
    return null
  }

  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground mb-1">Current Balance</div>
            <div className="text-3xl font-bold">${(session.balance || 0).toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 flex justify-between items-center">
            <div>
              <div className="text-sm text-muted-foreground mb-1">Add Funds</div>
              <div className="text-lg font-medium">Deposit to your account</div>
            </div>
            <Button onClick={() => setDepositDialogOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Deposit
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground mb-1">Account Status</div>
            <div className="text-lg font-medium">
              <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
              Active
            </div>
          </CardContent>
        </Card>
      </div>

      <DepositDialog open={depositDialogOpen} onOpenChange={setDepositDialogOpen} />
    </div>
  )
}
