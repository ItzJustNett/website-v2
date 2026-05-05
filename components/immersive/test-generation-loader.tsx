"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"
import { Zap, Brain, FileQuestion, CheckCircle2 } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export function TestGenerationLoader() {
  const [currentStep, setCurrentStep] = useState(0)
  const { t } = useLanguage()

  const steps = [
    { icon: Brain, label: t("testLoader.step1"), color: "text-purple-500" },
    { icon: FileQuestion, label: t("testLoader.step2"), color: "text-blue-500" },
    { icon: CheckCircle2, label: t("testLoader.step3"), color: "text-emerald-500" },
    { icon: Zap, label: t("testLoader.step4"), color: "text-yellow-500" },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length)
    }, 2800)
    return () => clearInterval(interval)
  }, [steps.length])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl p-8 backdrop-blur-md border bg-white/10 border-white/20"
    >
      <div className="flex flex-col items-center gap-6">
        {/* Animated brain icon */}
        <div className="relative">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border-2 border-dashed border-primary/30"
            style={{ width: 80, height: 80 }}
          />
          <motion.div
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center"
          >
            <motion.div
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <Zap className="w-9 h-9 text-primary" />
            </motion.div>
          </motion.div>

          {/* Orbiting particles */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-primary/60"
              animate={{
                x: [0, 30 * Math.cos((i * 2 * Math.PI) / 3), 0],
                y: [0, 30 * Math.sin((i * 2 * Math.PI) / 3), 0],
                opacity: [0.4, 1, 0.4],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.6,
                ease: "easeInOut",
              }}
              style={{
                top: "50%",
                left: "50%",
                marginTop: -4,
                marginLeft: -4,
              }}
            />
          ))}
        </div>

        {/* Title */}
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-1">{t("testLoader.title")}</h3>
          <p className="text-sm text-muted-foreground">{t("testLoader.subtitle")}</p>
        </div>

        {/* Steps */}
        <div className="w-full max-w-xs space-y-3">
          {steps.map((step, index) => {
            const Icon = step.icon
            const isActive = index === currentStep
            const isPast = index < currentStep

            return (
              <motion.div
                key={index}
                animate={{
                  opacity: isActive ? 1 : isPast ? 0.5 : 0.3,
                  x: isActive ? 4 : 0,
                }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-3"
              >
                <div className="relative">
                  <Icon className={`w-5 h-5 ${isActive ? step.color : "text-muted-foreground"}`} />
                  {isActive && (
                    <motion.div
                      layoutId="step-glow"
                      className="absolute inset-0 rounded-full"
                      style={{
                        boxShadow: "0 0 12px currentColor",
                      }}
                    />
                  )}
                </div>
                <span className={`text-sm font-medium ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                  {step.label}
                </span>
                {isActive && (
                  <motion.div
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="ml-auto flex gap-1"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <motion.span
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                      className="w-1.5 h-1.5 rounded-full bg-primary"
                    />
                    <motion.span
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                      className="w-1.5 h-1.5 rounded-full bg-primary"
                    />
                  </motion.div>
                )}
              </motion.div>
            )
          })}
        </div>

        {/* Progress bar */}
        <div className="w-full max-w-xs">
          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-primary via-blue-500 to-primary"
              animate={{
                width: ["0%", "100%"],
              }}
              transition={{
                duration: 2.8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  )
}
