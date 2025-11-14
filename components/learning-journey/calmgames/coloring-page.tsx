"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Mascot } from "@/components/learning-journey/calmgames/mascot"
import { usePoints } from "../../../hooks/use-points"

const coloringTemplates = [
  {
    id: "butterfly",
    name: "Beautiful Butterfly",
    paths: [
      // Left wing upper
      "M30 25 Q20 15 15 25 Q10 35 15 40 Q25 45 35 40 Q40 35 35 30 Q30 25 30 25 Z",
      // Left wing lower
      "M30 40 Q20 45 15 55 Q10 65 20 70 Q30 65 35 55 Q40 50 35 45 Q30 40 30 40 Z",
      // Right wing upper
      "M70 25 Q80 15 85 25 Q90 35 85 40 Q75 45 65 40 Q60 35 65 30 Q70 25 70 25 Z",
      // Right wing lower
      "M70 40 Q80 45 85 55 Q90 65 80 70 Q70 65 65 55 Q60 50 65 45 Q70 40 70 40 Z",
      // Body
      "M50 20 Q48 15 50 10 Q52 15 50 20 L50 75 Q48 80 50 85 Q52 80 50 75 Z",
      // Antennae
      "M48 12 Q45 8 43 5 M52 12 Q55 8 57 5",
      // Wing patterns
      "M25 30 Q20 25 25 35 M75 30 Q80 25 75 35 M25 55 Q20 50 25 60 M75 55 Q80 50 75 60",
    ],
  },
  {
    id: "flower",
    name: "Happy Flower",
    paths: [
      // Center
      "M50 40 A8 8 0 1 1 50 41 Z",
      // Petals
      "M50 32 Q45 25 40 32 Q45 40 50 32 Z",
      "M58 36 Q65 31 70 38 Q63 45 58 36 Z",
      "M58 44 Q65 51 58 58 Q50 51 58 44 Z",
      "M42 44 Q35 51 42 58 Q50 51 42 44 Z",
      "M42 36 Q35 31 30 38 Q37 45 42 36 Z",
      // Stem
      "M50 58 L50 85 Q48 87 50 89 Q52 87 50 85",
      // Leaves
      "M45 70 Q35 65 30 75 Q35 80 45 75 Q50 70 45 70 Z",
      "M55 75 Q65 70 70 80 Q65 85 55 80 Q50 75 55 75 Z",
      // Face
      "M46 38 A2 2 0 1 1 46 39 Z M54 38 A2 2 0 1 1 54 39 Z",
      "M48 42 Q50 44 52 42",
    ],
  },
  {
    id: "house",
    name: "Cozy House",
    paths: [
      // Main house
      "M20 60 L50 30 L80 60 L80 85 L20 85 Z",
      // Door
      "M40 70 L40 85 L50 85 L50 70 Q45 68 40 70 Z",
      // Door knob
      "M48 77 A1 1 0 1 1 48 78 Z",
      // Windows
      "M30 50 L40 50 L40 60 L30 60 Z M35 50 L35 60 M30 55 L40 55",
      "M60 50 L70 50 L70 60 L60 60 Z M65 50 L65 60 M60 55 L70 55",
      // Chimney
      "M65 35 L65 25 L72 25 L72 40",
      // Smoke
      "M68 25 Q70 20 68 15 Q66 10 68 5",
      // Roof details
      "M25 58 L75 58",
    ],
  },
  {
    id: "tree",
    name: "Magic Tree",
    paths: [
      // Trunk
      "M45 85 L55 85 L54 60 L46 60 Z",
      // Tree rings
      "M47 70 Q50 68 53 70 M47 75 Q50 73 53 75 M47 80 Q50 78 53 80",
      // Main foliage
      "M50 60 Q35 45 25 55 Q20 40 35 35 Q30 25 45 30 Q40 15 55 20 Q60 10 70 25 Q75 15 80 30 Q85 25 75 40 Q80 45 70 55 Q75 60 65 65 Q70 70 55 65 Q60 75 45 70 Q40 75 35 65 Q30 70 25 55",
      // Leaves details
      "M35 45 Q40 40 45 45 M55 35 Q60 30 65 35 M45 50 Q50 45 55 50 M40 55 Q45 50 50 55",
      // Apples
      "M40 40 A3 3 0 1 1 40 41 Z M60 45 A3 3 0 1 1 60 46 Z M55 55 A3 3 0 1 1 55 56 Z",
      // Apple stems
      "M41 40 L41 37 M61 45 L61 42 M56 55 L56 52",
    ],
  },
  {
    id: "car",
    name: "Fun Car",
    paths: [
      // Main body
      "M15 65 L85 65 L85 55 L75 55 L75 45 L70 40 L30 40 L25 45 L25 55 L15 55 Z",
      // Windshield
      "M30 45 L70 45 L65 50 L35 50 Z",
      // Side windows
      "M32 47 L42 47 L40 49 L34 49 Z M58 47 L68 47 L66 49 L60 49 Z",
      // Wheels
      "M25 70 A8 8 0 1 1 25 71 Z M75 70 A8 8 0 1 1 75 71 Z",
      // Wheel centers
      "M25 70 A3 3 0 1 1 25 71 Z M75 70 A3 3 0 1 1 75 71 Z",
      // Headlights
      "M15 58 A3 3 0 1 1 15 59 Z M85 58 A3 3 0 1 1 85 59 Z",
      // Bumper
      "M12 62 L88 62",
      // Door handle
      "M45 52 L47 52",
      // License plate
      "M40 62 L60 62 L60 64 L40 64 Z",
    ],
  },
]

