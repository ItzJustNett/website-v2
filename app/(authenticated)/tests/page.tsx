"use client"

import { PageTransition } from "@/components/page-transition"
import { GlassCard } from "@/components/immersive/glass-card"
import { ButtonEnhanced } from "@/components/immersive/button-enhanced"
import { motion } from "framer-motion"
import { Zap } from "lucide-react"

export default function TestsPage() {
  const tests = [
    { id: 1, title: "React Fundamentals Quiz", questions: 10, difficulty: "Beginner" },
    { id: 2, title: "Hooks Challenge", questions: 15, difficulty: "Intermediate" },
    { id: 3, title: "TypeScript Mastery", questions: 20, difficulty: "Advanced" },
  ]

  return (
    <PageTransition>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
          <Zap className="w-8 h-8" />
          Tests
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tests.map((test) => (
            <GlassCard key={test.id}>
              <h3 className="font-semibold text-lg mb-2">{test.title}</h3>
              <div className="flex items-center justify-between mb-4 text-sm text-muted-foreground">
                <span>{test.questions} questions</span>
                <span>{test.difficulty}</span>
              </div>
              <ButtonEnhanced className="w-full" glow>
                Start Test
              </ButtonEnhanced>
            </GlassCard>
          ))}
        </div>
      </motion.div>
    </PageTransition>
  )
}
