"use client"

import { motion } from "framer-motion"
import { Coins } from "lucide-react"
import { useState, useEffect } from "react"

interface CoinCounterProps {
  count: number
  showLabel?: boolean
  size?: "sm" | "md" | "lg"
  variant?: "default" | "compact"
}

export function CoinCounter({
  count = 0,
  showLabel = true,
  size = "md",
  variant = "default",
}: CoinCounterProps) {
  const [displayCount, setDisplayCount] = useState(count ?? 0)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (displayCount !== count) {
      setIsAnimating(true)
      const interval = setInterval(() => {
        setDisplayCount((prev) => {
          const diff = count - prev
          if (diff === 0) {
            setIsAnimating(false)
            return prev
          }
          const step = Math.ceil(diff / 10)
          return Math.min(prev + step, count)
        })
      }, 30)

      return () => clearInterval(interval)
    }
  }, [count, displayCount])

  const sizeClasses = {
    sm: "w-4 h-4 text-sm",
    md: "w-5 h-5 text-base",
    lg: "w-6 h-6 text-lg",
  }

  return (
    <motion.div
      animate={isAnimating ? { y: [-2, 2, -2, 0] } : {}}
      transition={isAnimating ? { duration: 0.6 } : {}}
      className="flex items-center gap-2"
    >
      <motion.div
        animate={isAnimating ? { scale: [1, 1.2, 1] } : {}}
        transition={isAnimating ? { duration: 0.6 } : {}}
      >
        <Coins className={`${sizeClasses[size]} text-yellow-500`} />
      </motion.div>

      {variant === "default" && (
        <div>
          <motion.span className={`font-bold text-foreground`}>
            {(displayCount ?? 0).toLocaleString()}
          </motion.span>
          {showLabel && (
            <span className="text-xs text-muted-foreground ml-1">coins</span>
          )}
        </div>
      )}

      {variant === "compact" && (
        <motion.span className="font-bold text-sm">
          {(displayCount ?? 0).toLocaleString()}
        </motion.span>
      )}
    </motion.div>
  )
}
