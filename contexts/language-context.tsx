"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { t as translate, type Language } from "@/lib/translations"

interface LanguageContextValue {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string, params?: Record<string, string | number>) => string
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("uk")

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("language") as Language | null
      if (saved === "en" || saved === "uk") {
        setLanguageState(saved)
        document.documentElement.lang = saved
      } else {
        document.documentElement.lang = "uk"
      }
    }
  }, [])

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang)
    if (typeof window !== "undefined") {
      localStorage.setItem("language", lang)
      document.documentElement.lang = lang
    }
  }, [])

  const t = useCallback((key: string, params?: Record<string, string | number>) => {
    return translate(key, language, params)
  }, [language])

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
