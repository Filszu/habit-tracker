"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import HabitForm from "@/components/habit-form"
import HabitsList from "@/components/habits-list"
import { getHabits, saveHabits } from "@/lib/local-storage"
import type { Habit, HabitLog } from "@/lib/types"

export default function HabitsTracker() {
  const [habits, setHabits] = useState<Habit[]>([])

  useEffect(() => {
    const savedHabits = getHabits()
    if (savedHabits) {
      setHabits(savedHabits)
    }
  }, [])

  const addHabit = (habit: Habit) => {
    const newHabits = [...habits, habit]
    setHabits(newHabits)
    saveHabits(newHabits)
  }

  const updateHabitLog = (habitId: string, date: string, value: number | boolean) => {
    const updatedHabits = habits.map((habit) => {
      if (habit.id === habitId) {
        const existingLogIndex = habit.logs.findIndex((log) => log.date === date)
        let newLogs: HabitLog[]

        if (existingLogIndex >= 0) {
          newLogs = [...habit.logs]
          newLogs[existingLogIndex] = { date, value }
        } else {
          newLogs = [...habit.logs, { date, value }]
        }

        return { ...habit, logs: newLogs }
      }
      return habit
    })

    setHabits(updatedHabits)
    saveHabits(updatedHabits)
  }

  const deleteHabit = (habitId: string) => {
    const updatedHabits = habits.filter((habit) => habit.id !== habitId)
    setHabits(updatedHabits)
    saveHabits(updatedHabits)
  }

  const updateHabit = (updatedHabit: Habit) => {
    const updatedHabits = habits.map((habit) => (habit.id === updatedHabit.id ? updatedHabit : habit))
    setHabits(updatedHabits)
    saveHabits(updatedHabits)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto"
    >
      <div className="flex flex-col items-center mb-8">
        <motion.h1
          className="text-6xl md:text-5xl font-handwriting text-primary mb-2 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          Habits Tracker
        </motion.h1>
        <motion.div
          className="h-1 w-40 bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: "10rem" }}
          transition={{ delay: 0.4, duration: 0.8 }}
        />
      </div>

      <HabitForm onAddHabit={addHabit} />

      <Tabs defaultValue="track" className="mt-8">
        <TabsList className="grid w-full grid-cols-1">
          <TabsTrigger value="track">Track Habits</TabsTrigger>
        </TabsList>
        <TabsContent value="track" className="mt-4">
          <HabitsList
            habits={habits}
            onUpdateLog={updateHabitLog}
            onDeleteHabit={deleteHabit}
            onUpdateHabit={updateHabit}
          />
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}

