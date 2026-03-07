"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface InputEnhancedProps extends React.ComponentProps<"input"> {
  glow?: boolean
}

const InputEnhanced = React.forwardRef<HTMLInputElement, InputEnhancedProps>(
  ({ className, type, glow = true, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false)

    return (
      <motion.div
        animate={
          isFocused && glow
            ? { boxShadow: "0 0 12px rgba(59, 130, 246, 0.4)" }
            : { boxShadow: "0 0 0px rgba(59, 130, 246, 0)" }
        }
        transition={{ duration: 0.15 }}
        className="relative rounded-md"
      >
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm transition-all",
            glow && isFocused && "border-primary",
            className
          )}
          onFocus={(e) => {
            setIsFocused(true)
            props.onFocus?.(e)
          }}
          onBlur={(e) => {
            setIsFocused(false)
            props.onBlur?.(e)
          }}
          ref={ref}
          {...props}
        />
      </motion.div>
    )
  }
)
InputEnhanced.displayName = "InputEnhanced"

export { InputEnhanced }
