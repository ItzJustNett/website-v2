"use client"

import { ReactNode } from "react"
import { ThemeProvider } from "next-themes"
import { AuthProvider } from "@/contexts/auth-context"
import { AccessibilityProvider } from "@/contexts/accessibility-context"
import { NotificationProvider } from "@/contexts/notification-context"
import { Toaster } from "sonner"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <AccessibilityProvider>
          <NotificationProvider>
            {children}
            <Toaster />
          </NotificationProvider>
        </AccessibilityProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
