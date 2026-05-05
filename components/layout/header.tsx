"use client"

import { useState, useEffect, useRef } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useProfile } from "@/contexts/profile-context"
import { useLanguage } from "@/contexts/language-context"
import {
  Menu,
  Moon,
  Sun,
  LogOut,
  Settings,
  ChevronDown,
  ArrowLeft,
  Coins,
} from "lucide-react"
import { useTheme } from "next-themes"
import { usePathname, useRouter } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { fetchWithAuth } from "@/lib/api"
import { motion, AnimatePresence } from "framer-motion"

interface HeaderProps {
  sidebarOpen: boolean
  onSidebarToggle: () => void
}

export function Header({ onSidebarToggle }: HeaderProps) {
  const { user, logout } = useAuth()
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()
  const router = useRouter()
  const { meowcoins } = useProfile()
  const { t } = useLanguage()
  const [pageTitle, setPageTitle] = useState("")
  const [displayCoins, setDisplayCoins] = useState(meowcoins)
  const [coinDiff, setCoinDiff] = useState<number | null>(null)
  const prevCoinsRef = useRef(meowcoins)
  const hasInitializedRef = useRef(false)

  useEffect(() => {
    const fetchPageTitle = async () => {
      // Check if we're on a lesson page
      const lessonMatch = pathname?.match(/\/lessons\/([^\/]+)/)
      if (lessonMatch) {
        try {
          const lessonId = lessonMatch[1]
          const lesson = await fetchWithAuth(`/lessons/${lessonId}`)
          setPageTitle(lesson.title || "")
        } catch (err) {
          console.error("Error fetching lesson title:", err)
          setPageTitle("")
        }
      } else {
        setPageTitle("")
      }
    }

    fetchPageTitle()
  }, [pathname])

  // Update coin counter INSTANTLY when meowcoins change
  useEffect(() => {
    if (meowcoins !== prevCoinsRef.current) {
      const diff = meowcoins - prevCoinsRef.current

      // Update display immediately
      setDisplayCoins(meowcoins)

      // Only show +X animation for real earnings, not initial page load
      if (diff > 0 && hasInitializedRef.current) {
        setCoinDiff(diff)
        setTimeout(() => setCoinDiff(null), 1500)
      }

      prevCoinsRef.current = meowcoins
      hasInitializedRef.current = true
    }
  }, [meowcoins])

  return (
    <header className="sticky top-0 z-40 border-b border-black dark:border-white bg-white dark:bg-black">
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        {/* Left side */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={onSidebarToggle}
          >
            <Menu className="w-5 h-5" />
          </Button>

          {/* Back Button (shown on lesson pages) */}
          {pageTitle && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/lessons")}
              className="hidden sm:flex"
              title={t("header.backToLessons")}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          )}

          {/* Page Title */}
          {pageTitle && (
            <h1 className="text-lg font-semibold truncate max-w-md">
              {pageTitle}
            </h1>
          )}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Coins counter */}
          <div className="relative flex items-center gap-2 text-sm font-sans hidden sm:flex">
            <Coins className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
            <motion.span
              key={displayCoins}
              initial={{ scale: coinDiff ? 1.3 : 1 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 15 }}
              className="font-medium tabular-nums"
            >
              {displayCoins}
            </motion.span>
            <AnimatePresence>
              {coinDiff !== null && coinDiff > 0 && (
                <motion.span
                  initial={{ opacity: 1, y: 0, x: 0, scale: 1.5 }}
                  animate={{ opacity: 0, y: -30, x: 15, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="absolute left-full ml-1 text-lg text-green-500 dark:text-green-400 font-bold pointer-events-none"
                >
                  +{coinDiff}
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-sm"
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </Button>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-2 rounded-sm px-2 md:px-3 text-sm"
              >
                <div className="hidden sm:flex items-center font-sans">
                  <span>{user?.username}</span>
                </div>
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="bg-white dark:bg-black border border-black dark:border-white rounded-sm">
              <DropdownMenuLabel className="font-serif">
                {user?.username}
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuItem asChild>
                <a href="/settings" className="cursor-pointer">
                  <Settings className="w-4 h-4 mr-2" />
                  {t("header.settings")}
                </a>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={logout}
                className="cursor-pointer font-sans"
              >
                <LogOut className="w-4 h-4 mr-2" />
                {t("header.logout")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
