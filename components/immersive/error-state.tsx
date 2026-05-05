"use client"

import { motion } from "framer-motion"
import { AlertCircle, RefreshCw } from "lucide-react"
import { ButtonEnhanced } from "./button-enhanced"
import { GlassCard } from "./glass-card"
import { useLanguage } from "@/contexts/language-context"

interface ErrorStateProps {
  title?: string
  message?: string
  onRetry?: () => void
  icon?: React.ReactNode
}

export function ErrorState({
  title,
  message,
  onRetry,
  icon,
}: ErrorStateProps) {
  const { t } = useLanguage()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <GlassCard className="text-center py-12">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/20 mb-4 mx-auto"
        >
          {icon || <AlertCircle className="w-8 h-8 text-red-500" />}
        </motion.div>
        <h3 className="text-xl font-semibold mb-2">{title || t("errorState.defaultTitle")}</h3>
        <p className="text-muted-foreground mb-6">{message || t("errorState.defaultMessage")}</p>

        {onRetry && (
          <ButtonEnhanced onClick={onRetry} className="gap-2">
            <RefreshCw className="w-4 h-4" />
            {t("errorState.tryAgain")}
          </ButtonEnhanced>
        )}
      </GlassCard>
    </motion.div>
  )
}
