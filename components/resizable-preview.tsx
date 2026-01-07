"use client"

import { useEffect, useRef, useState } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Code } from "lucide-react"
import { EmptyPreviewState } from "./empty-preview-state"

interface ResizablePreviewProps {
  content: string
  scrollPercentage: number
  theme: "light" | "dark" | "minimal"
}

export function ResizablePreview({ content, scrollPercentage, theme }: ResizablePreviewProps) {
  const previewRef = useRef<HTMLDivElement>(null)
  const [isScrollSyncing, setIsScrollSyncing] = useState(true)
  const [renderError, setRenderError] = useState<string | null>(null)

  useEffect(() => {
    try {
      setRenderError(null)
    } catch (error) {
      setRenderError("Failed to render preview. Please check your markdown syntax.")
    }
  }, [content])

  useEffect(() => {
    if (!isScrollSyncing || !previewRef.current) return

    const { scrollHeight, clientHeight } = previewRef.current
    const maxScroll = scrollHeight - clientHeight
    const newScrollTop = maxScroll * scrollPercentage
    previewRef.current.scrollTop = newScrollTop
  }, [scrollPercentage, isScrollSyncing])

  const getThemeClasses = () => {
    switch (theme) {
      case "minimal":
        return "bg-white text-black prose-sm"
      case "light":
        return "bg-background text-foreground prose-sm"
      case "dark":
        return "bg-slate-950 text-white prose-invert prose-sm"
      default:
        return "bg-background text-foreground prose-sm"
    }
  }

  const isEmpty = !content || content.trim().length === 0

  return (
    <div className="hidden md:flex flex-1 flex-col overflow-hidden bg-background">
      {/* Preview Header */}
      <div className="border-b border-border bg-card px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Code className="h-4 w-4 text-primary" />
          <h2 className="font-semibold text-foreground">Preview</h2>
        </div>
        <button
          onClick={() => setIsScrollSyncing(!isScrollSyncing)}
          className={`text-xs px-2 py-1 rounded transition-colors ${
            isScrollSyncing ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
          }`}
          title="Toggle scroll sync"
        >
          {isScrollSyncing ? "Synced" : "Free"}
        </button>
      </div>

      {renderError && (
        <div className="border-b border-border bg-red-50 border-red-200 p-4 flex gap-3">
          <div className="text-red-600 font-semibold text-sm">{renderError}</div>
        </div>
      )}

      {/* Preview Content */}
      {isEmpty ? (
        <EmptyPreviewState />
      ) : (
        <div ref={previewRef} className="flex-1 overflow-auto" data-theme={theme}>
          <div className={`prose dark:prose-invert prose-sm max-w-none px-6 py-6 ${getThemeClasses()}`}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ node, ...props }) => <h1 className="text-3xl font-bold mt-0 mb-4 text-foreground" {...props} />,
                h2: ({ node, ...props }) => (
                  <h2 className="text-2xl font-bold mt-6 mb-3 text-foreground border-b border-border pb-2" {...props} />
                ),
                h3: ({ node, ...props }) => <h3 className="text-xl font-bold mt-4 mb-2 text-foreground" {...props} />,
                h4: ({ node, ...props }) => <h4 className="text-lg font-bold mt-3 mb-2 text-foreground" {...props} />,
                p: ({ node, ...props }) => <p className="my-3 leading-7 text-foreground" {...props} />,
                ul: ({ node, ...props }) => <ul className="my-3 ml-6 list-disc space-y-2 text-foreground" {...props} />,
                ol: ({ node, ...props }) => (
                  <ol className="my-3 ml-6 list-decimal space-y-2 text-foreground" {...props} />
                ),
                li: ({ node, ...props }) => <li className="text-foreground" {...props} />,
                code: ({ node, inline, ...props }) =>
                  inline ? (
                    <code className="bg-muted px-2 py-1 rounded font-mono text-sm text-foreground" {...props} />
                  ) : (
                    <code
                      className="block bg-muted p-4 rounded-lg font-mono text-sm text-foreground overflow-x-auto"
                      {...props}
                    />
                  ),
                pre: ({ node, ...props }) => <pre className="bg-muted p-4 rounded-lg overflow-x-auto" {...props} />,
                blockquote: ({ node, ...props }) => (
                  <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground my-3" {...props} />
                ),
                a: ({ node, ...props }) => <a className="text-primary hover:underline" {...props} />,
                table: ({ node, ...props }) => (
                  <div className="overflow-x-auto my-3">
                    <table className="w-full border-collapse border border-border" {...props} />
                  </div>
                ),
                thead: ({ node, ...props }) => <thead className="bg-muted" {...props} />,
                td: ({ node, ...props }) => (
                  <td className="border border-border px-3 py-2 text-foreground" {...props} />
                ),
                th: ({ node, ...props }) => (
                  <th className="border border-border px-3 py-2 text-foreground font-bold" {...props} />
                ),
                hr: ({ node, ...props }) => <hr className="my-6 border-border" {...props} />,
                img: ({ node, ...props }) => <img className="max-w-full rounded-lg my-3" {...props} />,
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  )
}
