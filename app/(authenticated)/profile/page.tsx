"use client"

import { PageTransition } from "@/components/page-transition"
import { GlassCard } from "@/components/immersive/glass-card"
import { CatMascot } from "@/components/immersive/cat-mascot"
import { ButtonEnhanced } from "@/components/immersive/button-enhanced"
import { motion } from "framer-motion"
import { User, Settings, LogOut } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export default function ProfilePage() {
  const { user, logout } = useAuth()

  const achievements = [
    { name: "First Steps", emoji: "👣", unlocked: true },
    { name: "7 Day Streak", emoji: "🔥", unlocked: true },
    { name: "100 Lessons", emoji: "📚", unlocked: false },
    { name: "Expert Level", emoji: "🏆", unlocked: false },
  ]

  return (
    <PageTransition>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        {/* Profile Header */}
        <GlassCard>
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
                <User className="w-8 h-8" />
                {user?.username}
              </h1>
              <p className="text-muted-foreground">
                Learning journey since 2024
              </p>
            </div>
          </div>

          <div className="flex justify-center my-6">
            <CatMascot size="md" state="happy" />
          </div>

          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-4">Your cat companion</p>
          </div>
        </GlassCard>

        {/* Achievements */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Achievements</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {achievements.map((achievement, index) => (
              <GlassCard
                key={index}
                className={!achievement.unlocked ? "opacity-50" : ""}
              >
                <div className="text-4xl text-center mb-2">
                  {achievement.emoji}
                </div>
                <p className="text-sm font-semibold text-center">
                  {achievement.name}
                </p>
                {achievement.unlocked && (
                  <p className="text-xs text-green-500 text-center mt-2">
                    ✓ Unlocked
                  </p>
                )}
              </GlassCard>
            ))}
          </div>
        </div>

        {/* Settings */}
        <GlassCard>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Settings className="w-6 h-6" />
            Settings
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Theme</span>
              <span className="text-muted-foreground">System</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Notifications</span>
              <span className="text-muted-foreground">Enabled</span>
            </div>
          </div>
        </GlassCard>

        {/* Logout */}
        <motion.div
          whileHover={{ scale: 1.02 }}
        >
          <ButtonEnhanced
            onClick={logout}
            className="w-full"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </ButtonEnhanced>
        </motion.div>
      </motion.div>
    </PageTransition>
  )
}
