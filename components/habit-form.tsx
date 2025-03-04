"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { v4 as uuidv4 } from "uuid"
import { Plus, CheckCircle, Percent, LayoutTemplate, Dumbbell, Brain, Heart, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import type { Habit } from "@/lib/types"
import { useToast } from "@/components/ui/use-toast"

// Define template types with proper structure
type TemplateHabit = {
  name: string
  frequency: "daily" | "weekly" | "custom"
  completionType: "boolean" | "percentage"
  selectedDays?: number[]
}

type HabitTemplate = {
  id: string
  category: string
  title: string
  description: string
  icon: React.ReactNode
  habits: TemplateHabit[]
}

// Define all available templates
const habitTemplates: HabitTemplate[] = [
  {
    id: "fitness",
    category: "fitness",
    title: "Fitness & Health",
    description: "Build a healthier lifestyle",
    icon: <Dumbbell className="h-5 w-5 text-purple-500" />,
    habits: [
      { name: "Drink 8 glasses of water", frequency: "daily", completionType: "boolean" },
      { name: "Exercise for 30 minutes", frequency: "daily", completionType: "boolean" },
      { name: "Take vitamins", frequency: "daily", completionType: "boolean" },
      { name: "Stretch/Yoga", frequency: "daily", completionType: "boolean" },
    ],
  },
  {
    id: "nutrition",
    category: "fitness",
    title: "Nutrition",
    description: "Eat better every day",
    icon: <Heart className="h-5 w-5 text-red-500" />,
    habits: [
      { name: "Eat 5 servings of vegetables", frequency: "daily", completionType: "boolean" },
      { name: "No processed sugar", frequency: "daily", completionType: "boolean" },
      { name: "Track calories", frequency: "daily", completionType: "boolean" },
      { name: "Meal prep", frequency: "weekly", completionType: "boolean" },
    ],
  },
  {
    id: "productivity",
    category: "productivity",
    title: "Work Productivity",
    description: "Boost your daily productivity",
    icon: <Brain className="h-5 w-5 text-green-500" />,
    habits: [
      { name: "Plan your day", frequency: "daily", completionType: "boolean" },
      { name: "No social media until noon", frequency: "daily", completionType: "boolean" },
      { name: "Inbox zero", frequency: "daily", completionType: "boolean" },
      { name: "Deep work session", frequency: "daily", completionType: "boolean" },
    ],
  },
  {
    id: "learning",
    category: "productivity",
    title: "Learning",
    description: "Grow your knowledge daily",
    icon: <BookOpen className="h-5 w-5 text-blue-500" />,
    habits: [
      { name: "Read for 20 minutes", frequency: "daily", completionType: "boolean" },
      { name: "Learn something new", frequency: "daily", completionType: "boolean" },
      { name: "Practice a skill", frequency: "daily", completionType: "boolean" },
      { name: "Take notes", frequency: "daily", completionType: "boolean" },
    ],
  },
  {
    id: "mindfulness",
    category: "mindfulness",
    title: "Mindfulness",
    description: "Improve mental wellbeing",
    icon: <CheckCircle className="h-5 w-5 text-orange-500" />,
    habits: [
      { name: "Meditate for 10 minutes", frequency: "daily", completionType: "boolean" },
      { name: "Practice gratitude", frequency: "daily", completionType: "boolean" },
      { name: "Journal", frequency: "daily", completionType: "boolean" },
      { name: "Digital detox hour", frequency: "daily", completionType: "boolean" },
    ],
  },
]

// Group templates by category
const templateCategories = [
  {
    id: "fitness",
    name: "Fitness & Health",
    icon: <Dumbbell className="h-5 w-5" />,
    templates: habitTemplates.filter((t) => t.category === "fitness"),
  },
  {
    id: "productivity",
    name: "Productivity",
    icon: <Brain className="h-5 w-5" />,
    templates: habitTemplates.filter((t) => t.category === "productivity"),
  },
  {
    id: "mindfulness",
    name: "Mindfulness",
    icon: <CheckCircle className="h-5 w-5" />,
    templates: habitTemplates.filter((t) => t.category === "mindfulness"),
  },
]

interface HabitFormProps {
  onAddHabit: (habit: Habit) => void
}

export default function HabitForm({ onAddHabit }: HabitFormProps) {
  const [open, setOpen] = useState(false)
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false)
  const [name, setName] = useState("")
  const [frequency, setFrequency] = useState<"daily" | "weekly" | "custom">("daily")
  const [completionType, setCompletionType] = useState<"boolean" | "percentage">("boolean")
  const [selectedDays, setSelectedDays] = useState<number[]>([])
  const { toast } = useToast()

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

  const addTemplateHabits = (template: HabitTemplate) => {
    // Add all habits from the template
    template.habits.forEach((habit) => {
      const newHabit: Habit = {
        id: uuidv4(),
        name: habit.name,
        frequency: habit.frequency,
        completionType: habit.completionType,
        selectedDays: habit.selectedDays || [],
        logs: [],
        createdAt: new Date().toISOString(),
      }
      onAddHabit(newHabit)
    })

    // Show success toast
    toast({
      title: "Template added",
      description: `${template.habits.length} habits from "${template.title}" have been added.`,
    })

    setTemplateDialogOpen(false)
  }

  return (
    <>
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

      {/* Templates Dialog */}
      <Dialog open={templateDialogOpen} onOpenChange={setTemplateDialogOpen}>
        <DialogTrigger asChild>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="mt-4">
            <Button variant="outline" className="w-full border-dashed border-2">
              <LayoutTemplate className="mr-2 h-5 w-5" /> Use Habit Templates
            </Button>
          </motion.div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center font-handwriting text-2xl">Habit Templates</DialogTitle>
            <DialogDescription className="text-center">
              Choose a template to add pre-defined habits to your list
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="fitness" className="w-full mt-4">
            <TabsList className="grid w-full grid-cols-3">
              {templateCategories.map((category) => (
                <TabsTrigger key={category.id} value={category.id} className="flex items-center justify-center">
                  <span className="mr-2">{category.icon}</span>
                  <span className="hidden sm:inline">{category.name}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {templateCategories.map((category) => (
              <TabsContent key={category.id} value={category.id} className="mt-4">
                <div className="grid grid-cols-1 gap-4">
                  {category.templates.map((template) => (
                    <div
                      key={template.id}
                      className="border rounded-lg p-4 hover:border-primary hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center mb-2">
                        <div className="mr-3">{template.icon}</div>
                        <h3 className="font-semibold text-lg">{template.title}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{template.description}</p>
                      <ul className="text-sm space-y-1 mb-4">
                        {template.habits.map((habit, index) => (
                          <li key={index} className="flex items-center">
                            <CheckCircle className="h-3 w-3 mr-2 text-green-500 flex-shrink-0" />
                            <span className="truncate">{habit.name}</span>
                          </li>
                        ))}
                      </ul>
                      <Button onClick={() => addTemplateHabits(template)} size="sm" className="w-full">
                        Add All Habits
                      </Button>
                    </div>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  )
}

