"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  variant?: "light" | "dark"
  hover?: boolean
  onClick?: () => void
}

export function GlassCard({
  children,
  className,
  variant = "light",
  hover = true,
  onClick,
}: GlassCardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -8, scale: 1.02 } : {}}
      whileTap={hover ? { scale: 0.98 } : {}}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className={cn(
        "rounded-2xl p-6 backdrop-blur-md border transition-all duration-300",
        variant === "light"
          ? "bg-white/10 border-white/20 hover:bg-white/15 hover:border-white/30"
          : "bg-black/10 border-black/20 hover:bg-black/15 hover:border-black/30",
        hover && "cursor-pointer shadow-lg hover:shadow-xl hover:shadow-primary/20",
        className
      )}
    >
      {children}
    </motion.div>
  )
}
