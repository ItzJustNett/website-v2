"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { PageTransition } from "@/components/page-transition"
import { GlassCard } from "@/components/immersive/glass-card"
import { ButtonEnhanced } from "@/components/immersive/button-enhanced"
import { SkeletonLoader } from "@/components/immersive/skeleton-loader"
import { ErrorState } from "@/components/immersive/error-state"
import { TestGenerationLoader } from "@/components/immersive/test-generation-loader"
import { motion, AnimatePresence } from "framer-motion"
import { BookOpen, Play, Send, Zap, ChevronUp, ChevronDown } from "lucide-react"
import { api } from "@/lib/api-client"
import { fetchWithAuth } from "@/lib/api"
import { useNotification } from "@/contexts/notification-context"
import { useProfile } from "@/contexts/profile-context"
import { useLanguage } from "@/contexts/language-context"

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

interface Summary {
  lesson_id: string
  title: string
  summary: string
  key_points: string[]
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
  const searchParams = useSearchParams()
  const lessonId = params?.id as string
  const summaryIdParam = searchParams.get("summaryId")
  const testIdParam = searchParams.get("testId")
  const { t } = useLanguage()

  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [isCreatingTest, setIsCreatingTest] = useState(false)
  const [test, setTest] = useState<Test | null>(null)
  const [testAnswers, setTestAnswers] = useState<Record<number, number>>({})
  const [showTestResults, setShowTestResults] = useState(false)
  const [testRewards, setTestRewards] = useState<{meowcoins_earned: number, xp_earned: number} | null>(null)
  const [isSubmittingTest, setIsSubmittingTest] = useState(false)
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false)
  const [summary, setSummary] = useState<Summary | null>(null)
  const [videoCollapsed, setVideoCollapsed] = useState(false)
  const [isCompletingLesson, setIsCompletingLesson] = useState(false)
  const { error: showError, success: showSuccess } = useNotification()
  const { updateMeowcoins } = useProfile()

  // Initialize AI greeting message
  useEffect(() => {
    setMessages([{
      id: "1",
      text: t("lessonDetail.aiGreeting"),
      sender: "ai",
      timestamp: new Date(),
    }])
  }, [t])

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
        text: t("lessonDetail.aiResponse"),
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

      // Display test inline
      setTest(testData)
      setTestAnswers({})
      setShowTestResults(false)
      showSuccess(t("lessonDetail.testCreated"))
    } catch (err) {
      console.error("Error creating test:", err)
      showError(t("lessonDetail.testCreateError"))
    } finally {
      setIsCreatingTest(false)
    }
  }

  const handleCompleteLesson = async () => {
    console.log('START BUTTON CLICKED!')
    try {
      setIsCompletingLesson(true)
      console.log('[Lesson] Marking lesson as complete:', lessonId)

      const result = await fetchWithAuth(`/lessons/${lessonId}/complete`, {
        method: "POST",
      })

      console.log('[Lesson] Complete response:', result)

      if (result.success) {
        if (result.already_completed) {
          console.log('[Lesson] Already completed')
        } else {
          showSuccess(t("lessonDetail.lessonCompleted", { xp: result.xp_earned, coins: result.meowcoins_earned }))

          if (result.total_meowcoins !== undefined) {
            console.log('[Lesson] Updating meowcoins:', result.total_meowcoins)
            updateMeowcoins(result.total_meowcoins)
          }
        }

        setLesson((prev) => prev ? { ...prev, completed: true } : null)
      }
    } catch (err) {
      console.error("Error completing lesson:", err)
      showError(t("lessonDetail.lessonCompleteError"))
    } finally {
      setIsCompletingLesson(false)
    }
  }

  const handleGenerateSummary = async () => {
    try {
      setIsGeneratingSummary(true)
      const summaryData = await fetchWithAuth(`/lessons/${lessonId}/conspect`, {
        method: "GET",
      })

      setSummary(summaryData)
      showSuccess(t("lessonDetail.summaryGenerated"))

      if (!lesson?.completed) {
        await handleCompleteLesson()
      }
    } catch (err) {
      console.error("Error generating summary:", err)
      showError(t("lessonDetail.summaryGenerateError"))
    } finally {
      setIsGeneratingSummary(false)
    }
  }

  const handleSelectAnswer = (questionIndex: number, optionIndex: number) => {
    setTestAnswers((prev) => ({
      ...prev,
      [questionIndex]: optionIndex,
    }))
  }

  const handleSubmitTest = async () => {
    if (!test) return

    try {
      setIsSubmittingTest(true)

      let correct = 0
      test.questions.forEach((q, idx) => {
        if (testAnswers[idx] === q.correct_answer) {
          correct++
        }
      })

      const result = await fetchWithAuth(`/lessons/${lessonId}/test/submit`, {
        method: "POST",
        body: JSON.stringify({
          score: correct,
          total_questions: test.questions.length
        })
      })

      console.log('[Test] Submission result:', result)

      setTestRewards({
        meowcoins_earned: result.meowcoins_earned,
        xp_earned: result.xp_earned
      })
      setShowTestResults(true)

      if (result.total_meowcoins !== undefined) {
        console.log('[Test] Updating meowcoins to:', result.total_meowcoins)
        updateMeowcoins(result.total_meowcoins)
      }

      showSuccess(t("lessonDetail.testSuccess", { coins: result.meowcoins_earned }))
    } catch (err) {
      console.error("Error submitting test:", err)
      showError(t("lessonDetail.testSubmitError"))
      setShowTestResults(true)
    } finally {
      setIsSubmittingTest(false)
    }
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

  // Load saved summary/test from query params
  useEffect(() => {
    if (isLoading) return

    const loadSavedContent = async () => {
      if (summaryIdParam) {
        try {
          const data = await fetchWithAuth(`/saved-summaries/${summaryIdParam}`)
          setSummary({ title: data.title, summary: data.summary, key_points: data.key_points, lesson_id: lessonId })
        } catch (err) {
          console.error("Error loading saved summary:", err)
          showError(t("lessonDetail.savedSummaryError"))
        }
      }
      if (testIdParam) {
        try {
          const data = await fetchWithAuth(`/saved-tests/${testIdParam}`)
          const testContent = data.test_content
          setTest({ title: testContent.title, questions: testContent.questions, lesson_id: lessonId })
          setTestAnswers({})
          setShowTestResults(false)
        } catch (err) {
          console.error("Error loading saved test:", err)
          showError(t("lessonDetail.savedTestError"))
        }
      }
    }

    loadSavedContent()
  }, [isLoading, summaryIdParam, testIdParam, lessonId, showError, t])

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
        <SkeletonLoader type="card" count={1} />
      </PageTransition>
    )
  }

  if (error || !lesson) {
    return (
      <PageTransition>
        <ErrorState
          icon="⚠️"
          title={t("lessonDetail.notFoundTitle")}
          message={error || t("lessonDetail.notFoundMessage")}
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
        className="min-h-screen"
      >
        {/* YouTube Video Section - Collapsible */}
        {lesson.youtube_link && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full bg-black relative"
          >
            {/* Collapse/Expand Button */}
            <button
              onClick={() => setVideoCollapsed(!videoCollapsed)}
              className="absolute top-4 left-4 z-50 px-3 py-1.5 rounded-full bg-black/80 backdrop-blur text-white font-medium hover:bg-black/90 transition-colors flex items-center gap-2"
            >
              {videoCollapsed ? (
                <>
                  <ChevronDown className="w-4 h-4" />
                  {t("lessonDetail.showVideo")}
                </>
              ) : (
                <>
                  <ChevronUp className="w-4 h-4" />
                  {t("lessonDetail.hideVideo")}
                </>
              )}
            </button>

            {!videoCollapsed && (
              <div className="w-full aspect-video max-h-[60vh]">
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
            )}
          </motion.div>
        )}

        {/* Lesson header + actions */}
        <div className="px-6 pt-6 pb-4 border-b border-foreground/10">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-sans font-bold text-foreground mb-1">
                {lesson.title}
              </h1>
              {lesson.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {lesson.description}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {lesson.difficulty && (
                <span className="text-xs px-3 py-1.5 rounded-full border border-foreground/20 font-medium">
                  {lesson.difficulty}
                </span>
              )}
              {lesson.completed && (
                <span className="text-xs px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/30 text-green-600 dark:text-green-400 font-medium">
                  {t("lessonDetail.completed")}
                </span>
              )}
            </div>
          </div>

          {/* Action buttons - horizontal toolbar */}
          <div className="flex items-center gap-3">
            <ButtonEnhanced
              glow={!lesson?.completed}
              className="flex items-center gap-2 px-5 py-2.5"
              onClick={handleCompleteLesson}
              disabled={isCompletingLesson || lesson?.completed}
            >
              <Play className="w-4 h-4" />
              <span className="text-sm font-medium">
                {isCompletingLesson ? "..." : lesson?.completed ? t("lessonDetail.completed") : t("lessonDetail.startLesson")}
              </span>
            </ButtonEnhanced>

            <ButtonEnhanced
              variant="outline"
              className="flex items-center gap-2 px-5 py-2.5"
              onClick={handleCreateTest}
              disabled={isCreatingTest}
            >
              {isCreatingTest ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Zap className="w-4 h-4" />
                </motion.div>
              ) : (
                <Zap className="w-4 h-4" />
              )}
              <span className="text-sm font-medium">
                {isCreatingTest ? t("lessonDetail.generating") : t("lessonDetail.generateTest")}
              </span>
            </ButtonEnhanced>

            <ButtonEnhanced
              onClick={handleGenerateSummary}
              disabled={isGeneratingSummary}
              variant="outline"
              className="flex items-center gap-2 px-5 py-2.5"
            >
              <BookOpen className="w-4 h-4" />
              <span className="text-sm font-medium">
                {isGeneratingSummary ? t("lessonDetail.generating") : t("lessonDetail.generateSummary")}
              </span>
            </ButtonEnhanced>
          </div>
        </div>

        {/* Content area */}
        <div className="p-6 space-y-4">

          {/* Test Generation Loading Animation */}
          <AnimatePresence>
            {isCreatingTest && (
              <TestGenerationLoader />
            )}
          </AnimatePresence>

          {/* Test Section */}
          {test && !isCreatingTest && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <GlassCard hover={false}>
                <h2 className="text-2xl font-sans font-bold mb-6">{t("lessonDetail.testTitle", { title: test.title })}</h2>

                {!showTestResults ? (
                  <div className="space-y-6">
                    {test.questions.map((question, qIdx) => (
                      <div key={qIdx} className="border-b border-foreground/10 pb-6 last:border-0">
                        <p className="font-sans font-semibold mb-4 text-lg">
                          {qIdx + 1}. {question.question}
                        </p>
                        <div className="space-y-2">
                          {question.options.map((option, oIdx) => (
                            <button
                              key={oIdx}
                              onClick={() => handleSelectAnswer(qIdx, oIdx)}
                              className={`w-full text-left p-3 rounded-lg border-2 transition-colors font-sans ${
                                testAnswers[qIdx] === oIdx
                                  ? "border-primary bg-primary/10"
                                  : "border-foreground/10 hover:border-primary/50"
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
                      disabled={isSubmittingTest || Object.keys(testAnswers).length === 0}
                      glow
                      className="w-full mt-6"
                    >
                      {isSubmittingTest ? t("lessonDetail.submitting") : t("lessonDetail.submitTest")}
                    </ButtonEnhanced>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="text-center py-8">
                      <div className="text-5xl font-bold text-primary mb-2">
                        {calculateScore()}%
                      </div>
                      <p className="text-muted-foreground mb-4">
                        {t("lessonDetail.answeredOf", { answered: Object.keys(testAnswers).length, total: test.questions.length })}
                      </p>

                      {/* Rewards Display */}
                      {testRewards && (
                        <div className="flex items-center justify-center gap-6 mt-6">
                          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                            <span className="text-2xl">🪙</span>
                            <div>
                              <div className="text-sm text-muted-foreground">{t("lessonDetail.coinsEarned")}</div>
                              <div className="text-xl font-bold text-yellow-500">+{testRewards.meowcoins_earned}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                            <span className="text-2xl">⚡</span>
                            <div>
                              <div className="text-sm text-muted-foreground">{t("lessonDetail.xpEarned")}</div>
                              <div className="text-xl font-bold text-blue-500">+{testRewards.xp_earned}</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {test.questions.map((question, qIdx) => {
                      const userAnswer = testAnswers[qIdx]
                      const isCorrect = userAnswer === question.correct_answer
                      return (
                        <div
                          key={qIdx}
                          className={`border-l-4 p-4 rounded font-sans ${
                            isCorrect
                              ? "border-green-500 bg-green-500/10"
                              : "border-red-500 bg-red-500/10"
                          }`}
                        >
                          <p className="font-semibold mb-2">
                            {qIdx + 1}. {question.question}
                          </p>
                          <p className="text-sm mb-2">
                            {t("lessonDetail.yourAnswer", { answer: userAnswer !== undefined ? question.options[userAnswer] : t("lessonDetail.notAnswered") })}
                          </p>
                          {!isCorrect && (
                            <p className="text-sm text-green-600 dark:text-green-400">
                              {t("lessonDetail.correctAnswer", { answer: question.options[question.correct_answer] })}
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
                        setTestRewards(null)
                      }}
                      variant="outline"
                      className="w-full"
                    >
                      {t("lessonDetail.retakeTest")}
                    </ButtonEnhanced>
                  </div>
                )}
              </GlassCard>
            </motion.div>
          )}

          {/* Summary Section */}
          {summary && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <GlassCard hover={false}>
                <h2 className="text-2xl font-sans font-bold mb-6">{t("lessonDetail.summaryTitle", { title: summary.title })}</h2>

                <div className="space-y-6">
                  {/* Main Summary Text */}
                  <div className="max-w-none">
                    <p className="text-base font-sans leading-relaxed whitespace-pre-wrap text-foreground">
                      {summary.summary}
                    </p>
                  </div>

                  {/* Key Points */}
                  {summary.key_points && summary.key_points.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-lg font-sans font-semibold mb-4">{t("lessonDetail.keyPoints")}</h3>
                      <ul className="space-y-2">
                        {summary.key_points.map((point, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20 font-sans"
                          >
                            <span className="text-primary font-bold mt-0.5">
                              {idx + 1}.
                            </span>
                            <span className="flex-1">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Close Button */}
                  <ButtonEnhanced
                    onClick={() => setSummary(null)}
                    variant="outline"
                    className="w-full mt-6"
                  >
                    {t("lessonDetail.closeSummary")}
                  </ButtonEnhanced>
                </div>
              </GlassCard>
            </motion.div>
          )}

          {/* Empty state when no test or summary is shown */}
          {!test && !summary && (
            <div className="text-center py-16 text-muted-foreground">
              <p className="text-lg font-sans mb-2">{t("lessonDetail.emptyTitle")}</p>
              <p className="text-sm">{t("lessonDetail.emptySubtitle")}</p>
            </div>
          )}
        </div>
      </motion.div>
    </PageTransition>
  )
}
