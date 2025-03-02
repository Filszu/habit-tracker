import TodayView from "@/components/today-view"
import Image from "next/image"

export default function TodayPage() {
  return (
    <main className="min-h-screen bg-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Today's Habits</h1>
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Minutes-Of-Meeting--Streamline-Manchester-1wUm5a4xQY3OwaAoXPQhcxG4dUkV9O.png"
            alt="Today's Habits"
            width={100}
            height={100}
          />
        </div>
        <TodayView />
      </div>
    </main>
  )
}

