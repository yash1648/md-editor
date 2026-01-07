"use client"

import { useRef, useState, useCallback, useEffect } from "react"
import { SectionBuilder, type Section } from "./section-builder"
import { ModeToggle } from "./mode-toggle"
import { EnhancedToolbar } from "./enhanced-toolbar"
import { EmptyEditorState } from "./empty-editor-state"
import { LargeFileWarning } from "./large-file-warning"
import { ValidationErrorBanner } from "./validation-error-banner"
import { validateMarkdown, type ValidationResult } from "@/lib/markdown-validator"
import { safeSetItem } from "@/lib/storage-manager"

interface ResizableEditorProps {
  value: string
  onChange: (value: string) => void
  onScroll?: (scrollPercentage: number) => void
  onStorageError?: (error: string) => void
}

export function ResizableEditor({ value, onChange, onScroll, onStorageError }: ResizableEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [mode, setMode] = useState<"raw" | "structured">("raw")
  const [sections, setSections] = useState<Section[]>([])
  const [validation, setValidation] = useState<ValidationResult>({ isValid: true, errors: [], warnings: [] })
  const [showValidation, setShowValidation] = useState(true)
  const [mounted, setMounted] = useState(false)

  const isEmpty = !value || value.trim().length === 0
  const sizeInKB = new Blob([value]).size / 1024

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem("editor-mode")
    if (saved) {
      setMode(saved as "raw" | "structured")
    }
  }, [])

  useEffect(() => {
    if (mounted) {
      const result = safeSetItem("editor-mode", mode, {
        onQuotaExceeded: () => {
          onStorageError?.("Storage quota exceeded. Some data may not be saved.")
        },
      })

      if (!result.success) {
        console.warn("Failed to save editor mode:", result.message)
      }
    }
  }, [mode, mounted, onStorageError])

  useEffect(() => {
    localStorage.setItem("editor-mode", mode)
  }, [mode])

  useEffect(() => {
    if (!isEmpty) {
      const validationResult = validateMarkdown(value)
      setValidation(validationResult)
    }
  }, [value, isEmpty])

  const handleScroll = useCallback(() => {
    if (!textareaRef.current || !onScroll) return

    const { scrollTop, scrollHeight, clientHeight } = textareaRef.current
    const maxScroll = scrollHeight - clientHeight
    const scrollPercentage = maxScroll > 0 ? scrollTop / maxScroll : 0
    onScroll(scrollPercentage)
  }, [onScroll])

  const handleSectionsChange = (newSections: Section[]) => {
    setSections(newSections)
    const markdown = newSections
      .map((section) => {
        switch (section.type) {
          case "heading":
            return `# ${section.title}\n${section.content}`
          case "code":
            return `## ${section.title}\n\`\`\`\n${section.content}\n\`\`\``
          case "list":
            const items = section.content
              .split("\n")
              .filter((line) => line.trim())
              .map((item) => `- ${item}`)
              .join("\n")
            return `## ${section.title}\n${items}`
          default:
            return `## ${section.title}\n${section.content}`
        }
      })
      .join("\n\n")
    onChange(markdown)
  }

  const handleLoadTemplate = (templateName: string) => {
    const TEMPLATES: Record<string, string> = {
      readme: `# Project Name\n\n## Overview\nBrief description of your project.\n\n## Features\n- Feature 1\n- Feature 2\n- Feature 3\n\n## Installation\n\`\`\`bash\nnpm install your-package\n\`\`\`\n\n## Usage\n\`\`\`javascript\nconst lib = require('your-package');\nlib.doSomething();\n\`\`\`\n\n## Contributing\nContributions are welcome!\n\n## License\nMIT`,
      blog: `# Blog Post Title\n\n*Published on ${new Date().toLocaleDateString()}*\n\n## Introduction\nStart with an engaging introduction.\n\n## Main Points\n\n### Point 1\nExplain your first major point.\n\n### Point 2\nExpand on your second point.\n\n## Conclusion\nWrap up your thoughts.`,
      report: `# Report Title\n\n## Executive Summary\nSummarize key findings.\n\n## Background\nProvide context.\n\n## Methodology\nExplain methods used.\n\n## Findings\nDetail results.\n\n## Recommendations\n1. Recommendation 1\n2. Recommendation 2`,
      blank: `# Start Here\n\nBegin typing your markdown content...`,
    }
    onChange(TEMPLATES[templateName] || "")
  }

  if (mode === "structured") {
    return (
      <div className="flex flex-1 flex-col border-r border-border bg-background">
        <EnhancedToolbar content={value} onContentChange={onChange} onLoadTemplate={handleLoadTemplate} />
        <div className="border-b border-border bg-card p-4">
          <ModeToggle mode={mode} onChange={setMode} />
        </div>
        <SectionBuilder sections={sections} onSectionsChange={handleSectionsChange} onClose={() => setMode("raw")} />
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col border-r border-border bg-background">
      <EnhancedToolbar content={value} onContentChange={onChange} onLoadTemplate={handleLoadTemplate} />
      <div className="border-b border-border bg-card p-4">
        <ModeToggle mode={mode} onChange={setMode} />
      </div>

      {showValidation && <ValidationErrorBanner validation={validation} onDismiss={() => setShowValidation(false)} />}

      {sizeInKB > 300 && (
        <div className="border-b border-border p-4">
          <LargeFileWarning sizeInKB={sizeInKB} />
        </div>
      )}

      {isEmpty ? (
        <EmptyEditorState onLoadTemplate={handleLoadTemplate} />
      ) : (
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onScroll={handleScroll}
          placeholder="Enter your markdown here..."
          className="flex-1 resize-none bg-background p-6 font-mono text-sm text-foreground focus:outline-none overflow-y-auto"
        />
      )}
    </div>
  )
}
