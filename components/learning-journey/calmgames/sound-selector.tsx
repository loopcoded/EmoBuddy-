"use client"

import { useRef } from "react"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface SoundSelectorProps {
  onComplete: () => void
  onBack: () => void
  durationSeconds?: number
}

export function SoundSelector({ onComplete, onBack, durationSeconds = 60 }: SoundSelectorProps) {
  const [selectedSounds, setSelectedSounds] = useState<string[]>([])
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null)
  const [totalTimeRemaining, setTotalTimeRemaining] = useState(durationSeconds)
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({})
  const completedRef = useRef(false)

  const sounds = [
    {
      id: "rain",
      name: "Gentle Rain",
      icon: "🌧️",
      description: "Soft raindrops falling",
      url: "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBg==",
      frequency: 440,
    },
    {
      id: "ocean",
      name: "Ocean Waves",
      icon: "🌊",
      description: "Peaceful waves on the shore",
      url: "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBg==",
      frequency: 220,
    },
    {
      id: "birds",
      name: "Bird Songs",
      icon: "🐦",
      description: "Happy birds chirping",
      url: "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBg==",
      frequency: 880,
    },
    {
      id: "wind",
      name: "Soft Wind",
      icon: "🍃",
      description: "Gentle breeze through trees",
      url: "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBg==",
      frequency: 330,
    },
    {
      id: "chimes",
      name: "Wind Chimes",
      icon: "🎐",
      description: "Melodic chimes in the breeze",
      url: "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBg==",
      frequency: 660,
    },
    {
      id: "stream",
      name: "Babbling Brook",
      icon: "💧",
      description: "Water flowing gently",
      url: "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBg==",
      frequency: 110,
    },
  ]

  const playSound = (sound: any) => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.setValueAtTime(sound.frequency, audioContext.currentTime)
      oscillator.type = sound.id === "birds" ? "square" : sound.id === "chimes" ? "sine" : "triangle"

      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 2)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 2)
    } catch (error) {
      console.log("[v0] Audio context not available")
    }
  }

  const handleSoundSelect = (sound: any) => {
    setSelectedSounds((prev) => {
      if (prev.includes(sound.id)) {
        return prev.filter((s) => s !== sound.id)
      } else {
        return [...prev, sound.id]
      }
    })

    playSound(sound)
    setCurrentlyPlaying(sound.id)
    setTimeout(() => setCurrentlyPlaying(null), 2000)
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Card className="p-3 bg-white/80">
            <div className="text-sm font-medium">{totalTimeRemaining}s</div>
          </Card>
          <Card className="p-3 bg-white/80">
            <div className="text-sm font-medium">Sounds Selected: {selectedSounds.length}</div>
          </Card>
        </div>

        {/* Instructions */}
        <Card className="p-6 mb-8 bg-white/90 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Choose Peaceful Sounds</h2>
          <p className="text-muted-foreground text-pretty">
            Tap on the sounds that help you feel calm and relaxed. Listen to nature's gentle music!
          </p>
        </Card>

        {/* Sound Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {sounds.map((sound) => (
            <Card
              key={sound.id}
              className={`p-6 cursor-pointer transition-all duration-300 hover:shadow-lg border-4 ${
                selectedSounds.includes(sound.id) ? "border-primary shadow-lg scale-105" : "border-transparent"
              } ${currentlyPlaying === sound.id ? "animate-pulse-gentle" : ""}`}
              onClick={() => handleSoundSelect(sound)}
            >
              <div className="text-center space-y-4">
                <div className="text-6xl">{sound.icon}</div>
                <h3 className="text-lg font-semibold text-foreground">{sound.name}</h3>
                <p className="text-sm text-muted-foreground">{sound.description}</p>
                {selectedSounds.includes(sound.id) && (
                  <div className="flex items-center justify-center gap-2 text-primary font-medium">
                    <span>🎵</span>
                    <span>Playing</span>
                  </div>
                )}
                {currentlyPlaying === sound.id && (
                  <div className="text-sm text-primary font-medium animate-pulse">♪ ♫ ♪</div>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* Next Activity Button */}
        {selectedSounds.length >= 2 && (
          <div className="flex justify-center">
            <Button
              onClick={onComplete}
              size="lg"
              className="rounded-xl bg-blue-500 hover:bg-blue-600 text-white px-8 py-6 text-lg font-semibold"
            >
              I feel calmer now
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
