"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useAuth } from "@/contexts/auth-context"
import { useNotification } from "@/contexts/notification-context"
import { useLanguage } from "@/contexts/language-context"
import { EditorialCard } from "@/components/immersive/editorial-card"
import { EditorialButton } from "@/components/immersive/editorial-button"
import { InputEnhanced } from "@/components/immersive/input-enhanced"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { OAuthButtons } from "@/components/oauth-buttons"

export default function LoginPage() {
  const router = useRouter()
  const { login, register } = useAuth()
  const { success, error: showError } = useNotification()
  const { t } = useLanguage()

  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("login")

  const [loginData, setLoginData] = useState({ username: "", password: "" })
  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await login(loginData.username, loginData.password)
      if (result.success) {
        success(t("login.successLogin"))
        router.push("/dashboard")
      } else {
        showError(result.error || t("login.errorLogin"))
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (registerData.password !== registerData.confirmPassword) {
      showError(t("login.passwordMismatch"))
      setIsLoading(false)
      return
    }

    try {
      const result = await register(
        registerData.username,
        registerData.password,
        registerData.email
      )
      if (result.success) {
        // Auto-login after successful registration
        const loginResult = await login(registerData.username, registerData.password)
        if (loginResult.success) {
          success(t("login.registerSuccess"))
          router.push("/setup")
        } else {
          // Login failed after register - fall back to manual login
          success(t("login.registerSuccessLogin"))
          setActiveTab("login")
          setLoginData({ username: registerData.username, password: "" })
        }
      } else {
        showError(result.error || t("login.registerError"))
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen flex items-center justify-center bg-white dark:bg-black p-4"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-12">
          <h1 className="text-5xl font-serif font-bold mb-3">{t("login.title")}</h1>
          <p className="text-lg text-muted-foreground font-sans">
            {t("login.subtitle")}
          </p>
        </div>

        <EditorialCard>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-8 bg-white dark:bg-black border border-black dark:border-white rounded-sm">
              <TabsTrigger value="login" className="rounded-none">
                {t("login.tabLogin")}
              </TabsTrigger>
              <TabsTrigger value="register" className="rounded-none">
                {t("login.tabRegister")}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-5">
              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="block text-sm font-sans font-medium mb-2">
                    {t("login.username")}
                  </label>
                  <InputEnhanced
                    type="text"
                    placeholder={t("login.usernamePlaceholder")}
                    value={loginData.username}
                    onChange={(e) =>
                      setLoginData({
                        ...loginData,
                        username: e.target.value,
                      })
                    }
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-sans font-medium mb-2">
                    {t("login.password")}
                  </label>
                  <InputEnhanced
                    type="password"
                    placeholder={t("login.passwordPlaceholder")}
                    value={loginData.password}
                    onChange={(e) =>
                      setLoginData({
                        ...loginData,
                        password: e.target.value,
                      })
                    }
                    disabled={isLoading}
                  />
                </div>

                <EditorialButton
                  type="submit"
                  variant="primary"
                  className="w-full"
                >
                  {isLoading ? t("login.loggingIn") : t("login.loginButton")}
                </EditorialButton>
              </form>

              <OAuthButtons />
            </TabsContent>

            <TabsContent value="register" className="space-y-5">
              <form onSubmit={handleRegister} className="space-y-5">
                <div>
                  <label className="block text-sm font-sans font-medium mb-2">
                    {t("login.username")}
                  </label>
                  <InputEnhanced
                    type="text"
                    placeholder={t("login.chooseUsername")}
                    value={registerData.username}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        username: e.target.value,
                      })
                    }
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-sans font-medium mb-2">
                    {t("login.email")}
                  </label>
                  <InputEnhanced
                    type="email"
                    placeholder={t("login.emailPlaceholder")}
                    value={registerData.email}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        email: e.target.value,
                      })
                    }
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-sans font-medium mb-2">
                    {t("login.password")}
                  </label>
                  <InputEnhanced
                    type="password"
                    placeholder={t("login.createPassword")}
                    value={registerData.password}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        password: e.target.value,
                      })
                    }
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-sans font-medium mb-2">
                    {t("login.confirmPassword")}
                  </label>
                  <InputEnhanced
                    type="password"
                    placeholder={t("login.confirmPasswordPlaceholder")}
                    value={registerData.confirmPassword}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        confirmPassword: e.target.value,
                      })
                    }
                    disabled={isLoading}
                  />
                </div>

                <EditorialButton
                  type="submit"
                  variant="primary"
                  className="w-full"
                >
                  {isLoading ? t("login.registering") : t("login.registerButton")}
                </EditorialButton>
              </form>

              <OAuthButtons />
            </TabsContent>
          </Tabs>
        </EditorialCard>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="text-center text-xs text-muted-foreground mt-8 font-sans"
        >
          {t("login.terms")}
        </motion.p>
      </motion.div>
    </motion.div>
  )
}
