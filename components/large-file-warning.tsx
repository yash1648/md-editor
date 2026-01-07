"use client"

import { AlertTriangle } from "lucide-react"

interface LargeFileWarningProps {
  sizeInKB: number
}

export function LargeFileWarning({ sizeInKB }: LargeFileWarningProps) {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
      <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
      <div>
        <h4 className="font-semibold text-amber-900">Large File Detected</h4>
        <p className="text-sm text-amber-800 mt-1">
          Your file is {sizeInKB.toFixed(0)}KB. Preview and editing may be slower. Consider breaking content into
          smaller files.
        </p>
      </div>
    </div>
  )
}
