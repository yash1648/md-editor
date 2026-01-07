"use client"

import { useState, useEffect, useRef } from "react"
import { ResizableEditor } from "@/components/resizable-editor"
import { ResizablePreview } from "@/components/resizable-preview"
import { Header } from "@/components/header"
import { NotificationSystem, useNotifications } from "@/components/notification-system"
import { UnsavedChangesBanner } from "@/components/unsaved-changes-banner"
import { StorageErrorHandler } from "@/components/storage-error-handler"
import { hasUnsavedChanges, saveContentAsLastSaved, setupBeforeUnloadWarning } from "@/lib/change-detector"
import { safeGetItem, safeSetItem } from "@/lib/storage-manager"

export default function Home() {
  const [markdown, setMarkdown] = useState("")
  const [scrollPercentage, setScrollPercentage] = useState(0)
  const [previewTheme, setPreviewTheme] = useState<"light" | "dark" | "minimal">("light")
  const [mounted, setMounted] = useState(false)
  const [showUnsavedBanner, setShowUnsavedBanner] = useState(false)
  const autosaveTimeoutRef = useRef<NodeJS.Timeout>()
  const { notifications, add: addNotification, remove: removeNotification } = useNotifications()

  useEffect(() => {
    const savedContent = safeGetItem("markdown-content")
    if (savedContent.success && savedContent.data) {
      setMarkdown(savedContent.data)
      saveContentAsLastSaved(savedContent.data)
    } else if (savedContent.error) {
      addNotification({
        type: "warning",
        title: "Could Not Load Content",
        message: savedContent.message || "Your previous content could not be loaded.",
        duration: 5000,
      })
    }

    const themeResult = safeGetItem("preview-theme")
    if (themeResult.success && themeResult.data) {
      const theme = themeResult.data as "light" | "dark" | "minimal"
      if (["light", "dark", "minimal"].includes(theme)) {
        setPreviewTheme(theme)
      }
    }

    setMounted(true)
  }, [addNotification])

  useEffect(() => {
    if (!mounted) return

    if (autosaveTimeoutRef.current) {
      clearTimeout(autosaveTimeoutRef.current)
    }

    if (hasUnsavedChanges(markdown)) {
      setShowUnsavedBanner(true)
    }

    autosaveTimeoutRef.current = setTimeout(() => {
      const result = safeSetItem("markdown-content", markdown, {
        onQuotaExceeded: () => {
          addNotification({
            type: "error",
            title: "Storage Full",
            message: "Could not save. Please clear some drafts or browser cache.",
            duration: 5000,
          })
        },
      })

      if (result.success) {
        saveContentAsLastSaved(markdown)
        setShowUnsavedBanner(false)
      } else {
        addNotification({
          type: "error",
          title: "Autosave Failed",
          message: result.message || "Changes could not be saved to storage.",
          duration: 4000,
        })
      }
    }, 2000)

    return () => {
      if (autosaveTimeoutRef.current) {
        clearTimeout(autosaveTimeoutRef.current)
      }
    }
  }, [markdown, mounted, addNotification])

  useEffect(() => {
    const result = safeSetItem("preview-theme", previewTheme)
    if (!result.success) {
      console.warn("[v0] Could not save theme preference:", result.message)
    }
  }, [previewTheme])

  useEffect(() => {
    const hasChanges = hasUnsavedChanges(markdown)
    return setupBeforeUnloadWarning(hasChanges)
  }, [markdown])

  if (!mounted) {
    return null
  }

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <Header onThemeChange={setPreviewTheme} currentTheme={previewTheme} />

      <StorageErrorHandler />

      {showUnsavedBanner && (
        <UnsavedChangesBanner
          onSave={() => {
            const result = safeSetItem("markdown-content", markdown)
            if (result.success) {
              saveContentAsLastSaved(markdown)
              setShowUnsavedBanner(false)
              addNotification({
                type: "success",
                title: "Saved!",
                message: "Your changes have been saved.",
                duration: 2000,
              })
            } else {
              addNotification({
                type: "error",
                title: "Save Failed",
                message: result.message || "Could not save changes.",
                duration: 3000,
              })
            }
          }}
          onDiscard={() => {
            setShowUnsavedBanner(false)
          }}
        />
      )}

      <div className="flex flex-1 overflow-hidden">
        <ResizableEditor
          value={markdown}
          onChange={setMarkdown}
          onScroll={setScrollPercentage}
          onStorageError={(error) => {
            addNotification({
              type: "error",
              title: "Storage Error",
              message: error,
              duration: 4000,
            })
          }}
        />
        <ResizablePreview content={markdown} scrollPercentage={scrollPercentage} theme={previewTheme} />
      </div>

      <NotificationSystem notifications={notifications} onRemove={removeNotification} />
    </div>
  )
}
