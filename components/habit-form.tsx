"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { v4 as uuidv4 } from "uuid"
import { Plus, CheckCircle, Percent } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import type { Habit } from "@/lib/types"

interface HabitFormProps {
  onAddHabit: (habit: Habit) => void
}

export default function HabitForm({ onAddHabit }: HabitFormProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [frequency, setFrequency] = useState<"daily" | "weekly" | "custom">("daily")
  const [completionType, setCompletionType] = useState<"boolean" | "percentage">("boolean")
  const [selectedDays, setSelectedDays] = useState<number[]>([])

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) return

    const newHabit: Habit = {
      id: uuidv4(),
      name,
      frequency,
      completionType,
      selectedDays: frequency === "custom" ? selectedDays : [],
      logs: [],
      createdAt: new Date().toISOString(),
    }

    onAddHabit(newHabit)
    setOpen(false)
    resetForm()
  }

  const resetForm = () => {
    setName("")
    setFrequency("daily")
    setCompletionType("boolean")
    setSelectedDays([])
  }

  const toggleDay = (dayIndex: number) => {
    setSelectedDays((prev) => (prev.includes(dayIndex) ? prev.filter((d) => d !== dayIndex) : [...prev, dayIndex]))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button className="w-full bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600">
            <Plus className="mr-2 h-5 w-5" /> Add New Habit
          </Button>
        </motion.div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center font-handwriting text-2xl">Create New Habit</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Habit Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Drink water, Read, Exercise..."
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Frequency</Label>
            <RadioGroup value={frequency} onValueChange={(value) => setFrequency(value as any)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="daily" id="daily" />
                <Label htmlFor="daily">Daily</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="weekly" id="weekly" />
                <Label htmlFor="weekly">Weekly</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="custom" id="custom" />
                <Label htmlFor="custom">Custom Days</Label>
              </div>
            </RadioGroup>
          </div>

          {frequency === "custom" && (
            <div className="space-y-2">
              <Label>Select Days</Label>
              <div className="flex flex-wrap gap-2">
                {daysOfWeek.map((day, index) => (
                  <Button
                    key={day}
                    type="button"
                    variant={selectedDays.includes(index) ? "default" : "outline"}
                    className={`h-10 w-10 p-0 ${selectedDays.includes(index) ? "bg-primary" : ""}`}
                    onClick={() => toggleDay(index)}
                  >
                    {day.charAt(0)}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label>Completion Type</Label>
            <RadioGroup value={completionType} onValueChange={(value) => setCompletionType(value as any)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="boolean" id="boolean" />
                <Label htmlFor="boolean" className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4" /> Checkmark (Done/Not Done)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="percentage" id="percentage" />
                <Label htmlFor="percentage" className="flex items-center">
                  <Percent className="mr-2 h-4 w-4" /> Percentage (0-100%)
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Habit</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

