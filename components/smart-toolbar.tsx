"use client"

import type React from "react"

import { useCallback, useRef, useState } from "react"
import { Copy, Download, RotateCcw, Save, FileText, Settings2 } from "lucide-react"
import { TemplateSelector } from "./template-selector"
import { DraftManager } from "./draft-manager"
import { useNotifications } from "./notification-system"
import { ButtonWithTooltip } from "./button-with-tooltip"
import { canExport, checkFileSize, validateMarkdown } from "@/lib/markdown-validator"
import { createDraft } from "@/lib/draft-manager"

interface SmartToolbarProps {
  content: string
  onContentChange: (content: string) => void
  onLoadTemplate: (template: string) => void
}

export function SmartToolbar({ content, onContentChange, onLoadTemplate }: SmartToolbarProps) {
  const { add: addNotification } = useNotifications()
  const [showDraftManager, setShowDraftManager] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const isEmpty = !content || content.trim().length === 0
  const validation = !isEmpty ? validateMarkdown(content) : { isValid: true, errors: [], warnings: [] }
  const { canExport: canExportFile, reason: exportReason } = canExport(content)
  const fileSizeCheck = checkFileSize(content)

  const handleCopy = async () => {
    if (isEmpty) {
      addNotification({
        type: "warning",
        title: "Nothing to Copy",
        message: "Please add some content before copying.",
        duration: 3000,
      })
      return
    }

    try {
      await navigator.clipboard.writeText(content)
      addNotification({
        type: "success",
        title: "Copied!",
        message: "Markdown content copied to clipboard.",
        duration: 3000,
      })
    } catch {
      addNotification({
        type: "error",
        title: "Copy Failed",
        message: "Could not copy to clipboard. Try again.",
        duration: 3000,
      })
    }
  }

  const handleExport = () => {
    if (!canExportFile) {
      addNotification({
        type: "error",
        title: "Cannot Export",
        message: exportReason || "Content has validation errors",
        duration: 4000,
      })
      return
    }

    if (!fileSizeCheck.isValid) {
      addNotification({
        type: "error",
        title: "File Too Large",
        message: fileSizeCheck.message || "File exceeds maximum size",
        duration: 4000,
      })
      return
    }

    try {
      const element = document.createElement("a")
      const file = new Blob([content], { type: "text/plain;charset=utf-8" })
      element.href = URL.createObjectURL(file)
      element.download = "README.md"
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)
      URL.revokeObjectURL(element.href)

      addNotification({
        type: "success",
        title: "Downloaded!",
        message: "File exported as README.md",
        duration: 3000,
      })
    } catch {
      addNotification({
        type: "error",
        title: "Export Failed",
        message: "Could not download file. Try again.",
        duration: 3000,
      })
    }
  }

  const handleSaveDraft = useCallback(() => {
    if (isEmpty) {
      addNotification({
        type: "warning",
        title: "Empty Draft",
        message: "Please add content before saving a draft.",
        duration: 3000,
      })
      return
    }

    const draftName = prompt("Draft name (optional):", "")
    if (draftName !== null) {
      try {
        createDraft(content, draftName || undefined)
        addNotification({
          type: "success",
          title: "Draft Saved!",
          message: draftName ? `Draft "${draftName}" has been saved.` : "Your draft has been saved.",
          duration: 3000,
        })
      } catch {
        addNotification({
          type: "error",
          title: "Save Failed",
          message: "Could not save draft to storage.",
          duration: 3000,
        })
      }
    }
  }, [content, isEmpty, addNotification])

  const handleClear = () => {
    if (isEmpty) {
      addNotification({
        type: "info",
        title: "Already Empty",
        message: "The editor is already empty.",
        duration: 2000,
      })
      return
    }

    if (confirm("Are you sure you want to clear all content? This cannot be undone.")) {
      onContentChange("")
      addNotification({
        type: "success",
        title: "Cleared",
        message: "Editor has been cleared.",
        duration: 2000,
      })
    }
  }

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const sizeInMB = file.size / (1024 * 1024)
    if (sizeInMB > 10) {
      addNotification({
        type: "error",
        title: "File Too Large",
        message: `File is ${sizeInMB.toFixed(2)}MB. Maximum is 10MB.`,
        duration: 4000,
      })
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string
        onContentChange(text)
        addNotification({
          type: "success",
          title: "File Imported",
          message: `"${file.name}" has been imported.`,
          duration: 3000,
        })
      } catch {
        addNotification({
          type: "error",
          title: "Import Failed",
          message: "Could not read file. Make sure it is a valid text file.",
          duration: 3000,
        })
      }
    }
    reader.onerror = () => {
      addNotification({
        type: "error",
        title: "Import Failed",
        message: "Could not read file.",
        duration: 3000,
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

        {/* Smart Action Buttons */}
        <ButtonWithTooltip
          onClick={handleCopy}
          disabled={isEmpty}
          disabledReason="Add content to copy"
          icon={<Copy className="h-4 w-4" />}
          label="Copy"
          title="Copy markdown to clipboard"
          variant="accent"
        />

        <ButtonWithTooltip
          onClick={handleExport}
          disabled={!canExportFile}
          disabledReason={exportReason || "Content has validation errors"}
          icon={<Download className="h-4 w-4" />}
          label="Export"
          title="Export as README.md"
          variant="primary"
        />

        <ButtonWithTooltip
          onClick={handleSaveDraft}
          disabled={isEmpty}
          disabledReason="Add content to save a draft"
          icon={<Save className="h-4 w-4" />}
          label="Save Draft"
          title="Save current content as draft"
          variant="secondary"
        />

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

        <ButtonWithTooltip
          onClick={handleClear}
          disabled={isEmpty}
          disabledReason="Editor is already empty"
          icon={<RotateCcw className="h-4 w-4" />}
          label="Clear"
          title="Clear all content"
          variant="muted"
        />
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
