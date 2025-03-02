"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import HabitsTracker from "@/components/habits-tracker";
import HabitsCharts from "@/components/habits-charts";
import { getHabits, saveHabits } from "@/lib/local-storage";
import type { Habit } from "@/lib/types";
import { useToast } from "@/components/ui/use-toast";

export default function HabitsPage() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const savedHabits = getHabits();
    if (savedHabits) {
      setHabits(savedHabits);
    }
  }, []);

  const onDeleteHabit = (habitId: string): void => {
    const updatedHabits = habits.filter((habit) => habit.id !== habitId);
    setHabits(updatedHabits);
    saveHabits(updatedHabits);
    toast({
      title: "Habit deleted",
      description: "The habit has been successfully deleted.",
    });
  };

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
        <HabitsTracker
        // habits={habits} setHabits={setHabits}
        />
        {/* <HabitsCharts habits={habits} onDeleteHabit={onDeleteHabit} /> */}
      </motion.div>
    </main>
  );
}
