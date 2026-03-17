"use client"

import { useState } from "react"
import { PageTransition } from "@/components/page-transition"
import { GlassCard } from "@/components/immersive/glass-card"
import { ButtonEnhanced } from "@/components/immersive/button-enhanced"
import { motion } from "framer-motion"
import { Brain, Volume2, Lightbulb } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AIFeaturesPage() {
  const [isProcessing, setIsProcessing] = useState(false)

  const handleProcess = () => {
    setIsProcessing(true)
    setTimeout(() => setIsProcessing(false), 2000)
  }

  return (
    <PageTransition>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
          <Brain className="w-8 h-8" />
          AI функції
        </h1>

        <Tabs defaultValue="tts" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="tts">Озвучування тексту</TabsTrigger>
            <TabsTrigger value="summary">Конспекти</TabsTrigger>
            <TabsTrigger value="tools">AI інструменти</TabsTrigger>
          </TabsList>

          {/* Text-to-Speech */}
          <TabsContent value="tts">
            <GlassCard>
              <div className="flex items-center gap-3 mb-4">
                <Volume2 className="w-6 h-6 text-blue-500" />
                <h2 className="text-2xl font-bold">Озвучування тексту</h2>
              </div>
              <p className="text-muted-foreground mb-6">
                Слухайте уроки з озвученням від штучного інтелекту
              </p>
              <motion.div
                animate={isProcessing ? { scale: [1, 1.05, 1] } : {}}
                transition={{ duration: 0.6 }}
              >
                <ButtonEnhanced
                  onClick={handleProcess}
                  disabled={isProcessing}
                  className="w-full"
                  glow
                >
                  {isProcessing ? "Відтворення..." : "Відтворити аудіо уроку"}
                </ButtonEnhanced>
              </motion.div>
            </GlassCard>
          </TabsContent>

          {/* Summaries */}
          <TabsContent value="summary">
            <GlassCard>
              <div className="flex items-center gap-3 mb-4">
                <Lightbulb className="w-6 h-6 text-yellow-500" />
                <h2 className="text-2xl font-bold">Миттєві конспекти</h2>
              </div>
              <p className="text-muted-foreground mb-6">
                Отримуйте конспекти уроків, створені штучним інтелектом
              </p>
              <motion.div
                animate={isProcessing ? { scale: [1, 1.05, 1] } : {}}
                transition={{ duration: 0.6 }}
              >
                <ButtonEnhanced
                  onClick={handleProcess}
                  disabled={isProcessing}
                  className="w-full"
                  glow
                >
                  {isProcessing ? "Генерація..." : "Згенерувати конспект"}
                </ButtonEnhanced>
              </motion.div>
            </GlassCard>
          </TabsContent>

          {/* Tools */}
          <TabsContent value="tools">
            <GlassCard>
              <div className="flex items-center gap-3 mb-4">
                <Brain className="w-6 h-6 text-purple-500" />
                <h2 className="text-2xl font-bold">AI асистент</h2>
              </div>
              <p className="text-muted-foreground mb-6">
                Отримуйте миттєві відповіді та пояснення від нашого AI репетитора
              </p>
              <motion.div
                animate={isProcessing ? { scale: [1, 1.05, 1] } : {}}
                transition={{ duration: 0.6 }}
              >
                <ButtonEnhanced
                  onClick={handleProcess}
                  disabled={isProcessing}
                  className="w-full"
                  glow
                >
                  {isProcessing ? "Думаю..." : "Запитати AI асистента"}
                </ButtonEnhanced>
              </motion.div>
            </GlassCard>
          </TabsContent>
        </Tabs>
      </motion.div>
    </PageTransition>
  )
}
