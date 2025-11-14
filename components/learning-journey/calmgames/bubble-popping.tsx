"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface Bubble {
  id: number
  x: number
  y: number
  size: number
  color: string
  speed: number
}

interface BubblePoppingProps {
  onComplete: () => void
  onBack: () => void
  durationSeconds?: number
}

export function BubblePopping({ onComplete, onBack, durationSeconds = 60 }: BubblePoppingProps) {
  const [bubbles, setBubbles] = useState<Bubble[]>([])
  const [poppedCount, setPoppedCount] = useState(0)
  const [isActive, setIsActive] = useState(true)
  const [totalTimeRemaining, setTotalTimeRemaining] = useState(durationSeconds)
  const completedRef = useRef(false)

  const colors = ["#93c5fd", "#a7f3d0", "#fde68a", "#f9a8d4", "#c4b5fd", "#fed7aa"]

  const createBubble = useCallback(() => {
    const newBubble: Bubble = {
      id: Math.random(),
      x: Math.random() * (window.innerWidth - 100),
      y: window.innerHeight + 50,
      size: 40 + Math.random() * 60,
      color: colors[Math.floor(Math.random() * colors.length)],
      speed: 1 + Math.random() * 2,
    }
    return newBubble
  }, [])

  useEffect(() => {
    if (!isActive) return

    const interval = setInterval(() => {
      setBubbles((prev) => {
        const filtered = prev.filter((bubble) => bubble.y > -100)
        const newBubble = createBubble()
        return [...filtered, newBubble]
      })
    }, 800)

    return () => clearInterval(interval)
  }, [isActive, createBubble])

  useEffect(() => {
    if (!isActive) return

    const animationFrame = setInterval(() => {
      setBubbles((prev) =>
        prev.map((bubble) => ({
          ...bubble,
          y: bubble.y - bubble.speed,
        })),
      )
    }, 16)

    return () => clearInterval(animationFrame)
  }, [isActive])

  useEffect(() => {
    const interval = setInterval(() => {
      setTotalTimeRemaining((prev) => {
        const newValue = prev - 1
        if (newValue <= 0 && !completedRef.current) {
          completedRef.current = true
          setIsActive(false)
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

  const popBubble = (id: number) => {
    setBubbles((prev) => prev.filter((bubble) => bubble.id !== id))
    setPoppedCount((prev) => prev + 1)

    // Play pop sound effect (visual feedback)
    const popElement = document.createElement("div")
    popElement.textContent = "POP!"
    popElement.style.position = "fixed"
    popElement.style.fontSize = "24px"
    popElement.style.fontWeight = "bold"
    popElement.style.color = "#84cc16"
    popElement.style.pointerEvents = "none"
    popElement.style.zIndex = "1000"
    document.body.appendChild(popElement)

    setTimeout(() => {
      document.body.removeChild(popElement)
    }, 500)
  }

  const handleComplete = () => {
    if (!completedRef.current) {
      completedRef.current = true
      setIsActive(false)
      onComplete()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-cyan-100 relative overflow-hidden">
      {/* Header */}
      <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-center">
        <Button variant="outline" onClick={onBack} className="rounded-xl bg-white/80">
          ← Back
        </Button>
        <Card className="p-3 bg-white/80">
          <div className="text-sm font-medium">{totalTimeRemaining}s</div>
        </Card>
        <Card className="p-3 bg-white/80">
          <div className="text-sm font-medium">Bubbles Popped: {poppedCount}</div>
        </Card>
      </div>

      {/* Instructions */}
      <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-10">
        <Card className="p-4 bg-white/90 text-center">
          <p className="text-sm font-medium text-foreground">Tap the bubbles to pop them and feel calm!</p>
        </Card>
      </div>

      {/* Bubbles */}
      {bubbles.map((bubble) => (
        <div
          key={bubble.id}
          className="absolute cursor-pointer transition-transform hover:scale-110 animate-float"
          style={{
            left: bubble.x,
            top: bubble.y,
            width: bubble.size,
            height: bubble.size,
          }}
          onClick={() => popBubble(bubble.id)}
        >
          <div
            className="w-full h-full rounded-full opacity-80 shadow-lg"
            style={{
              background: `radial-gradient(circle at 30% 30%, ${bubble.color}aa, ${bubble.color}44)`,
              border: `2px solid ${bubble.color}`,
            }}
          />
        </div>
      ))}

      {/* Complete button */}
      {poppedCount >= 10 && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
          <Button onClick={handleComplete} size="lg" className="rounded-xl animate-gentle-bounce">
            🌟 I Feel Calmer Now
          </Button>
        </div>
      )}
    </div>
  )
}
