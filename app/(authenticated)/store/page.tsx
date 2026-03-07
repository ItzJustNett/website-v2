"use client"

import { useEffect, useState } from "react"
import { PageTransition } from "@/components/page-transition"
import { GlassCard } from "@/components/immersive/glass-card"
import { CoinCounter } from "@/components/immersive/coin-counter"
import { ButtonEnhanced } from "@/components/immersive/button-enhanced"
import { motion } from "framer-motion"
import { ShoppingBag } from "lucide-react"
import { fetchWithAuth } from "@/lib/api"
import { useNotification } from "@/contexts/notification-context"

interface StoreItem {
  id: string
  name: string
  price: number
  description?: string
  type: string
}

export default function StorePage() {
  const [coins, setCoins] = useState(0)
  const [items, setItems] = useState<StoreItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [purchasingId, setPurchasingId] = useState<string | null>(null)
  const { error: showError, success: showSuccess } = useNotification()

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        setIsLoading(true)
        // Fetch user profile to get coins
        const profile = await fetchWithAuth("/profiles/me")
        setCoins(profile.meowcoins)

        // TODO: Fetch store items from API when endpoint is available
        // For now, we'll use placeholder data
        const defaultItems: StoreItem[] = [
          {
            id: "1",
            name: "Golden Hat",
            price: 500,
            type: "hat",
            description: "A shiny golden hat",
          },
          {
            id: "2",
            name: "Sunglasses",
            price: 300,
            type: "accessory",
            description: "Cool shades",
          },
          {
            id: "3",
            name: "Party Crown",
            price: 750,
            type: "hat",
            description: "Celebrate in style",
          },
          {
            id: "4",
            name: "Wizard Hat",
            price: 1000,
            type: "hat",
            description: "Master of magic",
          },
        ]
        setItems(defaultItems)
      } catch (err) {
        console.error("Error fetching store data:", err)
        showError("Failed to load store")
      } finally {
        setIsLoading(false)
      }
    }

    fetchStoreData()
  }, [showError])

  const handlePurchase = async (item: StoreItem) => {
    if (coins < item.price) {
      showError("Not enough coins!")
      return
    }

    try {
      setPurchasingId(item.id)
      // TODO: Call actual purchase endpoint when available
      // For now, just simulate the purchase
      setCoins(coins - item.price)
      showSuccess(`Purchased ${item.name}!`)
    } catch (err) {
      console.error("Purchase error:", err)
      showError("Purchase failed")
    } finally {
      setPurchasingId(null)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent"></div>
        </motion.div>
      </div>
    )
  }

  const storeEmojis: Record<string, string> = {
    hat: "👒",
    accessory: "😎",
    background: "🎨",
  }

  return (
    <PageTransition>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <ShoppingBag className="w-8 h-8" />
            Store
          </h1>
          <CoinCounter count={coins} size="lg" />
        </div>

        <div className="mb-6 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
          <p className="text-sm text-muted-foreground">
            Use your meowcoins to customize your cat and unlock special items!
          </p>
        </div>

        {items.length === 0 ? (
          <GlassCard className="text-center py-12">
            <p className="text-muted-foreground mb-4">No items available yet.</p>
            <p className="text-sm text-muted-foreground">Check back soon!</p>
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <GlassCard
                  className="flex flex-col h-full"
                  hover
                  onClick={() => handlePurchase(item)}
                >
                  <div className="text-6xl text-center mb-4">
                    {storeEmojis[item.type] || "🎁"}
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
                  {item.description && (
                    <p className="text-xs text-muted-foreground mb-4 flex-grow">
                      {item.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between mb-4 pt-4 border-t border-border/50">
                    <span className="text-yellow-500 font-bold flex items-center gap-1">
                      💰 {item.price}
                    </span>
                    {coins >= item.price ? (
                      <span className="text-xs text-green-500">✓ Affordable</span>
                    ) : (
                      <span className="text-xs text-red-500">Too pricey</span>
                    )}
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <ButtonEnhanced
                      onClick={(e) => {
                        e.stopPropagation()
                        handlePurchase(item)
                      }}
                      disabled={coins < item.price || purchasingId === item.id}
                      className="w-full"
                      glow={coins >= item.price}
                    >
                      {purchasingId === item.id
                        ? "Purchasing..."
                        : coins >= item.price
                          ? "Buy"
                          : "Can't Afford"}
                    </ButtonEnhanced>
                  </motion.div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </PageTransition>
  )
}
