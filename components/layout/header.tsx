"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useAuth } from "@/contexts/auth-context"
import {
  Menu,
  Moon,
  Sun,
  LogOut,
  Settings,
  ChevronDown,
  Coins,
} from "lucide-react"
import { useTheme } from "next-themes"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

interface HeaderProps {
  sidebarOpen: boolean
  onSidebarToggle: () => void
}

export function Header({ onSidebarToggle }: HeaderProps) {
  const { user, logout } = useAuth()
  const { theme, setTheme } = useTheme()
  const [coins, setCoins] = useState(1250)

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
      className="sticky top-0 z-40 border-b border-border/40 bg-background/40 backdrop-blur-md"
    >
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

          <div className="hidden md:flex items-center gap-2">
            <h2 className="font-semibold text-lg">Welcome back!</h2>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Coins counter */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg glass hover:bg-primary/10 transition-colors"
            onClick={() => setCoins((c) => c + 100)}
          >
            <Coins className="w-5 h-5 text-yellow-500" />
            <span className="font-semibold hidden sm:inline text-sm md:text-base">
              {coins}
            </span>
          </motion.button>

          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-lg"
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
                className="flex items-center gap-2 rounded-lg px-2 md:px-3"
              >
                <div className="hidden sm:flex items-center">
                  <span className="text-sm font-medium">{user?.username}</span>
                </div>
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                {user?.username}
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuItem asChild>
                <a href="/profile" className="cursor-pointer">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </a>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={logout}
                className="text-red-600 cursor-pointer"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </motion.header>
  )
}
