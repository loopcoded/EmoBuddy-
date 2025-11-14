"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Mascot } from "@/components/learning-journey/calmgames/mascot"
import { usePoints, type ColorItem } from "../../../hooks/use-points"

const availableColors: ColorItem[] = [
  { id: "red", name: "Cherry Red", color: "#ef4444", cost: 10, owned: false },
  { id: "blue", name: "Ocean Blue", color: "#3b82f6", cost: 10, owned: false },
  { id: "green", name: "Forest Green", color: "#22c55e", cost: 10, owned: false },
  { id: "yellow", name: "Sunshine Yellow", color: "#eab308", cost: 15, owned: false },
  { id: "purple", name: "Magic Purple", color: "#a855f7", cost: 15, owned: false },
  { id: "orange", name: "Sunset Orange", color: "#f97316", cost: 15, owned: false },
  { id: "pink", name: "Cotton Candy Pink", color: "#ec4899", cost: 20, owned: false },
  { id: "teal", name: "Tropical Teal", color: "#14b8a6", cost: 20, owned: false },
]

const drawingTemplates = [
  { id: "butterfly", name: "Beautiful Butterfly", cost: 0, description: "FREE!" },
  { id: "flower", name: "Happy Flower", cost: 3, description: "3 ⭐" },
  { id: "house", name: "Cozy House", cost: 5, description: "5 ⭐" },
  { id: "tree", name: "Magic Tree", cost: 4, description: "4 ⭐" },
  { id: "car", name: "Fun Car", cost: 6, description: "6 ⭐" },
]

interface ColorShopProps {
  onBackToWelcome: () => void
  onStartColoring: () => void
}

