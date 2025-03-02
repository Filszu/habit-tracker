"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { format, startOfWeek, addDays, isSameDay } from "date-fns"
import { CheckCircle, Circle, Trash2, ChevronRight, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import type { Habit } from "@/lib/types"
import { cn } from "@/lib/utils"
import { shouldShowHabitForDate } from "@/lib/habit-utils"
import { useToast } from "@/components/ui/use-toast"

interface HabitsListProps {
  habits: Habit[]
  onUpdateLog: (habitId: string, date: string, value: number | boolean) => void
  onDeleteHabit: (habitId: string) => void
}

export default function HabitsList({ habits, onUpdateLog, onDeleteHabit }: HabitsListProps) {
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }))
  const { toast } = useToast()

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i))

  const previousWeek = () => {
    setCurrentWeekStart(addDays(currentWeekStart, -7))
  }

  const nextWeek = () => {
    setCurrentWeekStart(addDays(currentWeekStart, 7))
  }

  const goToCurrentWeek = () => {
    setCurrentWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }))
  }

  const getLogValue = (habit: Habit, date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd")
    const log = habit.logs.find((log) => log.date === dateStr)
    return log ? log.value : null
  }

  const handleToggleCompletion = (habit: Habit, date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd")
    const currentValue = getLogValue(habit, date)

    if (habit.completionType === "boolean") {
      onUpdateLog(habit.id, dateStr, currentValue === true ? false : true)
      toast({
        title: `Habit ${currentValue === true ? "uncompleted" : "completed"}`,
        description: `${habit.name} has been marked as ${currentValue === true ? "not done" : "done"} for ${format(date, "MMM d, yyyy")}.`,
      })
    }
  }

  const handlePercentageChange = (habit: Habit, date: Date, value: number) => {
    const dateStr = format(date, "yyyy-MM-dd")
    onUpdateLog(habit.id, dateStr, value)
    toast({
      title: "Habit progress updated",
      description: `${habit.name} progress set to ${value}% for ${format(date, "MMM d, yyyy")}.`,
    })
  }

  const handleDeleteHabit = (habitId: string) => {
    onDeleteHabit(habitId)
    toast({
      title: "Habit deleted",
      description: "The habit has been successfully removed.",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <Button variant="outline" size="icon" onClick={previousWeek}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button variant="outline" onClick={goToCurrentWeek}>
          {format(currentWeekStart, "MMM d")} - {format(addDays(currentWeekStart, 6), "MMM d, yyyy")}
        </Button>
        <Button variant="outline" size="icon" onClick={nextWeek}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-8 gap-2 mb-4">
        <div className="font-medium text-sm text-muted-foreground">Habit</div>
        {weekDays.map((day, i) => (
          <div
            key={i}
            className={cn(
              "text-center font-medium text-sm",
              isSameDay(day, new Date()) ? "text-primary" : "text-muted-foreground",
            )}
          >
            <div>{format(day, "EEE")}</div>
            <div>{format(day, "d")}</div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {habits.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-10 text-muted-foreground"
          >
            No habits added yet. Add your first habit to start tracking!
          </motion.div>
        ) : (
          habits.map((habit) => (
            <motion.div
              key={habit.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-8 gap-2 items-center py-3 border-b border-dashed border-gray-200"
            >
              <div className="flex items-center justify-between">
                <span className="font-handwriting text-lg truncate" title={habit.name}>
                  {habit.name}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleDeleteHabit(habit.id)}
                >
                  <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                </Button>
              </div>

              {weekDays.map((day, i) => {
                const shouldShow = shouldShowHabitForDate(habit, day)
                const logValue = getLogValue(habit, day)

                return (
                  <div key={i} className="flex justify-center items-center">
                    {shouldShow ? (
                      habit.completionType === "boolean" ? (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleToggleCompletion(habit, day)}
                          className="focus:outline-none"
                        >
                          {logValue === true ? (
                            <CheckCircle className="h-8 w-8 text-green-500" />
                          ) : (
                            <Circle className="h-8 w-8 text-gray-300" />
                          )}
                        </motion.button>
                      ) : (
                        <div className="w-full px-1">
                          <Slider
                            value={[(logValue as number) ?? 0]}
                            min={0}
                            max={100}
                            step={5}
                            onValueChange={(value) => handlePercentageChange(habit, day, value[0])}
                            className="w-full"
                          />
                          <div className="text-xs text-center mt-1">{logValue !== null ? `${logValue}%` : "0%"}</div>
                        </div>
                      )
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-100"></div>
                    )}
                  </div>
                )
              })}
            </motion.div>
          ))
        )}
      </AnimatePresence>
    </div>
  )
}

