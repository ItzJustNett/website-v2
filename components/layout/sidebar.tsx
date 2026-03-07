"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BookOpen,
  Zap,
  ShoppingBag,
  User,
  Brain,
  Home,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/lessons", label: "Lessons", icon: BookOpen },
  { href: "/tests", label: "Tests", icon: Zap },
  { href: "/store", label: "Store", icon: ShoppingBag },
  { href: "/ai-features", label: "AI Features", icon: Brain },
  { href: "/profile", label: "Profile", icon: User },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <motion.aside
      initial={{ x: -256 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3 }}
      className="hidden md:block w-64 border-r border-border/40 bg-background/40 backdrop-blur-md h-screen sticky top-0"
    >
      <nav className="flex flex-col h-full p-4 gap-2">
        {/* Logo/Brand */}
        <div className="px-4 py-6">
          <h1 className="text-2xl font-bold text-primary">PureMind</h1>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname.startsWith(item.href)

            return (
              <motion.div
                key={item.href}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                    isActive
                      ? "bg-primary/20 text-primary font-semibold shadow-lg"
                      : "text-foreground/70 hover:text-foreground hover:bg-muted"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r"
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </Link>
              </motion.div>
            )
          })}
        </div>

        {/* Bottom info */}
        <div className="pt-4 border-t border-border/40">
          <p className="text-xs text-muted-foreground px-4">
            v1.0 - Immersive Edition
          </p>
        </div>
      </nav>
    </motion.aside>
  )
}
