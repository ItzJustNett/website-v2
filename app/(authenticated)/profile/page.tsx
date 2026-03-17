"use client"

import { useEffect, useState } from "react"
import { PageTransition } from "@/components/page-transition"
import { EditorialCard } from "@/components/immersive/editorial-card"
import { EditorialButton } from "@/components/immersive/editorial-button"
import { EditorialProgress } from "@/components/immersive/editorial-progress"
import { EditorialStat } from "@/components/immersive/editorial-stat"
import { motion } from "framer-motion"
import { LogOut } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { fetchWithAuth } from "@/lib/api"
import { useNotification } from "@/contexts/notification-context"

interface UserProfile {
  user_id: string
  username: string
  email?: string
  level: number
  xp: number
  max_xp: number
  meowcoins: number
  streak: number
  lessons_completed: number
  tests_completed: number
}

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const { error: showError } = useNotification()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true)
        const data = await fetchWithAuth("/profiles/me")

        if (data && typeof data === "object") {
          setProfile(data as UserProfile)
        } else {
          showError("Невірні дані профілю")
        }
      } catch (err) {
        console.error("Error fetching profile:", err)
        showError("Не вдалося завантажити профіль")
      } finally {
        setIsLoading(false)
      }
    }

    if (isLoading) {
      fetchProfile()
    }
  }, [showError, isLoading])

  const achievements = [
    { name: "Перші кроки", icon: "👣", unlocked: profile && profile.lessons_completed > 0 },
    {
      name: "Серія 7 днів",
      icon: "🔥",
      unlocked: profile && profile.streak >= 7,
    },
    {
      name: "100 уроків",
      icon: "📚",
      unlocked: profile && profile.lessons_completed >= 100,
    },
    {
      name: "Експертний рівень",
      icon: "🏆",
      unlocked: profile && profile.level >= 10,
    },
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-12 h-12 rounded-full border-2 border-black dark:border-white border-t-transparent"></div>
        </motion.div>
      </div>
    )
  }

  return (
    <PageTransition>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-16"
      >
        {/* Profile Header */}
        <div>
          <h1 className="text-5xl font-serif font-bold mb-3">
            {profile?.username || user?.username}
          </h1>
          <div className="space-y-2">
            {profile?.email && (
              <p className="text-sm font-sans text-muted-foreground">{profile.email}</p>
            )}
            <p className="text-sm font-sans text-muted-foreground">
              Рівень {profile?.level || 0} · Серія {profile?.streak || 0} днів · {profile?.meowcoins || 0} монет
            </p>
          </div>
        </div>

        {/* Stats Overview */}
        {profile && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <EditorialStat value={profile.level} label="Рівень" size="lg" />
              <EditorialStat value={profile.streak} label="Днів підряд" size="lg" />
              <EditorialStat value={profile.meowcoins} label="Монет" size="lg" />
              <EditorialStat value={profile.lessons_completed} label="Уроків" size="lg" />
            </div>

            {/* Divider */}
            <div className="editorial-divider" />

            {/* Progress Section */}
            <div>
              <h2 className="text-3xl font-serif font-bold mb-8">Прогрес</h2>
              <div className="space-y-8">
                <EditorialProgress
                  value={profile.lessons_completed}
                  max={100}
                  label="Уроків виконано"
                  showPercentage={false}
                />
                <EditorialProgress
                  value={profile.tests_completed}
                  max={50}
                  label="Тестів виконано"
                  showPercentage={false}
                />
                <EditorialProgress
                  value={profile.xp}
                  max={profile.max_xp}
                  label={`Досвід рівня ${profile.level}`}
                  showPercentage={true}
                />
              </div>
            </div>

            {/* Divider */}
            <div className="editorial-divider" />

            {/* Achievements */}
            <div>
              <h2 className="text-3xl font-serif font-bold mb-8">Досягнення</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {achievements.map((achievement, index) => (
                  <EditorialCard
                    key={index}
                    className={achievement.unlocked ? "" : "opacity-40"}
                  >
                    <div className="text-center">
                      <p className="text-4xl mb-3">{achievement.icon}</p>
                      <p className="text-sm font-sans font-medium">{achievement.name}</p>
                      {achievement.unlocked && (
                        <p className="text-xs font-sans text-muted-foreground mt-2">
                          Відкрито
                        </p>
                      )}
                    </div>
                  </EditorialCard>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="editorial-divider" />

            {/* Settings Section */}
            <div>
              <h2 className="text-3xl font-serif font-bold mb-8">Налаштування</h2>
              <EditorialCard>
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-6 border-b border-black dark:border-white">
                    <span className="font-sans font-medium">Тема</span>
                    <span className="text-sm text-muted-foreground">Системна</span>
                  </div>
                  <div className="flex items-center justify-between pb-6 border-b border-black dark:border-white">
                    <span className="font-sans font-medium">Сповіщення</span>
                    <span className="text-sm text-muted-foreground">Увімкнено</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-sans font-medium">Акаунт створено</span>
                    <span className="text-sm text-muted-foreground">2024</span>
                  </div>
                </div>
              </EditorialCard>
            </div>

            {/* Divider */}
            <div className="editorial-divider" />

            {/* Logout Button */}
            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
              <EditorialButton
                onClick={logout}
                variant="ghost"
                className="w-full justify-start"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Вийти
              </EditorialButton>
            </motion.div>
          </>
        )}
      </motion.div>
    </PageTransition>
  )
}
