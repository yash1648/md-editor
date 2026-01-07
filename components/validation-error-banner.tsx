"use client"

import { AlertCircle, AlertTriangle } from "lucide-react"
import type { ValidationResult } from "@/lib/markdown-validator"

interface ValidationErrorBannerProps {
  validation: ValidationResult
  onDismiss?: () => void
}

export function ValidationErrorBanner({ validation, onDismiss }: ValidationErrorBannerProps) {
  if (validation.isValid && validation.warnings.length === 0) {
    return null
  }

  const hasErrors = validation.errors.length > 0
  const hasWarnings = validation.warnings.length > 0

  return (
    <div
      className={`border-b p-4 flex gap-3 ${hasErrors ? "bg-red-50 border-red-200" : "bg-amber-50 border-amber-200"}`}
    >
      <div className="flex-shrink-0 mt-0.5">
        {hasErrors ? (
          <AlertCircle className="h-5 w-5 text-red-600" />
        ) : (
          <AlertTriangle className="h-5 w-5 text-amber-600" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className={`font-semibold ${hasErrors ? "text-red-900" : "text-amber-900"}`}>
          {hasErrors ? "Validation Errors" : "Warnings"}
        </h4>
        <div className={`text-sm mt-2 space-y-1 ${hasErrors ? "text-red-800" : "text-amber-800"}`}>
          {validation.errors.map((error, idx) => (
            <div key={idx}>
              {error.message} {error.line && <span className="opacity-75">(Line {error.line})</span>}
            </div>
          ))}
          {validation.warnings.map((warning, idx) => (
            <div key={idx}>
              {warning.message}
              {warning.suggestion && <span className="block text-xs opacity-75">Suggestion: {warning.suggestion}</span>}
            </div>
          ))}
        </div>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors"
        >
          ✕
        </button>
      )}
    </div>
  )
}