interface ColoringPageProps {
  onBackToShop: () => void
}

export function ColoringPage({ onBackToShop }: ColoringPageProps) {
  const { ownedColors, ownedDrawings } = usePoints()
  const [selectedColor, setSelectedColor] = useState<string>("#000000")
  const [selectedTemplate, setSelectedTemplate] = useState(0)
  const [pathColors, setPathColors] = useState<{ [key: string]: string }>({})
  const [showCompleteAnimation, setShowCompleteAnimation] = useState(false)

  const availableColors = [
    { id: "red", color: "#ef4444" },
    { id: "blue", color: "#3b82f6" },
    { id: "green", color: "#22c55e" },
    { id: "yellow", color: "#eab308" },
    { id: "purple", color: "#a855f7" },
    { id: "orange", color: "#f97316" },
    { id: "pink", color: "#ec4899" },
    { id: "teal", color: "#14b8a6" },
  ].filter((color) => ownedColors.includes(color.id))

  const availableTemplates = coloringTemplates.filter((template) => ownedDrawings.includes(template.id))

  const currentTemplate = availableTemplates[selectedTemplate] || availableTemplates[0]

  const handlePathClick = (pathIndex: number) => {
    if (!currentTemplate) return
    const pathKey = `${currentTemplate.id}-${pathIndex}`
    setPathColors((prev) => ({
      ...prev,
      [pathKey]: selectedColor,
    }))
  }

  const handleComplete = () => {
    setShowCompleteAnimation(true)
    setTimeout(() => setShowCompleteAnimation(false), 3000)
  }

  if (availableTemplates.length === 0 || availableColors.length === 0) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <Button variant="outline" onClick={onBackToShop} className="rounded-xl bg-transparent">
              ← Back to Shop
            </Button>
          </div>

          <div className="flex justify-center mb-8">
            <Mascot
              message="You need to buy some colors and drawings first! Let's go shopping!"
              emotion="encouraging"
              size="medium"
            />
          </div>

          <Card className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Color?</h2>
            <p className="text-muted-foreground mb-6">
              {availableColors.length === 0 && availableTemplates.length === 0
                ? "You need both colors and drawings to start coloring!"
                : availableColors.length === 0
                  ? "You need some colors to paint with!"
                  : "You need some drawings to color!"}
            </p>
            <Button onClick={onBackToShop} className="rounded-xl">
              Go to Shop 🛒
            </Button>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Button variant="outline" onClick={onBackToShop} className="rounded-xl bg-transparent">
            ← Back to Shop
          </Button>
          <Button onClick={handleComplete} className="rounded-xl">
            ✨ I'm Done!
          </Button>
        </div>

        {/* Mascot guidance */}
        <div className="flex justify-center mb-8">
          <Mascot
            message="Choose your colors and tap on the picture to paint! Have fun creating!"
            emotion="excited"
            size="medium"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Coloring Canvas */}
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4 text-center">{currentTemplate?.name}</h3>

            <div className="bg-white rounded-lg p-4 border-2 border-dashed border-gray-300">
              <svg viewBox="0 0 100 100" className="w-full h-64 cursor-pointer">
                {currentTemplate?.paths.map((path, index) => (
                  <path
                    key={index}
                    d={path}
                    fill={pathColors[`${currentTemplate.id}-${index}`] || "white"}
                    stroke="#333"
                    strokeWidth="1"
                    onClick={() => handlePathClick(index)}
                    className="hover:opacity-80 transition-opacity"
                  />
                ))}
              </svg>
            </div>

            {/* Template selector */}
            {availableTemplates.length > 1 && (
              <div className="flex gap-2 mt-4 justify-center flex-wrap">
                {availableTemplates.map((template, index) => (
                  <Button
                    key={template.id}
                    variant={selectedTemplate === index ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedTemplate(index)}
                    className="rounded-lg"
                  >
                    {template.name}
                  </Button>
                ))}
              </div>
            )}
          </Card>

          {/* Color Palette */}
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4 text-center">Your Colors</h3>

            <div className="grid grid-cols-3 gap-3">
              {availableColors.map((color) => (
                <button
                  key={color.id}
                  className={`w-16 h-16 rounded-full border-4 transition-all duration-200 ${
                    selectedColor === color.color
                      ? "border-primary scale-110 shadow-lg"
                      : "border-white hover:scale-105"
                  }`}
                  style={{ backgroundColor: color.color }}
                  onClick={() => setSelectedColor(color.color)}
                />
              ))}
            </div>

            {/* Instructions */}
            <div className="mt-6 p-4 bg-primary/5 rounded-xl">
              <h4 className="font-semibold mb-2">How to Color:</h4>
              <ol className="text-sm space-y-1 text-muted-foreground">
                <li>1. Pick a color from your palette</li>
                <li>2. Tap on parts of the picture</li>
                <li>3. Watch it fill with color!</li>
                <li>4. Try different templates</li>
              </ol>
            </div>
          </Card>
        </div>

        {/* Completion Animation */}
        {showCompleteAnimation && (
          <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 pointer-events-none">
            <Card className="p-8 text-center bg-white shadow-xl">
              <div className="text-6xl mb-4 animate-bounce">🎨</div>
              <h3 className="text-2xl font-bold text-primary mb-2">Amazing Work!</h3>
              <p className="text-muted-foreground">Your artwork is beautiful!</p>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
