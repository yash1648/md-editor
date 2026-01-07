"use client"

import { FileText } from "lucide-react"

interface EmptyEditorStateProps {
  onLoadTemplate?: (template: string) => void
}

export function EmptyEditorState({ onLoadTemplate }: EmptyEditorStateProps) {
  return (
    <div className="flex-1 flex items-center justify-center p-8 bg-background">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-muted p-4">
            <FileText className="h-8 w-8 text-muted-foreground" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">No Content Yet</h3>
        <p className="text-muted-foreground text-sm mb-6">
          Start creating your README by typing directly or loading a template.
        </p>
        {onLoadTemplate && (
          <div className="flex flex-col gap-2">
            <p className="text-xs text-muted-foreground font-medium">Quick start templates:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {[
                { id: "readme", label: "README" },
                { id: "blog", label: "Blog Post" },
                { id: "report", label: "Report" },
              ].map((template) => (
                <button
                  key={template.id}
                  onClick={() => onLoadTemplate(template.id)}
                  className="px-3 py-1.5 rounded-md bg-accent text-accent-foreground text-xs font-medium hover:opacity-90 transition-opacity"
                >
                  {template.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
