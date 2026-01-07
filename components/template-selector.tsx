"use client"

import { useState } from "react"
import { FileText, ChevronDown } from "lucide-react"

const TEMPLATE_OPTIONS = [
  { id: "readme", label: "README", icon: "📄" },
  { id: "blog", label: "Blog Post", icon: "📝" },
  { id: "report", label: "Report", icon: "📊" },
  { id: "blank", label: "Blank", icon: "✨" },
]

export function TemplateSelector({
  onSelect,
}: {
  onSelect: (template: "readme" | "blog" | "report" | "blank") => void
}) {
  const [isOpen, setIsOpen] = useState(false)

  const handleSelect = (templateId: string) => {
    onSelect(templateId as "readme" | "blog" | "report" | "blank")
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors text-sm font-medium"
      >
        <FileText className="h-4 w-4" />
        Templates
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-48 rounded-lg border border-border bg-card shadow-lg z-50">
          {TEMPLATE_OPTIONS.map((template) => (
            <button
              key={template.id}
              onClick={() => handleSelect(template.id)}
              className="w-full text-left px-4 py-3 hover:bg-accent hover:text-accent-foreground transition-colors first:rounded-t-lg last:rounded-b-lg border-b border-border last:border-b-0"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{template.icon}</span>
                <span className="font-medium">{template.label}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