export function ColorShop({ onBackToWelcome, onStartColoring }: ColorShopProps) {
  const { points, buyColor, hasColor, buyDrawing, hasDrawing } = usePoints()
  const [purchaseAnimation, setPurchaseAnimation] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"colors" | "drawings">("colors")

  const handleBuyColor = (color: ColorItem) => {
    if (buyColor(color.id, color.cost)) {
      setPurchaseAnimation(color.id)
      setTimeout(() => setPurchaseAnimation(null), 1500)
    }
  }

  const handleBuyDrawing = (drawing: (typeof drawingTemplates)[0]) => {
    if (buyDrawing(drawing.id, drawing.cost)) {
      setPurchaseAnimation(drawing.id)
      setTimeout(() => setPurchaseAnimation(null), 1500)
    }
  }

  const ownedColorsCount = availableColors.filter((color) => hasColor(color.id)).length
  const ownedDrawingsCount = drawingTemplates.filter((drawing) => hasDrawing(drawing.id)).length

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Button variant="outline" onClick={onBackToWelcome} className="rounded-xl bg-transparent">
            ← Back to Home
          </Button>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-xl">
              <span className="text-2xl">⭐</span>
              <span className="font-bold text-primary">{points}</span>
            </div>
            {ownedColorsCount > 0 && ownedDrawingsCount > 0 && (
              <Button onClick={onStartColoring} className="rounded-xl">
                🎨 Start Coloring
              </Button>
            )}
          </div>
        </div>

        {/* Mascot guidance */}
        <div className="flex justify-center mb-8">
          <Mascot
            message="Use your stars to buy beautiful colors and drawings! Then you can paint amazing pictures!"
            emotion="excited"
            size="medium"
          />
        </div>

        <div className="flex justify-center mb-6">
          <div className="bg-secondary/20 p-1 rounded-xl">
            <Button
              variant={activeTab === "colors" ? "default" : "ghost"}
              onClick={() => setActiveTab("colors")}
              className="rounded-lg"
            >
              🎨 Colors
            </Button>
            <Button
              variant={activeTab === "drawings" ? "default" : "ghost"}
              onClick={() => setActiveTab("drawings")}
              className="rounded-lg"
            >
              📝 Drawings
            </Button>
          </div>
        </div>

        {activeTab === "colors" ? (
          /* Color Shop */
          <Card className="p-8">
            <h2 className="text-3xl font-bold text-center mb-8 text-foreground">🎨 Color Shop</h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {availableColors.map((color) => {
                const owned = hasColor(color.id)
                const canAfford = points >= color.cost
                const isAnimating = purchaseAnimation === color.id

                return (
                  <Card
                    key={color.id}
                    className={`p-4 text-center transition-all duration-300 ${
                      owned
                        ? "bg-primary/10 border-primary/30"
                        : canAfford
                          ? "hover:shadow-lg cursor-pointer"
                          : "opacity-50"
                    } ${isAnimating ? "animate-pulse scale-105" : ""}`}
                  >
                    <div
                      className="w-16 h-16 rounded-full mx-auto mb-3 border-4 border-white shadow-lg"
                      style={{ backgroundColor: color.color }}
                    />
                    <h3 className="font-semibold text-sm mb-2">{color.name}</h3>

                    {owned ? (
                      <div className="text-primary font-bold">✓ Owned</div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex items-center justify-center gap-1 text-sm">
                          <span>{color.cost}</span>
                          <span className="text-lg">⭐</span>
                        </div>
                        <Button
                          size="sm"
                          disabled={!canAfford}
                          onClick={() => handleBuyColor(color)}
                          className="w-full rounded-lg"
                        >
                          {canAfford ? "Buy" : "Need more ⭐"}
                        </Button>
                      </div>
                    )}
                  </Card>
                )
              })}
            </div>

            {ownedColorsCount === 0 && (
              <div className="text-center mt-8 p-6 bg-secondary/20 rounded-xl">
                <p className="text-muted-foreground">
                  Play social skills games to earn stars and buy your first colors! 🌟
                </p>
              </div>
            )}
          </Card>
        ) : (
          /* Added Drawing Shop */
          <Card className="p-8">
            <h2 className="text-3xl font-bold text-center mb-8 text-foreground">📝 Drawing Shop</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {drawingTemplates.map((drawing) => {
                const owned = hasDrawing(drawing.id)
                const canAfford = points >= drawing.cost
                const isAnimating = purchaseAnimation === drawing.id
                const isFree = drawing.cost === 0

                return (
                  <Card
                    key={drawing.id}
                    className={`p-6 text-center transition-all duration-300 ${
                      owned
                        ? "bg-primary/10 border-primary/30"
                        : canAfford || isFree
                          ? "hover:shadow-lg cursor-pointer"
                          : "opacity-50"
                    } ${isAnimating ? "animate-pulse scale-105" : ""}`}
                  >
                    <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl mx-auto mb-4 flex items-center justify-center text-3xl">
                      {drawing.id === "butterfly" && "🦋"}
                      {drawing.id === "flower" && "🌸"}
                      {drawing.id === "house" && "🏠"}
                      {drawing.id === "tree" && "🌳"}
                      {drawing.id === "car" && "🚗"}
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{drawing.name}</h3>

                    {owned ? (
                      <div className="text-primary font-bold">✓ Owned</div>
                    ) : (
                      <div className="space-y-2">
                        <div className="text-sm font-medium">
                          {isFree ? (
                            <span className="text-green-600 font-bold">FREE!</span>
                          ) : (
                            <span>{drawing.description}</span>
                          )}
                        </div>
                        <Button
                          size="sm"
                          disabled={!canAfford && !isFree}
                          onClick={() => handleBuyDrawing(drawing)}
                          className="w-full rounded-lg"
                        >
                          {isFree ? "Get Free!" : canAfford ? "Buy" : "Need more ⭐"}
                        </Button>
                      </div>
                    )}
                  </Card>
                )
              })}
            </div>

            {ownedDrawingsCount === 0 && (
              <div className="text-center mt-8 p-6 bg-secondary/20 rounded-xl">
                <p className="text-muted-foreground">
                  Get your first drawing for free! Then earn more stars to unlock others! 🎨
                </p>
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  )
}
