import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Nav from "@/components/nav"
import Footer from "@/components/footer"
import { JsonLd } from "@/components/json-ld"
import { ToastProvider } from "@/components/toast-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Habits Tracker - Build Better Habits and Track Your Progress",
  description:
    "Track your daily habits, achieve your goals, and become the best version of yourself with our free habit tracking app. Features include Pomodoro timer, statistics, and progress tracking.",
  keywords: "habits tracker, habit building, productivity, goal tracking, pomodoro timer, personal development",
  authors: [{ name: "Filshu" }],
  openGraph: {
    title: "Habits Tracker - Build Better Habits",
    description: "Track your habits and achieve your goals with our free habit tracking app",
    type: "website",
    url: "https://habits-tracker.vercel.app",
    images: [
      {
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Charts--Streamline-Manchester-Tk5dhk8YVjFcUQugxTFLUraQtqoQTB.png",
        width: 1200,
        height: 630,
        alt: "Habits Tracker App",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Habits Tracker - Build Better Habits",
    description: "Track your habits and achieve your goals with our free habit tracking app",
    images: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Charts--Streamline-Manchester-Tk5dhk8YVjFcUQugxTFLUraQtqoQTB.png",
    ],
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#7c3aed" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={inter.className}>
        <JsonLd />
        <ToastProvider>
          <div className="flex flex-col min-h-screen">
            <Nav />
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
        </ToastProvider>
      </body>
    </html>
  )
}



import './globals.css'