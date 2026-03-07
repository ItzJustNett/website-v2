"use client"

import { useEffect, useState } from "react"
import { PageTransition } from "@/components/page-transition"
import { GlassCard } from "@/components/immersive/glass-card"
import { ButtonEnhanced } from "@/components/immersive/button-enhanced"
import { SkeletonLoader } from "@/components/immersive/skeleton-loader"
import { EmptyState } from "@/components/immersive/empty-state"
import { motion } from "framer-motion"
import { BookOpen } from "lucide-react"
import { fetchWithAuth } from "@/lib/api"
import { useNotification } from "@/contexts/notification-context"
import Link from "next/link"

interface Lesson {
  id: string
  title: string
  description?: string
  difficulty?: string
  completed?: boolean
  xp_reward?: number
}

export default function LessonsPage() {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { error: showError } = useNotification()

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        setIsLoading(true)
        const data = await fetchWithAuth("/lessons")

        // Handle different response formats
        let lessonsData = []
        if (Array.isArray(data)) {
          lessonsData = data
        } else if (data && typeof data === "object") {
          // Try common response wrapper formats
          lessonsData = data.lessons || data.data || data.items || []
        }

        setLessons(lessonsData)
      } catch (err) {
        console.error("Error fetching lessons:", err)
        showError("Failed to load lessons")
        setLessons([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchLessons()
  }, [showError])

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

        {isLoading ? (
          <SkeletonLoader type="card" count={4} />
        ) : lessons.length === 0 ? (
          <EmptyState
            icon="📚"
            title="No lessons available"
            description="Check back soon for new learning content!"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lessons.map((lesson, index) => (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link href={`/lessons/${lesson.id}`}>
                  <GlassCard>
                    <h3 className="font-semibold text-lg mb-2">{lesson.title}</h3>
                    {lesson.description && (
                      <p className="text-sm text-muted-foreground mb-4">{lesson.description}</p>
                    )}
                    <div className="flex items-center justify-between mb-4">
                      {lesson.difficulty && (
                        <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary">
                          {lesson.difficulty}
                        </span>
                      )}
                      {lesson.xp_reward && (
                        <span className="text-xs text-yellow-500 font-semibold">
                          +{lesson.xp_reward} XP
                        </span>
                      )}
                    </div>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <ButtonEnhanced className="w-full" glow>
                        {lesson.completed ? "Review Lesson" : "Start Lesson"}
                      </ButtonEnhanced>
                    </motion.div>
                  </GlassCard>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </PageTransition>
  )
}
