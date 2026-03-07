"use client"

import { motion } from "framer-motion"
import { useAuth } from "@/contexts/auth-context"
import { PageTransition } from "@/components/page-transition"
import { GlassCard } from "@/components/immersive/glass-card"
import { StreakFlame } from "@/components/immersive/streak-flame"
import { CoinCounter } from "@/components/immersive/coin-counter"
import { XPProgressBar } from "@/components/immersive/xp-progress-bar"
import { CatMascot } from "@/components/immersive/cat-mascot"
import { ButtonEnhanced } from "@/components/immersive/button-enhanced"
import Link from "next/link"
import {
  BookOpen,
  Zap,
  ShoppingBag,
  Brain,
  Trophy,
} from "lucide-react"

export default function DashboardPage() {
  const { user } = useAuth()

  // Mock data
  const stats = {
    streak: 15,
    lessonsCompleted: 42,
    testsCompleted: 28,
    level: 8,
    currentXP: 2450,
    maxXP: 5000,
    coins: 1250,
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  const quickActions = [
    {
      title: "Start Lesson",
      icon: BookOpen,
      href: "/lessons",
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Take Test",
      icon: Zap,
      href: "/tests",
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "Visit Store",
      icon: ShoppingBag,
      href: "/store",
      color: "from-yellow-500 to-orange-500",
    },
    {
      title: "AI Features",
      icon: Brain,
      href: "/ai-features",
      color: "from-green-500 to-teal-500",
    },
  ]

  return (
    <PageTransition>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* Welcome Header */}
        <motion.div variants={itemVariants}>
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                Welcome back, {user?.username}! 🎉
              </h1>
              <p className="text-muted-foreground">
                Keep up your streak and level up your knowledge
              </p>
            </div>
            <CoinCounter count={stats.coins} size="lg" />
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {/* Streak Card */}
          <motion.div variants={itemVariants}>
            <GlassCard className="text-center">
              <div className="flex justify-center mb-4">
                <StreakFlame size="lg" color="orange" />
              </div>
              <h3 className="text-sm text-muted-foreground mb-2">
                Current Streak
              </h3>
              <p className="text-4xl font-bold">{stats.streak}</p>
              <p className="text-xs text-muted-foreground mt-2">
                Days in a row
              </p>
            </GlassCard>
          </motion.div>

          {/* Lessons Card */}
          <motion.div variants={itemVariants}>
            <GlassCard>
              <div className="flex items-center justify-between mb-4">
                <BookOpen className="w-6 h-6 text-blue-500" />
                <span className="text-2xl font-bold">{stats.lessonsCompleted}</span>
              </div>
              <h3 className="text-sm text-muted-foreground">
                Lessons Completed
              </h3>
              <div className="mt-4 h-2 rounded-full bg-muted overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "75%" }}
                  transition={{ duration: 1, delay: 0.3 }}
                  className="h-full bg-blue-500"
                />
              </div>
            </GlassCard>
          </motion.div>

          {/* Tests Card */}
          <motion.div variants={itemVariants}>
            <GlassCard>
              <div className="flex items-center justify-between mb-4">
                <Zap className="w-6 h-6 text-purple-500" />
                <span className="text-2xl font-bold">{stats.testsCompleted}</span>
              </div>
              <h3 className="text-sm text-muted-foreground">Tests Completed</h3>
              <div className="mt-4 h-2 rounded-full bg-muted overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "56%" }}
                  transition={{ duration: 1, delay: 0.4 }}
                  className="h-full bg-purple-500"
                />
              </div>
            </GlassCard>
          </motion.div>

          {/* Level Card */}
          <motion.div variants={itemVariants}>
            <GlassCard>
              <div className="flex items-center justify-between mb-4">
                <Trophy className="w-6 h-6 text-yellow-500" />
                <span className="text-2xl font-bold">Level {stats.level}</span>
              </div>
              <h3 className="text-sm text-muted-foreground">Your Level</h3>
              <div className="mt-4 h-2 rounded-full bg-muted overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "49%" }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-full bg-yellow-500"
                />
              </div>
            </GlassCard>
          </motion.div>
        </motion.div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Streak Showcase + Cat */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <GlassCard>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Streak Power! 🔥</h2>
                  <p className="text-muted-foreground">
                    You&apos;re on fire! Keep learning to maintain your streak.
                  </p>
                </div>
                <div className="text-6xl">
                  <StreakFlame size="xl" />
                </div>
              </div>

              <div className="bg-muted/50 rounded-lg p-6 mb-6">
                <p className="text-lg font-semibold mb-2">
                  Next milestone: 30 day streak 🎯
                </p>
                <div className="h-3 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "50%" }}
                    transition={{ duration: 1, delay: 0.6 }}
                    className="h-full bg-gradient-to-r from-orange-500 to-red-500"
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  15 of 30 days complete
                </p>
              </div>

              <div className="text-center">
                <p className="text-muted-foreground mb-4">
                  Maintain your streak by completing at least 1 lesson per day
                </p>
                <Link href="/lessons">
                  <ButtonEnhanced className="w-full">
                    Start a Lesson
                  </ButtonEnhanced>
                </Link>
              </div>
            </GlassCard>
          </motion.div>

          {/* Cat Mascot */}
          <motion.div variants={itemVariants}>
            <GlassCard className="flex flex-col items-center justify-center text-center h-full">
              <CatMascot size="lg" state="happy" />
              <h3 className="text-lg font-semibold mt-4">Whiskers</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Your learning companion
              </p>
            </GlassCard>
          </motion.div>
        </div>

        {/* XP Progress */}
        <motion.div variants={itemVariants}>
          <GlassCard>
            <h2 className="text-lg font-bold mb-6">Experience Progress</h2>
            <XPProgressBar
              current={stats.currentXP}
              max={stats.maxXP}
              level={stats.level}
              showLabel
            />
          </GlassCard>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={itemVariants}>
          <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon
              return (
                <motion.div
                  key={action.href}
                  variants={itemVariants}
                  custom={index}
                >
                  <Link href={action.href}>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <GlassCard className="h-full flex flex-col items-center justify-center text-center py-6">
                        <div
                          className={`bg-gradient-to-br ${action.color} p-3 rounded-lg mb-3`}
                        >
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <p className="font-semibold text-sm">
                          {action.title}
                        </p>
                      </GlassCard>
                    </motion.div>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </motion.div>
    </PageTransition>
  )
}
