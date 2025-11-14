"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"

interface MascotProps {
  message: string
  emotion?: "happy" | "encouraging" | "calm" | "excited" | "caring"
  size?: "small" | "medium" | "large"
}

const emotionEmojis = {
  happy: "🐻",
  encouraging: "🤗",
  calm: "😌",
  excited: "🌟",
  caring: "🧸",
}

const emotionColors = {
  happy: "bg-primary",
  encouraging: "bg-accent",
  calm: "bg-secondary",
  excited: "bg-primary",
  caring: "bg-pink-300",
}

export function Mascot({ message, emotion = "happy", size = "medium" }: MascotProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [message])

  const sizeClasses = {
    small: "w-16 h-16 text-3xl",
    medium: "w-24 h-24 text-4xl",
    large: "w-32 h-32 text-6xl",
  }

  return (
    <div className="relative flex flex-col items-center">
      {/* Mascot Character */}
      <div
        className={`
          ${sizeClasses[size]} 
          ${emotionColors[emotion]} 
          rounded-full flex items-center justify-center 
          animate-gentle-bounce shadow-lg
        `}
      >
        <div>{emotionEmojis[emotion]}</div>
      </div>

      {/* Speech Bubble */}
      {message && (
        <Card
          className={`mt-4 p-3 bg-white shadow-lg border-2 border-primary/20 max-w-xs transition-opacity duration-500 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="text-sm font-medium text-foreground text-balance text-center">
            {message}
          </div>
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 
              w-0 h-0 border-l-4 border-r-4 border-b-4 
              border-l-transparent border-r-transparent border-b-white" />
        </Card>
      )}
    </div>
  )
}
