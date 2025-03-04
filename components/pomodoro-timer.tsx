"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Play, Pause, RotateCcw, Settings2, Maximize2, Volume2, VolumeX } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { formatTime } from "@/lib/utils"
import FocusMode from "./focus-mode"

export default function PomodoroTimer() {
  const [time, setTime] = useState(25 * 60)
  const [isActive, setIsActive] = useState(false)
  const [pomodoroLength, setPomodoroLength] = useState(25)
  const [shortBreakLength, setShortBreakLength] = useState(5)
  const [longBreakLength, setLongBreakLength] = useState(15)
  const [timerType, setTimerType] = useState<"pomodoro" | "shortBreak" | "longBreak">("pomodoro")
  const [settingsOpen, setSettingsOpen] = useState(false)

  // Add a new state for sound settings
  const [isMuted, setIsMuted] = useState(false)
  const startSoundRef = useRef<HTMLAudioElement | null>(null)
  const pauseSoundRef = useRef<HTMLAudioElement | null>(null)
  const completeSoundRef = useRef<HTMLAudioElement | null>(null)

  // Add focus mode state
  const [focusMode, setFocusMode] = useState(false)

  const { toast } = useToast()

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1)
      }, 1000)
    } else if (time === 0 && isActive) {
      setIsActive(false)
      // Play completion sound when timer reaches zero
      if (!isMuted && completeSoundRef.current) {
        completeSoundRef.current.play().catch((err) => console.error("Error playing sound:", err))
      }

      // Show notification
      toast({
        title:
          timerType === "pomodoro"
            ? "Pomodoro completed!"
            : timerType === "shortBreak"
              ? "Short break completed!"
              : "Long break completed!",
        description:
          timerType === "pomodoro" ? "Time for a break! Take a moment to relax." : "Time to get back to work!",
      })
    }

    return () => clearInterval(interval)
  }, [isActive, time, isMuted, timerType, toast])

  useEffect(() => {
    // Set timer based on selected type
    switch (timerType) {
      case "pomodoro":
        setTime(pomodoroLength * 60)
        break
      case "shortBreak":
        setTime(shortBreakLength * 60)
        break
      case "longBreak":
        setTime(longBreakLength * 60)
        break
    }
  }, [timerType, pomodoroLength, shortBreakLength, longBreakLength])

  // Add this after the existing useEffect hooks
  useEffect(() => {
    // Initialize audio elements
    startSoundRef.current = new Audio("/sounds/timer-start.mp3")
    pauseSoundRef.current = new Audio("/sounds/timer-pause.mp3")
    completeSoundRef.current = new Audio("/sounds/timer-complete.mp3")

    // Set volume
    if (startSoundRef.current) startSoundRef.current.volume = 0.5
    if (pauseSoundRef.current) pauseSoundRef.current.volume = 0.5
    if (completeSoundRef.current) completeSoundRef.current.volume = 0.7

    return () => {
      // Clean up audio elements
      startSoundRef.current = null
      pauseSoundRef.current = null
      completeSoundRef.current = null
    }
  }, [])

  // Modify the toggleTimer function to include sound
  const toggleTimer = () => {
    if (!isActive) {
      // Play start sound when timer starts
      if (!isMuted && startSoundRef.current) {
        startSoundRef.current.play().catch((err) => console.error("Error playing sound:", err))
      }
    } else {
      // Play pause sound when timer pauses
      if (!isMuted && pauseSoundRef.current) {
        pauseSoundRef.current.play().catch((err) => console.error("Error playing sound:", err))
      }
    }
    setIsActive(!isActive)
  }

  // Add a function to toggle mute
  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  // Add toggle function for focus mode
  const toggleFocusMode = () => {
    setFocusMode(!focusMode)
  }

  const resetTimer = () => {
    setIsActive(false)
    // Reset to the current timer type's duration
    switch (timerType) {
      case "pomodoro":
        setTime(pomodoroLength * 60)
        break
      case "shortBreak":
        setTime(shortBreakLength * 60)
        break
      case "longBreak":
        setTime(longBreakLength * 60)
        break
    }
  }

  const saveSettings = () => {
    setSettingsOpen(false)
    resetTimer()
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative w-full max-w-xs mx-auto mb-4">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Soon-Hourglass--Streamline-Manchester-i3vvHOk12yhW6HF6xKGHvnFFeJ4utw.png"
          alt="Time management"
          width={150}
          height={150}
          className="mx-auto"
        />
      </div>

      <div className="flex space-x-2 mb-4 flex-wrap justify-center gap-2">
        <Button
          variant={timerType === "pomodoro" ? "default" : "outline"}
          onClick={() => setTimerType("pomodoro")}
          className="text-sm"
        >
          Pomodoro
        </Button>
        <Button
          variant={timerType === "shortBreak" ? "default" : "outline"}
          onClick={() => setTimerType("shortBreak")}
          className="text-sm"
        >
          Short Break
        </Button>
        <Button
          variant={timerType === "longBreak" ? "default" : "outline"}
          onClick={() => setTimerType("longBreak")}
          className="text-sm"
        >
          Long Break
        </Button>
      </div>

      <div className="text-5xl font-bold">{formatTime(time)}</div>

      <div className="flex space-x-2 flex-wrap justify-center gap-2 "> 
        <Button onClick={toggleTimer} variant="outline" size="lg">
          {isActive ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
          {isActive ? "Pause" : "Start"}
        </Button>
        <Button onClick={resetTimer} variant="outline">
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset
        </Button>

        {/* Add focus mode button when timer is active */}
        {isActive && (
          <Button onClick={toggleFocusMode} variant="outline">
            <Maximize2 className="h-4 w-4 mr-2" />
            Focus Mode
          </Button>
        )}

        <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Settings2 className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Timer Settings</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label>Pomodoro Length (minutes)</Label>
                <div className="flex items-center space-x-2">
                  <Slider
                    value={[pomodoroLength]}
                    min={5}
                    max={60}
                    step={5}
                    onValueChange={(value) => setPomodoroLength(value[0])}
                  />
                  <span className="w-12 text-center">{pomodoroLength}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Short Break Length (minutes)</Label>
                <div className="flex items-center space-x-2">
                  <Slider
                    value={[shortBreakLength]}
                    min={1}
                    max={15}
                    step={1}
                    onValueChange={(value) => setShortBreakLength(value[0])}
                  />
                  <span className="w-12 text-center">{shortBreakLength}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Long Break Length (minutes)</Label>
                <div className="flex items-center space-x-2">
                  <Slider
                    value={[longBreakLength]}
                    min={5}
                    max={30}
                    step={5}
                    onValueChange={(value) => setLongBreakLength(value[0])}
                  />
                  <span className="w-12 text-center">{longBreakLength}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Sound Settings</Label>
                <div className="flex items-center space-x-2">
                  <Checkbox id="sound-toggle" checked={!isMuted} onCheckedChange={() => toggleMute()} />
                  <Label htmlFor="sound-toggle">Enable timer sounds</Label>
                </div>
                <p className="text-xs text-gray-500">Play sounds when the timer starts, pauses, and completes.</p>
              </div>

              <Button onClick={saveSettings} className="w-full">
                Save Settings
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        <Button onClick={toggleMute} variant="outline" size="icon" className="ml-1">
          {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </Button>
      </div>

      <p className="text-xs text-gray-500 mt-4 text-center">
        The Pomodoro Technique helps you work with time, instead of struggling against it.
      </p>

      {/* Focus Mode Component */}
      {focusMode && (
        <FocusMode
          time={time}
          isActive={isActive}
          timerType={timerType}
          onToggleTimer={toggleTimer}
          onExit={toggleFocusMode}
        />
      )}
    </div>
  )
}

