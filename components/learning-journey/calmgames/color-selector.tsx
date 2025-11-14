"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface ColorSelectorProps {
  onComplete: () => void
  onBack: () => void
}

interface FloatingBubble {
  id: number
  color: string
  x: number
  y: number
  size: number
  speed: number
}

export function ColorSelector({ onComplete, onBack }: ColorSelectorProps) {
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [backgroundGradient, setBackgroundGradient] = useState("from-blue-50 to-green-50")
  const [floatingBubbles, setFloatingBubbles] = useState<FloatingBubble[]>([])

  const colors = [
    { name: "Ocean Blue", value: "#3b82f6", gradient: "from-blue-100 to-blue-200" },
    { name: "Forest Green", value: "#10b981", gradient: "from-green-100 to-green-200" },
    { name: "Sunset Orange", value: "#f97316", gradient: "from-orange-100 to-orange-200" },
    { name: "Lavender Purple", value: "#8b5cf6", gradient: "from-purple-100 to-purple-200" },
    { name: "Rose Pink", value: "#ec4899", gradient: "from-pink-100 to-pink-200" },
    { name: "Sunny Yellow", value: "#eab308", gradient: "from-yellow-100 to-yellow-200" },
    { name: "Sky Cyan", value: "#06b6d4", gradient: "from-cyan-100 to-cyan-200" },
    { name: "Soft Gray", value: "#6b7280", gradient: "from-gray-100 to-gray-200" },
  ]

  const createFloatingBubbles = (selectedColor: string) => {
    const otherColors = colors.filter((c) => c.value !== selectedColor)
    const newBubbles: FloatingBubble[] = []

    for (let i = 0; i < 8; i++) {
      const randomColor = otherColors[Math.floor(Math.random() * otherColors.length)]
      newBubbles.push({
        id: Date.now() + i,
        color: randomColor.value,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 30 + 20,
        speed: Math.random() * 2 + 1,
      })
    }

    setFloatingBubbles(newBubbles)

    // Remove bubbles after animation
    setTimeout(() => setFloatingBubbles([]), 5000)
  }

  useEffect(() => {
    if (floatingBubbles.length === 0) return

    const interval = setInterval(() => {
      setFloatingBubbles((prev) =>
        prev
          .map((bubble) => ({
            ...bubble,
            y: bubble.y - bubble.speed,
            x: bubble.x + Math.sin(Date.now() * 0.001 + bubble.id) * 0.5,
          }))
          .filter((bubble) => bubble.y > -10),
      )
    }, 50)

    return () => clearInterval(interval)
  }, [floatingBubbles])

  const handleColorSelect = (color: any) => {
    setSelectedColors((prev) => {
      if (prev.includes(color.value)) {
        return prev.filter((c) => c !== color.value)
      } else {
        return [...prev, color.value]
      }
    })
    setBackgroundGradient(color.gradient)

    createFloatingBubbles(color.value)
  }

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${backgroundGradient} p-6 transition-all duration-1000 relative overflow-hidden`}
    >
      <div className="absolute inset-0 pointer-events-none">
        {floatingBubbles.map((bubble) => (
          <div
            key={bubble.id}
            className="absolute rounded-full opacity-60 animate-pulse"
            style={{
              left: `${bubble.x}%`,
              top: `${bubble.y}%`,
              width: `${bubble.size}px`,
              height: `${bubble.size}px`,
              backgroundColor: bubble.color,
              transform: "translate(-50%, -50%)",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            }}
          />
        ))}
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Button variant="outline" onClick={onBack} className="rounded-xl bg-white/80">
            ← Back
          </Button>
          <Card className="p-3 bg-white/80">
            <div className="text-sm font-medium">Colors Selected: {selectedColors.length}</div>
          </Card>
        </div>

        {/* Instructions */}
        <Card className="p-6 mb-8 bg-white/90 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Choose Your Favorite Colors</h2>
          <p className="text-muted-foreground text-pretty">
            Tap on the colors that make you feel happy and peaceful. Watch the magical bubbles appear!
          </p>
        </Card>

        {/* Color Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {colors.map((color) => (
            <Card
              key={color.value}
              className={`p-6 cursor-pointer transition-all duration-300 hover:shadow-lg border-4 ${
                selectedColors.includes(color.value) ? "border-primary shadow-lg scale-105" : "border-transparent"
              }`}
              onClick={() => handleColorSelect(color)}
            >
              <div className="text-center space-y-3">
                <div className="w-16 h-16 rounded-full mx-auto shadow-lg" style={{ backgroundColor: color.value }} />
                <h3 className="text-sm font-semibold text-foreground">{color.name}</h3>
                {selectedColors.includes(color.value) && <div className="text-lg">✨</div>}
              </div>
            </Card>
          ))}
        </div>

        {/* Selected Colors Display */}
        {selectedColors.length > 0 && (
          <Card className="p-6 mb-8 bg-white/90">
            <h3 className="text-lg font-semibold text-center mb-4">Your Peaceful Color Palette</h3>
            <div className="flex justify-center gap-2 flex-wrap">
              {selectedColors.map((color, index) => (
                <div key={index} className="w-12 h-12 rounded-full shadow-md" style={{ backgroundColor: color }} />
              ))}
            </div>
          </Card>
        )}

        {/* Complete button */}
        {selectedColors.length >= 2 && (
          <div className="text-center">
            <Button onClick={onComplete} size="lg" className="rounded-xl animate-gentle-bounce">
              🌈 These Colors Make Me Happy
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
