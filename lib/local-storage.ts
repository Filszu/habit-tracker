import type { Habit } from "./types"

const STORAGE_KEY = "habits-tracker-data"

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

