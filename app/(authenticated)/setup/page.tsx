"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PageTransition } from "@/components/page-transition"
import { GlassCard } from "@/components/immersive/glass-card"
import { ButtonEnhanced } from "@/components/immersive/button-enhanced"
import { motion } from "framer-motion"
import { GraduationCap, Cat } from "lucide-react"
import { fetchWithAuth } from "@/lib/api"
import { useNotification } from "@/contexts/notification-context"

const GRADES = [6, 7, 8, 9, 10, 11]
const CATS = [
  { id: 0, name: "Рудий кіт", emoji: "🐱", color: "from-orange-500/20 to-orange-600/10" },
  { id: 1, name: "Сірий кіт", emoji: "😺", color: "from-gray-500/20 to-gray-600/10" },
  { id: 2, name: "Чорний кіт", emoji: "😸", color: "from-purple-500/20 to-purple-600/10" }
]

export default function SetupPage() {
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null)
  const [selectedCat, setSelectedCat] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { success: showSuccess, error: showError } = useNotification()

  const handleComplete = async () => {
    if (!selectedGrade) {
      showError("Будь ласка, виберіть ваш клас")
      return
    }

    if (selectedCat === null) {
      showError("Будь ласка, виберіть кота")
      return
    }

    try {
      setIsLoading(true)
      await fetchWithAuth("/profiles/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          grade: selectedGrade,
          cat_id: selectedCat
        })
      })

      showSuccess("Налаштування завершено!")
      router.push("/lessons")
    } catch (err) {
      console.error("Setup error:", err)
      showError("Не вдалося завершити налаштування")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-2xl"
        >
          <GlassCard>
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="p-4 rounded-full bg-foreground/5">
                  <GraduationCap className="w-12 h-12" />
                </div>
              </div>
              <h1 className="text-3xl font-bold mb-2">Вітаємо! 👋</h1>
              <p className="text-muted-foreground">
                Почнемо з налаштування вашого профілю
              </p>
            </div>

            {/* Grade Selection */}
            <div className="mb-8">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <GraduationCap className="w-5 h-5" />
                Виберіть ваш клас
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {GRADES.map((grade) => (
                  <motion.button
                    key={grade}
                    onClick={() => setSelectedGrade(grade)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`p-6 rounded-xl border-2 transition-all ${
                      selectedGrade === grade
                        ? "border-foreground bg-foreground/5"
                        : "border-border hover:border-foreground/30"
                    }`}
                  >
                    <div className="text-3xl font-bold mb-1">{grade}</div>
                    <div className="text-sm text-muted-foreground">Клас</div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Cat Selection */}
            <div className="mb-8">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Cat className="w-5 h-5" />
                Виберіть вашого кота
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {CATS.map((cat) => (
                  <motion.button
                    key={cat.id}
                    onClick={() => setSelectedCat(cat.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`p-6 rounded-xl border-2 transition-all ${
                      selectedCat === cat.id
                        ? "border-foreground bg-foreground/5"
                        : "border-border hover:border-foreground/30"
                    }`}
                  >
                    <div className="text-5xl mb-2">{cat.emoji}</div>
                    <div className="text-sm font-bold">{cat.name}</div>
                  </motion.button>
                ))}
              </div>
            </div>

            <ButtonEnhanced
              onClick={handleComplete}
              disabled={!selectedGrade || selectedCat === null || isLoading}
              className="w-full"
              glow
            >
              {isLoading ? "Завершення..." : "Продовжити"}
            </ButtonEnhanced>

            {(!selectedGrade || selectedCat === null) && (
              <p className="text-center text-sm text-muted-foreground mt-4">
                {!selectedGrade && !selectedCat ? "Виберіть клас та кота, щоб продовжити" :
                 !selectedGrade ? "Виберіть клас, щоб продовжити" :
                 "Виберіть кота, щоб продовжити"}
              </p>
            )}
          </GlassCard>
        </motion.div>
      </div>
    </PageTransition>
  )
}
