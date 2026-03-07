"use client"

import { motion } from "framer-motion"
import { ReactNode } from "react"
import { pageTransition } from "@/lib/motion-config"

export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={pageTransition.initial}
      animate={pageTransition.animate}
      exit={pageTransition.exit}
      transition={pageTransition.transition}
    >
      {children}
    </motion.div>
  )
}
