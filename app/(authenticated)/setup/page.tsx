"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PageTransition } from "@/components/page-transition"
import { GlassCard } from "@/components/immersive/glass-card"
import { ButtonEnhanced } from "@/components/immersive/button-enhanced"
import { motion } from "framer-motion"
import { GraduationCap, Cat } from "lucide-react"
import { api } from "@/lib/api-client"
import { useNotification } from "@/contexts/notification-context"
import { useProfile } from "@/contexts/profile-context"
import { useLanguage } from "@/contexts/language-context"

const GRADES = [6, 7, 8, 9, 10, 11]

export default function SetupPage() {
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null)
  const [selectedCat, setSelectedCat] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { success: showSuccess, error: showError } = useNotification()
  const { refreshProfile } = useProfile()
  const { t } = useLanguage()

  const CATS = [
    { id: 0, name: t("setup.orangeCat"), image: "/orange.png", color: "from-orange-500/20 to-orange-600/10" },
    { id: 1, name: t("setup.grayCat"), image: "/gray.png", color: "from-gray-500/20 to-gray-600/10" },
    { id: 2, name: t("setup.blackCat"), image: "/black.png", color: "from-purple-500/20 to-purple-600/10" }
  ]

  const handleComplete = async () => {
    if (!selectedGrade) {
      showError(t("setup.selectGradeError"))
      return
    }

    if (selectedCat === null) {
      showError(t("setup.selectCatError"))
      return
    }

    try {
      setIsLoading(true)
      await api.post("/profiles/setup", {
        grade: selectedGrade,
        cat_id: selectedCat
      })

      await refreshProfile()
      showSuccess(t("setup.success"))
      router.push("/lessons")
    } catch (err) {
      console.error("Setup error:", err)
      const errorMessage = err instanceof Error ? err.message : t("setup.error")
      showError(errorMessage)
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
              <h1 className="text-3xl font-bold mb-2">{t("setup.welcomeTitle")} 👋</h1>
              <p className="text-muted-foreground">
                {t("setup.welcomeSubtitle")}
              </p>
            </div>

            {/* Grade Selection */}
            <div className="mb-8">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <GraduationCap className="w-5 h-5" />
                {t("setup.selectGrade")}
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
                    <div className="text-sm text-muted-foreground">{t("common.grade")}</div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Cat Selection */}
            <div className="mb-8">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Cat className="w-5 h-5" />
                {t("setup.selectCat")}
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
                    <img src={cat.image} alt={cat.name} className="w-20 h-20 object-contain mx-auto mb-2" />
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
              {isLoading ? t("setup.completing") : t("setup.continue")}
            </ButtonEnhanced>

            {(!selectedGrade || selectedCat === null) && (
              <p className="text-center text-sm text-muted-foreground mt-4">
                {!selectedGrade && selectedCat === null ? t("setup.selectBoth") :
                 !selectedGrade ? t("setup.selectGradeHint") :
                 t("setup.selectCatHint")}
              </p>
            )}
          </GlassCard>
        </motion.div>
      </div>
    </PageTransition>
  )
}
