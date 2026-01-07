"use client"

import type { ReactNode } from "react"

interface ButtonWithTooltipProps {
  onClick: () => void
  disabled: boolean
  disabledReason?: string
  icon: ReactNode
  label: string
  title: string
  variant?: "primary" | "secondary" | "accent" | "destructive" | "muted"
  hideIconOnMobile?: boolean
}

export function ButtonWithTooltip({
  onClick,
  disabled,
  disabledReason,
  icon,
  label,
  title,
  variant = "primary",
  hideIconOnMobile = true,
}: ButtonWithTooltipProps) {
  const variantClasses = {
    primary: "bg-primary text-primary-foreground hover:opacity-90",
    secondary: "bg-secondary text-secondary-foreground hover:opacity-90",
    accent: "bg-accent text-accent-foreground hover:opacity-90",
    destructive: "bg-destructive text-destructive-foreground hover:opacity-90",
    muted: "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground",
  }

  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : ""

  return (
    <div className="group relative inline-flex">
      <button
        onClick={onClick}
        disabled={disabled}
        className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg transition-opacity text-sm font-medium ${variantClasses[variant]} ${disabledClasses}`}
        title={disabled ? disabledReason : title}
      >
        {icon}
        <span className={hideIconOnMobile ? "hidden sm:inline" : ""}>{label}</span>
      </button>

      {disabled && disabledReason && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
          {disabledReason}
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 transform rotate-45" />
        </div>
      )}
    </div>
  )
}
