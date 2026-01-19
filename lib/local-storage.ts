import type { Habit, NotificationSettings } from "./types"

const STORAGE_KEY = "habits-tracker-data"
const NOTIFICATION_SETTINGS_KEY = "habits-tracker-notification-settings"

export const saveHabits = (habits: Habit[]): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(habits))
  }
}

export const getHabits = (): Habit[] | null => {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  }
  return null
}

export const saveNotificationSettings = (settings: NotificationSettings): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem(NOTIFICATION_SETTINGS_KEY, JSON.stringify(settings))
  }
}

export const getNotificationSettings = (): NotificationSettings => {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem(NOTIFICATION_SETTINGS_KEY)
    if (data) {
      return JSON.parse(data)
    }
  }
  return {
    enabled: false,
    times: [],
  }
}

