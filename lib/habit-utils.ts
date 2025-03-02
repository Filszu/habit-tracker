import { format, isMonday } from "date-fns"
import type { Habit } from "./types"

export const shouldShowHabitForDate = (habit: Habit, date: Date): boolean => {
  if (habit.frequency === "daily") {
    return true
  }

  if (habit.frequency === "weekly") {
    return isMonday(date)
  }

  if (habit.frequency === "custom") {
    const dayOfWeek = date.getDay()
    // Convert Sunday (0) to 6 for our array where Monday is 0
    const adjustedDay = dayOfWeek === 0 ? 6 : dayOfWeek - 1
    return habit.selectedDays.includes(adjustedDay)
  }

  return false
}

export const calculateCompletionRate = (habit: Habit, dateRange: Date[]): number => {
  let totalDays = 0
  let completedDays = 0

  dateRange.forEach((date) => {
    if (shouldShowHabitForDate(habit, date)) {
      totalDays++

      const dateStr = format(date, "yyyy-MM-dd")
      const log = habit.logs.find((log) => log.date === dateStr)

      if (log) {
        if (habit.completionType === "boolean") {
          if (log.value === true) {
            completedDays++
          }
        } else {
          // For percentage type, consider anything above 0 as partially completed
          completedDays += (log.value as number) / 100
        }
      }
    }
  })

  return totalDays > 0 ? (completedDays / totalDays) * 100 : 0
}

