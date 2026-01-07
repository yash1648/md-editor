"use client"

import { FileText, Moon, Sun, Minimize2 } from "lucide-react"

interface HeaderProps {
  onThemeChange?: (theme: "light" | "dark" | "minimal") => void
  currentTheme?: "light" | "dark" | "minimal"
}

export function Header({ onThemeChange, currentTheme = "light" }: HeaderProps) {
  const themes: Array<"light" | "dark" | "minimal"> = ["light", "dark", "minimal"]

  const getThemeIcon = (theme: "light" | "dark" | "minimal") => {
    switch (theme) {
      case "light":
        return <Sun className="h-4 w-4" />
      case "dark":
        return <Moon className="h-4 w-4" />
      case "minimal":
        return <Minimize2 className="h-4 w-4" />
    }
  }

  return (
    <header className="border-b border-border bg-card px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <FileText className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">MD-Editor</h1>
            <p className="text-sm text-muted-foreground">
              Forget ads for now.
Developers come from these places 👇Forget ads for now.
Developers come from these places 👇
            </p>
          </div>
        </div>

        {/* Theme switcher */}
        {onThemeChange && (
          <div className="flex gap-2">
            {themes.map((theme) => (
              <button
                key={theme}
                onClick={() => onThemeChange(theme)}
                className={`p-2 rounded-lg transition-colors ${
                  currentTheme === theme
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
                title={`${theme.charAt(0).toUpperCase() + theme.slice(1)} theme`}
              >
                {getThemeIcon(theme)}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  )
}
