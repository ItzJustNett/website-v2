"use client"

import { cn } from "@/lib/utils"
import { ReactNode, ButtonHTMLAttributes } from "react"

interface EditorialButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  onClick?: () => void
  href?: string
  variant?: "primary" | "secondary" | "ghost"
  className?: string
}

export function EditorialButton({
  children,
  onClick,
  href,
  variant = "primary",
  className,
  type = "button",
  ...rest
}: EditorialButtonProps) {
  const baseStyles = "inline-flex items-center justify-center px-6 py-3 text-sm font-medium transition-transform duration-300 hover:scale-[1.01] active:scale-[0.99] rounded-sm"

  const variantStyles = {
    primary: "bg-black dark:bg-white text-white dark:text-black border-[1.5px] border-black dark:border-white",
    secondary: "bg-white dark:bg-black text-black dark:text-white border-[1.5px] border-black dark:border-white",
    ghost: "text-black dark:text-white underline hover:no-underline",
  }

  const finalClassName = cn(
    baseStyles,
    variantStyles[variant],
    className
  )

  if (href) {
    return (
      <a href={href} className={finalClassName}>
        {children}
      </a>
    )
  }

  return (
    <button type={type} className={finalClassName} onClick={onClick} {...rest}>
      {children}
    </button>
  )
}
