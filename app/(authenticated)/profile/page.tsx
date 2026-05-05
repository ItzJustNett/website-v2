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
import { api } from "@/lib/api-client"
import { useNotification } from "@/contexts/notification-context"
import { useLanguage } from "@/contexts/language-context"
import { CatAvatar } from "@/components/cat-avatar"
import { useProfile } from "@/contexts/profile-context"

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
  cat_id: number
  equipped_items: string[]
}

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const { error: showError } = useNotification()
  const { t } = useLanguage()
  const { catId, equippedItems } = useProfile()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true)
        const data = await api.get("/profiles/me")
        setProfile(data as UserProfile)
      } catch {
        showError(t("profile.loadError"))
      } finally {
        setIsLoading(false)
      }
    }

    load()
  }, [showError, t])

  const achievements = [
    { name: t("profile.firstSteps"), icon: "👣", unlocked: profile && profile.lessons_completed > 0 },
    {
      name: t("profile.streak7"),
      icon: "🔥",
      unlocked: profile && profile.streak >= 7,
    },
    {
      name: t("profile.lessons100"),
      icon: "📚",
      unlocked: profile && profile.lessons_completed >= 100,
    },
    {
      name: t("profile.expertLevel"),
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
        <div className="flex items-center gap-8">
          <CatAvatar
            catId={catId}
            equippedItems={equippedItems}
            size={192}
          />
          <div>
            <h1 className="text-5xl font-serif font-bold mb-3">
              {profile?.username || user?.username}
            </h1>
            <div className="space-y-2">
              {profile?.email && (
                <p className="text-sm font-sans text-muted-foreground">{profile.email}</p>
              )}
              <p className="text-sm font-sans text-muted-foreground">
                {t("profile.info", { level: profile?.level || 0, streak: profile?.streak || 0, coins: profile?.meowcoins || 0 })}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        {profile && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <EditorialStat value={profile.level} label={t("profile.levelStat")} size="lg" />
              <EditorialStat value={profile.streak} label={t("profile.daysStreak")} size="lg" />
              <EditorialStat value={profile.meowcoins} label={t("profile.coinsStat")} size="lg" />
              <EditorialStat value={profile.lessons_completed} label={t("profile.lessonsStat")} size="lg" />
            </div>

            {/* Divider */}
            <div className="editorial-divider" />

            {/* Progress Section */}
            <div>
              <h2 className="text-3xl font-serif font-bold mb-8">{t("profile.progress")}</h2>
              <div className="space-y-8">
                <EditorialProgress
                  value={profile.lessons_completed}
                  max={100}
                  label={t("profile.lessonsCompleted")}
                  showPercentage={false}
                />
                <EditorialProgress
                  value={profile.tests_completed}
                  max={50}
                  label={t("profile.testsCompleted")}
                  showPercentage={false}
                />
                <EditorialProgress
                  value={profile.xp}
                  max={profile.max_xp}
                  label={t("profile.levelXP", { level: profile.level })}
                  showPercentage={true}
                />
              </div>
            </div>

            {/* Divider */}
            <div className="editorial-divider" />

            {/* Achievements */}
            <div>
              <h2 className="text-3xl font-serif font-bold mb-8">{t("profile.achievements")}</h2>
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
                          {t("profile.unlocked")}
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
              <h2 className="text-3xl font-serif font-bold mb-8">{t("profile.settings")}</h2>
              <EditorialCard>
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-6 border-b border-black dark:border-white">
                    <span className="font-sans font-medium">{t("profile.theme")}</span>
                    <span className="text-sm text-muted-foreground">{t("profile.themeSystem")}</span>
                  </div>
                  <div className="flex items-center justify-between pb-6 border-b border-black dark:border-white">
                    <span className="font-sans font-medium">{t("profile.notifications")}</span>
                    <span className="text-sm text-muted-foreground">{t("profile.notificationsEnabled")}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-sans font-medium">{t("profile.accountCreated")}</span>
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
                {t("profile.logout")}
              </EditorialButton>
            </motion.div>
          </>
        )}
      </motion.div>
    </PageTransition>
  )
}
