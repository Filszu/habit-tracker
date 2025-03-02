"use client"

import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import confetti from "canvas-confetti"
import { useEffect } from "react"

interface ConfettiCelebrationProps {
  show: boolean
  onComplete: () => void
}

export default function ConfettiCelebration({ show, onComplete }: ConfettiCelebrationProps) {
  useEffect(() => {
    if (show) {
      const duration = 3000
      const animationEnd = Date.now() + duration
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

      function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min
      }

      const interval: NodeJS.Timeout = setInterval(() => {
        const timeLeft = animationEnd - Date.now()

        if (timeLeft <= 0) {
          clearInterval(interval)
          setTimeout(onComplete, 1000)
          return
        }

        const particleCount = 50 * (timeLeft / duration)

        // Since they are random, these confetti will create a more natural effect
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        })
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        })
      }, 250)

      return () => clearInterval(interval)
    }
  }, [show, onComplete])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="bg-white p-8 rounded-lg text-center max-w-sm mx-4"
          >
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Good-Job-Keep-It-Up--Streamline-Manchester-l7NiGzSC4QTpKDdhdx8d8YUAKgpsf4.png"
              alt="Congratulations"
              width={100}
              height={100}
              className="mx-auto mb-4"
            />
            <motion.h2
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY }}
              className="text-3xl font-bold mb-4"
            >
              🎉 Amazing Job! 🎉
            </motion.h2>
            <p className="text-xl mb-4">You've completed all your tasks for today!</p>
            <p className="text-gray-600">Keep up the great work and build those habits!</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

