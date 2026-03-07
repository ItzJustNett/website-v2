"use client"

import { createContext, useContext, type ReactNode } from "react"
import { toast } from "sonner"

interface NotificationContextType {
  success: (message: string) => void
  error: (message: string) => void
  info: (message: string) => void
  warning: (message: string) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const success = (message: string) => toast.success(message)
  const error = (message: string) => toast.error(message)
  const info = (message: string) => toast.info(message)
  const warning = (message: string) => toast.warning(message)

  return (
    <NotificationContext.Provider value={{ success, error, info, warning }}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotification() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error("useNotification must be used within a NotificationProvider")
  }
  return context
}
