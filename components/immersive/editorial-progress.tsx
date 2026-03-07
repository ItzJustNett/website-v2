"use client"

import { motion } from "framer-motion"

interface EditorialProgressProps {
  value: number
  max?: number
  label?: string
  showPercentage?: boolean
}

export function EditorialProgress({
  value,
  max = 100,
  label,
  showPercentage = true,
}: EditorialProgressProps) {
  const percentage = Math.min((value / max) * 100, 100)

  return (
    <div className="w-full">
      {label && (
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium">{label}</span>
          {showPercentage && (
            <span className="text-xs text-muted-foreground">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      <div className="editorial-progress">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="editorial-progress-fill"
        />
      </div>
    </div>
  )
}
