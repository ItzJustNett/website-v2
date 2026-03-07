export const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3 }
}

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    }
  }
}

export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 }
}

export const slideIn = (direction: 'left' | 'right' | 'up' | 'down') => {
  const variants = {
    left: { initial: { x: -100, opacity: 0 }, animate: { x: 0, opacity: 1 } },
    right: { initial: { x: 100, opacity: 0 }, animate: { x: 0, opacity: 1 } },
    up: { initial: { y: 100, opacity: 0 }, animate: { y: 0, opacity: 1 } },
    down: { initial: { y: -100, opacity: 0 }, animate: { y: 0, opacity: 1 } },
  }
  return {
    ...variants[direction],
    transition: { duration: 0.4, ease: "easeOut" }
  }
}

export const scaleIn = {
  initial: { scale: 0.9, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  transition: { duration: 0.3 }
}

export const bounceIn = {
  initial: { scale: 0.3, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  transition: {
    type: "spring",
    stiffness: 260,
    damping: 20
  }
}

export const shakeAnimation = {
  animate: {
    x: [0, -10, 10, -10, 10, 0],
    transition: { duration: 0.5 }
  }
}

export const pulseGlow = {
  animate: {
    boxShadow: [
      "0 0 0 0 currentColor",
      "0 0 0 10px rgba(59, 130, 246, 0.7)",
      "0 0 0 20px rgba(59, 130, 246, 0)"
    ]
  },
  transition: { duration: 2, repeat: Infinity }
}
