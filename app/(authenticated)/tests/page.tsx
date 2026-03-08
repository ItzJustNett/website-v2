"use client"

import { useEffect, useState } from "react"
import { PageTransition } from "@/components/page-transition"
import { GlassCard } from "@/components/immersive/glass-card"
import { ButtonEnhanced } from "@/components/immersive/button-enhanced"
import { motion } from "framer-motion"
import { Zap, BookOpen } from "lucide-react"
import { fetchWithAuth } from "@/lib/api"
import { useNotification } from "@/contexts/notification-context"
import { SkeletonLoader } from "@/components/immersive/skeleton-loader"
import { EmptyState } from "@/components/immersive/empty-state"

interface Lesson {
  id: string
  title: string
  difficulty?: string
}

export default function TestsPage() {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [creatingTest, setCreatingTest] = useState<string | null>(null)
  const { error: showError, success: showSuccess } = useNotification()

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        setIsLoading(true)
        const data = await fetchWithAuth("/lessons")

        // Handle different response formats
        let lessonsData: Lesson[] = []
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

  const handleCreateTest = async (lessonId: string) => {
    try {
      setCreatingTest(lessonId)
      await fetchWithAuth(`/lessons/${lessonId}/test`, {
        method: "GET",
      })
      showSuccess("Test created! Starting test...")
      // In a real app, you'd navigate to the test taking interface
      // For now, just show success
      setCreatingTest(null)
    } catch (err) {
      console.error("Error creating test:", err)
      showError("Failed to create test")
      setCreatingTest(null)
    }
  }

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

        <div className="mb-6 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
          <p className="text-sm text-muted-foreground">
            Select a lesson to create and take a test. Tests help reinforce what you&apos;ve learned!
          </p>
        </div>

        {isLoading ? (
          <SkeletonLoader type="card" count={3} />
        ) : lessons.length === 0 ? (
          <EmptyState
            icon="📝"
            title="No lessons to test"
            description="Complete some lessons first, then you can create tests to reinforce your knowledge!"
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
                <GlassCard>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">{lesson.title}</h3>
                      <p className="text-xs text-muted-foreground">Test your knowledge</p>
                    </div>
                    <BookOpen className="w-5 h-5 text-blue-500 flex-shrink-0 ml-2" />
                  </div>

                  {lesson.difficulty && (
                    <div className="flex items-center justify-between mb-4 text-sm text-muted-foreground">
                      <span>{lesson.difficulty}</span>
                    </div>
                  )}

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <ButtonEnhanced
                      onClick={() => handleCreateTest(lesson.id)}
                      disabled={creatingTest === lesson.id}
                      className="w-full"
                      glow
                    >
                      {creatingTest === lesson.id ? "Creating Test..." : "Create & Start Test"}
                    </ButtonEnhanced>
                  </motion.div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </PageTransition>
  )
}
