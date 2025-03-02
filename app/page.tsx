"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const features = [
  {
    title: "Track Your Progress",
    description: "Visualize your habits with beautiful charts and statistics",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Charts--Streamline-Manchester-Tk5dhk8YVjFcUQugxTFLUraQtqoQTB.png",
  },
  {
    title: "Stay Motivated",
    description: "Get daily motivation and track your streaks",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Consult-Experts--Streamline-Manchester-OMEODDASk2iwTsGDxQWX1HVx6s9jU2.png",
  },
  {
    title: "Manage Your Time",
    description: "Use the Pomodoro timer to stay focused",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Minutes-Of-Meeting--Streamline-Manchester-Z6XcYRg0NTDvLL7mj0kBXDbsV4gL72.png",
  },
  {
    title: "Achieve Your Goals",
    description: "Break down big goals into daily habits",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Task-List--Streamline-Manchester-D5GZzocXW1PMg2Qysth2gHFSlIlQw8.png",
  },
]

const steps = [
  {
    title: "Create Your Habits",
    description: "Define your habits and set your goals",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Content-Creation-Writing--Streamline-Manchester-srUsJj4iKjIv6rn7FxzJ9ynRDLAfEg.png",
  },
  {
    title: "Track Daily",
    description: "Check off your habits as you complete them",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Overworked-Employee-Calendar--Streamline-Manchester-LQjplCnnDIflU9icIxbboBUA3guMYu.png",
  },
  {
    title: "Analyze Progress",
    description: "View your progress and stay motivated",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Data-Organization-1--Streamline-Manchester-7V2mlwpR5J7VbAgf3xPlG09NeeW1LN.png",
  },
]

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Build Better Habits
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Track your habits, achieve your goals, and become the best version of yourself. Always free, always
              improving.
            </p>
            <Link href="/today">
              <Button size="lg" className="rounded-full">
                Get Started <ArrowRight className="ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
        <div className="absolute inset-0 -z-10">
          <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
            <defs>
              <pattern id="pattern" width="100" height="100" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1" className="text-gray-200" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#pattern)" />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center mb-12"
          >
            Everything you need to build better habits
          </motion.h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="bg-white p-6 rounded-lg shadow-lg"
              >
                <div className="mb-4 h-48 relative">
                  <Image
                    src={feature.image || "/placeholder.svg"}
                    alt={feature.title}
                    fill
                    className="object-contain"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center mb-12"
          >
            How It Works
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="text-center"
              >
                <div className="mb-4 h-48 relative">
                  <Image src={step.image || "/placeholder.svg"} alt={step.title} fill className="object-contain" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Kaizen Philosophy Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold mb-4">The Kaizen Philosophy</h2>
              <p className="text-lg text-gray-600">
                Small, continuous improvements lead to remarkable results over time
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="text-2xl font-semibold mb-4">Building Habits is Like Cooking</h3>
                <p className="text-gray-600 mb-4">
                  Just as a chef perfects a recipe through small adjustments and consistent practice, building habits
                  requires patience, experimentation, and daily commitment.
                </p>
                <p className="text-gray-600 mb-4">
                  The Kaizen approach teaches us that making tiny 1% improvements consistently is the key to
                  extraordinary results. It's not about radical changes, but rather about small, sustainable steps.
                </p>
                <ul className="list-disc pl-5 space-y-2 text-gray-600">
                  <li>Start with simple habits that take less than 2 minutes</li>
                  <li>Focus on consistency rather than perfection</li>
                  <li>Track your progress to stay motivated</li>
                  <li>Celebrate small wins along the way</li>
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="relative h-80"
              >
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Pasta-2--Streamline-Manchester-lP8CJ0Q90WasXhYsP2aT8ayrjKWUUg.png"
                  alt="Building habits is like cooking"
                  fill
                  className="object-contain"
                />
                <div className="absolute -bottom-10 left-0 right-0 text-center">
                  <p className="text-sm text-gray-500 italic">
                    Like cooking pasta, habits require patience and consistent practice
                  </p>
                </div>
              </motion.div>
            </div>

            <div className="mt-20 grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="relative h-80 md:order-1 order-2"
              >
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Chef-2--Streamline-Manchester-GNqugKhm2f4vrIteVkK3xZcd0mFuhc.png"
                  alt="Small steps lead to big results"
                  fill
                  className="object-contain"
                />
                <div className="absolute -bottom-10 left-0 right-0 text-center">
                  <p className="text-sm text-gray-500 italic">Each small step brings you closer to your goals</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="md:order-2 order-1"
              >
                <h3 className="text-2xl font-semibold mb-4">The Science of Habit Formation</h3>
                <p className="text-gray-600 mb-4">
                  Research shows that habits follow a neurological loop: cue, craving, response, and reward.
                  Understanding this loop helps you build better habits and break bad ones.
                </p>
                <p className="text-gray-600">
                  Our app helps you implement proven strategies like habit stacking, environment design, and the
                  two-minute rule to make habit formation easier and more enjoyable.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4">Start Building Better Habits Today</h2>
            <p className="text-xl mb-8 opacity-90">Join thousands of others who are transforming their lives</p>
            <Link href="/today">
              <Button size="lg" variant="secondary" className="rounded-full">
                Get Started For Free <ArrowRight className="ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  )
}

