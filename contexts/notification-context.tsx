"use client"

import { createContext, useContext, type ReactNode } from "react"
import { toast } from "sonner"

const NotificationContext = createContext(toast)

export function NotificationProvider({ children }: { children: ReactNode }) {
  return (
    <NotificationContext.Provider value={toast}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotification() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error("useNotification must be used within a NotificationProvider")
  }
  return context
}
