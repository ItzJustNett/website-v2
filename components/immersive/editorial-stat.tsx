"use client"

interface EditorialStatProps {
  value: string | number
  label: string
  size?: "sm" | "md" | "lg"
}

export function EditorialStat({
  value,
  label,
  size = "md",
}: EditorialStatProps) {
  const sizeStyles = {
    sm: "text-3xl",
    md: "text-5xl",
    lg: "text-6xl",
  }

  return (
    <div className="text-center">
      <div className={`${sizeStyles[size]} font-serif font-bold text-black dark:text-white mb-2`}>
        {value}
      </div>
      <p className="text-sm font-sans text-muted-foreground uppercase tracking-wide">
        {label}
      </p>
    </div>
  )
}
