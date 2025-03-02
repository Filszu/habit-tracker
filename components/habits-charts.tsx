"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, parseISO, subDays } from "date-fns"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
} from "recharts"
import type { Habit } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Trash2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface HabitsChartsProps {
  habits: Habit[]
  onDeleteHabit: (habitId: string) => void
}

export default function HabitsCharts({ habits, onDeleteHabit }: HabitsChartsProps) {
  const [selectedHabits, setSelectedHabits] = useState<Set<string>>(new Set(habits.map((h) => h.id)))
  const [view, setView] = useState<"week" | "month" | "overall">("week")
  const [chartData, setChartData] = useState<any[]>([])
  const [areaChartData, setAreaChartData] = useState<any[]>([])
  const { toast } = useToast()

  const updateChartData = useCallback(() => {
    const today = new Date()
    let dateRange: Date[]

    if (view === "week") {
      const weekStart = startOfWeek(today)
      const weekEnd = endOfWeek(today)
      dateRange = eachDayOfInterval({ start: weekStart, end: weekEnd })
    } else if (view === "month") {
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
      const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0)
      dateRange = eachDayOfInterval({ start: monthStart, end: monthEnd })
    } else {
      // For overall view, use all dates from the earliest habit creation to today
      const earliestDate = new Date(Math.min(...habits.map((h) => new Date(h.createdAt).getTime())))
      dateRange = eachDayOfInterval({ start: earliestDate, end: today })
    }

    const data = dateRange.map((date) => {
      const dateStr = format(date, "yyyy-MM-dd")
      const dayData: any = { name: format(date, view === "week" ? "EEE" : "MMM dd") }

      habits.forEach((habit) => {
        if (selectedHabits.has(habit.id)) {
          const log = habit.logs.find((log) => isSameDay(parseISO(log.date), date))
          dayData[habit.name] = log ? (habit.completionType === "boolean" ? (log.value ? 100 : 0) : log.value) : 0
        }
      })

      return dayData
    })

    setChartData(data)

    // Generate area chart data
    const areaData = Array.from({ length: 30 }, (_, i) => {
      const date = subDays(today, 29 - i)
      const dateStr = format(date, "MMM dd")
      const dayData: any = { name: dateStr }

      habits.forEach((habit) => {
        if (selectedHabits.has(habit.id)) {
          const log = habit.logs.find((log) => isSameDay(parseISO(log.date), date))
          dayData[habit.name] = log ? (habit.completionType === "boolean" ? (log.value ? 100 : 0) : log.value) : 0
        }
      })

      return dayData
    })

    setAreaChartData(areaData)
  }, [habits, selectedHabits, view])

  useEffect(() => {
    updateChartData()
  }, [updateChartData])

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

  const filteredHabits = habits.filter((habit) => selectedHabits.has(habit.id))

  const COLORS = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"]

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

      <div className="flex justify-center space-x-2 mb-4">
        <Button variant={view === "week" ? "default" : "outline"} onClick={() => setView("week")} size="sm">
          Weekly
        </Button>
        <Button variant={view === "month" ? "default" : "outline"} onClick={() => setView("month")} size="sm">
          Monthly
        </Button>
        <Button variant={view === "overall" ? "default" : "outline"} onClick={() => setView("overall")} size="sm">
          Overall
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-center font-handwriting text-xl">Habits Progress</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              {filteredHabits.map((habit, index) => (
                <Bar key={habit.id} dataKey={habit.name} fill={COLORS[index % COLORS.length]} radius={[4, 4, 0, 0]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-center font-handwriting text-xl">Completion Summary</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={filteredHabits.map((habit) => ({
                  name: habit.name,
                  value: habit.logs.filter(
                    (log) => log.value === true || (typeof log.value === "number" && log.value > 0),
                  ).length,
                }))}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={150}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {filteredHabits.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-center font-handwriting text-xl">Detailed Progress</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              {filteredHabits.map((habit, index) => (
                <Bar key={habit.id} dataKey={habit.name} stackId="a" fill={COLORS[index % COLORS.length]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-center font-handwriting text-xl">30-Day Trend</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={areaChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              {filteredHabits.map((habit, index) => (
                <Area
                  key={habit.id}
                  type="monotone"
                  dataKey={habit.name}
                  stackId="1"
                  stroke={COLORS[index % COLORS.length]}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  )
}

