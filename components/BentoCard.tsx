import * as React from "react"
import { type LucideIcon } from "lucide-react"

export interface BentoCardProps {
  title?: string
  value?: string | number
  description?: string
  icon?: LucideIcon
  className?: string
  textClassName?: string
  children?: React.ReactNode
}

export function BentoCard({
  title,
  value,
  description,
  icon: Icon,
  className = "",
  textClassName = "",
  children,
}: BentoCardProps) {
  return (
    <div className={`rounded-3xl p-6 flex flex-col ${className}`}>
      {children ? (
        children
      ) : (
        <>
          {title && (
            <div className="flex items-center justify-between mb-2">
              <span className={`text-xs ${textClassName || "text-gray-400"}`}>{title}</span>
              {Icon && <Icon className={`w-4 h-4 ${textClassName || "text-gray-400"}`} />}
            </div>
          )}
          {value && (
            <div className={`text-4xl sm:text-5xl font-medium tracking-tight ${textClassName || ""}`}>
              {value}
            </div>
          )}
          {description && (
            <p className={`text-xs mt-2 ${textClassName || "text-gray-500"}`}>{description}</p>
          )}
        </>
      )}
    </div>
  )
}

export function BentoPercentageCard({
  percentage,
  label,
  users,
  variant,
}: {
  percentage: number
  label: string
  users: string
  variant: "dark" | "lime"
}) {
  const isLime = variant === "lime"

  return (
    <div
      className={`rounded-3xl p-5 flex items-center justify-between ${
        isLime ? "bg-[#D3FF33]" : "bg-[#2A2B2F]"
      }`}
    >
      <div className="flex flex-col">
        <span
          className={`text-4xl sm:text-5xl font-medium tracking-tight ${
            isLime ? "text-black" : "text-white"
          }`}
        >
          {percentage}%
        </span>
        <span
          className={`text-xs mt-1 ${isLime ? "text-black/70" : "text-gray-400"}`}
        >
          {label}
        </span>
      </div>
      <span
        className={`text-xs ${isLime ? "text-black/50" : "text-gray-500"}`}
      >
        {users}
      </span>
    </div>
  )
}
