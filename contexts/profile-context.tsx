"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { fetchWithAuth } from "@/lib/api"

interface ProfileContextType {
  meowcoins: number
  xp: number
  level: number
  grade: number | null
  catId: number
  equippedItems: string[]
  refreshProfile: () => Promise<void>
  updateMeowcoins: (coins: number) => void
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined)

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [meowcoins, setMeowcoins] = useState(0)
  const [xp, setXp] = useState(0)
  const [level, setLevel] = useState(1)
  const [grade, setGrade] = useState<number | null>(null)
  const [catId, setCatId] = useState(0)
  const [equippedItems, setEquippedItems] = useState<string[]>([])

  const refreshProfile = async () => {
    try {
      const profile = await fetchWithAuth("/profiles/me")
      setMeowcoins(profile.meowcoins || 0)
      setXp(profile.xp || 0)
      setLevel(profile.level || 1)
      setGrade(profile.grade || null)
      setCatId(profile.cat_id ?? 0)
      setEquippedItems(profile.equipped_items || [])
    } catch (err) {
      console.error("Error fetching profile:", err)
    }
  }

  const updateMeowcoins = (coins: number) => {
    console.log('[ProfileContext] Updating meowcoins from', meowcoins, 'to', coins)
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
        grade,
        catId,
        equippedItems,
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
