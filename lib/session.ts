"use client"

import { useState, useEffect } from "react"

// This function should not be used in server components
export async function getSession() {
  if (typeof window === "undefined") {
    console.warn("getSession() was called on the server. This function is only available on the client.")
    return null
  }

  // Get user from localStorage
  const storedUser = localStorage.getItem("user")
  if (!storedUser) {
    return null
  }

  try {
    return JSON.parse(storedUser)
  } catch (error) {
    console.error("Failed to parse user from localStorage:", error)
    return null
  }
}

export function useSession() {
  const [session, setSession] = useState<any>(null)

  useEffect(() => {
    // Load session from localStorage on mount
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

  const signIn = (user: any) => {
    setSession(user)
    localStorage.setItem("user", JSON.stringify(user))
  }

  const signOut = () => {
    setSession(null)
    localStorage.removeItem("user")
  }

  const updateBalance = (newBalance: number) => {
    if (session) {
      const updatedUser = { ...session, balance: newBalance }
      setSession(updatedUser)
      localStorage.setItem("user", JSON.stringify(updatedUser))
    }
  }

  return { session, signIn, signOut, updateBalance }
}
