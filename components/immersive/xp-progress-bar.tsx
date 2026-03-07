"use client"

import { motion } from "framer-motion"
import { Star } from "lucide-react"

interface XPProgressBarProps {
  current: number
  max: number
  level: number
  showLabel?: boolean
  size?: "sm" | "md" | "lg"
}

export function XPProgressBar({
  current,
  max,
  level,
  showLabel = true,
  size = "md",
}: XPProgressBarProps) {
  const percentage = (current / max) * 100

  const sizeClasses = {
    sm: "h-2",
    md: "h-3",
    lg: "h-4",
  }

  return (
    <div className="space-y-2">
      {showLabel && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="font-semibold">Level {level}</span>
          </div>
          <span className="text-xs text-muted-foreground">
            {current.toLocaleString()} / {max.toLocaleString()} XP
          </span>
        </div>
      )}

      <div className={`w-full rounded-full bg-muted overflow-hidden ${sizeClasses[size]}`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 relative"
        >
          {/* Shimmer effect */}
          <motion.div
            animate={{ x: ["0%", "100%"] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          />
        </motion.div>
      </div>
    </div>
  )
}
