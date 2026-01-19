"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Coffee, Heart, Download, Save, Share2, Upload, Bell, X } from "lucide-react"
import { getHabits, saveHabits, getNotificationSettings, saveNotificationSettings } from "@/lib/local-storage"
import { useToast } from "@/components/ui/use-toast"
import type { Habit, NotificationSettings } from "@/lib/types"
import { Switch } from "@/components/ui/switch"
import Link from "next/link"

export default function SettingsPage() {
  const [userName, setUserName] = useState("")
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    enabled: false,
    times: [],
  })
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>("default")
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const savedUserName = localStorage.getItem("userName")
    if (savedUserName) {
      setUserName(savedUserName)
    }

    const settings = getNotificationSettings()
    setNotificationSettings(settings)

    if (typeof window !== "undefined" && "Notification" in window) {
      setNotificationPermission(Notification.permission)
    }
  }, [])

  const handleSave = () => {
    localStorage.setItem("userName", userName)
    toast({
      title: "Settings saved",
      description: "Your name has been saved successfully.",
    })
  }

  const exportData = () => {
    const habits = getHabits()
    const dataStr = JSON.stringify(habits, null, 2)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)

    const exportFileDefaultName = `habits-tracker-data-${new Date().toISOString().split("T")[0]}.json`

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()

    toast({
      title: "Data exported",
      description: "Your habits data has been exported successfully.",
    })
  }

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string
          const importedData = JSON.parse(content) as Habit[]

          // Validate the imported data structure
          if (Array.isArray(importedData) && importedData.every(isValidHabit)) {
            saveHabits(importedData)
            toast({
              title: "Data imported",
              description: "Your habits data has been imported successfully.",
            })
          } else {
            throw new Error("Invalid data structure")
          }
        } catch (error) {
          toast({
            title: "Import failed",
            description: "The selected file contains invalid data. Please check the file and try again.",
            variant: "destructive",
          })
        }
      }
      reader.readAsText(file)
    }
  }

  const isValidHabit = (habit: any): habit is Habit => {
    return (
      typeof habit.id === "string" &&
      typeof habit.name === "string" &&
      ["daily", "weekly", "custom"].includes(habit.frequency) &&
      ["boolean", "percentage"].includes(habit.completionType) &&
      Array.isArray(habit.selectedDays) &&
      Array.isArray(habit.logs) &&
      typeof habit.createdAt === "string"
    )
  }

  const shareApp = () => {
    const shareUrl = new URL(window.location.href)
    shareUrl.searchParams.set("ref", userName)

    if (navigator.share) {
      navigator
        .share({
          title: "Habits Tracker App",
          text: `Check out this awesome habits tracking app! Shared by ${userName}`,
          url: shareUrl.toString(),
        })
        .catch((error) => console.log("Error sharing", error))
    } else {
      navigator.clipboard.writeText(shareUrl.toString())
      toast({
        title: "Link copied!",
        description: "Share link has been copied to your clipboard.",
      })
    }
  }

  const handleNotificationToggle = (enabled: boolean) => {
    if (enabled && notificationPermission !== "granted") {
      toast({
        title: "Permission required",
        description: "Please enable notification permissions first.",
        variant: "destructive",
      })
      return
    }

    const updatedSettings = { ...notificationSettings, enabled }
    setNotificationSettings(updatedSettings)
    saveNotificationSettings(updatedSettings)
    toast({
      title: "Notifications updated",
      description: enabled ? "Daily notifications enabled." : "Daily notifications disabled.",
    })
  }

  const requestNotificationPermission = async () => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      toast({
        title: "Not supported",
        description: "Your browser does not support notifications.",
        variant: "destructive",
      })
      return
    }

    try {
      const permission = await Notification.requestPermission()
      setNotificationPermission(permission)

      if (permission === "granted") {
        toast({
          title: "Permission granted",
          description: "You can now enable daily notifications.",
        })
      } else {
        toast({
          title: "Permission denied",
          description: "Please enable notifications in your browser settings.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to request notification permission.",
        variant: "destructive",
      })
    }
  }

  const addNotificationTime = () => {
    if (notificationSettings.times.length >= 3) {
      toast({
        title: "Maximum reached",
        description: "You can set a maximum of 3 notification times per day.",
        variant: "destructive",
      })
      return
    }

    const defaultTime = "09:00"
    const updatedSettings = {
      ...notificationSettings,
      times: [...notificationSettings.times, defaultTime],
    }
    setNotificationSettings(updatedSettings)
    saveNotificationSettings(updatedSettings)
  }

  const removeNotificationTime = (index: number) => {
    const updatedTimes = notificationSettings.times.filter((_, i) => i !== index)
    const updatedSettings = {
      ...notificationSettings,
      times: updatedTimes,
    }
    setNotificationSettings(updatedSettings)
    saveNotificationSettings(updatedSettings)
  }

  const updateNotificationTime = (index: number, time: string) => {
    const updatedTimes = [...notificationSettings.times]
    updatedTimes[index] = time
    const updatedSettings = {
      ...notificationSettings,
      times: updatedTimes,
    }
    setNotificationSettings(updatedSettings)
    saveNotificationSettings(updatedSettings)
  }

  return (
    <main className="min-h-screen bg-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold">
            Settings
          </motion.h1>
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Home-Office--Streamline-Manchester-6nZxZkuXVhieCcsxK2tO8gagXdVN8Z.png"
            alt="Settings"
            width={100}
            height={100}
          />
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>Customize your experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Display Name</Label>
                <Input
                  id="name"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Enter your name"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button onClick={handleSave} className="flex-1">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
                <Button onClick={shareApp} variant="outline" className="flex-1">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share App
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Daily Notifications
              </CardTitle>
              <CardDescription>Get reminders to track your habits (up to 3 times per day)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notifications-enabled">Enable Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    {notificationPermission === "granted"
                      ? "Notifications are allowed"
                      : notificationPermission === "denied"
                        ? "Notifications are blocked. Please enable them in your browser settings."
                        : "Click 'Request Permission' to enable notifications"}
                  </p>
                </div>
                <Switch
                  id="notifications-enabled"
                  checked={notificationSettings.enabled}
                  onCheckedChange={handleNotificationToggle}
                  disabled={notificationPermission !== "granted"}
                />
              </div>

              {notificationPermission !== "granted" && (
                <Button onClick={requestNotificationPermission} variant="outline" className="w-full">
                  <Bell className="h-4 w-4 mr-2" />
                  Request Notification Permission
                </Button>
              )}

              {notificationPermission === "granted" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Notification Times</Label>
                    {notificationSettings.times.map((time, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input
                          type="time"
                          value={time}
                          onChange={(e) => updateNotificationTime(index, e.target.value)}
                          className="flex-1"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeNotificationTime(index)}
                          className="text-destructive hover:text-destructive"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    {notificationSettings.times.length < 3 && (
                      <Button onClick={addNotificationTime} variant="outline" className="w-full">
                        Add Notification Time
                      </Button>
                    )}
                  </div>
                  {notificationSettings.times.length === 0 && notificationSettings.enabled && (
                    <p className="text-sm text-muted-foreground">
                      Add at least one notification time to receive reminders.
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
              <CardDescription>Export or import your data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col space-y-2">
                <p className="text-sm text-gray-600">Export your habits data as a JSON file for backup or analysis.</p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button onClick={exportData} className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Export Data as JSON
                  </Button>
                  <Button onClick={() => fileInputRef.current?.click()} className="flex-1">
                    <Upload className="h-4 w-4 mr-2" />
                    Import Data from JSON
                  </Button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={importData}
                    accept=".json"
                    style={{ display: "none" }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card>
            <CardHeader>
              <CardTitle>Support the Project</CardTitle>
              <CardDescription>Help us keep the app free for everyone</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-6">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Designer-Working-1--Streamline-Manchester-1TqHolCv6SboUdZHpgaimDs7nEd3Hh.png"
                  alt="Support the project"
                  width={200}
                  height={200}
                  className="mx-auto"
                />
                <p className="text-center md:text-left text-gray-600 max-w-sm">
                  Your support helps us continue developing new features and keeping the app free for everyone. Join our
                  community of supporters and help shape the future of Habits Tracker!
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="h-24 space-y-2">
                  <Coffee className="h-6 w-6" />
                  <Link href="https://buymeacoffee.com/filshu">
                    <div className="font-semibold">Buy me a coffee</div>
                    <div className="text-sm text-muted-foreground">$1</div>
                  </Link>
                </Button>
                <Button variant="outline" className="h-24 space-y-2">
                  <Heart className="h-6 w-6 text-red-500" />
                  <Link href="https://buymeacoffee.com/filshu">
                    <div className="font-semibold">Become a supporter</div>
                    <div className="text-sm text-muted-foreground">$3/month</div>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="text-center text-sm text-gray-500">
          <p>Version 1.0.1</p>
          <p>Made with ❤️ by <a href="https://filszu.vercel.app" className="text-blue-500 hover:text-blue-600" target="_blank">filshu</a></p>
        </div>
      </div>
    </main>
  )
}

