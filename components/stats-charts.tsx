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
import { Maximize2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface StatsChartsProps {
  habits: Habit[]
  view: "week" | "month" | "overall"
}

export default function StatsCharts({ habits, view }: StatsChartsProps) {
  const [selectedHabits, setSelectedHabits] = useState<Set<string>>(new Set(habits.map((h) => h.id)))
  const [chartData, setChartData] = useState<any[]>([])
  const [areaChartData, setAreaChartData] = useState<any[]>([])
  const [fullscreenChart, setFullscreenChart] = useState<string | null>(null)

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

  useEffect(() => {
    // Initialize with all habits selected
    setSelectedHabits(new Set(habits.map((h) => h.id)))
  }, [habits])

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

  const filteredHabits = habits.filter((habit) => selectedHabits.has(habit.id))

  const COLORS = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"]

  const openFullscreen = (chartId: string) => {
    setFullscreenChart(chartId)
  }

  const renderChart = (chartId: string) => {
    switch (chartId) {
      case "progress":
        return (
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
        )
      case "summary":
        return (
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
        )
      case "detailed":
        return (
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
        )
      case "trend":
        return (
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
        )
      default:
        return null
    }
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
            </div>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-center font-handwriting text-xl">Habits Progress</CardTitle>
          <Button variant="outline" size="sm" onClick={() => openFullscreen("progress")}>
            <Maximize2 className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="h-[400px]">{renderChart("progress")}</CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-center font-handwriting text-xl">Completion Summary</CardTitle>
          <Button variant="outline" size="sm" onClick={() => openFullscreen("summary")}>
            <Maximize2 className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="h-[400px]">{renderChart("summary")}</CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-center font-handwriting text-xl">Detailed Progress</CardTitle>
          <Button variant="outline" size="sm" onClick={() => openFullscreen("detailed")}>
            <Maximize2 className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="h-[400px]">{renderChart("detailed")}</CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-center font-handwriting text-xl">30-Day Trend</CardTitle>
          <Button variant="outline" size="sm" onClick={() => openFullscreen("trend")}>
            <Maximize2 className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="h-[400px]">{renderChart("trend")}</CardContent>
      </Card>

      {/* Fullscreen Chart Dialog */}
      <Dialog open={fullscreenChart !== null} onOpenChange={(open) => !open && setFullscreenChart(null)}>
        <DialogContent className="max-w-6xl w-[90vw] h-[80vh]">
          <DialogHeader>
            <DialogTitle>
              {fullscreenChart === "progress" && "Habits Progress"}
              {fullscreenChart === "summary" && "Completion Summary"}
              {fullscreenChart === "detailed" && "Detailed Progress"}
              {fullscreenChart === "trend" && "30-Day Trend"}
            </DialogTitle>
          </DialogHeader>
          <div className="h-full py-4">{fullscreenChart && renderChart(fullscreenChart)}</div>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}

