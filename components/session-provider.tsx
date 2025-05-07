"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useToast } from "@/components/ui/use-toast"

type User = {
  id: string
  name: string
  email: string
  balance?: number
}

type SessionContextType = {
  session: User | null
  signIn: (user: User) => void
  signOut: () => void
  updateBalance: (newBalance: number) => void
}

const SessionContext = createContext<SessionContextType | undefined>(undefined)

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<User | null>(null)
  const { toast } = useToast()

  // Load session from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser)
        setSession(user)
      } catch (error) {
        console.error("Failed to parse user from localStorage:", error)
        localStorage.removeItem("user")
      }
    }
  }, [])

  const signIn = (user: User) => {
    setSession(user)
    localStorage.setItem("user", JSON.stringify(user))
    toast({
      title: "Signed in",
      description: `Welcome, ${user.name}!`,
    })
  }

  const signOut = () => {
    setSession(null)
    localStorage.removeItem("user")
    toast({
      title: "Signed out",
      description: "You have been signed out successfully.",
    })
  }

  const updateBalance = (newBalance: number) => {
    if (session) {
      const updatedUser = { ...session, balance: newBalance }
      setSession(updatedUser)
      localStorage.setItem("user", JSON.stringify(updatedUser))
    }
  }

  return (
    <SessionContext.Provider value={{ session, signIn, signOut, updateBalance }}>{children}</SessionContext.Provider>
  )
}

export function useSession() {
  const context = useContext(SessionContext)
  if (context === undefined) {
    throw new Error("useSession must be used within a SessionProvider")
  }
  return context
}
