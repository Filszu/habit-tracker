"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import Image from "next/image"

interface Quote {
  text: string
  author: string
  image: string
}

const motivationalQuotes: Quote[] = [
  {
    text: "The secret of getting ahead is getting started.",
    author: "Mark Twain",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Listening-To-Feedback--Streamline-Manchester-yxDm0wt2QBdtsmoXi3QDQxN0m3FP6p.png",
  },
  {
    text: "It always seems impossible until it's done.",
    author: "Nelson Mandela",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Astronaut--Streamline-Manchester-m5JH4DsdKJ6nO9jF1qbmGmKHhsWqSK.png",
  },
  {
    text: "Don't watch the clock; do what it does. Keep going.",
    author: "Sam Levenson",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Soon-Hourglass--Streamline-Manchester-i3vvHOk12yhW6HF6xKGHvnFFeJ4utw.png",
  },
  {
    text: "Believe you can and you're halfway there.",
    author: "Theodore Roosevelt",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Travel--Streamline-Manchester-VlICF8W3Zwz3dCg3cXFoPJtnWiq6hh.png",
  },
  {
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Scientist-2--Streamline-Manchester-Zg0D07hI3PXTnoCJr32AUcOF1iOLkV.png",
  },
  {
    text: "The way to get started is to quit talking and begin doing.",
    author: "Walt Disney",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Security-Safety--Streamline-Manchester-R7EGrwe0QgwUUrqqWuLo6EUcDWdP1k.png",
  },
  {
    text: "Small daily improvements are the key to staggering long-term results.",
    author: "Robin Sharma",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Chef-2--Streamline-Manchester-GNqugKhm2f4vrIteVkK3xZcd0mFuhc.png",
  },
  {
    text: "Habits are the compound interest of self-improvement.",
    author: "James Clear",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Pasta-2--Streamline-Manchester-lP8CJ0Q90WasXhYsP2aT8ayrjKWUUg.png",
  },
]

export default function MotivationTimer() {
  const [quote, setQuote] = useState<Quote>(motivationalQuotes[0])

  const generateQuote = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * motivationalQuotes.length)
    setQuote(motivationalQuotes[randomIndex])
  }, [])

  useEffect(() => {
    generateQuote()
    const interval = setInterval(generateQuote, 60000) // Change quote every minute
    return () => clearInterval(interval)
  }, [generateQuote])

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative w-full max-w-xs mx-auto h-40">
        <Image src={quote.image || "/placeholder.svg"} alt="Motivation illustration" fill className="object-contain" />
      </div>

      <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 text-center">
        <p className="text-lg italic mb-2">"{quote.text}"</p>
        <p className="text-sm text-gray-600">— {quote.author}</p>
      </div>

      <Button onClick={generateQuote} variant="outline">
        <RefreshCw className="h-4 w-4 mr-2" />
        New Quote
      </Button>
    </div>
  )
}

