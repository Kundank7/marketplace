// Mock authentication functions for the zero-database architecture

export async function signIn(provider: string) {
  // In a real app, this would connect to NextAuth.js or similar
  // For this zero-database architecture, we'll simulate it

  if (provider === "google") {
    // Simulate Google OAuth
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Create a mock user
    const user = {
      id: `user-${Date.now()}`,
      name: "Demo User",
      email: "demo@example.com",
      balance: 0,
    }

    // Store in localStorage
    localStorage.setItem("user", JSON.stringify(user))

    return user
  }

  throw new Error(`Unsupported provider: ${provider}`)
}

export async function signOut() {
  // Remove user from localStorage
  localStorage.removeItem("user")
}

export async function getSession() {
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
