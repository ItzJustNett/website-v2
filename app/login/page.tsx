"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useAuth } from "@/contexts/auth-context"
import { useNotification } from "@/contexts/notification-context"
import { EditorialCard } from "@/components/immersive/editorial-card"
import { EditorialButton } from "@/components/immersive/editorial-button"
import { InputEnhanced } from "@/components/immersive/input-enhanced"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { OAuthButtons } from "@/components/oauth-buttons"

export default function LoginPage() {
  const router = useRouter()
  const { login, register } = useAuth()
  const { success, error: showError } = useNotification()

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
        success("Login successful!")
        router.push("/dashboard")
      } else {
        showError(result.error || "Login failed")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (registerData.password !== registerData.confirmPassword) {
      showError("Passwords do not match")
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
        success("Registration successful! Please login.")
        setActiveTab("login")
        setLoginData({ username: registerData.username, password: "" })
      } else {
        showError(result.error || "Registration failed")
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
        {/* Logo and title */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-serif font-bold mb-3">PureMind</h1>
          <p className="text-lg text-muted-foreground font-sans">
            Focused learning, minimal distraction
          </p>
        </div>

        {/* Auth forms */}
        <EditorialCard>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-8 bg-white dark:bg-black border border-black dark:border-white rounded-sm">
              <TabsTrigger value="login" className="rounded-none">
                Login
              </TabsTrigger>
              <TabsTrigger value="register" className="rounded-none">
                Register
              </TabsTrigger>
            </TabsList>

            {/* Login form */}
            <TabsContent value="login" className="space-y-5">
              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="block text-sm font-sans font-medium mb-2">
                    Username
                  </label>
                  <InputEnhanced
                    type="text"
                    placeholder="your username"
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
                    Password
                  </label>
                  <InputEnhanced
                    type="password"
                    placeholder="your password"
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
                  {isLoading ? "Logging in..." : "Login"}
                </EditorialButton>
              </form>

              <OAuthButtons />
            </TabsContent>

            {/* Register form */}
            <TabsContent value="register" className="space-y-5">
              <form onSubmit={handleRegister} className="space-y-5">
                <div>
                  <label className="block text-sm font-sans font-medium mb-2">
                    Username
                  </label>
                  <InputEnhanced
                    type="text"
                    placeholder="choose a username"
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
                    Email
                  </label>
                  <InputEnhanced
                    type="email"
                    placeholder="your email"
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
                    Password
                  </label>
                  <InputEnhanced
                    type="password"
                    placeholder="create a password"
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
                    Confirm Password
                  </label>
                  <InputEnhanced
                    type="password"
                    placeholder="confirm password"
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
                  {isLoading ? "Creating account..." : "Register"}
                </EditorialButton>
              </form>

              <OAuthButtons />
            </TabsContent>
          </Tabs>
        </EditorialCard>

        {/* Footer text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="text-center text-xs text-muted-foreground mt-8 font-sans"
        >
          By logging in, you agree to our Terms of Service and Privacy Policy
        </motion.p>
      </motion.div>
    </motion.div>
  )
}
