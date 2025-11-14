"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Mascot } from "@/components/learning-journey/calmgames/mascot"

interface BreathingExerciseProps {
  onBackToCalming: () => void
  onBackToWelcome: () => void
}

export function BreathingExercise({ onBackToCalming, onBackToWelcome }: BreathingExerciseProps) {
  const [isActive, setIsActive] = useState(false)
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale">("inhale")
  const [cycleCount, setCycleCount] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(4)
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null)

  const exercises = [
    {
      id: "basic",
      name: "Basic Breathing",
      description: "Simple in and out breathing",
      inhale: 4,
      hold: 2,
      exhale: 4,
      icon: "🌬️",
    },
    {
      id: "calm",
      name: "Calming Breath",
      description: "Longer exhale for relaxation",
      inhale: 4,
      hold: 2,
      exhale: 6,
      icon: "😌",
    },
    {
      id: "energy",
      name: "Energy Breath",
      description: "Balanced breathing for focus",
      inhale: 3,
      hold: 3,
      exhale: 3,
      icon: "⭐",
    },
  ]

  const currentExercise = exercises.find((ex) => ex.id === selectedExercise)

  useEffect(() => {
    if (!isActive || !currentExercise) return

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          // Move to next phase
          if (phase === "inhale") {
            setPhase("hold")
            return currentExercise.hold
          } else if (phase === "hold") {
            setPhase("exhale")
            return currentExercise.exhale
          } else {
            setPhase("inhale")
            setCycleCount((prev) => prev + 1)
            return currentExercise.inhale
          }
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isActive, phase, currentExercise])

  const startExercise = (exerciseId: string) => {
    const exercise = exercises.find((ex) => ex.id === exerciseId)
    if (!exercise) return

    setSelectedExercise(exerciseId)
    setIsActive(true)
    setPhase("inhale")
    setCycleCount(0)
    setTimeRemaining(exercise.inhale)
  }

  const stopExercise = () => {
    setIsActive(false)
    setSelectedExercise(null)
    setCycleCount(0)
  }

  const getPhaseInstruction = () => {
    switch (phase) {
      case "inhale":
        return "Breathe in slowly through your nose"
      case "hold":
        return "Hold your breath gently"
      case "exhale":
        return "Breathe out slowly through your mouth"
    }
  }

  const getCircleSize = () => {
    if (phase === "inhale") return "scale-150"
    if (phase === "hold") return "scale-125"
    return "scale-100"
  }

  if (selectedExercise && isActive) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 p-6">
        <div className="max-w-2xl mx-auto text-center">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <Button variant="outline" onClick={stopExercise} className="rounded-xl bg-white/80">
              ← Stop Exercise
            </Button>
            <Card className="p-3 bg-white/80">
              <div className="text-sm font-medium">Cycles: {cycleCount}</div>
            </Card>
          </div>

          {/* Mascot guidance */}
          <div className="mb-8">
            <Mascot message={getPhaseInstruction()} emotion="calm" size="medium" />
          </div>

          {/* Breathing circle */}
          <div className="flex justify-center mb-8">
            <div
              className={`w-48 h-48 rounded-full bg-gradient-to-br from-blue-300 to-purple-300 flex items-center justify-center transition-transform duration-1000 ${getCircleSize()} shadow-2xl`}
            >
              <div className="text-white text-6xl font-bold">{timeRemaining}</div>
            </div>
          </div>

          {/* Phase indicator */}
          <Card className="p-6 bg-white/90 mb-8">
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-foreground capitalize">{phase}</h3>
              <p className="text-muted-foreground">{getPhaseInstruction()}</p>
            </div>
          </Card>

          {/* Progress */}
          <div className="text-sm text-muted-foreground">
            {cycleCount >= 5 && (
              <Button onClick={stopExercise} size="lg" className="rounded-xl animate-gentle-bounce">
                🌟 I Feel Much Calmer Now
              </Button>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Button variant="outline" onClick={onBackToCalming} className="rounded-xl bg-white/80">
            ← Back to Calming
          </Button>
          <Button variant="secondary" onClick={onBackToWelcome} className="rounded-xl bg-white/80">
            🏠 Home
          </Button>
        </div>

        {/* Mascot introduction */}
        <div className="flex justify-center mb-8">
          <Mascot
            message="Let's practice breathing together! Choose an exercise that feels right for you."
            emotion="calm"
            size="large"
          />
        </div>

        {/* Instructions */}
        <Card className="p-6 mb-8 bg-white/90 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Breathing Exercises</h2>
          <p className="text-muted-foreground text-pretty">
            Breathing exercises help us feel calm and peaceful. Follow the circle and breathe along with the
            instructions.
          </p>
        </Card>

        {/* Exercise options */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {exercises.map((exercise) => (
            <Card
              key={exercise.id}
              className="p-6 cursor-pointer transition-all duration-300 hover:shadow-lg border-2 hover:border-primary/50 bg-white/80"
              onClick={() => startExercise(exercise.id)}
            >
              <div className="text-center space-y-4">
                <div className="text-6xl">{exercise.icon}</div>
                <h3 className="text-xl font-bold text-foreground">{exercise.name}</h3>
                <p className="text-sm text-muted-foreground">{exercise.description}</p>
                <div className="text-xs text-muted-foreground">
                  In: {exercise.inhale}s • Hold: {exercise.hold}s • Out: {exercise.exhale}s
                </div>
                <Button className="w-full rounded-xl">Start Exercise</Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Benefits card */}
        <Card className="p-6 bg-white/90">
          <div className="text-center space-y-4">
            <div className="text-4xl">💙</div>
            <h3 className="text-lg font-bold text-foreground">Why Breathing Helps</h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm text-muted-foreground">
              <div>
                <div className="font-medium">Calms Your Mind</div>
                <div>Helps you feel peaceful</div>
              </div>
              <div>
                <div className="font-medium">Relaxes Your Body</div>
                <div>Makes tension go away</div>
              </div>
              <div>
                <div className="font-medium">Improves Focus</div>
                <div>Helps you think clearly</div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
