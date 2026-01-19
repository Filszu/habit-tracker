"use client"

import { useEffect, useRef } from "react"
import { getNotificationSettings } from "@/lib/local-storage"
import { getHabits } from "@/lib/local-storage"
import { shouldShowHabitForDate } from "@/lib/habit-utils"

export default function NotificationScheduler() {
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const timeoutRefsRef = useRef<Map<string, NodeJS.Timeout>>(new Map())

  useEffect(() => {
    // Check if browser supports notifications
    if (typeof window === "undefined" || !("Notification" in window) || !("serviceWorker" in navigator)) {
      return
    }

    const scheduleNotifications = async () => {
      const settings = getNotificationSettings()
      
      if (!settings.enabled || settings.times.length === 0) {
        // Clear any existing scheduled notifications
        timeoutRefsRef.current.forEach((timeout) => clearTimeout(timeout))
        timeoutRefsRef.current.clear()
        return
      }

      // Request permission if not granted
      if (Notification.permission === "default") {
        // Don't auto-request, let user do it from settings
        return
      }

      if (Notification.permission !== "granted") {
        return
      }

      // Register service worker if needed
      let registration: ServiceWorkerRegistration | null = null
      try {
        registration = await navigator.serviceWorker.ready
      } catch (error) {
        console.error("Service worker not ready:", error)
        return
      }

      // Schedule notifications for each time
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

      settings.times.forEach((timeStr) => {
        const [hours, minutes] = timeStr.split(":").map(Number)
        const notificationTime = new Date(today)
        notificationTime.setHours(hours, minutes, 0, 0)

        // If the time has already passed today, schedule for tomorrow
        if (notificationTime <= now) {
          notificationTime.setDate(notificationTime.getDate() + 1)
        }

        const timeUntilNotification = notificationTime.getTime() - now.getTime()
        const notificationId = `${timeStr}-${notificationTime.toISOString().split("T")[0]}`

        // Only schedule if not already scheduled
        if (!timeoutRefsRef.current.has(notificationId)) {
          const timeoutId = setTimeout(() => {
            showNotification(registration!)
            timeoutRefsRef.current.delete(notificationId)
            // Schedule for next day
            scheduleRecurringNotification(timeStr, registration!)
          }, timeUntilNotification)
          
          timeoutRefsRef.current.set(notificationId, timeoutId)
        }
      })
    }

    const scheduleRecurringNotification = (timeStr: string, registration: ServiceWorkerRegistration) => {
      const scheduleNext = () => {
        const now = new Date()
        const tomorrow = new Date(now)
        tomorrow.setDate(tomorrow.getDate() + 1)
        const [hours, minutes] = timeStr.split(":").map(Number)
        tomorrow.setHours(hours, minutes, 0, 0)

        const timeUntilNotification = tomorrow.getTime() - now.getTime()
        const notificationId = `${timeStr}-${tomorrow.toISOString().split("T")[0]}`

        // Only schedule if not already scheduled
        if (!timeoutRefsRef.current.has(notificationId)) {
          const timeoutId = setTimeout(() => {
            showNotification(registration)
            timeoutRefsRef.current.delete(notificationId)
            scheduleNext() // Schedule the next day
          }, timeUntilNotification)
          
          timeoutRefsRef.current.set(notificationId, timeoutId)
        }
      }

      scheduleNext()
    }

    const showNotification = async (registration: ServiceWorkerRegistration) => {
      const habits = getHabits() || []
      const todaysHabits = habits.filter((habit) => shouldShowHabitForDate(habit, new Date()))
      const completedCount = todaysHabits.filter((habit) => {
        const today = new Date().toISOString().split("T")[0]
        const log = habit.logs.find((l) => l.date === today)
        return log && (log.value === true || (typeof log.value === "number" && log.value === 100))
      }).length

      const title = "Habits Reminder"
      const body =
        todaysHabits.length === 0
          ? "Start building better habits today!"
          : `You have ${todaysHabits.length} habit${todaysHabits.length > 1 ? "s" : ""} to track today. ${completedCount > 0 ? `${completedCount} completed!` : ""}`

      // Use service worker to show notification
      registration.showNotification(title, {
        body,
        icon: "/icons/icon-192x192.png",
        badge: "/icons/icon-96x96.png",
        tag: "habit-reminder",
        requireInteraction: false,
        // vibrate: [200, 100, 200],
      })
    }

    // Initial schedule
    scheduleNotifications()

    // Re-schedule every minute to handle time changes and new settings
    intervalRef.current = setInterval(() => {
      scheduleNotifications()
    }, 60000) // Check every minute

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      timeoutRefsRef.current.forEach((timeout) => clearTimeout(timeout))
      timeoutRefsRef.current.clear()
    }
  }, [])

  return null
}

