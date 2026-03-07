"use client"

import { motion } from "framer-motion"
import { Flame } from "lucide-react"
import { cn } from "@/lib/utils"

interface StreakFlameProps {
  size?: "sm" | "md" | "lg" | "xl"
  color?: "orange" | "red" | "golden"
  animated?: boolean
}

const sizeMap = {
  sm: "w-5 h-5",
  md: "w-8 h-8",
  lg: "w-12 h-12",
  xl: "w-16 h-16",
}

const colorMap = {
  orange: "text-orange-500",
  red: "text-red-500",
  golden: "text-yellow-500",
}

export function StreakFlame({
  size = "md",
  color = "orange",
  animated = true,
}: StreakFlameProps) {
  return (
    <motion.div
      animate={
        animated
          ? {
              y: [0, -4, 0],
              scale: [1, 1.05, 1],
            }
          : {}
      }
      transition={
        animated
          ? {
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }
          : {}
      }
      className="inline-block"
    >
      <Flame
        className={cn(
          sizeMap[size],
          colorMap[color],
          "drop-shadow-lg animate-flame-flicker"
        )}
        fill="currentColor"
      />
    </motion.div>
  )
}
