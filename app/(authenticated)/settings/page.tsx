"use client"

import { useState, useEffect } from "react"
import { PageTransition } from "@/components/page-transition"
import { GlassCard } from "@/components/immersive/glass-card"
import { ButtonEnhanced } from "@/components/immersive/button-enhanced"
import { SkeletonLoader } from "@/components/immersive/skeleton-loader"
import { motion } from "framer-motion"
import { Settings, User, Mail, Lock, Cat, GraduationCap } from "lucide-react"
import { fetchWithAuth } from "@/lib/api"
import { useNotification } from "@/contexts/notification-context"

const GRADES = [6, 7, 8, 9, 10, 11]
const CATS = [
  { id: 0, name: "Рудий кіт", image: "/orange.png" },
  { id: 1, name: "Сірий кіт", image: "/gray.png" }
]

export default function SettingsPage() {
  const [profile, setProfile] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null)
  const [selectedCat, setSelectedCat] = useState<number | null>(null)

  const { success: showSuccess, error: showError } = useNotification()

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true)
        const data = await fetchWithAuth("/profiles/me")
        setProfile(data)
        setEmail(data.email || "")
        setUsername(data.username || "")
        setSelectedGrade(data.grade || null)
        setSelectedCat(data.cat_id ?? null)
      } catch (err) {
        console.error("Error fetching profile:", err)
        showError("Не вдалося завантажити профіль")
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [showError])

  const handleUpdateEmail = async () => {
    if (!email) return
    try {
      setIsSaving(true)
      await fetchWithAuth("/account/email", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      })
      showSuccess("Електронну пошту оновлено")
    } catch (err) {
      showError("Не вдалося оновити електронну пошту")
    } finally {
      setIsSaving(false)
    }
  }

  const handleUpdateUsername = async () => {
    if (!username) return
    try {
      setIsSaving(true)
      await fetchWithAuth("/account/username", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username })
      })
      showSuccess("Ім'я користувача оновлено")
    } catch (err) {
      showError("Не вдалося оновити ім'я користувача")
    } finally {
      setIsSaving(false)
    }
  }

  const handleUpdatePassword = async () => {
    if (!currentPassword || !newPassword) {
      showError("Будь ласка, заповніть всі поля паролю")
      return
    }
    try {
      setIsSaving(true)
      await fetchWithAuth("/account/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword
        })
      })
      showSuccess("Пароль оновлено")
      setCurrentPassword("")
      setNewPassword("")
    } catch (err) {
      showError("Не вдалося оновити пароль")
    } finally {
      setIsSaving(false)
    }
  }

  const handleUpdateProfile = async () => {
    if (selectedGrade === null || selectedCat === null) {
      showError("Будь ласка, виберіть клас та кота")
      return
    }
    try {
      setIsSaving(true)
      await fetchWithAuth("/profiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profile.name || username,
          grade: selectedGrade,
          cat_id: selectedCat
        })
      })
      showSuccess("Профіль оновлено")
    } catch (err) {
      showError("Не вдалося оновити профіль")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <PageTransition>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
            <Settings className="w-8 h-8" />
            Налаштування акаунту
          </h1>
          <SkeletonLoader type="card" count={3} />
        </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
          <Settings className="w-8 h-8" />
          Account Settings
        </h1>

        <div className="space-y-6">
          {/* Profile Settings */}
          <GlassCard>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <User className="w-5 h-5" />
              Профіль
            </h2>

            <div className="space-y-4">
              {/* Grade Selection */}
              <div>
                <label className="block text-sm font-bold mb-2 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4" />
                  Клас
                </label>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                  {GRADES.map((grade) => (
                    <button
                      key={grade}
                      onClick={() => setSelectedGrade(grade)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        selectedGrade === grade
                          ? "border-foreground bg-foreground/5"
                          : "border-border hover:border-foreground/30"
                      }`}
                    >
                      <div className="text-lg font-bold">{grade}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Cat Selection */}
              <div>
                <label className="block text-sm font-bold mb-2 flex items-center gap-2">
                  <Cat className="w-4 h-4" />
                  Кіт
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {CATS.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCat(cat.id)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        selectedCat === cat.id
                          ? "border-foreground bg-foreground/5"
                          : "border-border hover:border-foreground/30"
                      }`}
                    >
                      <img src={cat.image} alt={cat.name} className="w-16 h-16 object-contain mx-auto mb-1" />
                      <div className="text-xs font-bold">{cat.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              <ButtonEnhanced
                onClick={handleUpdateProfile}
                disabled={isSaving}
                className="w-full"
              >
                Оновити профіль
              </ButtonEnhanced>
            </div>
          </GlassCard>

          {/* Account Settings */}
          <GlassCard>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Акаунт
            </h2>

            <div className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-sm font-bold mb-2">Електронна пошта</label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 px-4 py-2 rounded-lg bg-background/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="your.email@example.com"
                  />
                  <ButtonEnhanced onClick={handleUpdateEmail} disabled={isSaving}>
                    Оновити
                  </ButtonEnhanced>
                </div>
              </div>

              {/* Username */}
              <div>
                <label className="block text-sm font-bold mb-2">Ім'я користувача</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="flex-1 px-4 py-2 rounded-lg bg-background/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="ім'я користувача"
                  />
                  <ButtonEnhanced onClick={handleUpdateUsername} disabled={isSaving}>
                    Update
                  </ButtonEnhanced>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Security Settings */}
          <GlassCard>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Безпека
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-2">Поточний пароль</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-background/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">Новий пароль</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-background/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="••••••••"
                />
              </div>

              <ButtonEnhanced
                onClick={handleUpdatePassword}
                disabled={isSaving || !currentPassword || !newPassword}
                className="w-full"
              >
                Змінити пароль
              </ButtonEnhanced>
            </div>
          </GlassCard>
        </div>
      </div>
    </PageTransition>
  )
}
