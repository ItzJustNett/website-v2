"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { PageTransition } from "@/components/page-transition"
import { GlassCard } from "@/components/immersive/glass-card"
import { ButtonEnhanced } from "@/components/immersive/button-enhanced"
import { SkeletonLoader } from "@/components/immersive/skeleton-loader"
import { ErrorState } from "@/components/immersive/error-state"
import { motion } from "framer-motion"
import { ArrowLeft, BookOpen, Play, Send } from "lucide-react"
import { fetchWithAuth } from "@/lib/api"
import { useNotification } from "@/contexts/notification-context"
import Link from "next/link"

interface Message {
  id: string
  text: string
  sender: "user" | "ai"
  timestamp: Date
}

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

  let videoId = ""

  if (url.includes("youtu.be/")) {
    videoId = url.split("youtu.be/")[1].split("?")[0]
  } else if (url.includes("youtube.com/watch")) {
    try {
      videoId = new URL(url).searchParams.get("v") || ""
    } catch {
      return url
    }
  } else if (url.includes("youtube.com/embed/")) {
    return url
  }

  return videoId ? `https://www.youtube.com/embed/${videoId}` : url
}

export default function LessonDetailPage() {
  const params = useParams()
  const router = useRouter()
  const lessonId = params?.id as string

  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi! 👋 I'm your AI assistant. Ask me anything about this lesson!",
      sender: "ai",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [isCreatingTest, setIsCreatingTest] = useState(false)
  const { error: showError, success: showSuccess } = useNotification()

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsSending(true)

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "That's a great question! I'm currently learning about this topic. You can ask me about the lesson content, and I'll do my best to help! 🤖",
        sender: "ai",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiMessage])
      setIsSending(false)
    }, 1000)
  }

  const handleCreateTest = async () => {
    try {
      setIsCreatingTest(true)
      await fetchWithAuth(`/lessons/${lessonId}/test`, {
        method: "GET",
      })
      showSuccess("Test created! Scroll down to view the test.")
    } catch (err) {
      console.error("Error creating test:", err)
      showError("Failed to create test")
    } finally {
      setIsCreatingTest(false)
    }
  }

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
          <h1 className="text-3xl font-bold mb-3 flex items-center gap-3">
            <BookOpen className="w-8 h-8" />
            {lesson.title}
          </h1>

          <div className="flex flex-wrap gap-3">
            {lesson.difficulty && (
              <span className="text-xs px-3 py-1 rounded-full bg-primary/20 text-primary font-medium">
                {lesson.difficulty}
              </span>
            )}
            {lesson.xp_reward && (
              <span className="text-xs px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-500 font-semibold">
                +{lesson.xp_reward} XP
              </span>
            )}
            {lesson.completed && (
              <span className="text-xs px-3 py-1 rounded-full bg-green-500/20 text-green-500 font-medium">
                ✓ Completed
              </span>
            )}
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-300px)]">
          {/* Left Column - Video and Content */}
          <div className="lg:col-span-2 flex flex-col gap-6 overflow-y-auto">
            {/* YouTube Video Section */}
            {lesson.youtube_link && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <GlassCard className="h-96">
                  <div className="aspect-video bg-black rounded-lg overflow-hidden h-full">
                    <iframe
                      width="100%"
                      height="100%"
                      src={getYouTubeEmbedUrl(lesson.youtube_link)}
                      title={lesson.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
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
              >
                <GlassCard>
                  <h2 className="text-lg font-semibold mb-3">Overview</h2>
                  <p className="text-muted-foreground text-sm leading-relaxed">{lesson.description}</p>
                </GlassCard>
              </motion.div>
            )}

            {/* Content */}
            {lesson.content && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <GlassCard>
                  <h2 className="text-lg font-semibold mb-3">Content</h2>
                  <div className="prose prose-invert prose-sm max-w-none">
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
              className="flex gap-3 flex-wrap"
            >
              <ButtonEnhanced glow className="flex items-center gap-2 text-sm">
                <Play className="w-4 h-4" />
                {lesson.completed ? "Review" : "Start"}
              </ButtonEnhanced>
              <ButtonEnhanced
                variant="outline"
                className="text-sm"
                onClick={handleCreateTest}
                disabled={isCreatingTest}
              >
                {isCreatingTest ? "Creating..." : "Test"}
              </ButtonEnhanced>
              <ButtonEnhanced variant="outline" className="text-sm">
                Summary
              </ButtonEnhanced>
            </motion.div>
          </div>

          {/* Right Column - AI Chat */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <GlassCard className="h-full flex flex-col">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span>🤖</span> AI Assistant
              </h2>

              {/* Messages Container */}
              <div className="flex-1 overflow-y-auto mb-4 space-y-3 pr-2">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                        msg.sender === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isSending && (
                  <div className="flex justify-start">
                    <div className="bg-muted text-muted-foreground px-3 py-2 rounded-lg text-sm">
                      <span className="animate-pulse">Thinking...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Ask a question..."
                  className="flex-1 px-3 py-2 rounded-lg bg-secondary text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  disabled={isSending}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={isSending || !inputValue.trim()}
                  className="px-3 py-2 rounded-lg bg-primary hover:bg-primary/90 disabled:opacity-50 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </motion.div>
    </PageTransition>
  )
}
