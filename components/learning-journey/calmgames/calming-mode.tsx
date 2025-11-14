"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Mascot } from "@/components/learning-journey/calmgames/mascot"
import { BubblePopping } from "@/components/learning-journey/calmgames/bubble-popping"
import { ColorSelector } from "@/components/learning-journey/calmgames/color-selector"
import { SoundSelector } from "@/components/learning-journey/calmgames/sound-selector"
import { AnimalSelector } from "@/components/learning-journey/calmgames/animal-selector"

interface CalmingModeProps {
  onBackToWelcome: () => void
  onBreathingExercise: () => void
}

export function CalmingMode({ onBackToWelcome, onBreathingExercise }: CalmingModeProps) {
  const [currentActivity, setCurrentActivity] = useState<"menu" | "bubbles" | "colors" | "sounds" | "animals">("menu")
  const [calmingLevel, setCalmingLevel] = useState(0)

  const activities = [
    {
      id: "bubbles",
      title: "Pop Bubbles",
      description: "Pop floating bubbles to feel calm and relaxed",
      icon: "🫧",
      color: "bg-blue-100 hover:bg-blue-200",
    },
    {
      id: "colors",
      title: "Choose Colors",
      description: "Pick your favorite calming colors",
      icon: "🌈",
      color: "bg-purple-100 hover:bg-purple-200",
    },
    {
      id: "sounds",
      title: "Peaceful Sounds",
      description: "Listen to gentle, soothing sounds",
      icon: "🎵",
      color: "bg-green-100 hover:bg-green-200",
    },
    {
      id: "animals",
      title: "Friendly Animals",
      description: "Meet cute and cuddly animal friends",
      icon: "🐾",
      color: "bg-yellow-100 hover:bg-yellow-200",
    },
  ]

  const handleActivityComplete = () => {
    setCalmingLevel((prev) => Math.min(prev + 25, 100))
    setCurrentActivity("menu")
  }

  if (currentActivity === "bubbles") {
    return <BubblePopping onComplete={handleActivityComplete} onBack={() => setCurrentActivity("menu")} />
  }

  if (currentActivity === "colors") {
    return <ColorSelector onComplete={handleActivityComplete} onBack={() => setCurrentActivity("menu")} />
  }

  if (currentActivity === "sounds") {
    return <SoundSelector onComplete={handleActivityComplete} onBack={() => setCurrentActivity("menu")} />
  }

  if (currentActivity === "animals") {
    return <AnimalSelector onComplete={handleActivityComplete} onBack={() => setCurrentActivity("menu")} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Button variant="outline" onClick={onBackToWelcome} className="rounded-xl bg-white/80">
            ← Back to Home
          </Button>
          <div className="text-sm text-muted-foreground">Calm Level: {calmingLevel}%</div>
        </div>

        {/* Mascot with calming message */}
        <div className="flex justify-center mb-8">
          <Mascot
            message="Take your time and choose what makes you feel peaceful and happy!"
            emotion="calm"
            size="large"
          />
        </div>

        {/* Calming level indicator */}
        <Card className="p-6 mb-8 bg-white/80">
          <div className="text-center space-y-4">
            <h3 className="text-lg font-semibold text-foreground">How are you feeling?</h3>
            <div className="w-full bg-gray-200 rounded-full h-4 max-w-md mx-auto">
              <div
                className="bg-gradient-to-r from-blue-400 to-green-400 h-4 rounded-full transition-all duration-1000"
                style={{ width: `${calmingLevel}%` }}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              {calmingLevel < 25 && "Let's find something that helps you feel better"}
              {calmingLevel >= 25 && calmingLevel < 50 && "You're starting to feel more relaxed"}
              {calmingLevel >= 50 && calmingLevel < 75 && "You're feeling much calmer now"}
              {calmingLevel >= 75 && "You're feeling peaceful and ready!"}
            </p>
          </div>
        </Card>

        {/* Activity Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {activities.map((activity) => (
            <Card
              key={activity.id}
              className={`p-6 cursor-pointer transition-all duration-300 hover:shadow-lg ${activity.color} border-2 hover:border-primary/30`}
              onClick={() => setCurrentActivity(activity.id as any)}
            >
              <div className="text-center space-y-4">
                <div className="text-6xl">{activity.icon}</div>
                <h3 className="text-xl font-bold text-foreground">{activity.title}</h3>
                <p className="text-sm text-muted-foreground text-pretty">{activity.description}</p>
                <Button variant="outline" className="w-full rounded-xl bg-white/50">
                  Try This Activity
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Breathing Exercise Option */}
        <Card className="p-6 bg-white/80 text-center">
          <div className="space-y-4">
            <div className="text-4xl">🌬️</div>
            <h3 className="text-xl font-bold text-foreground">Breathing Exercise</h3>
            <p className="text-muted-foreground text-pretty">
              Practice slow, deep breathing to feel even more calm and centered
            </p>
            <Button onClick={onBreathingExercise} className="rounded-xl">
              Start Breathing Exercise
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
