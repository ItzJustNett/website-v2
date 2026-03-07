"use client"

import { motion } from "framer-motion"

interface SkeletonLoaderProps {
  type?: "card" | "text" | "circle" | "bar"
  count?: number
}

export function SkeletonLoader({ type = "card", count = 1 }: SkeletonLoaderProps) {
  const variants = {
    animate: {
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: 1.5,
        repeat: Infinity,
      },
    },
  }

  if (type === "card") {
    return (
      <div className="space-y-4">
        {Array.from({ length: count }).map((_, i) => (
          <motion.div
            key={i}
            variants={variants}
            animate="animate"
            className="h-32 bg-muted rounded-xl"
          />
        ))}
      </div>
    )
  }

  if (type === "text") {
    return (
      <div className="space-y-3">
        {Array.from({ length: count }).map((_, i) => (
          <motion.div
            key={i}
            variants={variants}
            animate="animate"
            className="h-4 bg-muted rounded w-full"
          />
        ))}
      </div>
    )
  }

  if (type === "circle") {
    return (
      <div className="flex gap-4">
        {Array.from({ length: count }).map((_, i) => (
          <motion.div
            key={i}
            variants={variants}
            animate="animate"
            className="w-12 h-12 bg-muted rounded-full"
          />
        ))}
      </div>
    )
  }

  if (type === "bar") {
    return (
      <motion.div
        variants={variants}
        animate="animate"
        className="h-2 bg-muted rounded-full"
      />
    )
  }

  return null
}
