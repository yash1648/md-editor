"use client"

/**
 * Resilient localStorage wrapper with error handling and recovery
 * Handles quota exceeded, access denied, and corrupted data scenarios
 */

export type StorageError = "quota-exceeded" | "access-denied" | "corrupted" | "unknown"

export interface StorageResult<T> {
  success: boolean
  data?: T
  error?: StorageError
  message?: string
}

export interface StorageHealthCheck {
  available: boolean
  readonly: boolean
  quotaExceeded: boolean
  canWrite: boolean
}

/**
 * Check if localStorage is accessible and functional
 */
export function checkStorageHealth(): StorageHealthCheck {
  const result: StorageHealthCheck = {
    available: false,
    readonly: false,
    quotaExceeded: false,
    canWrite: false,
  }

  try {
    const testKey = "__storage_test__"
    const testValue = "test"

    // Check if storage is available
    if (!globalThis.localStorage) {
      return result
    }

    result.available = true

    // Try to write
    try {
      localStorage.setItem(testKey, testValue)
      localStorage.removeItem(testKey)
      result.canWrite = true
    } catch (e) {
      if (e instanceof DOMException) {
        if (e.name === "QuotaExceededError") {
          result.quotaExceeded = true
        } else if (e.name === "SecurityError") {
          result.readonly = true
        }
      }
    }

    return result
  } catch {
    return result
  }
}

/**
 * Safely read from localStorage with error handling
 */
export function safeGetItem(key: string): StorageResult<string> {
  try {
    const health = checkStorageHealth()

    if (!health.available) {
      return {
        success: false,
        error: "access-denied",
        message: "Storage is not available in this environment",
      }
    }

    const value = localStorage.getItem(key)

    if (value === null) {
      return { success: true, data: undefined }
    }

    // Validate that the value is properly encoded
    if (typeof value !== "string") {
      return {
        success: false,
        error: "corrupted",
        message: "Storage contains invalid data",
      }
    }

    return { success: true, data: value }
  } catch (error) {
    if (error instanceof DOMException && error.name === "SecurityError") {
      return {
        success: false,
        error: "access-denied",
        message: "Access to storage was denied",
      }
    }

    return {
      success: false,
      error: "unknown",
      message: error instanceof Error ? error.message : "Unknown storage error",
    }
  }
}

/**
 * Safely write to localStorage with error handling and recovery
 */
export function safeSetItem(
  key: string,
  value: string,
  options?: { maxRetries?: number; onQuotaExceeded?: () => void },
): StorageResult<void> {
  const maxRetries = options?.maxRetries ?? 1

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const health = checkStorageHealth()

      if (!health.available) {
        return {
          success: false,
          error: "access-denied",
          message: "Storage is not available in this environment",
        }
      }

      if (!health.canWrite) {
        if (health.readonly) {
          return {
            success: false,
            error: "access-denied",
            message: "Storage is read-only (possibly in private mode)",
          }
        }

        if (health.quotaExceeded) {
          options?.onQuotaExceeded?.()
          return {
            success: false,
            error: "quota-exceeded",
            message: "Storage quota exceeded. Try clearing old drafts or browser cache.",
          }
        }
      }

      localStorage.setItem(key, value)
      return { success: true }
    } catch (error) {
      if (error instanceof DOMException) {
        if (error.name === "QuotaExceededError") {
          options?.onQuotaExceeded?.()
          return {
            success: false,
            error: "quota-exceeded",
            message: "Storage quota exceeded. Clear some drafts or browser cache to continue saving.",
          }
        }

        if (error.name === "SecurityError") {
          return {
            success: false,
            error: "access-denied",
            message: "Cannot write to storage (private browsing or restricted access)",
          }
        }
      }

      // Retry on other errors
      if (attempt < maxRetries) {
        continue
      }

      return {
        success: false,
        error: "unknown",
        message: error instanceof Error ? error.message : "Unknown storage error",
      }
    }
  }

  return {
    success: false,
    error: "unknown",
    message: "Failed to write to storage after retries",
  }
}

/**
 * Safely remove from localStorage
 */
export function safeRemoveItem(key: string): StorageResult<void> {
  try {
    const health = checkStorageHealth()

    if (!health.available) {
      return {
        success: false,
        error: "access-denied",
        message: "Storage is not available",
      }
    }

    localStorage.removeItem(key)
    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: "unknown",
      message: error instanceof Error ? error.message : "Could not remove from storage",
    }
  }
}

/**
 * Safely clear all storage with error handling
 */
export function safeClearStorage(): StorageResult<void> {
  try {
    const health = checkStorageHealth()

    if (!health.available) {
      return {
        success: false,
        error: "access-denied",
        message: "Storage is not available",
      }
    }

    localStorage.clear()
    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: "unknown",
      message: error instanceof Error ? error.message : "Could not clear storage",
    }
  }
}

/**
 * Get remaining storage quota estimate (rough estimate)
 */
export function getStorageEstimate(): { used: number; available: number; percentUsed: number } {
  let used = 0
  try {
    if (globalThis.localStorage) {
      for (const key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          used += localStorage[key].length + key.length
        }
      }
    }
  } catch {
    // Silently fail
  }

  const estimated = used / 1024 // Rough estimate in KB
  const available = 5120 - estimated // Typical 5MB limit
  const percentUsed = (estimated / 5120) * 100

  return { used: estimated, available, percentUsed }
}
