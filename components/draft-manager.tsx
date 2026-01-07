"use client"

import { useEffect, useState } from "react"
import { Copy, Trash2, Pin, PinOff, Download, Edit2 } from "lucide-react"
import {
  getDrafts,
  getCurrentDraftId,
  setCurrentDraftId,
  deleteDraft,
  togglePinDraft,
  renameDraft,
  type Draft,
} from "@/lib/draft-manager"
import { useToast } from "@/hooks/use-toast"

interface DraftManagerProps {
  onLoadDraft: (content: string) => void
  onClose: () => void
}

export function DraftManager({ onLoadDraft, onClose }: DraftManagerProps) {
  const [drafts, setDrafts] = useState<Draft[]>([])
  const [currentId, setCurrentId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    setDrafts(getDrafts())
    setCurrentId(getCurrentDraftId())
  }, [])

  const handleLoadDraft = (draft: Draft) => {
    onLoadDraft(draft.content)
    setCurrentDraftId(draft.id)
    setCurrentId(draft.id)
    toast({
      title: "Draft loaded",
      description: `"${draft.name}" has been loaded.`,
    })
  }

  const handleDeleteDraft = (id: string) => {
    if (confirm("Are you sure you want to delete this draft?")) {
      deleteDraft(id)
      setDrafts(getDrafts())
      toast({
        title: "Draft deleted",
        description: "The draft has been removed.",
      })
    }
  }

  const handleTogglePin = (id: string) => {
    togglePinDraft(id)
    setDrafts(getDrafts())
  }

  const handleRenameDraft = (id: string, newName: string) => {
    if (newName.trim()) {
      renameDraft(id, newName)
      setDrafts(getDrafts())
      setEditingId(null)
    }
  }

  const handleExportDraft = (draft: Draft) => {
    const element = document.createElement("a")
    const file = new Blob([draft.content], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = `${draft.name}.md`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const handleCopyDraft = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content)
      toast({
        title: "Copied!",
        description: "Draft content copied to clipboard.",
      })
    } catch {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard.",
        variant: "destructive",
      })
    }
  }

  const sortedDrafts = [...drafts].sort((a, b) => {
    if (a.isPinned !== b.isPinned) {
      return b.isPinned ? 1 : -1
    }
    return b.updatedAt - a.updatedAt
  })

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card px-4 py-3 flex items-center justify-between">
        <h3 className="font-semibold text-foreground">Drafts ({drafts.length})</h3>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors text-sm">
          Close
        </button>
      </div>

      {/* Drafts List */}
      <div className="flex-1 overflow-y-auto">
        {sortedDrafts.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
            <p>No drafts yet. Create one from the toolbar.</p>
          </div>
        ) : (
          <div className="p-4 space-y-2">
            {sortedDrafts.map((draft) => (
              <div
                key={draft.id}
                className={`p-3 rounded-lg border transition-colors cursor-pointer ${
                  currentId === draft.id ? "border-primary bg-accent/20" : "border-border bg-card hover:bg-accent/10"
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1 cursor-pointer" onClick={() => handleLoadDraft(draft)}>
                    {editingId === draft.id ? (
                      <input
                        autoFocus
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleRenameDraft(draft.id, editingName)
                          } else if (e.key === "Escape") {
                            setEditingId(null)
                          }
                        }}
                        onBlur={() => handleRenameDraft(draft.id, editingName)}
                        className="w-full px-2 py-1 bg-background border border-primary rounded text-sm font-medium"
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <h4 className="font-medium text-foreground text-sm">{draft.name}</h4>
                    )}
                  </div>

                  <div className="flex gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setEditingId(draft.id)
                        setEditingName(draft.name)
                      }}
                      className="p-1 rounded hover:bg-accent"
                      title="Rename"
                    >
                      <Edit2 className="h-3 w-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleTogglePin(draft.id)
                      }}
                      className="p-1 rounded hover:bg-accent"
                      title={draft.isPinned ? "Unpin" : "Pin"}
                    >
                      {draft.isPinned ? <PinOff className="h-3 w-3" /> : <Pin className="h-3 w-3" />}
                    </button>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground mb-2 line-clamp-1">{draft.content.slice(0, 100)}...</p>

                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-muted-foreground">
                    {new Date(draft.updatedAt).toLocaleDateString()}{" "}
                    {new Date(draft.updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>

                  <div className="flex gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleCopyDraft(draft.content)
                      }}
                      className="p-1 rounded hover:bg-accent text-xs"
                      title="Copy"
                    >
                      <Copy className="h-3 w-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleExportDraft(draft)
                      }}
                      className="p-1 rounded hover:bg-accent text-xs"
                      title="Export"
                    >
                      <Download className="h-3 w-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteDraft(draft.id)
                      }}
                      className="p-1 rounded hover:bg-destructive/50 hover:text-destructive text-xs"
                      title="Delete"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
