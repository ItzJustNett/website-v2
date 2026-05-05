"use client"

import { motion } from "framer-motion"
import { GlassCard } from "./glass-card"
import { useLanguage } from "@/contexts/language-context"

interface EmptyStateProps {
  icon?: string
  title?: string
  description?: string
  action?: React.ReactNode
}

export function EmptyState({
  icon = "📭",
  title,
  description,
  action,
}: EmptyStateProps) {
  const { t } = useLanguage()

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
        <h3 className="text-xl font-semibold mb-2">{title || t("emptyState.defaultTitle")}</h3>
        <p className="text-muted-foreground mb-6">{description || t("emptyState.defaultDescription")}</p>
        {action && <div>{action}</div>}
      </GlassCard>
    </motion.div>
  )
}
