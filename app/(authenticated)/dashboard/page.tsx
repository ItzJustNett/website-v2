"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useAuth } from "@/contexts/auth-context"
import { useNotification } from "@/contexts/notification-context"
import { PageTransition } from "@/components/page-transition"
import { EditorialCard } from "@/components/immersive/editorial-card"
import { EditorialProgress } from "@/components/immersive/editorial-progress"
import { EditorialStat } from "@/components/immersive/editorial-stat"
import { fetchWithAuth } from "@/lib/api"
import Link from "next/link"
import {
  BookOpen,
  Zap,
  ShoppingBag,
  Brain,
  ArrowRight,
} from "lucide-react"

interface DashboardData {
  streak: number
  lessons_completed: number
  tests_completed: number
}

interface ProfileData {
  xp: number
  max_xp: number
  level: number
  meowcoins: number
}

export default function DashboardPage() {
  const { user } = useAuth()
  const { error: showError } = useNotification()
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)

        const dashDataRaw = await fetchWithAuth("/profiles/me/stats")
        const dashData = dashDataRaw && typeof dashDataRaw === "object"
          ? dashDataRaw
          : {
              streak: 0,
              lessons_completed: 0,
              tests_completed: 0,
            }
        setDashboardData(dashData)

        const profDataRaw = await fetchWithAuth("/profiles/me")
        const profData = profDataRaw && typeof profDataRaw === "object"
          ? profDataRaw
          : {
              level: 1,
              xp: 0,
              max_xp: 5000,
              meowcoins: 0,
            }
        setProfileData(profData)
      } catch (err) {
        console.error("Error fetching dashboard data:", err)

        // If profile not found, redirect to setup
        if (err instanceof Error && err.message.includes("Not Found")) {
          window.location.href = "/setup"
          return
        }

        showError("Failed to load dashboard data")
        setDashboardData({
          streak: 0,
          lessons_completed: 0,
          tests_completed: 0,
        })
        setProfileData({
          level: 1,
          xp: 0,
          max_xp: 5000,
          meowcoins: 0,
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [showError])

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

  const stats = {
    streak: dashboardData?.streak || 0,
    lessonsCompleted: dashboardData?.lessons_completed || 0,
    testsCompleted: dashboardData?.tests_completed || 0,
    level: profileData?.level || 1,
    currentXP: profileData?.xp || 0,
    maxXP: profileData?.max_xp || 5000,
    coins: profileData?.meowcoins || 0,
  }

  const quickActions = [
    {
      title: "Start Lesson",
      href: "/lessons",
      icon: BookOpen,
    },
    {
      title: "Take Test",
      href: "/tests",
      icon: Zap,
    },
    {
      title: "Visit Store",
      href: "/store",
      icon: ShoppingBag,
    },
    {
      title: "AI Features",
      href: "/ai-features",
      icon: Brain,
    },
  ]

  return (
    <PageTransition>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-16"
      >
        {/* Welcome Header */}
        <div>
          <h1 className="text-5xl font-serif font-bold mb-4">
            Welcome, {user?.username}
          </h1>
          <p className="text-lg text-muted-foreground font-sans">
            {stats.streak > 0
              ? `You're on a ${stats.streak}-day streak. Keep it going.`
              : "Start your learning journey today."}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <EditorialStat value={stats.streak} label="Day Streak" size="lg" />
          <EditorialStat value={stats.lessonsCompleted} label="Lessons Done" size="lg" />
          <EditorialStat value={stats.testsCompleted} label="Tests Passed" size="lg" />
          <EditorialStat value={`Lvl ${stats.level}`} label="Current Level" size="lg" />
        </div>

        {/* Divider */}
        <div className="editorial-divider" />

        {/* Progress Section */}
        <div>
          <h2 className="text-3xl font-serif font-bold mb-8">Progress</h2>
          <div className="space-y-6">
            <EditorialProgress
              value={stats.lessonsCompleted}
              max={100}
              label="Lessons Completed"
              showPercentage={false}
            />
            <EditorialProgress
              value={stats.testsCompleted}
              max={50}
              label="Tests Completed"
              showPercentage={false}
            />
            <EditorialProgress
              value={stats.currentXP}
              max={stats.maxXP}
              label={`Level ${stats.level} Progress`}
              showPercentage={true}
            />
          </div>
        </div>

        {/* Divider */}
        <div className="editorial-divider" />

        {/* Quick Stats */}
        <EditorialCard>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <p className="text-sm text-muted-foreground font-sans uppercase tracking-wide mb-2">
                Available Coins
              </p>
              <p className="text-4xl font-serif font-bold">{stats.coins}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-sans uppercase tracking-wide mb-2">
                Current Level
              </p>
              <p className="text-4xl font-serif font-bold">{stats.level}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-sans uppercase tracking-wide mb-2">
                Total XP
              </p>
              <p className="text-4xl font-serif font-bold">{stats.currentXP}</p>
            </div>
          </div>
        </EditorialCard>

        {/* Divider */}
        <div className="editorial-divider" />

        {/* Quick Actions */}
        <div>
          <h2 className="text-3xl font-serif font-bold mb-8">Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <Link key={action.href} href={action.href}>
                  <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                    <EditorialCard>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Icon className="w-6 h-6" />
                          <span className="font-sans font-medium">{action.title}</span>
                        </div>
                        <ArrowRight className="w-5 h-5 text-muted-foreground" />
                      </div>
                    </EditorialCard>
                  </motion.div>
                </Link>
              )
            })}
          </div>
        </div>
      </motion.div>
    </PageTransition>
  )
}
