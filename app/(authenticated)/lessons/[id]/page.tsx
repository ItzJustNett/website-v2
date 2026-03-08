"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { PageTransition } from "@/components/page-transition"
import { GlassCard } from "@/components/immersive/glass-card"
import { ButtonEnhanced } from "@/components/immersive/button-enhanced"
import { SkeletonLoader } from "@/components/immersive/skeleton-loader"
import { ErrorState } from "@/components/immersive/error-state"
import { motion } from "framer-motion"
import { ArrowLeft, BookOpen, Play, Send, Zap } from "lucide-react"
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

interface TestQuestion {
  question: string
  options: string[]
  correct_answer: number
}

interface Test {
  lesson_id: string
  title: string
  questions: TestQuestion[]
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
  const [test, setTest] = useState<Test | null>(null)
  const [testAnswers, setTestAnswers] = useState<Record<number, number>>({})
  const [showTestResults, setShowTestResults] = useState(false)
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
      const testData = await fetchWithAuth(`/lessons/${lessonId}/test`, {
        method: "GET",
      })
      setTest(testData)
      setTestAnswers({})
      setShowTestResults(false)
      showSuccess("Test created! Scroll down to view the test.")
    } catch (err) {
      console.error("Error creating test:", err)
      showError("Failed to create test")
    } finally {
      setIsCreatingTest(false)
    }
  }

  const handleSelectAnswer = (questionIndex: number, optionIndex: number) => {
    setTestAnswers((prev) => ({
      ...prev,
      [questionIndex]: optionIndex,
    }))
  }

  const handleSubmitTest = () => {
    setShowTestResults(true)
  }

  const calculateScore = () => {
    if (!test) return 0
    let correct = 0
    test.questions.forEach((q, idx) => {
      if (testAnswers[idx] === q.correct_answer) {
        correct++
      }
    })
    return Math.round((correct / test.questions.length) * 100)
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
        className="h-screen flex flex-col"
      >
        {/* Header with lesson name */}
        <div className="sticky top-0 z-40 border-b border-secondary bg-background flex items-center justify-between h-16 px-6 gap-4">
          <div className="flex items-center gap-4">
            <Link href="/lessons" className="text-primary hover:opacity-70 transition">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-lg font-bold truncate flex-1">{lesson.title}</h1>
          </div>
          <div className="flex items-center gap-2">
            {lesson.difficulty && (
              <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary font-medium">
                {lesson.difficulty}
              </span>
            )}
            {lesson.completed && (
              <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-500">
                ✓ Completed
              </span>
            )}
          </div>
        </div>

        {/* Two Column Layout - Main content area */}
        <div className="flex-1 flex overflow-hidden gap-4 px-6 pb-6">
          {/* Left Column - Video (fills space) */}
          <div className="flex-1 flex flex-col gap-4 overflow-y-auto">
            {/* YouTube Video Section - Fill available space */}
            {lesson.youtube_link && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="flex-1"
              >
                <div className="w-full h-full bg-black rounded-lg overflow-hidden">
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
              </motion.div>
            )}

            {/* Test Section */}
            {test && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <GlassCard>
                  <h2 className="text-2xl font-bold mb-6">Test: {test.title}</h2>

                  {!showTestResults ? (
                    <div className="space-y-6">
                      {test.questions.map((question, qIdx) => (
                        <div key={qIdx} className="border-b border-secondary pb-6 last:border-0">
                          <p className="font-semibold mb-4 text-lg">
                            {qIdx + 1}. {question.question}
                          </p>
                          <div className="space-y-2">
                            {question.options.map((option, oIdx) => (
                              <button
                                key={oIdx}
                                onClick={() => handleSelectAnswer(qIdx, oIdx)}
                                className={`w-full text-left p-3 rounded-lg border-2 transition-colors ${
                                  testAnswers[qIdx] === oIdx
                                    ? "border-primary bg-primary/10"
                                    : "border-secondary hover:border-primary/50"
                                }`}
                              >
                                <span className="font-medium mr-2">
                                  {String.fromCharCode(65 + oIdx)}.
                                </span>
                                {option}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                      <ButtonEnhanced
                        onClick={handleSubmitTest}
                        glow
                        className="w-full mt-6"
                      >
                        Submit Test
                      </ButtonEnhanced>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="text-center py-8">
                        <div className="text-5xl font-bold text-primary mb-2">
                          {calculateScore()}%
                        </div>
                        <p className="text-muted-foreground">
                          {Object.keys(testAnswers).length} out of {test.questions.length} questions answered
                        </p>
                      </div>

                      {test.questions.map((question, qIdx) => {
                        const userAnswer = testAnswers[qIdx]
                        const isCorrect = userAnswer === question.correct_answer
                        return (
                          <div
                            key={qIdx}
                            className={`border-l-4 p-4 rounded ${
                              isCorrect
                                ? "border-green-500 bg-green-500/10"
                                : "border-red-500 bg-red-500/10"
                            }`}
                          >
                            <p className="font-semibold mb-2">
                              {qIdx + 1}. {question.question}
                            </p>
                            <p className="text-sm mb-2">
                              Your answer: {userAnswer !== undefined ? question.options[userAnswer] : "Not answered"}
                            </p>
                            {!isCorrect && (
                              <p className="text-sm text-green-400">
                                Correct answer: {question.options[question.correct_answer]}
                              </p>
                            )}
                          </div>
                        )
                      })}

                      <ButtonEnhanced
                        onClick={() => {
                          setTest(null)
                          setTestAnswers({})
                          setShowTestResults(false)
                        }}
                        variant="outline"
                        className="w-full"
                      >
                        Retake Test
                      </ButtonEnhanced>
                    </div>
                  )}
                </GlassCard>
              </motion.div>
            )}
          </div>

          {/* Right Column - Tools Sidebar (thin) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="w-20 flex flex-col gap-2"
          >
            <ButtonEnhanced
              glow
              className="flex flex-col items-center justify-center w-full h-16 text-xs"
              title="Start lesson"
            >
              <Play className="w-5 h-5 mb-1" />
              <span>Start</span>
            </ButtonEnhanced>

            <ButtonEnhanced
              variant="outline"
              className="flex flex-col items-center justify-center w-full h-16 text-xs"
              onClick={handleCreateTest}
              disabled={isCreatingTest}
              title="Take test"
            >
              <Zap className="w-5 h-5 mb-1" />
              <span className="text-[10px]">{isCreatingTest ? "..." : "Test"}</span>
            </ButtonEnhanced>

            <ButtonEnhanced
              variant="outline"
              className="flex flex-col items-center justify-center w-full h-16 text-xs"
              title="Generate summary"
            >
              <BookOpen className="w-5 h-5 mb-1" />
              <span>Summary</span>
            </ButtonEnhanced>
          </motion.div>
        </div>
      </motion.div>
    </PageTransition>
  )
}
