"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { Habit } from "@/lib/types"
import { shouldShowHabitForDate } from "@/lib/habit-utils"
import { cn } from "@/lib/utils"

interface MonthlyStatsProps {
  habits: Habit[]
}

export default function MonthlyStats({ habits }: MonthlyStatsProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const goToPreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1))
  }

  const goToNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1))
  }

  const goToCurrentMonth = () => {
    setCurrentMonth(new Date())
  }

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Get day names for the header
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  // Calculate the day of the week for the first day of the month (0 = Sunday, 6 = Saturday)
  const firstDayOfMonth = monthStart.getDay()

  // Create an array of blank spaces for the days before the first day of the month
  const blanks = Array(firstDayOfMonth).fill(null)

  // Combine blanks and days to create the calendar grid
  const calendarDays = [...blanks, ...daysInMonth]

  // Get completion data for each day
  const getDayCompletionData = (date: Date) => {
    if (!date) return { total: 0, completed: 0 }

    const dateStr = format(date, "yyyy-MM-dd")
    const applicableHabits = habits.filter((habit) => shouldShowHabitForDate(habit, date))

    const completed = applicableHabits.filter((habit) => {
      const log = habit.logs.find((log) => log.date === dateStr)
      return log ? (habit.completionType === "boolean" ? log.value : (log.value as number) >= 100) : false
    }).length

    return {
      total: applicableHabits.length,
      completed,
    }
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle>Monthly Overview</CardTitle>
          <div className="flex space-x-2">
            <Button variant="outline" size="icon" onClick={goToPreviousMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={goToCurrentMonth}>
              {format(currentMonth, "MMMM yyyy")}
            </Button>
            <Button variant="outline" size="icon" onClick={goToNextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map((day) => (
            <div key={day} className="text-center text-sm font-medium text-muted-foreground">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, i) => {
            if (!day) {
              return <div key={`blank-${i}`} className="h-16 rounded-md" />
            }

            const isToday = isSameDay(day, new Date())
            const { total, completed } = getDayCompletionData(day)
            const completionRate = total > 0 ? (completed / total) * 100 : 0

            let bgColorClass = "bg-gray-100"
            if (total > 0) {
              if (completionRate === 100) bgColorClass = "bg-green-100"
              else if (completionRate > 0) bgColorClass = "bg-yellow-100"
            }

            return (
              <motion.div
                key={day.toString()}
                whileHover={{ scale: 1.05 }}
                className={cn("h-16 rounded-md p-1 relative", bgColorClass, isToday && "ring-2 ring-primary")}
              >
                <div className="text-xs font-medium">{format(day, "d")}</div>
                {total > 0 && (
                  <div className="absolute bottom-1 right-1 text-xs">
                    <span
                      className={cn(
                        "inline-block rounded-full px-1.5 py-0.5 text-xs",
                        completionRate === 100
                          ? "bg-green-500 text-white"
                          : completionRate > 0
                            ? "bg-yellow-500 text-white"
                            : "bg-gray-300",
                      )}
                    >
                      {completed}/{total}
                    </span>
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>

        <div className="flex justify-center space-x-4 mt-6">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
            <span className="text-xs">All Completed</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
            <span className="text-xs">Partially Completed</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-gray-300 mr-2"></div>
            <span className="text-xs">Not Completed</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

