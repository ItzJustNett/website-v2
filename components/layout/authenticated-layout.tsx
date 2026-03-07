"use client"

import { ReactNode, useState } from "react"
import { Sidebar } from "./sidebar"
import { Header } from "./header"
import { AuthGuard } from "./auth-guard"
import { useScreenSize } from "@/hooks/use-screen-size"

export function AuthenticatedLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { isMobile } = useScreenSize()

  return (
    <AuthGuard>
      <div className="relative min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        {/* Animated background gradient */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 opacity-50"></div>
        </div>

        <div className="flex">
          {/* Sidebar */}
          {!isMobile && <Sidebar />}

          {/* Main content */}
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <Header
              sidebarOpen={sidebarOpen}
              onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
            />

            {/* Page content */}
            <main className="flex-1 overflow-auto">
              <div className="container mx-auto px-4 py-8 md:px-6 md:py-10">
                {children}
              </div>
            </main>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
