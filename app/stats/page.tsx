"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import Image from "next/image"
import { getHabits } from "@/lib/local-storage"
import { Button } from "@/components/ui/button"
import { Calendar, BarChart2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import MonthlyStats from "@/components/monthly-stats"
import StatsCharts from "@/components/stats-charts"
import { Habit } from "@/lib/types"

export default function StatsPage() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [view, setView] = useState<"week" | "month" | "overall">("overall")

  useEffect(() => {
    const savedHabits = getHabits() as Habit[]
    if (savedHabits) {
      setHabits(savedHabits)
    }
  }, [])

  return (
    <main className="min-h-screen bg-white p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Habits Statistics</h1>
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Charts--Streamline-Manchester-Tk5dhk8YVjFcUQugxTFLUraQtqoQTB.png"
            alt="Habits Statistics"
            width={100}
            height={100}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center"
          >
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Scientist-2--Streamline-Manchester-Zg0D07hI3PXTnoCJr32AUcOF1iOLkV.png"
              alt="Data Analysis"
              width={100}
              height={100}
              className="mb-4"
            />
            <h3 className="text-xl font-semibold mb-2">Data-Driven Insights</h3>
            <p className="text-gray-600">Analyze your habits with scientific precision</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center"
          >
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Listening-To-Feedback--Streamline-Manchester-yxDm0wt2QBdtsmoXi3QDQxN0m3FP6p.png"
              alt="Progress Tracking"
              width={100}
              height={100}
              className="mb-4"
            />
            <h3 className="text-xl font-semibold mb-2">Track Your Journey</h3>
            <p className="text-gray-600">See how far you've come on your habits journey</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center"
          >
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Travel--Streamline-Manchester-VlICF8W3Zwz3dCg3cXFoPJtnWiq6hh.png"
              alt="Goal Achievement"
              width={100}
              height={100}
              className="mb-4"
            />
            <h3 className="text-xl font-semibold mb-2">Visualize Success</h3>
            <p className="text-gray-600">Watch your consistency build over time</p>
          </motion.div>
        </div>

        <Tabs defaultValue="charts" className="mb-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="charts">
              <BarChart2 className="h-4 w-4 mr-2" />
              Charts
            </TabsTrigger>
            <TabsTrigger value="monthly">
              <Calendar className="h-4 w-4 mr-2" />
              Monthly View
            </TabsTrigger>
          </TabsList>
          <TabsContent value="charts" className="mt-4">
            <div className="flex justify-between items-center mb-4">
              <div className="space-x-2">
                <Button variant={view === "week" ? "default" : "outline"} onClick={() => setView("week")} size="sm">
                  Weekly
                </Button>
                <Button variant={view === "month" ? "default" : "outline"} onClick={() => setView("month")} size="sm">
                  Monthly
                </Button>
                <Button
                  variant={view === "overall" ? "default" : "outline"}
                  onClick={() => setView("overall")}
                  size="sm"
                >
                  Overall
                </Button>
              </div>
            </div>

            <StatsCharts habits={habits} view={view} />
          </TabsContent>
          <TabsContent value="monthly" className="mt-4">
            <MonthlyStats habits={habits} />
          </TabsContent>
        </Tabs>
      </motion.div>
    </main>
  )
}

