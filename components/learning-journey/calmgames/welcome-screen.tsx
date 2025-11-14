"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { usePoints } from "../../../hooks/use-points"

interface WelcomeScreenProps {
  onStartGame: () => void
  onCalmingMode: () => void
  onColorShop: () => void
}

export function WelcomeScreen({ onStartGame, onCalmingMode, onColorShop }: WelcomeScreenProps) {
  const [mascotMessage, setMascotMessage] = useState(0)
  const { points } = usePoints()

  const messages = [
    "Hi there! I'm Buddy, your friendly helper! 🌟",
    "I'm here to play fun games with you and help you learn about friendship! 🤗",
    "Whenever you feel ready, we can start our adventure together! ✨",
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setMascotMessage((prev) => (prev + 1) % messages.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-background to-secondary/20">
      {/* Floating decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-16 h-16 bg-primary/20 rounded-full animate-float" />
        <div
          className="absolute top-40 right-32 w-12 h-12 bg-accent/20 rounded-full animate-float"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute bottom-32 left-32 w-20 h-20 bg-secondary/30 rounded-full animate-float"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute bottom-20 right-20 w-14 h-14 bg-primary/20 rounded-full animate-float"
          style={{ animationDelay: "0.5s" }}
        />
      </div>

      <div className="max-w-2xl w-full space-y-8 text-center relative z-10">
        {/* Mascot Character */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-32 h-32 bg-primary rounded-full flex items-center justify-center animate-gentle-bounce shadow-lg">
              <div className="text-6xl">🐻</div>
            </div>
            {/* Speech bubble */}
            <Card className="absolute -top-20 left-1/2 transform -translate-x-1/2 p-4 bg-white shadow-lg border-2 border-primary/20 min-w-[300px]">
              <div className="text-sm font-medium text-foreground text-balance">{messages[mascotMessage]}</div>
              {/* Speech bubble tail */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white" />
            </Card>
          </div>
        </div>

        {/* Welcome Title */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground text-balance">
            Welcome to Social Skills Adventure!
          </h1>
          <p className="text-lg text-muted-foreground text-pretty max-w-lg mx-auto">
            Let's learn about friendship, sharing, and being kind together through fun stories and games!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            onClick={onStartGame}
            size="lg"
            className="text-lg px-8 py-6 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse-gentle"
          >
            🎮 Start Learning Games
          </Button>

          <Button
            onClick={onCalmingMode}
            variant="secondary"
            size="lg"
            className="text-lg px-8 py-6 bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            🫧 Calm & Relax Mode
          </Button>

          <Button
            onClick={onColorShop}
            variant="outline"
            size="lg"
            className="text-lg px-8 py-6 bg-accent hover:bg-accent/90 text-accent-foreground rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-accent"
          >
            🎨 Color Shop ({points} ⭐)
          </Button>
        </div>

        {/* Comfort indicators (subtle) */}
        <div className="flex justify-center gap-4 mt-8">
          <div className="text-xs text-muted-foreground flex items-center gap-2">
            <div className="w-3 h-3 bg-primary rounded-full animate-pulse-gentle" />
            Ready to play
          </div>
          {points > 0 && (
            <div className="text-xs text-muted-foreground flex items-center gap-2">
              <div className="w-3 h-3 bg-accent rounded-full animate-pulse-gentle" />
              {points} stars earned!
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
