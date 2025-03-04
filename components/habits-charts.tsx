"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Trash2, BarChart2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import type { Habit } from "@/lib/types"

interface HabitsChartsProps {
  habits: Habit[]
  onDeleteHabit: (habitId: string) => void
}

export default function HabitsCharts({ habits, onDeleteHabit }: HabitsChartsProps) {
  const [selectedHabits, setSelectedHabits] = useState<Set<string>>(new Set(habits.map((h) => h.id)))
  const { toast } = useToast()

  const toggleHabit = (habitId: string) => {
    setSelectedHabits((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(habitId)) {
        newSet.delete(habitId)
      } else {
        newSet.add(habitId)
      }
      return newSet
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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="space-y-8">
      <div className="bg-white p-4 rounded-lg shadow-sm border mb-4">
        <h3 className="text-lg font-semibold mb-3">Show/Hide Habits</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {habits.map((habit) => (
            <div key={habit.id} className="flex items-center space-x-3">
              <Checkbox
                id={`toggle-${habit.id}`}
                checked={selectedHabits.has(habit.id)}
                onCheckedChange={() => toggleHabit(habit.id)}
                className="w-6 h-6"
              />
              <Label htmlFor={`toggle-${habit.id}`} className="text-sm">
                {habit.name}
              </Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteHabit(habit.id)}
                className="ml-auto text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-center font-handwriting text-xl">View Detailed Statistics</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Charts--Streamline-Manchester-Tk5dhk8YVjFcUQugxTFLUraQtqoQTB.png"
            alt="Statistics"
            width={200}
            height={200}
            className="mb-4"
          />
          <Link href="/stats">
            <Button className="mt-4">
              <BarChart2 className="mr-2 h-4 w-4" />
              View Statistics
            </Button>
          </Link>
        </CardContent>
      </Card>
    </motion.div>
  )
}

