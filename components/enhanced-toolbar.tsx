"use client"

import type React from "react"

import { useCallback, useRef, useState } from "react"
import { Copy, Download, RotateCcw, Save, FileText, Settings2 } from "lucide-react"
import { TemplateSelector } from "./template-selector"
import { DraftManager } from "./draft-manager"
import { useToast } from "@/hooks/use-toast"
import { createDraft } from "@/lib/draft-manager"

interface EnhancedToolbarProps {
  content: string
  onContentChange: (content: string) => void
  onLoadTemplate: (template: string) => void
}

export function EnhancedToolbar({ content, onContentChange, onLoadTemplate }: EnhancedToolbarProps) {
  const { toast } = useToast()
  const [showDraftManager, setShowDraftManager] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content)
      toast({
        title: "Copied!",
        description: "Markdown content copied to clipboard.",
      })
    } catch {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard.",
        variant: "destructive",
      })
    }
  }

  const handleExport = () => {
    const element = document.createElement("a")
    const file = new Blob([content], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = "README.md"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)

    toast({
      title: "Downloaded!",
      description: "File exported as README.md.",
    })
  }

  const handleSaveDraft = useCallback(() => {
    const draftName = prompt("Draft name (optional):", "")
    if (draftName !== null) {
      createDraft(content, draftName || undefined)
      toast({
        title: "Draft saved!",
        description: "Your draft has been saved.",
      })
    }
  }, [content, toast])

  const handleClear = () => {
    if (confirm("Are you sure you want to clear all content?")) {
      onContentChange("")
      toast({
        title: "Cleared",
        description: "Editor has been cleared.",
      })
    }
  }

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target?.result as string
      onContentChange(text)
      toast({
        title: "File imported",
        description: `"${file.name}" has been imported.`,
      })
    }
    reader.readAsText(file)
  }

  return (
    <>
      <div className="flex flex-wrap gap-2 border-b border-border bg-card p-4">
        {/* Templates */}
        <TemplateSelector onSelect={onLoadTemplate} />

        <div className="w-px bg-border" />

        {/* Action Buttons */}
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-accent text-accent-foreground hover:opacity-90 transition-opacity text-sm font-medium"
          title="Copy markdown to clipboard"
        >
          <Copy className="h-4 w-4" />
          <span className="hidden sm:inline">Copy</span>
        </button>

        <button
          onClick={handleExport}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity text-sm font-medium"
          title="Export as README.md"
        >
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">Export</span>
        </button>

        <button
          onClick={handleSaveDraft}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-green-600 text-green-50 hover:opacity-90 transition-opacity text-sm font-medium"
          title="Save current content as draft"
        >
          <Save className="h-4 w-4" />
          <span className="hidden sm:inline">Save Draft</span>
        </button>

        <button
          onClick={() => setShowDraftManager(!showDraftManager)}
          className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg transition-opacity text-sm font-medium ${
            showDraftManager ? "bg-blue-600 text-blue-50" : "bg-secondary text-secondary-foreground hover:opacity-90"
          }`}
          title="Manage drafts"
        >
          <FileText className="h-4 w-4" />
          <span className="hidden sm:inline">Drafts</span>
        </button>

        <button
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors text-sm font-medium"
          title="Import markdown file"
        >
          <Settings2 className="h-4 w-4" />
          <span className="hidden sm:inline">Import</span>
        </button>

        <button
          onClick={handleClear}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary text-secondary-foreground hover:opacity-90 transition-opacity text-sm font-medium ml-auto"
          title="Clear editor"
        >
          <RotateCcw className="h-4 w-4" />
          <span className="hidden sm:inline">Clear</span>
        </button>
      </div>

      {/* Draft Manager Panel */}
      {showDraftManager && (
        <div className="border-b border-border bg-card max-h-96 overflow-hidden">
          <DraftManager onLoadDraft={onContentChange} onClose={() => setShowDraftManager(false)} />
        </div>
      )}

      {/* Hidden file input */}
      <input ref={fileInputRef} type="file" accept=".md,.txt" onChange={handleImportFile} className="hidden" />
    </>
  )
}
