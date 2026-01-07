"use client"

import { Code2, Edit } from "lucide-react"

interface ModeToggleProps {
  mode: "raw" | "structured"
  onChange: (mode: "raw" | "structured") => void
}

export function ModeToggle({ mode, onChange }: ModeToggleProps) {
  return (
    <div className="flex gap-1 bg-muted p-1 rounded-lg">
      <button
        onClick={() => onChange("raw")}
        className={`flex items-center gap-2 px-3 py-1 rounded transition-colors text-sm font-medium ${
          mode === "raw" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <Edit className="h-4 w-4" />
        Raw Markdown
      </button>
      <button
        onClick={() => onChange("structured")}
        className={`flex items-center gap-2 px-3 py-1 rounded transition-colors text-sm font-medium ${
          mode === "structured" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <Code2 className="h-4 w-4" />
        Structured
      </button>
    </div>
  )
}
