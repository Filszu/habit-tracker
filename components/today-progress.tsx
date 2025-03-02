"use client"

import { motion } from "framer-motion"
import { Progress } from "@/components/ui/progress"
import type { Habit } from "@/lib/types"
import { CheckCircle, Circle } from "lucide-react"

interface TodayProgressProps {
  habits: Habit[]
}

export default function TodayProgress({ habits }: TodayProgressProps) {
  const today = new Date().toISOString().split("T")[0]

  const completedHabits = habits.filter((habit) => {
    const log = habit.logs.find((log) => log.date === today)
    return log ? (typeof log.value === "boolean" ? log.value : log.value === 100) : false
  }).length

  const progressPercentage = habits.length > 0 ? (completedHabits / habits.length) * 100 : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      <h2 className="text-2xl font-semibold font-handwriting">Today's Progress</h2>
      <div className="bg-white p-4 rounded-lg shadow">
        <Progress value={progressPercentage} className="h-4 mb-2" />
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">
            {completedHabits} of {habits.length} tasks completed
          </span>
          <div className="flex space-x-1">
            {habits.map((habit, index) => {
              const log = habit.logs.find((log) => log.date === today)
              const isCompleted = log ? (typeof log.value === "boolean" ? log.value : log.value === 100) : false
              return isCompleted ? (
                <CheckCircle key={index} className="h-5 w-5 text-green-500" />
              ) : (
                <Circle key={index} className="h-5 w-5 text-gray-300" />
              )
            })}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

