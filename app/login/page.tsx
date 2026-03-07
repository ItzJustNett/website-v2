"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useAuth } from "@/contexts/auth-context"
import { useNotification } from "@/contexts/notification-context"
import { PageTransition } from "@/components/page-transition"
import { GlassCard } from "@/components/immersive/glass-card"
import { ButtonEnhanced } from "@/components/immersive/button-enhanced"
import { InputEnhanced } from "@/components/immersive/input-enhanced"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Brain } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const { login, register } = useAuth()
  const { success, error: showError } = useNotification()

  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("login")

  // Login form
  const [loginData, setLoginData] = useState({ username: "", password: "" })

  // Register form
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

  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4">
        {/* Animated background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
          <motion.div
            animate={{
              x: [0, 100, -100, 0],
              y: [0, -100, 100, 0],
              rotate: [0, 90, 180, 270, 360],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 blur-3xl"
          />
          <motion.div
            animate={{
              x: [0, -100, 100, 0],
              y: [0, 100, -100, 0],
              rotate: [360, 270, 180, 90, 0],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-r from-accent/20 to-primary/20 blur-3xl"
          />
        </div>

        {/* Main content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md"
        >
          {/* Logo and title */}
          <motion.div variants={itemVariants} className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-primary to-accent mb-4 mx-auto"
            >
              <Brain className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              PureMind
            </h1>
            <p className="text-muted-foreground mt-2">
              Immersive learning, powered by AI
            </p>
          </motion.div>

          {/* Auth forms */}
          <motion.div variants={itemVariants}>
            <GlassCard>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="register">Register</TabsTrigger>
                </TabsList>

                {/* Login form */}
                <TabsContent value="login" className="space-y-4">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Username
                      </label>
                      <InputEnhanced
                        type="text"
                        placeholder="Enter your username"
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
                      <label className="block text-sm font-medium mb-2">
                        Password
                      </label>
                      <InputEnhanced
                        type="password"
                        placeholder="Enter your password"
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

                    <ButtonEnhanced
                      type="submit"
                      disabled={isLoading}
                      className="w-full"
                      glow
                    >
                      {isLoading ? "Logging in..." : "Login"}
                    </ButtonEnhanced>
                  </form>
                </TabsContent>

                {/* Register form */}
                <TabsContent value="register" className="space-y-4">
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Username
                      </label>
                      <InputEnhanced
                        type="text"
                        placeholder="Choose a username"
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
                      <label className="block text-sm font-medium mb-2">
                        Email
                      </label>
                      <InputEnhanced
                        type="email"
                        placeholder="Enter your email"
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
                      <label className="block text-sm font-medium mb-2">
                        Password
                      </label>
                      <InputEnhanced
                        type="password"
                        placeholder="Create a password"
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
                      <label className="block text-sm font-medium mb-2">
                        Confirm Password
                      </label>
                      <InputEnhanced
                        type="password"
                        placeholder="Confirm your password"
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

                    <ButtonEnhanced
                      type="submit"
                      disabled={isLoading}
                      className="w-full"
                      glow
                    >
                      {isLoading ? "Creating account..." : "Register"}
                    </ButtonEnhanced>
                  </form>
                </TabsContent>
              </Tabs>
            </GlassCard>
          </motion.div>

          {/* Footer text */}
          <motion.p
            variants={itemVariants}
            className="text-center text-xs text-muted-foreground mt-6"
          >
            By logging in, you agree to our Terms of Service and Privacy
            Policy
          </motion.p>
        </motion.div>
      </div>
    </PageTransition>
  )
}
