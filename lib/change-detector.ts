"use client"

/**
 * Detects unsaved changes in the editor
 * Uses localStorage to track the last saved state
 */

const LAST_SAVED_KEY = "markdown-last-saved"
const AUTOSAVE_THRESHOLD_MS = 2000 // Auto-save every 2 seconds if changed

export function getLastSavedContent(): string | null {
  try {
    return localStorage.getItem(LAST_SAVED_KEY)
  } catch {
    return null
  }
}

export function saveContentAsLastSaved(content: string): boolean {
  try {
    localStorage.setItem(LAST_SAVED_KEY, content)
    return true
  } catch {
    return false
  }
}

export function hasUnsavedChanges(currentContent: string): boolean {
  const lastSaved = getLastSavedContent()
  return currentContent !== lastSaved
}

export function setupBeforeUnloadWarning(hasChanges: boolean) {
  const handleBeforeUnload = (e: BeforeUnloadEvent) => {
    if (hasChanges) {
      e.preventDefault()
      e.returnValue = ""
      return ""
    }
  }

  window.addEventListener("beforeunload", handleBeforeUnload)
  return () => window.removeEventListener("beforeunload", handleBeforeUnload)
}
