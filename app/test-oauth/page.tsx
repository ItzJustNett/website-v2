"use client"

import { OAuthButtons } from "@/components/oauth-buttons"
import { GlassCard } from "@/components/immersive/glass-card"
import { motion } from "framer-motion"

export default function TestOAuthPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <GlassCard>
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold mb-2">Test OAuth Login</h1>
            <p className="text-muted-foreground">
              Click a button to test Discord/Microsoft login
            </p>
          </div>

          <OAuthButtons />

          <div className="mt-6 p-4 bg-foreground/5 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Note:</strong> Make sure you've added your Discord Client ID 
              and Secret to the API's .env file!
            </p>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  )
}
