"use client"

import { useState } from "react"
import { PageTransition } from "@/components/page-transition"
import { GlassCard } from "@/components/immersive/glass-card"
import { CoinCounter } from "@/components/immersive/coin-counter"
import { ButtonEnhanced } from "@/components/immersive/button-enhanced"
import { motion } from "framer-motion"
import { ShoppingBag } from "lucide-react"

export default function StorePage() {
  const [coins, setCoins] = useState(1250)

  const items = [
    { id: 1, name: "Golden Hat", price: 500, emoji: "👒" },
    { id: 2, name: "Sunglasses", price: 300, emoji: "😎" },
    { id: 3, name: "Party Crown", price: 750, emoji: "👑" },
    { id: 4, name: "Wizard Hat", price: 1000, emoji: "🧙" },
  ]

  const handlePurchase = (price: number) => {
    if (coins >= price) {
      setCoins(coins - price)
    }
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <GlassCard key={item.id} className="flex flex-col">
              <div className="text-6xl text-center mb-4">{item.emoji}</div>
              <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
              <div className="flex items-center justify-between mb-4 flex-grow">
                <span className="text-yellow-500 font-bold flex items-center gap-1">
                  💰 {item.price}
                </span>
              </div>
              <ButtonEnhanced
                onClick={() => handlePurchase(item.price)}
                disabled={coins < item.price}
                className="w-full"
              >
                Buy
              </ButtonEnhanced>
            </GlassCard>
          ))}
        </div>
      </motion.div>
    </PageTransition>
  )
}
