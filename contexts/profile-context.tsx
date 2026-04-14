"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { fetchWithAuth } from "@/lib/api"

interface ProfileContextType {
  meowcoins: number
  xp: number
  level: number
  refreshProfile: () => Promise<void>
  updateMeowcoins: (coins: number) => void
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined)

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [meowcoins, setMeowcoins] = useState(0)
  const [xp, setXp] = useState(0)
  const [level, setLevel] = useState(1)

  const refreshProfile = async () => {
    try {
      const profile = await fetchWithAuth("/profiles/me")
      setMeowcoins(profile.meowcoins || 0)
      setXp(profile.xp || 0)
      setLevel(profile.level || 1)
    } catch (err) {
      console.error("Error fetching profile:", err)
    }
  }

  const updateMeowcoins = (coins: number) => {
    setMeowcoins(coins)
  }

  useEffect(() => {
    refreshProfile()
  }, [])

  return (
    <ProfileContext.Provider
      value={{
        meowcoins,
        xp,
        level,
        refreshProfile,
        updateMeowcoins,
      }}
    >
      {children}
    </ProfileContext.Provider>
  )
}

export function useProfile() {
  const context = useContext(ProfileContext)
  if (!context) {
    throw new Error("useProfile must be used within a ProfileProvider")
  }
  return context
}
