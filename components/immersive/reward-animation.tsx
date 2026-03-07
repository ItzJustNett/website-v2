"use client"

import { motion } from "framer-motion"
import { Star, Trophy, Zap } from "lucide-react"
import { useEffect, useState } from "react"

interface RewardAnimationProps {
  type: "coin" | "achievement" | "streak" | "level"
  amount?: number
  label?: string
  onComplete?: () => void
}

export function RewardAnimation({
  type,
  amount,
  label,
  onComplete,
}: RewardAnimationProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      onComplete?.()
    }, 2000)

    return () => clearTimeout(timer)
  }, [onComplete])

  if (!isVisible) return null

  const icons = {
    coin: "🪙",
    achievement: <Trophy className="w-8 h-8 text-yellow-500" />,
    streak: <Zap className="w-8 h-8 text-orange-500" />,
    level: <Star className="w-8 h-8 text-purple-500" />,
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0, y: 0 }}
      animate={{ opacity: 1, scale: 1, y: -100 }}
      exit={{ opacity: 0, scale: 0 }}
      transition={{ duration: 2, ease: "easeOut" }}
      className="fixed pointer-events-none"
      style={{
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      <motion.div
        animate={{ y: [0, -120], opacity: [1, 0] }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="flex flex-col items-center gap-2"
      >
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 2, ease: "linear" }}
        >
          {typeof icons[type] === "string" ? (
            <span className="text-6xl">{icons[type]}</span>
          ) : (
            icons[type]
          )}
        </motion.div>

        {amount && (
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold text-primary"
          >
            +{amount}
          </motion.div>
        )}

        {label && (
          <motion.div
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 2 }}
            className="text-lg font-semibold text-foreground"
          >
            {label}
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  )
}
