"use client"

import { useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Minimize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatTime } from "@/lib/utils"

interface FocusModeProps {
  time: number
  isActive: boolean
  timerType: "pomodoro" | "shortBreak" | "longBreak"
  onToggleTimer: () => void
  onExit: () => void
}

export default function FocusMode({ time, isActive, timerType, onToggleTimer, onExit }: FocusModeProps) {
  const backgroundRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Add event listener for escape key
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onExit()
      }
    }
    window.addEventListener("keydown", handleKeyDown)

    // Mouse movement effect
    const handleMouseMove = (e: MouseEvent) => {
      if (backgroundRef.current) {
        const x = e.clientX / window.innerWidth
        const y = e.clientY / window.innerHeight

        backgroundRef.current.style.background = `radial-gradient(
          circle at ${x * 100}% ${y * 100}%, 
          rgba(124, 58, 237, 0.2) 0%, 
          rgba(0, 0, 0, 0.95) 70%
        )`
      }
    }
    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [onExit])

  const getTimerLabel = () => {
    switch (timerType) {
      case "pomodoro":
        return "Focus Session"
      case "shortBreak":
        return "Short Break"
      case "longBreak":
        return "Long Break"
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black"
        ref={backgroundRef}
      >
        <div className="absolute top-4 right-4 flex space-x-2">
          <Button variant="ghost" size="icon" onClick={onExit} className="text-white">
            <Minimize2 className="h-6 w-6" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onExit} className="text-white">
            <X className="h-6 w-6" />
          </Button>
        </div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center text-white p-4 md:p-8 max-w-full"
        >
          <h2 className="text-xl md:text-2xl font-medium mb-2">{getTimerLabel()}</h2>
          <div className="text-6xl md:text-8xl font-bold mb-8 cursor-pointer" onClick={onToggleTimer}>
            {formatTime(time)}
          </div>

          <div className="flex justify-center space-x-4">
            <Button
              variant="outline"
              size="lg"
              onClick={onToggleTimer}
              className="border-white text-white hover:bg-white/10"
            >
              {isActive ? "Pause" : "Start"}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

