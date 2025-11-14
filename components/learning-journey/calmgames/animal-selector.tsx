"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface AnimalSelectorProps {
  onComplete: () => void
  onBack: () => void
  durationSeconds?: number
}

export function AnimalSelector({ onComplete, onBack, durationSeconds = 60 }: AnimalSelectorProps) {
  const [selectedAnimals, setSelectedAnimals] = useState<string[]>([])
  const [interactingWith, setInteractingWith] = useState<string | null>(null)
  const [totalTimeRemaining, setTotalTimeRemaining] = useState(durationSeconds)
  const completedRef = useRef(false)

  const animals = [
    { id: "puppy", name: "Friendly Puppy", icon: "🐶", sound: "Woof!", action: "wagging tail", frequency: 200 },
    { id: "kitten", name: "Cuddly Kitten", icon: "🐱", sound: "Meow!", action: "purring softly", frequency: 400 },
    { id: "bunny", name: "Soft Bunny", icon: "🐰", sound: "Hop hop!", action: "twitching nose", frequency: 600 },
    { id: "duck", name: "Happy Duck", icon: "🦆", sound: "Quack!", action: "splashing gently", frequency: 300 },
    { id: "hamster", name: "Tiny Hamster", icon: "🐹", sound: "Squeak!", action: "running on wheel", frequency: 800 },
    { id: "bird", name: "Singing Bird", icon: "🐦", sound: "Tweet!", action: "flapping wings", frequency: 1000 },
  ]

  const playAnimalSound = (animal: any) => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      // Different sound patterns for different animals
      if (animal.id === "puppy") {
        // Bark pattern: two quick tones
        oscillator.frequency.setValueAtTime(animal.frequency, audioContext.currentTime)
        oscillator.frequency.setValueAtTime(animal.frequency * 0.8, audioContext.currentTime + 0.1)
        oscillator.type = "square"
      } else if (animal.id === "kitten") {
        // Meow pattern: rising then falling
        oscillator.frequency.setValueAtTime(animal.frequency, audioContext.currentTime)
        oscillator.frequency.exponentialRampToValueAtTime(animal.frequency * 1.5, audioContext.currentTime + 0.3)
        oscillator.frequency.exponentialRampToValueAtTime(animal.frequency * 0.7, audioContext.currentTime + 0.6)
        oscillator.type = "sine"
      } else if (animal.id === "bird") {
        // Tweet pattern: quick high notes
        oscillator.frequency.setValueAtTime(animal.frequency, audioContext.currentTime)
        oscillator.frequency.setValueAtTime(animal.frequency * 1.2, audioContext.currentTime + 0.05)
        oscillator.frequency.setValueAtTime(animal.frequency, audioContext.currentTime + 0.1)
        oscillator.type = "sine"
      } else {
        // Default pattern for other animals
        oscillator.frequency.setValueAtTime(animal.frequency, audioContext.currentTime)
        oscillator.type = "triangle"
      }

      gainNode.gain.setValueAtTime(0.15, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.8)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.8)
    } catch (error) {
      console.log("[v0] Audio context not available")
    }
  }

  const handleAnimalSelect = (animal: any) => {
    setSelectedAnimals((prev) => {
      if (prev.includes(animal.id)) {
        return prev.filter((a) => a !== animal.id)
      } else {
        return [...prev, animal.id]
      }
    })

    playAnimalSound(animal)

    // Simulate animal interaction
    setInteractingWith(animal.id)
    setTimeout(() => setInteractingWith(null), 3000)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setTotalTimeRemaining((prev) => {
        const newValue = prev - 1
        if (newValue <= 0 && !completedRef.current) {
          completedRef.current = true
          // Defer the callback to next render cycle
          setTimeout(() => {
            onComplete()
          }, 0)
        }
        return Math.max(0, newValue)
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [onComplete])

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-pink-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Button variant="outline" onClick={onBack} className="rounded-xl bg-white/80">
            ← Back
          </Button>
          <Card className="p-3 bg-white/80">
            <div className="text-sm font-medium">{totalTimeRemaining}s</div>
          </Card>
          <Card className="p-3 bg-white/80">
            <div className="text-sm font-medium">Animal Friends: {selectedAnimals.length}</div>
          </Card>
        </div>

        {/* Instructions */}
        <Card className="p-6 mb-8 bg-white/90 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Meet Your Animal Friends</h2>
          <p className="text-muted-foreground text-pretty">
            Tap on the animals to say hello and hear their sounds. They love to play and cuddle!
          </p>
        </Card>

        {/* Animal Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {animals.map((animal) => (
            <Card
              key={animal.id}
              className={`p-6 cursor-pointer transition-all duration-300 hover:shadow-lg border-4 ${
                selectedAnimals.includes(animal.id) ? "border-primary shadow-lg scale-105" : "border-transparent"
              } ${interactingWith === animal.id ? "animate-gentle-bounce" : ""}`}
              onClick={() => handleAnimalSelect(animal)}
            >
              <div className="text-center space-y-4">
                <div className="text-6xl">{animal.icon}</div>
                <h3 className="text-lg font-semibold text-foreground">{animal.name}</h3>
                {selectedAnimals.includes(animal.id) && (
                  <div className="flex items-center justify-center gap-2 text-primary font-medium">
                    <span>💕</span>
                    <span>Friend</span>
                  </div>
                )}
                {interactingWith === animal.id && (
                  <div className="space-y-2">
                    <div className="text-lg font-bold text-primary">{animal.sound}</div>
                    <div className="text-sm text-muted-foreground italic">{animal.action}</div>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* Complete button */}
        {selectedAnimals.length >= 2 && (
          <div className="text-center">
            <Button onClick={onComplete} size="lg" className="rounded-xl animate-gentle-bounce">
              I feel calmer now
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
