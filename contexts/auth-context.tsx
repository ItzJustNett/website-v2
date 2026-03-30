"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"

interface User {
  id: string
  username: string
}

interface AuthContextValue {
  user: User | null
  isLoading: boolean
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (username: string, password: string, email: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token")
      const username = localStorage.getItem("username")
      const userId = localStorage.getItem("user_id")

      if (token && username && userId) {
        setUser({ id: userId, username })
      }

      setIsLoading(false)
    }
  }, [])

  const login = async (username: string, password: string) => {
    try {
      const res = await fetch("https://api.xoperr.dev/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })

      if (!res.ok) {
        return { success: false, error: "Login failed. Please check your credentials." }
      }

      const data = await res.json()
      localStorage.setItem("token", data.token)
      localStorage.setItem("username", username)
      localStorage.setItem("user_id", data.user_id)

      setUser({ id: data.user_id, username })
      return { success: true }
    } catch (error) {
      return { success: false, error: "Network error. Please try again." }
    }
  }

  const register = async (username: string, password: string, email: string) => {
    try {
      const res = await fetch("https://api.xoperr.dev/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, email }),
      })

      if (!res.ok) {
        return { success: false, error: "Registration failed. Please try again." }
      }

      const data = await res.json()
      return { success: true, user_id: data.user_id }
    } catch {
      return { success: false, error: "Network error. Please try again." }
    }
  }

  const logout = () => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token")
      if (token) {
        fetch("https://api.xoperr.dev/api/auth/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }).catch(() => {})
      }

      localStorage.removeItem("token")
      localStorage.removeItem("username")
      localStorage.removeItem("user_id")
      setUser(null)
      router.push("/login")
    }
  }

  return <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
