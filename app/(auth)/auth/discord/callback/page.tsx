"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useNotification } from "@/contexts/notification-context"

const API_URL = "https://api.xoperr.dev"

export default function DiscordCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { success: showSuccess, error: showError } = useNotification()
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get("code")
        const error = searchParams.get("error")

        if (error) {
          throw new Error("Authentication cancelled")
        }

        if (!code) {
          throw new Error("No authorization code received")
        }

        setStatus("loading")

        const response = await fetch(`${API_URL}/api/oauth/callback`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code, provider: "discord" })
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.detail || "Authentication failed")
        }

        localStorage.setItem("token", data.token)
        localStorage.setItem("user_id", data.user_id)
        localStorage.setItem("username", data.username)

        setStatus("success")
        showSuccess("Successfully logged in with Discord!")

        setTimeout(() => {
          window.location.href = data.is_new_user ? "/setup" : "/lessons"
        }, 1000)

      } catch (err: any) {
        console.error("Discord callback error:", err)
        setStatus("error")
        showError(err.message || "Failed to authenticate")

        setTimeout(() => {
          router.push("/login")
        }, 2000)
      }
    }

    handleCallback()
  }, [searchParams, router, showSuccess, showError])

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center">
        {status === "loading" && (
          <>
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-foreground mx-auto mb-4"></div>
            <h2 className="text-xl font-bold mb-2">Connecting with Discord...</h2>
            <p className="text-muted-foreground">Please wait</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-xl font-bold mb-2">Success!</h2>
            <p className="text-muted-foreground">Redirecting...</p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="text-6xl mb-4">❌</div>
            <h2 className="text-xl font-bold mb-2">Authentication Failed</h2>
            <p className="text-muted-foreground">Redirecting to login...</p>
          </>
        )}
      </div>
    </div>
  )
}
