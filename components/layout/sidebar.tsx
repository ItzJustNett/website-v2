"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import {
  BookOpen,
  Zap,
  ShoppingBag,
  User,
  Brain,
  Home,
  Settings,
} from "lucide-react"
import { fetchWithAuth } from "@/lib/api"

const navItems = [
  { href: "/dashboard", label: "Головна", icon: Home },
  { href: "/lessons", label: "Уроки", icon: BookOpen },
  { href: "/ai-features", label: "AI Функції", icon: Brain },
  { href: "/store", label: "Магазин", icon: ShoppingBag },
  { href: "/profile", label: "Профіль", icon: User },
  { href: "/settings", label: "Налаштування", icon: Settings },
]

const CAT_IMAGES = {
  0: "/orange.png",
  1: "/gray.png",
  2: "/black.png"
}

export function Sidebar() {
  const pathname = usePathname()
  const [catId, setCatId] = useState<number | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await fetchWithAuth("/profiles/me")
        setCatId(profile.cat_id)
      } catch (err) {
        console.error("Error fetching profile:", err)
      }
    }
    fetchProfile()
  }, [])

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

        {/* Bottom info - User's Cat */}
        <div className="pt-6 border-t border-black dark:border-white">
          {catId !== null && (
            <div className="flex items-center justify-center px-4">
              <img
                src={CAT_IMAGES[catId as keyof typeof CAT_IMAGES]}
                alt="Your cat"
                className="w-48 h-48 object-contain"
              />
            </div>
          )}
        </div>
      </nav>
    </aside>
  )
}
