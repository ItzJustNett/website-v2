"use client"

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
    <aside className="hidden md:flex flex-col w-64 border-r border-black dark:border-white bg-white dark:bg-black h-screen sticky top-0">
      <nav className="flex flex-col h-full p-6">
        {/* Logo/Brand */}
        <div className="mb-12">
          <h1 className="text-3xl font-serif font-bold text-black dark:text-white">
            PureMind
          </h1>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 space-y-4">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname.startsWith(item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 text-sm font-sans transition-all duration-200 hover:bg-muted dark:hover:bg-muted relative group"
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className={isActive ? "font-semibold" : "font-normal"}>
                  {item.label}
                </span>
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-black dark:bg-white" />
                )}
              </Link>
            )
          })}
        </div>

        {/* Bottom info */}
        <div className="pt-6 border-t border-black dark:border-white">
          <p className="text-xs text-muted-foreground px-4 font-sans">
            Editorial Edition
          </p>
        </div>
      </nav>
    </aside>
  )
}
