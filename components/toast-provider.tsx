"use client"

import type React from "react"

import { ToastProvider as RadixToastProvider } from "@radix-ui/react-toast"
// import { useToast } from "@/components/ui/use-toast"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useToast()

  return (
    <RadixToastProvider>
      {children}
      <Toaster />
    </RadixToastProvider>
  )
}

