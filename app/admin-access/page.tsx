"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { Lock, ShieldAlert } from "lucide-react"
import { verifyAdminCredentials } from "@/lib/admin"
import { logAdminAction } from "@/lib/logging"

export default function AdminAccessPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const isValid = await verifyAdminCredentials(username, password)

      if (isValid) {
        // Log admin login action
        await logAdminAction({
          action: "login",
          user: username,
          timestamp: new Date().toISOString(),
          details: "Admin login successful",
        })

        // Store admin session in localStorage
        localStorage.setItem(
          "adminSession",
          JSON.stringify({
            isAdmin: true,
            username,
            loginTime: new Date().toISOString(),
          }),
        )

        toast({
          title: "Admin access granted",
          description: "Welcome to the admin panel.",
        })

        router.push("/admin-access/dashboard")
      } else {
        toast({
          title: "Access denied",
          description: "Invalid credentials. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: "An error occurred during login.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12 flex justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <ShieldAlert className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl text-center">Admin Access</CardTitle>
          <CardDescription className="text-center">Enter your credentials to access the admin panel</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-password">Password</Label>
              <Input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                "Verifying..."
              ) : (
                <>
                  <Lock className="mr-2 h-4 w-4" /> Secure Login
                </>
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">This area is restricted to authorized personnel only.</p>
        </CardFooter>
      </Card>
    </div>
  )
}
