"use client"

import { useState, useCallback } from "react"
import { AlertCircle, CheckCircle2, AlertTriangle, Info, X } from "lucide-react"

export type NotificationType = "success" | "error" | "warning" | "info"

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message?: string
  duration?: number
  action?: { label: string; onClick: () => void }
}

interface NotificationSystemProps {
  notifications: Notification[]
  onRemove: (id: string) => void
}

export function NotificationSystem({ notifications, onRemove }: NotificationSystemProps) {
  const getIcon = (type: NotificationType) => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="h-5 w-5 text-green-600" />
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-600" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-amber-600" />
      case "info":
        return <Info className="h-5 w-5 text-blue-600" />
    }
  }

  const getBgColor = (type: NotificationType) => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200"
      case "error":
        return "bg-red-50 border-red-200"
      case "warning":
        return "bg-amber-50 border-amber-200"
      case "info":
        return "bg-blue-50 border-blue-200"
    }
  }

  const getTextColor = (type: NotificationType) => {
    switch (type) {
      case "success":
        return "text-green-900"
      case "error":
        return "text-red-900"
      case "warning":
        return "text-amber-900"
      case "info":
        return "text-blue-900"
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3 pointer-events-none">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`pointer-events-auto flex gap-3 rounded-lg border p-4 max-w-md ${getBgColor(notification.type)}`}
        >
          <div className="flex-shrink-0 mt-0.5">{getIcon(notification.type)}</div>
          <div className="flex-1 min-w-0">
            <h3 className={`font-semibold ${getTextColor(notification.type)}`}>{notification.title}</h3>
            {notification.message && (
              <p className={`text-sm mt-1 ${getTextColor(notification.type)} opacity-90`}>{notification.message}</p>
            )}
            {notification.action && (
              <button
                onClick={notification.action.onClick}
                className={`text-sm font-medium mt-2 underline hover:opacity-75 transition-opacity ${getTextColor(notification.type)}`}
              >
                {notification.action.label}
              </button>
            )}
          </div>
          <button
            onClick={() => onRemove(notification.id)}
            className={`flex-shrink-0 ${getTextColor(notification.type)} hover:opacity-50 transition-opacity`}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      ))}
    </div>
  )
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const add = useCallback((notification: Omit<Notification, "id">) => {
    const id = Math.random().toString(36).substring(7)
    const newNotification: Notification = { ...notification, id }

    setNotifications((prev) => [...prev, newNotification])

    if (notification.duration !== 0) {
      const duration = notification.duration ?? 4000
      const timeout = setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id))
      }, duration)
      return () => clearTimeout(timeout)
    }
  }, [])

  const remove = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }, [])

  return { notifications, add, remove }
}
