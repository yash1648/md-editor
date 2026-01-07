"use client"

import { useState, useEffect } from "react"
import { HardDrive, AlertCircle, Info } from "lucide-react"
import type { StorageError } from "@/lib/storage-manager"
import { checkStorageHealth, getStorageEstimate } from "@/lib/storage-manager"

export function StorageErrorHandler() {
  const [storageIssue, setStorageIssue] = useState<StorageError | null>(null)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    const health = checkStorageHealth()

    if (!health.available) {
      setStorageIssue("access-denied")
    } else if (health.quotaExceeded) {
      setStorageIssue("quota-exceeded")
    } else if (health.readonly) {
      setStorageIssue("access-denied")
    }
  }, [])

  if (!storageIssue) {
    return null
  }

  const getErrorContent = () => {
    const estimate = getStorageEstimate()
    const isQuotaIssue = storageIssue === "quota-exceeded"

    if (isQuotaIssue) {
      return {
        title: "Storage Quota Nearly Full",
        message: "Your browser storage is almost full. Clear some drafts or browser cache to continue saving.",
        icon: <HardDrive className="h-5 w-5 text-orange-600" />,
        bgColor: "bg-orange-50 border-orange-200",
        textColor: "text-orange-900",
        details: `Using approximately ${estimate.used.toFixed(0)}KB of 5MB available (${estimate.percentUsed.toFixed(1)}% full)`,
      }
    } else {
      return {
        title: "Storage Access Limited",
        message: "Storage is unavailable. This may be due to private browsing mode or browser restrictions.",
        icon: <AlertCircle className="h-5 w-5 text-red-600" />,
        bgColor: "bg-red-50 border-red-200",
        textColor: "text-red-900",
        details: "The app will work but cannot save your data. Consider using a non-private browsing window.",
      }
    }
  }

  const content = getErrorContent()

  return (
    <div className={`border-b ${content.bgColor} p-4`}>
      <div className="flex gap-3">
        {content.icon}
        <div className="flex-1">
          <h4 className={`font-semibold ${content.textColor}`}>{content.title}</h4>
          <p className={`text-sm ${content.textColor} opacity-90 mt-1`}>{content.message}</p>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className={`text-sm font-medium mt-2 underline hover:opacity-75 transition-opacity ${content.textColor}`}
          >
            {showDetails ? "Hide details" : "Show details"}
          </button>
          {showDetails && (
            <div className={`mt-3 p-3 rounded bg-black bg-opacity-5 text-xs ${content.textColor}`}>
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <div>{content.details}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
