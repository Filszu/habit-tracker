"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { format } from "date-fns"
import { getHabits, saveHabits } from "@/lib/local-storage"
import type { Habit } from "@/lib/types"
import { shouldShowHabitForDate } from "@/lib/habit-utils"
import TodaysTasks from "./todays-tasks"
import PomodoroTimer from "./pomodoro-timer"
import MotivationTimer from "./motivation-timer"
import TodayProgress from "./today-progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sun, Moon, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

export default function TodayView() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [userName, setUserName] = useState<string>("")
  const [showCongrats, setShowCongrats] = useState(false)

  useEffect(() => {
    const savedHabits = getHabits()
    if (savedHabits) {
      setHabits(savedHabits)
    }

    const savedUserName = localStorage.getItem("userName")
    if (savedUserName) {
      setUserName(savedUserName)
    } else {
      setUserName("User")
    }
  }, [])

  const todaysHabits = habits.filter((habit) => shouldShowHabitForDate(habit, new Date()))

  const updateHabitCompletion = (habitId: string, completed: boolean | number) => {
    const updatedHabits = habits.map((habit) => {
      if (habit.id === habitId) {
        const today = format(new Date(), "yyyy-MM-dd")
        const updatedLogs = [...habit.logs.filter((log) => log.date !== today)]
        updatedLogs.push({ date: today, value: completed })
        return { ...habit, logs: updatedLogs }
      }
      return habit
    })

    setHabits(updatedHabits)
    saveHabits(updatedHabits)
  }

  const getTimeOfDayIcon = () => {
    const hour = new Date().getHours()
    if (hour >= 6 && hour < 18) {
      return <Sun className="h-8 w-8 text-yellow-500" />
    } else if (hour >= 18 && hour < 22) {
      return <Moon className="h-8 w-8 text-indigo-400" />
    } else {
      return <Star className="h-8 w-8 text-purple-500" />
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      <motion.div
        className="flex items-center justify-center space-x-4"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
      >
        {getTimeOfDayIcon()}
        <h1 className="text-4xl md:text-5xl font-handwriting text-primary mb-2 text-center">Hello, {userName}!</h1>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-center font-handwriting text-xl">Today's Focus</CardTitle>
          </CardHeader>
          <CardContent>
            <PomodoroTimer />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-center font-handwriting text-xl">Motivation Timer</CardTitle>
          </CardHeader>
          <CardContent>
            <MotivationTimer />
          </CardContent>
        </Card>
      </div>

      <TodayProgress habits={todaysHabits} />

      {todaysHabits.length > 0 ? (
        <TodaysTasks habits={todaysHabits} onUpdateCompletion={updateHabitCompletion} />
      ) : (
        <div className="text-center py-10">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Create-New-Post--Streamline-Manchester-G42lB4wM8e7bSe2mWNzsZBCGJGyuVT.png"
            alt="Create new habit"
            width={200}
            height={200}
            className="mx-auto mb-4"
          />
          <p className="text-xl mb-4">No habits for today. Start building better habits!</p>
          <Link href="/habits">
            <Button size="lg">Create New Habit</Button>
          </Link>
        </div>
      )}
    </motion.div>
  )
}

