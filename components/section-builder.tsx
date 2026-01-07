"use client"

import { useState } from "react"
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react"

export interface Section {
  id: string
  title: string
  content: string
  type: "heading" | "body" | "code" | "list"
}

interface SectionBuilderProps {
  sections: Section[]
  onSectionsChange: (sections: Section[]) => void
  onClose: () => void
}

export function SectionBuilder({ sections, onSectionsChange, onClose }: SectionBuilderProps) {
  const [editingId, setEditingId] = useState<string | null>(null)

  const addSection = (type: Section["type"] = "body") => {
    const newSection: Section = {
      id: Date.now().toString(),
      title: "",
      content: "",
      type,
    }
    onSectionsChange([...sections, newSection])
  }

  const updateSection = (id: string, updates: Partial<Section>) => {
    onSectionsChange(sections.map((s) => (s.id === id ? { ...s, ...updates } : s)))
  }

  const deleteSection = (id: string) => {
    onSectionsChange(sections.filter((s) => s.id !== id))
  }

  const moveSection = (id: string, direction: "up" | "down") => {
    const index = sections.findIndex((s) => s.id === id)
    if ((direction === "up" && index === 0) || (direction === "down" && index === sections.length - 1)) {
      return
    }

    const newSections = [...sections]
    const swapIndex = direction === "up" ? index - 1 : index + 1
    ;[newSections[index], newSections[swapIndex]] = [newSections[swapIndex], newSections[index]]
    onSectionsChange(newSections)
  }

  const getSectionMarkdown = (section: Section): string => {
    switch (section.type) {
      case "heading":
        return `# ${section.title}\n${section.content}\n`
      case "code":
        return `## ${section.title}\n\`\`\`\n${section.content}\n\`\`\`\n`
      case "list":
        const items = section.content
          .split("\n")
          .filter((line) => line.trim())
          .map((item) => `- ${item}`)
          .join("\n")
        return `## ${section.title}\n${items}\n`
      default:
        return `## ${section.title}\n${section.content}\n`
    }
  }

  const fullMarkdown = sections.map(getSectionMarkdown).join("\n")

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-border bg-card px-4 py-3 flex items-center justify-between">
        <h3 className="font-semibold text-foreground">Structured Mode</h3>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors text-sm">
          Close
        </button>
      </div>

      {/* Sections List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4">
          {sections.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-8">No sections yet. Add one below.</p>
          ) : (
            sections.map((section, index) => (
              <div key={section.id} className="border border-border rounded-lg p-4 bg-background">
                <div className="flex items-center justify-between mb-3">
                  <select
                    value={section.type}
                    onChange={(e) => updateSection(section.id, { type: e.target.value as Section["type"] })}
                    className="text-xs px-2 py-1 rounded bg-muted text-foreground border border-border"
                  >
                    <option value="heading">Heading</option>
                    <option value="body">Body</option>
                    <option value="code">Code Block</option>
                    <option value="list">List</option>
                  </select>

                  <div className="flex gap-1">
                    <button
                      onClick={() => moveSection(section.id, "up")}
                      disabled={index === 0}
                      className="p-1 rounded hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Move up"
                    >
                      <ChevronUp className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => moveSection(section.id, "down")}
                      disabled={index === sections.length - 1}
                      className="p-1 rounded hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Move down"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteSection(section.id)}
                      className="p-1 rounded hover:bg-destructive hover:text-destructive-foreground"
                      title="Delete section"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <input
                  type="text"
                  placeholder="Section title"
                  value={section.title}
                  onChange={(e) => updateSection(section.id, { title: e.target.value })}
                  className="w-full mb-2 px-3 py-2 bg-background border border-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />

                <textarea
                  placeholder={
                    section.type === "list"
                      ? "One item per line"
                      : section.type === "code"
                        ? "Enter code..."
                        : "Section content..."
                  }
                  value={section.content}
                  onChange={(e) => updateSection(section.id, { content: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-primary h-24"
                />
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Section Buttons */}
      <div className="border-t border-border bg-card p-4 space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => addSection("heading")}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-accent text-accent-foreground hover:opacity-90 transition-opacity text-sm font-medium"
          >
            <Plus className="h-4 w-4" />
            Heading
          </button>
          <button
            onClick={() => addSection("body")}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-accent text-accent-foreground hover:opacity-90 transition-opacity text-sm font-medium"
          >
            <Plus className="h-4 w-4" />
            Body
          </button>
          <button
            onClick={() => addSection("code")}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-accent text-accent-foreground hover:opacity-90 transition-opacity text-sm font-medium"
          >
            <Plus className="h-4 w-4" />
            Code
          </button>
          <button
            onClick={() => addSection("list")}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-accent text-accent-foreground hover:opacity-90 transition-opacity text-sm font-medium"
          >
            <Plus className="h-4 w-4" />
            List
          </button>
        </div>
      </div>

      {/* Preview of generated markdown */}
      <div className="border-t border-border bg-muted p-3 text-xs text-muted-foreground max-h-32 overflow-auto font-mono">
        <pre className="whitespace-pre-wrap break-words">{fullMarkdown.slice(0, 200)}...</pre>
      </div>
    </div>
  )
}
