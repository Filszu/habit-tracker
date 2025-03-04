"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Edit, CheckCircle, Percent } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import type { Habit } from "@/lib/types"

interface EditHabitDialogProps {
  habit: Habit
  onUpdateHabit: (updatedHabit: Habit) => void
}

export default function EditHabitDialog({ habit, onUpdateHabit }: EditHabitDialogProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState(habit.name)
  const [frequency, setFrequency] = useState<"daily" | "weekly" | "custom">(habit.frequency)
  const [completionType, setCompletionType] = useState<"boolean" | "percentage">(habit.completionType)
  const [selectedDays, setSelectedDays] = useState<number[]>(habit.selectedDays || [])
  const { toast } = useToast()

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

  useEffect(() => {
    if (open) {
      // Reset form when dialog opens
      setName(habit.name)
      setFrequency(habit.frequency)
      setCompletionType(habit.completionType)
      setSelectedDays(habit.selectedDays || [])
    }
  }, [open, habit])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) return

    const updatedHabit: Habit = {
      ...habit,
      name,
      frequency,
      completionType,
      selectedDays: frequency === "custom" ? selectedDays : [],
    }

    onUpdateHabit(updatedHabit)
    setOpen(false)

    toast({
      title: "Habit updated",
      description: "Your habit has been successfully updated.",
    })
  }

  const toggleDay = (dayIndex: number) => {
    setSelectedDays((prev) => (prev.includes(dayIndex) ? prev.filter((d) => d !== dayIndex) : [...prev, dayIndex]))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-blue-500 hover:text-blue-700">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center font-handwriting text-2xl">Edit Habit</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Habit Name</Label>
            <Input
              id="edit-name"
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
                <RadioGroupItem value="daily" id="edit-daily" />
                <Label htmlFor="edit-daily">Daily</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="weekly" id="edit-weekly" />
                <Label htmlFor="edit-weekly">Weekly</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="custom" id="edit-custom" />
                <Label htmlFor="edit-custom">Custom Days</Label>
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
                <RadioGroupItem value="boolean" id="edit-boolean" />
                <Label htmlFor="edit-boolean" className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4" /> Checkmark (Done/Not Done)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="percentage" id="edit-percentage" />
                <Label htmlFor="edit-percentage" className="flex items-center">
                  <Percent className="mr-2 h-4 w-4" /> Percentage (0-100%)
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Update Habit</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

