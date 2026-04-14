"use client"

import { useState, useEffect } from "react"
import { PageTransition } from "@/components/page-transition"
import { GlassCard } from "@/components/immersive/glass-card"
import { ButtonEnhanced } from "@/components/immersive/button-enhanced"
import { SkeletonLoader } from "@/components/immersive/skeleton-loader"
import { EmptyState } from "@/components/immersive/empty-state"
import { motion } from "framer-motion"
import { Store, Coins, Package, Check } from "lucide-react"
import { api } from "@/lib/api-client"
import { useNotification } from "@/contexts/notification-context"

interface StoreItem {
  id: string
  item_id: string
  name: string
  price: number
  description: string
}

interface Profile {
  meowcoins: number
  inventory: string[]
  equipped_items: string[]
}

const ITEM_EMOJIS: Record<string, string> = {
  "sunglasses": "😎",
  "cap": "🧢",
  "moustache": "🥸",
  "butterfly": "🦋",
  "bow-tie": "🎀",
  "crown": "👑",
  "glasses": "🤓",
  "party-hat": "🎉",
  "scarf": "🧣",
  "bandana": "🏴‍☠️",
  "flower": "🌸",
  "bow": "🎀",
  "top-hat": "🎩",
  "headphones": "🎧",
  "wizard-hat": "✨",
  "pirate-hat": "🏴‍☠️",
  "santa-hat": "🎅",
  "chef-hat": "👨‍🍳",
  "beret": "🎨",
  "necklace": "💎",
  "monocle": "🧐",
  "tie": "👔",
  "collar": "🔷",
  "badge": "⭐",
  "goggles": "🥽"
}

export default function StorePage() {
  const [items, setItems] = useState<StoreItem[]>([])
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [buyingItemId, setBuyingItemId] = useState<string | null>(null)
  const [equippingItemId, setEquippingItemId] = useState<string | null>(null)

  const { success: showSuccess, error: showError } = useNotification()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setIsLoading(true)
      const [storeData, profileData] = await Promise.all([
        api.get("/store"),
        api.get("/profiles/me")
      ])

      console.log("Store data:", storeData)
      console.log("Profile data:", profileData)

      // Ensure items is always an array
      const storeItems = Array.isArray(storeData?.items) ? storeData.items :
                         Array.isArray(storeData) ? storeData : []

      setItems(storeItems)
      setProfile(profileData)
    } catch (err) {
      console.error("Error fetching data:", err)
      showError("Не вдалося завантажити магазин")
      setItems([]) // Ensure items is set to empty array on error
    } finally {
      setIsLoading(false)
    }
  }

  const handleBuy = async (itemId: string, price: number) => {
    if (!profile || profile.meowcoins < price) {
      showError("Недостатньо MeowCoins!")
      return
    }

    try {
      setBuyingItemId(itemId)
      await api.post("/store/buy", { item_id: itemId })

      showSuccess("Предмет куплено!")
      await fetchData()
    } catch (err) {
      showError("Не вдалося купити предмет")
    } finally {
      setBuyingItemId(null)
    }
  }

  const handleEquip = async (itemId: string) => {
    try {
      setEquippingItemId(itemId)
      await api.get("/inventory/equip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ item_id: itemId })
      })

      showSuccess("Предмет екіпіровано!")
      await fetchData()
    } catch (err) {
      showError("Не вдалося екіпірувати предмет")
    } finally {
      setEquippingItemId(null)
    }
  }

  const handleUnequip = async (itemId: string) => {
    try {
      setEquippingItemId(itemId)
      await api.get("/inventory/unequip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ item_id: itemId })
      })

      showSuccess("Предмет знято!")
      await fetchData()
    } catch (err) {
      showError("Не вдалося зняти предмет")
    } finally {
      setEquippingItemId(null)
    }
  }

  const isOwned = (itemId: string) => profile?.inventory?.includes(itemId) || false
  const isEquipped = (itemId: string) => profile?.equipped_items?.includes(itemId) || false

  return (
    <PageTransition>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Store className="w-8 h-8" />
            Магазин аксесуарів для котів
          </h1>

          {profile && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-foreground/5 border border-border">
              <Coins className="w-5 h-5 text-yellow-500" />
              <span className="font-bold tabular-nums">{profile.meowcoins}</span>
              <span className="text-sm text-muted-foreground">MeowCoins</span>
            </div>
          )}
        </div>

        {isLoading ? (
          <SkeletonLoader type="card" count={4} />
        ) : items.length === 0 ? (
          <EmptyState icon="🏪" title="Магазин порожній" description="Повертайтесь пізніше!" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.isArray(items) && items.map((item, index) => {
              const owned = isOwned(item.item_id)
              const equipped = isEquipped(item.item_id)
              const canAfford = !!(profile && profile.meowcoins >= item.price)

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <GlassCard className="h-full flex flex-col">
                    <div className="text-center mb-4">
                      <div className="text-6xl mb-2">{ITEM_EMOJIS[item.item_id] || "🎁"}</div>
                      <h3 className="font-bold text-lg">{item.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                    </div>

                    <div className="flex items-center justify-center gap-2 mb-4">
                      <Coins className="w-4 h-4 text-yellow-500" />
                      <span className="font-bold tabular-nums">{item.price}</span>
                      <span className="text-xs text-muted-foreground">MC</span>
                    </div>

                    <div className="mt-auto">
                      {equipped ? (
                        <ButtonEnhanced onClick={() => handleUnequip(item.item_id)} disabled={equippingItemId === item.item_id} className="w-full" variant="secondary">
                          <Check className="w-4 h-4 mr-2" />Екіпіровано
                        </ButtonEnhanced>
                      ) : owned ? (
                        <ButtonEnhanced onClick={() => handleEquip(item.item_id)} disabled={equippingItemId === item.item_id} className="w-full">
                          <Package className="w-4 h-4 mr-2" />Екіпірувати
                        </ButtonEnhanced>
                      ) : (
                        <ButtonEnhanced onClick={() => handleBuy(item.item_id, item.price)} disabled={!canAfford || buyingItemId === item.item_id} className="w-full" glow={canAfford}>
                          {canAfford ? "Купити зараз" : "Недостатньо монет"}
                        </ButtonEnhanced>
                      )}
                    </div>
                  </GlassCard>
                </motion.div>
              )
            })}
          </div>
        )}

        <GlassCard className="mt-8">
          <div className="flex items-start gap-3">
            <Coins className="w-5 h-5 text-yellow-500 mt-1" />
            <div>
              <h3 className="font-bold mb-1">Як заробити MeowCoins</h3>
              <p className="text-sm text-muted-foreground">
                Виконуйте вправи та тести, щоб заробляти MeowCoins. Використовуйте їх, щоб купувати круті аксесуари для вашого кота!
              </p>
            </div>
          </div>
        </GlassCard>
      </div>
    </PageTransition>
  )
}
