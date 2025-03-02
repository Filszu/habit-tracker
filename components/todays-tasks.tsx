"use client"

import { motion } from "framer-motion"
import type { Habit } from "@/lib/types"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import ConfettiCelebration from "./confetti-celebration"
import { useState, useEffect } from "react"

interface TodaysTasksProps {
  habits: Habit[]
  onUpdateCompletion: (habitId: string, completed: boolean | number) => void
}

export default function TodaysTasks({ habits, onUpdateCompletion }: TodaysTasksProps) {
  const [showCelebration, setShowCelebration] = useState(false)
  const today = new Date().toISOString().split("T")[0]

  useEffect(() => {
    if (habits.length > 0) {
      const allCompleted = habits.every((habit) => {
        const log = habit.logs.find((log) => log.date === today)
        return log ? (typeof log.value === "boolean" ? log.value : log.value === 100) : false
      })

      if (allCompleted) {
        setShowCelebration(true)
      }
    }
  }, [habits, today])

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Today's Tasks</h2>
      {habits.length === 0 ? (
        <p className="text-muted-foreground">No tasks for today. Enjoy your day!</p>
      ) : (
        <ul className="space-y-4">
          {habits.map((habit) => {
            const log = habit.logs.find((log) => log.date === today)
            const isCompleted = log ? (typeof log.value === "boolean" ? log.value : log.value === 100) : false
            const percentageValue = log && typeof log.value === "number" ? log.value : 0

            return (
              <motion.li
                key={habit.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white p-4 rounded-lg shadow"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg font-medium">{habit.name}</span>
                  {habit.completionType === "boolean" ? (
                    <Checkbox
                      id={habit.id}
                      checked={isCompleted}
                      onCheckedChange={(checked) => onUpdateCompletion(habit.id, checked as boolean)}
                    />
                  ) : (
                    <span className="text-sm font-medium">{percentageValue}%</span>
                  )}
                </div>
                {habit.completionType === "percentage" && (
                  <div className="space-y-2">
                    <Slider
                      value={[percentageValue]}
                      min={0}
                      max={100}
                      step={5}
                      onValueChange={(value) => onUpdateCompletion(habit.id, value[0])}
                    />
                    <Progress value={percentageValue} className="h-2" />
                  </div>
                )}
              </motion.li>
            )
          })}
        </ul>
      )}

      <ConfettiCelebration show={showCelebration} onComplete={() => setShowCelebration(false)} />
    </div>
  )
}

