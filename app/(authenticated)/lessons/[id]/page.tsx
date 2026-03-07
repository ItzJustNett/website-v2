"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { PageTransition } from "@/components/page-transition"
import { GlassCard } from "@/components/immersive/glass-card"
import { ButtonEnhanced } from "@/components/immersive/button-enhanced"
import { SkeletonLoader } from "@/components/immersive/skeleton-loader"
import { ErrorState } from "@/components/immersive/error-state"
import { motion } from "framer-motion"
import { ArrowLeft, BookOpen, Play } from "lucide-react"
import { fetchWithAuth } from "@/lib/api"
import { useNotification } from "@/contexts/notification-context"
import Link from "next/link"

interface Lesson {
  id: string
  lesson_id: string
  title: string
  description?: string
  content?: string
  difficulty?: string
  completed?: boolean
  xp_reward?: number
  course_id?: string
  youtube_link?: string
  exercises?: Exercise[]
  created_at?: string
}

interface Exercise {
  exercise_id: string
  question: string
  options: string[]
  correct_option: number
}

// Helper function to convert YouTube URL to embed URL
function getYouTubeEmbedUrl(url: string): string {
  if (!url) return ""

  // Handle various YouTube URL formats
  let videoId = ""

  // youtu.be format
  if (url.includes("youtu.be/")) {
    videoId = url.split("youtu.be/")[1].split("?")[0]
  }
  // youtube.com watch format
  else if (url.includes("youtube.com/watch")) {
    const params = new URL(url).searchParams
    videoId = params.get("v") || ""
  }
  // Already embed format
  else if (url.includes("youtube.com/embed/")) {
    videoId = url.split("youtube.com/embed/")[1].split("?")[0]
  }
  // youtube-nocookie embed format
  else if (url.includes("youtube-nocookie.com/embed/")) {
    return url
  }

  return videoId ? `https://www.youtube-nocookie.com/embed/${videoId}` : url
}

export default function LessonDetailPage() {
  const params = useParams()
  const lessonId = params?.id as string

  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { error: showError } = useNotification()

  useEffect(() => {
    if (!lessonId) return

    const fetchLesson = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const data = await fetchWithAuth(`/lessons/${lessonId}`)
        setLesson(data)
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Failed to load lesson"
        console.error("Error fetching lesson:", err)
        setError(errorMsg)
        showError(errorMsg)
      } finally {
        setIsLoading(false)
      }
    }

    fetchLesson()
  }, [lessonId, showError])

  if (isLoading) {
    return (
      <PageTransition>
        <div className="mb-6">
          <Link href="/lessons" className="flex items-center gap-2 text-primary hover:underline mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Lessons
          </Link>
        </div>
        <SkeletonLoader type="card" count={1} />
      </PageTransition>
    )
  }

  if (error || !lesson) {
    return (
      <PageTransition>
        <div className="mb-6">
          <Link href="/lessons" className="flex items-center gap-2 text-primary hover:underline mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Lessons
          </Link>
        </div>
        <ErrorState
          icon="⚠️"
          title="Lesson not found"
          description={error || "The lesson you're looking for doesn't exist."}
        />
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Back button */}
        <Link href="/lessons" className="flex items-center gap-2 text-primary hover:underline mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Lessons
        </Link>

        {/* Lesson Header */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold mb-4 flex items-center gap-3">
            <BookOpen className="w-10 h-10" />
            {lesson.title}
          </h1>

          <div className="flex flex-wrap gap-4 mb-4">
            {lesson.difficulty && (
              <span className="text-sm px-3 py-1 rounded-full bg-primary/20 text-primary font-medium">
                {lesson.difficulty}
              </span>
            )}
            {lesson.xp_reward && (
              <span className="text-sm px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-500 font-semibold">
                +{lesson.xp_reward} XP
              </span>
            )}
            {lesson.completed && (
              <span className="text-sm px-3 py-1 rounded-full bg-green-500/20 text-green-500 font-medium">
                ✓ Completed
              </span>
            )}
          </div>
        </div>

        {/* YouTube Video Section */}
        {lesson.youtube_link && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8"
          >
            <GlassCard>
              <h2 className="text-lg font-semibold mb-4">Lesson Video</h2>
              <div className="aspect-video bg-black rounded-lg overflow-hidden">
                <iframe
                  width="100%"
                  height="100%"
                  src={getYouTubeEmbedUrl(lesson.youtube_link)}
                  title={lesson.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  loading="lazy"
                  className="w-full h-full"
                />
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* Description */}
        {lesson.description && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-6"
          >
            <GlassCard>
              <h2 className="text-xl font-semibold mb-3">Overview</h2>
              <p className="text-muted-foreground leading-relaxed">{lesson.description}</p>
            </GlassCard>
          </motion.div>
        )}

        {/* Content */}
        {lesson.content && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-6"
          >
            <GlassCard>
              <h2 className="text-xl font-semibold mb-3">Content</h2>
              <div className="prose prose-invert max-w-none">
                {lesson.content}
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex gap-4 flex-wrap"
        >
          <ButtonEnhanced glow className="flex items-center gap-2">
            <Play className="w-4 h-4" />
            {lesson.completed ? "Review Lesson" : "Start Lesson"}
          </ButtonEnhanced>
          <ButtonEnhanced variant="outline">
            Generate Test
          </ButtonEnhanced>
          <ButtonEnhanced variant="outline">
            Generate Summary
          </ButtonEnhanced>
        </motion.div>
      </motion.div>
    </PageTransition>
  )
}
