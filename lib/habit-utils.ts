import { format, isMonday, subDays } from "date-fns"
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

// Add this function to calculate streaks
export const calculateStreak = (habit: Habit): number => {
  let streak = 0
  const today = new Date()
  let currentDate = today

  // Sort logs by date in descending order
  const sortedLogs = [...habit.logs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  // Check if there's a log for today
  const todayStr = format(today, "yyyy-MM-dd")
  const hasTodayLog = sortedLogs.some(
    (log) => log.date === todayStr && (log.value === true || (typeof log.value === "number" && log.value >= 100)),
  )

  // If no log for today, check if there's one for yesterday to continue the streak
  if (!hasTodayLog) {
    const yesterdayStr = format(subDays(today, 1), "yyyy-MM-dd")
    const hasYesterdayLog = sortedLogs.some(
      (log) => log.date === yesterdayStr && (log.value === true || (typeof log.value === "number" && log.value >= 100)),
    )

    if (!hasYesterdayLog) {
      return 0 // Streak broken
    }
  }

  // Count consecutive days with completed habits
  for (let i = 0; i < 365; i++) {
    // Limit to a year
    const dateStr = format(currentDate, "yyyy-MM-dd")
    const log = sortedLogs.find((log) => log.date === dateStr)

    const isCompleted = log && (log.value === true || (typeof log.value === "number" && log.value >= 100))

    if (isCompleted) {
      streak++
      currentDate = subDays(currentDate, 1)
    } else {
      break
    }
  }

  return streak
}

