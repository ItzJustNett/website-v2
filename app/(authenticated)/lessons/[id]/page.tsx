"use client"

import { useCallback, useEffect, useRef, useState } from "react"
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

// Helper function to extract YouTube video ID from various URL formats
function getYouTubeVideoId(url: string): string {
  if (!url) return ""

  // youtu.be format
  if (url.includes("youtu.be/")) {
    return url.split("youtu.be/")[1].split("?")[0]
  }
  // youtube.com watch format
  if (url.includes("youtube.com/watch")) {
    try {
      return new URL(url).searchParams.get("v") || ""
    } catch {
      return ""
    }
  }
  // embed format
  if (url.includes("youtube.com/embed/") || url.includes("youtube-nocookie.com/embed/")) {
    return url.split("/embed/")[1].split("?")[0]
  }

  return ""
}

function YouTubePlayer({ url, title }: { url: string; title: string }) {
  const [activated, setActivated] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<unknown>(null)
  const videoId = getYouTubeVideoId(url)

  const initPlayer = useCallback(() => {
    if (!containerRef.current || !videoId || playerRef.current) return

    const createPlayer = () => {
      playerRef.current = new window.YT.Player(containerRef.current!, {
        videoId,
        host: "https://www.youtube-nocookie.com",
        playerVars: {
          autoplay: 1,
          modestbranding: 1,
          rel: 0,
          origin: window.location.origin,
        },
      })
    }

    // Load YT API if not already loaded
    if (typeof window.YT !== "undefined" && window.YT.Player) {
      createPlayer()
      return
    }

    ;(window as unknown as Record<string, unknown>).onYouTubeIframeAPIReady = () => createPlayer()

    if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
      const script = document.createElement("script")
      script.src = "https://www.youtube.com/iframe_api"
      document.head.appendChild(script)
    }
  }, [videoId])

  useEffect(() => {
    if (activated) initPlayer()
  }, [activated, initPlayer])

  useEffect(() => {
    return () => {
      playerRef.current?.destroy()
      playerRef.current = null
    }
  }, [])

  if (!videoId) return null

  if (activated) {
    return <div ref={containerRef} className="w-full h-full" />
  }

  return (
    <button
      onClick={() => setActivated(true)}
      className="relative w-full h-full group cursor-pointer"
      aria-label={`Play ${title}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
        alt={title}
        className="w-full h-full object-cover"
        onError={(e) => {
          (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
        }}
      />
      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-red-600 group-hover:bg-red-500 transition-colors flex items-center justify-center shadow-lg">
          <Play className="w-7 h-7 text-white fill-white ml-1" />
        </div>
      </div>
    </button>
  )
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
          message={error || "The lesson you're looking for doesn't exist."}
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
                <YouTubePlayer url={lesson.youtube_link} title={lesson.title} />
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
