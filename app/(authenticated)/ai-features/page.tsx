"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { PageTransition } from "@/components/page-transition"
import { GlassCard } from "@/components/immersive/glass-card"
import { ButtonEnhanced } from "@/components/immersive/button-enhanced"
import { motion } from "framer-motion"
import { Brain, Zap, BookOpen, Clock, Trash2, Star, FileText } from "lucide-react"
import { api } from "@/lib/api-client"
import { useNotification } from "@/contexts/notification-context"
import { SkeletonLoader } from "@/components/immersive/skeleton-loader"
import { EmptyState } from "@/components/immersive/empty-state"

interface SavedTest {
  id: number
  lesson_id: number | null
  lesson_string_id: string | null
  lesson_title: string | null
  title: string
  questions_count: number
  is_private: boolean
  is_favorite: boolean
  created_at: string
}

interface SavedSummary {
  id: number
  lesson_id: number | null
  lesson_string_id: string | null
  lesson_title: string | null
  title: string
  summary: string
  key_points: string[]
  is_favorite: boolean
  created_at: string
}

export default function AIFeaturesPage() {
  const router = useRouter()
  const [savedTests, setSavedTests] = useState<SavedTest[]>([])
  const [savedSummaries, setSavedSummaries] = useState<SavedSummary[]>([])
  const [activeTab, setActiveTab] = useState<"tests" | "summaries">("tests")
  const [isTestsLoading, setIsTestsLoading] = useState(true)
  const [isSummariesLoading, setIsSummariesLoading] = useState(true)
  const { error: showError, success: showSuccess } = useNotification()

  useEffect(() => {
    const fetchSavedTests = async () => {
      try {
        setIsTestsLoading(true)
        const data = await api.get("/saved-tests")
        setSavedTests(Array.isArray(data) ? data : [])
      } catch {
        showError("Не вдалося завантажити збережені тести")
        setSavedTests([])
      } finally {
        setIsTestsLoading(false)
      }
    }

    fetchSavedTests()
  }, [showError])

  useEffect(() => {
    const fetchSavedSummaries = async () => {
      try {
        setIsSummariesLoading(true)
        const data = await api.get("/saved-summaries")
        setSavedSummaries(Array.isArray(data) ? data : [])
      } catch {
        showError("Не вдалося завантажити збережені конспекти")
        setSavedSummaries([])
      } finally {
        setIsSummariesLoading(false)
      }
    }

    fetchSavedSummaries()
  }, [showError])

  const handleDeleteTest = async (testId: number) => {
    if (!confirm("Ви впевнені, що хочете видалити цей тест?")) return

    try {
      await api.delete(`/saved-tests/${testId}`)
      showSuccess("Тест успішно видалено")
      setSavedTests(savedTests.filter((test) => test.id !== testId))
    } catch {
      showError("Не вдалося видалити тест")
    }
  }

  const handleDeleteSummary = async (summaryId: number) => {
    if (!confirm("Ви впевнені, що хочете видалити цей конспект?")) return

    try {
      await api.delete(`/saved-summaries/${summaryId}`)
      showSuccess("Конспект успішно видалено")
      setSavedSummaries(savedSummaries.filter((summary) => summary.id !== summaryId))
    } catch {
      showError("Не вдалося видалити конспект")
    }
  }

  const handleToggleTestFavorite = async (testId: number) => {
    try {
      const response = await api.put(`/saved-tests/${testId}/favorite`)
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

  const handleToggleSummaryFavorite = async (summaryId: number) => {
    try {
      const response = await api.put(`/saved-summaries/${summaryId}/favorite`)
      showSuccess(response.is_favorite ? "Додано до обраного" : "Видалено з обраного")
      setSavedSummaries(
        savedSummaries.map((summary) =>
          summary.id === summaryId ? { ...summary, is_favorite: response.is_favorite } : summary
        )
      )
    } catch {
      showError("Не вдалося оновити обране")
    }
  }

  const sortedTests = [...savedTests].sort((a, b) => Number(b.is_favorite) - Number(a.is_favorite))
  const sortedSummaries = [...savedSummaries].sort((a, b) => Number(b.is_favorite) - Number(a.is_favorite))

  const handleViewTest = async (test: SavedTest) => {
    if (test.lesson_string_id) {
      router.push(`/lessons/${test.lesson_string_id}?testId=${test.id}`)
    } else {
      showError("Неможливо переглянути тест: урок не знайдено")
    }
  }

  const handleViewSummary = async (summary: SavedSummary) => {
    if (summary.lesson_string_id) {
      router.push(`/lessons/${summary.lesson_string_id}?summaryId=${summary.id}`)
    } else {
      showError("Неможливо переглянути конспект: урок не знайдено")
    }
  }

  return (
    <PageTransition>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-sans font-bold mb-6 flex items-center gap-2">
          <Brain className="w-8 h-8" />
          AI Функції
        </h1>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <ButtonEnhanced
            onClick={() => setActiveTab("tests")}
            className={activeTab === "tests"
              ? "bg-blue-500 text-white"
              : "bg-foreground/10 text-foreground hover:bg-foreground/15"}
          >
            <Zap className="w-4 h-4 mr-2" />
            Збережені тести ({savedTests.length})
          </ButtonEnhanced>
          <ButtonEnhanced
            onClick={() => setActiveTab("summaries")}
            className={activeTab === "summaries"
              ? "bg-purple-500 text-white"
              : "bg-foreground/10 text-foreground hover:bg-foreground/15"}
          >
            <FileText className="w-4 h-4 mr-2" />
            Збережені конспекти ({savedSummaries.length})
          </ButtonEnhanced>
        </div>

        {/* Saved Tests Tab */}
        {activeTab === "tests" && (
          <>
            <div className="mb-6 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <p className="text-sm text-muted-foreground">
                Всі ваші згенеровані тести автоматично зберігаються тут. Створюйте тести на сторінках уроків.
              </p>
            </div>

            {isTestsLoading ? (
              <SkeletonLoader type="card" count={3} />
            ) : savedTests.length === 0 ? (
              <EmptyState
                icon="📚"
                title="Немає збережених тестів"
                description="Перейдіть на сторінку уроку і створіть тест - він автоматично збережеться тут!"
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sortedTests.map((test, index) => (
                  <motion.div
                    key={test.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <GlassCard>
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="font-sans font-semibold text-lg mb-1">{test.title}</h3>
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
                          onClick={() => handleToggleTestFavorite(test.id)}
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

        {/* Saved Summaries Tab */}
        {activeTab === "summaries" && (
          <>
            <div className="mb-6 p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
              <p className="text-sm text-muted-foreground">
                Всі ваші згенеровані конспекти автоматично зберігаються тут. Створюйте конспекти на сторінках уроків.
              </p>
            </div>

            {isSummariesLoading ? (
              <SkeletonLoader type="card" count={3} />
            ) : savedSummaries.length === 0 ? (
              <EmptyState
                icon="📝"
                title="Немає збережених конспектів"
                description="Перейдіть на сторінку уроку і згенеруйте конспект - він автоматично збережеться тут!"
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sortedSummaries.map((summary, index) => (
                  <motion.div
                    key={summary.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <GlassCard>
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="font-sans font-semibold text-lg mb-1">{summary.title}</h3>
                          {summary.lesson_title && (
                            <p className="text-sm text-muted-foreground mb-2">
                              {summary.lesson_title}
                            </p>
                          )}
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span>{summary.key_points?.length || 0} ключових моментів</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(summary.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleToggleSummaryFavorite(summary.id)}
                          className="flex-shrink-0 ml-2"
                        >
                          <Star
                            className={`w-5 h-5 ${
                              summary.is_favorite
                                ? "fill-yellow-500 text-yellow-500"
                                : "text-gray-400"
                            }`}
                          />
                        </button>
                      </div>

                      <div className="flex gap-2">
                        <ButtonEnhanced
                          onClick={() => handleViewSummary(summary)}
                          className="flex-1"
                          glow
                        >
                          Переглянути конспект
                        </ButtonEnhanced>
                        <ButtonEnhanced
                          onClick={() => handleDeleteSummary(summary.id)}
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
      </motion.div>
    </PageTransition>
  )
}
