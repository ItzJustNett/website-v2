"use client"

import { useProfile } from "@/contexts/profile-context"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export function SetupGuard({ children }: { children: React.ReactNode }) {
  const { grade, isProfileLoaded } = useProfile()
  const pathname = usePathname()
  const router = useRouter()
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    if (!isProfileLoaded) return

    // Don't redirect if already on the setup page
    if (pathname === "/setup") {
      setChecked(true)
      return
    }

    // If grade is null after profile loaded, user hasn't completed setup
    if (grade === null) {
      router.push("/setup")
      return
    }

    setChecked(true)
  }, [grade, isProfileLoaded, pathname, router])

  if (pathname === "/setup") {
    return <>{children}</>
  }

  if (!checked) {
    return null
  }

  return <>{children}</>
}
