"use client"

import { motion } from "framer-motion"
import { GlassCard } from "./glass-card"

interface EmptyStateProps {
  icon?: string
  title?: string
  description?: string
  action?: React.ReactNode
}

export function EmptyState({
  icon = "📭",
  title = "Nothing here yet",
  description = "Check back soon for new content!",
  action,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <GlassCard className="text-center py-16">
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-6xl mb-4"
        >
          {icon}
        </motion.div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground mb-6">{description}</p>
        {action && <div>{action}</div>}
      </GlassCard>
    </motion.div>
  )
}
