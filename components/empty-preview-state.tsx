"use client"

import { Eye, Wand2 } from "lucide-react"

export function EmptyPreviewState() {
  return (
    <div className="flex-1 flex items-center justify-center p-8 bg-background">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-muted p-4">
            <Eye className="h-8 w-8 text-muted-foreground" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Preview is Empty</h3>
        <p className="text-muted-foreground text-sm mb-4">
          Start typing in the editor to see your markdown rendered here in real-time.
        </p>
        <div className="bg-muted rounded-lg p-4 text-left text-xs text-muted-foreground">
          <div className="flex items-center gap-2 mb-2 font-medium">
            <Wand2 className="h-4 w-4" />
            Supported Features
          </div>
          <ul className="space-y-1 ml-6 list-disc">
            <li>Headers and paragraphs</li>
            <li>Code blocks with syntax highlighting</li>
            <li>Tables and lists</li>
            <li>Links and images</li>
            <li>Blockquotes and more</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
