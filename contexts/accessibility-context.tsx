"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface AccessibilitySettings {
  fontSize: number
  highContrast: boolean
  readAloud: boolean
  dyslexicFont: boolean
  reducedMotion: boolean
  setFontSize: (size: number) => void
  setHighContrast: (value: boolean) => void
  setReadAloud: (value: boolean) => void
  setDyslexicFont: (value: boolean) => void
  setReducedMotion: (value: boolean) => void
}

const AccessibilityContext = createContext<AccessibilitySettings | undefined>(undefined)

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [fontSize, setFontSize] = useState(100)
  const [highContrast, setHighContrast] = useState(false)
  const [readAloud, setReadAloud] = useState(false)
  const [dyslexicFont, setDyslexicFont] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("accessibility")
      if (saved) {
        const settings = JSON.parse(saved)
        setFontSize(settings.fontSize || 100)
        setHighContrast(settings.highContrast || false)
        setReadAloud(settings.readAloud || false)
        setDyslexicFont(settings.dyslexicFont || false)
        setReducedMotion(settings.reducedMotion || false)
      }

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setReducedMotion(true)
      }
    }
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("accessibility", JSON.stringify({
        fontSize,
        highContrast,
        readAloud,
        dyslexicFont,
        reducedMotion,
      }))

      document.documentElement.style.fontSize = `${fontSize}%`
      document.documentElement.classList.toggle("high-contrast", highContrast)
      document.documentElement.classList.toggle("reduce-motion", reducedMotion)
    }
  }, [fontSize, highContrast, readAloud, dyslexicFont, reducedMotion])

  return (
    <AccessibilityContext.Provider
      value={{
        fontSize,
        highContrast,
        readAloud,
        dyslexicFont,
        reducedMotion,
        setFontSize,
        setHighContrast,
        setReadAloud,
        setDyslexicFont,
        setReducedMotion,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  )
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext)
  if (context === undefined) {
    throw new Error("useAccessibility must be used within an AccessibilityProvider")
  }
  return context
}
