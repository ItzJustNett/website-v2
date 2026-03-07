"use client"

import { motion } from "framer-motion"
import { Button, type ButtonProps } from "@/components/ui/button"
import { ReactNode } from "react"

interface EnhancedButtonProps extends ButtonProps {
  children: ReactNode
  glow?: boolean
  pulse?: boolean
}

export function ButtonEnhanced({
  children,
  glow = false,
  pulse = false,
  ...props
}: EnhancedButtonProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.1 }}
      className={glow ? "relative" : ""}
    >
      {glow && (
        <motion.div
          animate={{ boxShadow: ["0 0 0 0 rgba(59, 130, 246, 0.7)", "0 0 0 10px rgba(59, 130, 246, 0)"] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute inset-0 rounded-md"
        />
      )}

      <Button
        {...props}
        className={`
          relative overflow-hidden transition-all
          ${pulse ? "animate-pulse-slow" : ""}
          ${props.className}
        `}
      >
        {/* Ripple effect background */}
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className="absolute inset-0 bg-white/10"
        />

        {/* Content */}
        <span className="relative">{children}</span>
      </Button>
    </motion.div>
  )
}
