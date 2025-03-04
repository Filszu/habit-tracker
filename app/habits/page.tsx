"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import HabitsTracker from "@/components/habits-tracker"
import { getHabits, saveHabits } from "@/lib/local-storage"
import type { Habit } from "@/lib/types"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { BarChart2 } from "lucide-react"

export default function HabitsPage() {
  const [habits, setHabits] = useState<Habit[]>([])
  const { toast } = useToast()

  useEffect(() => {
    const savedHabits = getHabits()
    if (savedHabits) {
      setHabits(savedHabits)
    }
  }, [])

  const onDeleteHabit = (habitId: string) => {
    const updatedHabits = habits.filter((habit) => habit.id !== habitId)
    setHabits(updatedHabits)
    saveHabits(updatedHabits)
    toast({
      title: "Habit deleted",
      description: "The habit has been successfully deleted.",
    })
  }

  const onUpdateHabit = (updatedHabit: Habit) => {
    const updatedHabits = habits.map((habit) => (habit.id === updatedHabit.id ? updatedHabit : habit))
    setHabits(updatedHabits)
    saveHabits(updatedHabits)
  }

  return (
    <main className="min-h-screen bg-white p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Habits Tracker</h1>
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Content-Creation-Writing--Streamline-Manchester-1GH8kVI1TD00GEVUBWaL21nelYaIFc.png"
            alt="Habit Creation"
            width={100}
            height={100}
          />
        </div>
        <HabitsTracker />
        <div className="mt-8 text-center">
          <Link href="/stats">
            <Button className="mt-4">
              <BarChart2 className="mr-2 h-4 w-4" />
              View Detailed Statistics
            </Button>
          </Link>
        </div>
      </motion.div>
    </main>
  )
}

