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
      <div className="relative min-h-screen bg-white dark:bg-black">
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
              <div className="container mx-auto px-6 py-12 md:px-8 md:py-16">
                {children}
              </div>
            </main>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
