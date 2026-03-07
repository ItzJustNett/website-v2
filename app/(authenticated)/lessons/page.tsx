"use client"

import { PageTransition } from "@/components/page-transition"
import { GlassCard } from "@/components/immersive/glass-card"
import { motion } from "framer-motion"
import { BookOpen } from "lucide-react"

export default function LessonsPage() {
  const lessons = [
    { id: 1, title: "Getting Started with React", difficulty: "Beginner", completed: true },
    { id: 2, title: "React Hooks Deep Dive", difficulty: "Intermediate", completed: true },
    { id: 3, title: "Advanced TypeScript Patterns", difficulty: "Advanced", completed: false },
    { id: 4, title: "Performance Optimization", difficulty: "Intermediate", completed: false },
  ]

  return (
    <PageTransition>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
          <BookOpen className="w-8 h-8" />
          Lessons
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {lessons.map((lesson) => (
            <GlassCard key={lesson.id}>
              <h3 className="font-semibold text-lg mb-2">{lesson.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{lesson.difficulty}</p>
              <div className="flex items-center justify-between">
                <span className={lesson.completed ? "text-green-500" : "text-yellow-500"}>
                  {lesson.completed ? "Completed ✓" : "In Progress"}
                </span>
              </div>
            </GlassCard>
          ))}
        </div>
      </motion.div>
    </PageTransition>
  )
}
