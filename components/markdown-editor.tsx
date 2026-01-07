"use client"

import { useCallback, useRef } from "react"
import { Copy, Download, RotateCcw } from "lucide-react"
import { TemplateSelector } from "./template-selector"
import { useToast } from "@/hooks/use-toast"

const TEMPLATES = {
  readme: `# Project Name

## Overview
Brief description of your project.

## Features
- Feature 1
- Feature 2
- Feature 3

## Installation
\`\`\`bash
npm install your-package
\`\`\`

## Usage
\`\`\`javascript
const lib = require('your-package');
lib.doSomething();
\`\`\`

## Contributing
Contributions are welcome! Please read our contributing guidelines.

## License
MIT`,

  blog: `# Blog Post Title

*Published on January 7, 2026*

## Introduction
Start with an engaging introduction to draw your readers in.

## Main Points

### Point 1
Explain your first major point in detail.

### Point 2
Expand on your second point with examples.

## Conclusion
Wrap up your thoughts and provide actionable takeaways.

## Related Reading
- [Related Article 1](#)
- [Related Article 2](#)`,

  report: `# Report Title

## Executive Summary
Summarize the key findings and recommendations.

## Background
Provide context and background information.

## Methodology
Explain the approach and methods used.

## Findings
Detail the results and observations.

### Finding 1
\`\`\`
Supporting data or evidence
\`\`\`

### Finding 2
Additional findings and analysis.

## Recommendations
1. Recommendation 1
2. Recommendation 2
3. Recommendation 3

## Appendix
Additional supporting information.`,

  blank: "# Start Here\n\nBegin typing your markdown content...",
}

export function MarkdownEditor({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleTemplateSelect = useCallback(
    (template: keyof typeof TEMPLATES) => {
      onChange(TEMPLATES[template])
      toast({
        title: "Template loaded",
        description: "Template has been applied to the editor.",
      })
    },
    [onChange, toast],
  )

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value)
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
    const file = new Blob([value], { type: "text/plain" })
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

  const handleClear = () => {
    if (confirm("Are you sure you want to clear all content?")) {
      onChange("")
      toast({
        title: "Cleared",
        description: "Editor has been cleared.",
      })
    }
  }

  return (
    <div className="flex flex-1 flex-col border-r border-border bg-background">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 border-b border-border bg-card p-4">
        <TemplateSelector onSelect={handleTemplateSelect} />

        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-accent text-accent-foreground hover:opacity-90 transition-opacity text-sm font-medium"
          title="Copy markdown to clipboard"
        >
          <Copy className="h-4 w-4" />
          Copy
        </button>

        <button
          onClick={handleExport}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity text-sm font-medium"
          title="Export as README.md"
        >
          <Download className="h-4 w-4" />
          Export
        </button>

        <button
          onClick={handleClear}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary text-secondary-foreground hover:opacity-90 transition-opacity text-sm font-medium ml-auto"
          title="Clear editor"
        >
          <RotateCcw className="h-4 w-4" />
          Clear
        </button>
      </div>

      {/* Editor */}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter your markdown here..."
        className="flex-1 resize-none bg-background p-6 font-mono text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
      />

      {/* Hidden file input for future file upload functionality */}
      <input ref={fileInputRef} type="file" accept=".md,.txt" className="hidden" />
    </div>
  )
}
