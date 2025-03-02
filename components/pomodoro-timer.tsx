"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Play, Pause, RotateCcw, Settings2 } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export default function PomodoroTimer() {
  const [time, setTime] = useState(25 * 60)
  const [isActive, setIsActive] = useState(false)
  const [pomodoroLength, setPomodoroLength] = useState(25)
  const [shortBreakLength, setShortBreakLength] = useState(5)
  const [longBreakLength, setLongBreakLength] = useState(15)
  const [timerType, setTimerType] = useState<"pomodoro" | "shortBreak" | "longBreak">("pomodoro")
  const [settingsOpen, setSettingsOpen] = useState(false)

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1)
      }, 1000)
    } else if (time === 0) {
      setIsActive(false)
    }

    return () => clearInterval(interval)
  }, [isActive, time])

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

  const toggleTimer = () => {
    setIsActive(!isActive)
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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
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

      <div className="flex space-x-2 mb-4">
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

      <div className="flex space-x-2">
        <Button onClick={toggleTimer} variant="outline" size="lg">
          {isActive ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
          {isActive ? "Pause" : "Start"}
        </Button>
        <Button onClick={resetTimer} variant="outline">
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset
        </Button>

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

              <Button onClick={saveSettings} className="w-full">
                Save Settings
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <p className="text-xs text-gray-500 mt-4 text-center">
        The Pomodoro Technique helps you work with time, instead of struggling against it.
      </p>
    </div>
  )
}

