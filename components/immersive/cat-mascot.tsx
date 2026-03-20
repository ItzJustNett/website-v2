"use client"

import { motion } from "framer-motion"

interface CatMascotProps {
  size?: "sm" | "md" | "lg"
  state?: "idle" | "happy" | "thinking"
}

export function CatMascot({ size = "md", state = "idle" }: CatMascotProps) {
  const sizeClasses = {
    sm: "w-20 h-20 text-4xl",
    md: "w-32 h-32 text-6xl",
    lg: "w-48 h-48 text-8xl",
  }

  const stateImages = {
    idle: "/orange.png",
    happy: "/orange.png",
    thinking: "/gray.png",
  }

  const breatheVariants = {
    animate: {
      y: [0, -8, 0],
      scale: [1, 1.05, 1],
    },
  }

  return (
    <motion.div
      variants={breatheVariants}
      animate="animate"
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className={`flex items-center justify-center cursor-pointer ${sizeClasses[size]}`}
    >
      <motion.div
        whileHover={{
          scale: 1.1,
          rotate: 5,
        }}
        className="select-none"
      >
        <img src={stateImages[state]} alt="Cat mascot" className="w-full h-full object-contain" />
      </motion.div>
    </motion.div>
  )
}
