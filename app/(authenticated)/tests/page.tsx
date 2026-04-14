"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { PageTransition } from "@/components/page-transition"
import { GlassCard } from "@/components/immersive/glass-card"
import { ButtonEnhanced } from "@/components/immersive/button-enhanced"
import { motion } from "framer-motion"
import { Zap, BookOpen, Clock, Trash2, Star, FileText } from "lucide-react"
import { api } from "@/lib/api-client"
import { useNotification } from "@/contexts/notification-context"
import { SkeletonLoader } from "@/components/immersive/skeleton-loader"
import { EmptyState } from "@/components/immersive/empty-state"

interface Lesson {
  id: string
  title: string
  difficulty?: string
}

interface SavedTest {
  id: number
  lesson_id: number | null
  lesson_string_id: string | null  // The actual lesson identifier
  lesson_title: string | null
  title: string
  questions_count: number
  is_private: boolean
  is_favorite: boolean
  created_at: string
}

export default function TestsPage() {
  const router = useRouter()
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [savedTests, setSavedTests] = useState<SavedTest[]>([])
  const [activeTab, setActiveTab] = useState<"create" | "saved">("saved")
  const [isLoading, setIsLoading] = useState(true)
  const [isSavedTestsLoading, setIsSavedTestsLoading] = useState(true)
  const [creatingTest, setCreatingTest] = useState<string | null>(null)
  const { error: showError, success: showSuccess } = useNotification()

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        setIsLoading(true)
        const data = await api.get("/lessons")
        const lessons = Array.isArray(data)
          ? data
          : (data?.lessons || data?.data || data?.items || [])
        setLessons(lessons)
      } catch {
        showError("Не вдалося завантажити уроки")
        setLessons([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchLessons()
  }, [showError])

  useEffect(() => {
    const fetchSavedTests = async () => {
      try {
        setIsSavedTestsLoading(true)
        const data = await api.get("/saved-tests")
        setSavedTests(Array.isArray(data) ? data : [])
      } catch {
        showError("Не вдалося завантажити збережені тести")
        setSavedTests([])
      } finally {
        setIsSavedTestsLoading(false)
      }
    }

    fetchSavedTests()
  }, [showError])

  const handleCreateTest = async (lessonId: string) => {
    try {
      setCreatingTest(lessonId)
      await fetchWithAuth(`/lessons/${lessonId}/test`, {
        method: "GET",
      })
      showSuccess("Тест створено та збережено! Відкриття уроку...")
      // Refresh saved tests
      const data = await api.get("/saved-tests")
      setSavedTests(Array.isArray(data) ? data : [])
      // Navigate to the lesson detail page to view the test
      router.push(`/lessons/${lessonId}`)
    } catch {
      showError("Не вдалося створити тест")
      setCreatingTest(null)
    }
  }

  const handleDeleteTest = async (testId: number) => {
    if (!confirm("Ви впевнені, що хочете видалити цей тест?")) return

    try {
      await fetchWithAuth(`/saved-tests/${testId}`, {
        method: "DELETE",
      })
      showSuccess("Тест успішно видалено")
      setSavedTests(savedTests.filter((test) => test.id !== testId))
    } catch {
      showError("Не вдалося видалити тест")
    }
  }

  const handleToggleFavorite = async (testId: number) => {
    try {
      const response = await fetchWithAuth(`/saved-tests/${testId}/favorite`, {
        method: "PUT",
      })
      showSuccess(response.is_favorite ? "Додано до обраного" : "Видалено з обраного")
      setSavedTests(
        savedTests.map((test) =>
          test.id === testId ? { ...test, is_favorite: response.is_favorite } : test
        )
      )
    } catch {
      showError("Не вдалося оновити обране")
    }
  }

  const handleViewTest = async (test: SavedTest) => {
    if (test.lesson_string_id) {
      router.push(`/lessons/${test.lesson_string_id}?testId=${test.id}`)
    } else {
      showError("Неможливо переглянути тест: урок не знайдено")
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
          Тести
        </h1>

        <div className="flex gap-2 mb-6">
          <ButtonEnhanced
            onClick={() => setActiveTab("saved")}
            className={activeTab === "saved" ? "bg-blue-500" : "bg-gray-500/20"}
          >
            <FileText className="w-4 h-4 mr-2" />
            Мої збережені тести ({savedTests.length})
          </ButtonEnhanced>
          <ButtonEnhanced
            onClick={() => setActiveTab("create")}
            className={activeTab === "create" ? "bg-blue-500" : "bg-gray-500/20"}
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Створити новий тест
          </ButtonEnhanced>
        </div>

        {activeTab === "saved" && (
          <>
            <div className="mb-6 p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
              <p className="text-sm text-muted-foreground">
                Всі ваші згенеровані тести автоматично зберігаються тут. Вони приватні за замовчуванням.
              </p>
            </div>

            {isSavedTestsLoading ? (
              <SkeletonLoader type="card" count={3} />
            ) : savedTests.length === 0 ? (
              <EmptyState
                icon="📚"
                title="Немає збережених тестів"
                description="Створіть тест у вкладці 'Створити новий тест', і він автоматично збережеться тут!"
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {savedTests.map((test, index) => (
                  <motion.div
                    key={test.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <GlassCard>
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-1">{test.title}</h3>
                          {test.lesson_title && (
                            <p className="text-sm text-muted-foreground mb-2">
                              {test.lesson_title}
                            </p>
                          )}
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span>{test.questions_count} питань</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(test.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleToggleFavorite(test.id)}
                          className="flex-shrink-0 ml-2"
                        >
                          <Star
                            className={`w-5 h-5 ${
                              test.is_favorite
                                ? "fill-yellow-500 text-yellow-500"
                                : "text-gray-400"
                            }`}
                          />
                        </button>
                      </div>

                      <div className="flex gap-2">
                        <ButtonEnhanced
                          onClick={() => handleViewTest(test)}
                          className="flex-1"
                          glow
                        >
                          Переглянути тест
                        </ButtonEnhanced>
                        <ButtonEnhanced
                          onClick={() => handleDeleteTest(test.id)}
                          className="bg-red-500/20 hover:bg-red-500/30"
                        >
                          <Trash2 className="w-4 h-4" />
                        </ButtonEnhanced>
                      </div>
                    </GlassCard>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === "create" && (
          <>
            <div className="mb-6 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <p className="text-sm text-muted-foreground">
                Виберіть урок, щоб створити та пройти тест. Тести автоматично зберігаються у вашому профілі!
              </p>
            </div>

            {isLoading ? (
              <SkeletonLoader type="card" count={3} />
            ) : lessons.length === 0 ? (
              <EmptyState
                icon="📝"
                title="Немає уроків для тестування"
                description="Спочатку завершіть кілька уроків, потім ви зможете створювати тести для закріплення знань!"
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
                          <p className="text-xs text-muted-foreground">Перевірте свої знання</p>
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
                          {creatingTest === lesson.id ? "Створення тесту..." : "Створити та розпочати тест"}
                        </ButtonEnhanced>
                      </motion.div>
                    </GlassCard>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}
      </motion.div>
    </PageTransition>
  )
}
