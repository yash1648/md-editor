"use client"

import { AlertTriangle, Save, LogOut } from "lucide-react"

interface UnsavedChangesBannerProps {
  onSave?: () => void
  onDiscard?: () => void
}

export function UnsavedChangesBanner({ onSave, onDiscard }: UnsavedChangesBannerProps) {
  return (
    <div className="bg-amber-50 border-b border-amber-200 p-4 flex items-center gap-4">
      <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0" />
      <div className="flex-1">
        <h4 className="font-semibold text-amber-900">You have unsaved changes</h4>
        <p className="text-sm text-amber-800 mt-0.5">Changes are automatically saved, but you can save immediately.</p>
      </div>
      <div className="flex gap-2 flex-shrink-0">
        {onSave && (
          <button
            onClick={onSave}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-600 text-amber-50 hover:bg-amber-700 transition-colors text-sm font-medium"
          >
            <Save className="h-4 w-4" />
            <span className="hidden sm:inline">Save Now</span>
            <span className="sm:hidden">Save</span>
          </button>
        )}
        {onDiscard && (
          <button
            onClick={onDiscard}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors text-sm font-medium"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Discard</span>
          </button>
        )}
      </div>
    </div>
  )
}
