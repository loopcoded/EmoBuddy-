"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LevelMapNode } from "./level-map-node"

interface LevelMapProps {
  currentLevel: number
  childID: string
  childName: string
  avatarConfig: Record<string, unknown>
  onStart: () => void
  unlockedEnhancements?: string[]
  autismSupportLevel: number
}

const LEVELS = [
  {
    id: 1,
    title: "Level 1 - Minimal Support",
    description: "Build foundational social skills with guided support",
    rewards: ["⭐", "🎨"],
  },
  {
    id: 2,
    title: "Level 2 - Intermediate Support",
    description: "Develop intermediate social understanding with balanced guidance",
    rewards: ["⭐", "🎭"],
  },
  {
    id: 3,
    title: "Level 3 - High Support",
    description: "Master advanced social skills with structured learning",
    rewards: ["⭐", "🎤"],
  },
]

export default function LevelMap({
  currentLevel,
  childID,
  childName,
  avatarConfig,
  onStart,
  unlockedEnhancements = [],
  autismSupportLevel,
}: LevelMapProps) {
  const router = useRouter()
  const [selectedLevel, setSelectedLevel] = useState(autismSupportLevel)

  const handleStartLevel = () => {
    router.push(`/learning-journey/${selectedLevel}`)
  }

  const displayedLevels = LEVELS.filter((level) => level.id <= autismSupportLevel)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pb-12 px-4">
      <div className="max-w-6xl mx-auto pt-12">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-mint-500 to-blue-500 bg-clip-text text-transparent mb-12 text-center text-pretty animate-fade-in">
          Your Learning Journey Awaits
        </h1>

        <div className="mb-20 bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-md p-12 rounded-3xl border-2 border-white/60 shadow-2xl">
          {/* SVG connecting path with animated lines */}
          <svg className="w-full h-96 mb-8" viewBox="0 0 1200 400" preserveAspectRatio="none">
            {/* Animated gradient defs */}
            <defs>
              <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#a3e4d7" stopOpacity="0.3" />
                <stop offset="50%" stopColor="#60d5f0" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#a3e4d7" stopOpacity="0.3" />
              </linearGradient>
            </defs>

            {displayedLevels.map((level, idx) => {
              const isLeftSide = idx % 2 === 0
              const y = 50 + idx * 100
              const x = isLeftSide ? 200 : 1000

              const nextLevel = displayedLevels[idx + 1]
              const nextIsLeftSide = (idx + 1) % 2 === 0
              const nextY = 50 + (idx + 1) * 100
              const nextX = nextIsLeftSide ? 200 : 1000

              return (
                <g key={`path-${level.id}`}>
                  {idx < displayedLevels.length - 1 && (
                    <>
                      {/* Curved connecting line */}
                      <path
                        d={`M ${x} ${y} Q ${(x + nextX) / 2} ${(y + nextY) / 2 + 50} ${nextX} ${nextY}`}
                        stroke="url(#pathGradient)"
                        strokeWidth="4"
                        fill="none"
                        strokeLinecap="round"
                        opacity="0.6"
                        className="animate-dash"
                      />
                    </>
                  )}

                  {/* Path dots */}
                  <circle
                    cx={x}
                    cy={y}
                    r="6"
                    fill={level.id <= currentLevel ? "#a3e4d7" : "#d1d5db"}
                    opacity="0.6"
                    className="animate-pulse"
                  />
                </g>
              )
            })}
          </svg>

          <div className="flex flex-col gap-16 relative">
            {displayedLevels.map((level, idx) => {
              const isLeftSide = idx % 2 === 0
              return (
                <div
                  key={level.id}
                  className={`flex ${isLeftSide ? "justify-start pl-8" : "justify-end pr-8"} animate-slide-up`}
                  style={{ animationDelay: `${idx * 150}ms` }}
                >
                  <div className="flex flex-col items-center">
                    <LevelMapNode
                      level={{
                        ...level,
                        isUnlocked: true,
                        isCurrentLevel: level.id === selectedLevel,
                        isCompleted: level.id < currentLevel,
                        rewards: level.rewards,
                      }}
                      onClick={() => setSelectedLevel(level.id)}
                    />
                    <p className="text-sm text-gray-700 font-semibold text-center mt-16 w-48">{level.title}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {selectedLevel <= autismSupportLevel && (
          <Card className="p-8 bg-gradient-to-br from-white/95 to-white/80 backdrop-blur border-2 border-mint-200 shadow-2xl mb-8 animate-fade-in">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-mint-500 to-blue-500 bg-clip-text text-transparent mb-4">
              {LEVELS[selectedLevel - 1].title}
            </h2>
            <p className="text-gray-700 mb-6 leading-relaxed text-lg">{LEVELS[selectedLevel - 1].description}</p>
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                <p className="text-sm font-semibold text-blue-900 mb-3">Activities in this level:</p>
                <ul className="space-y-2 text-gray-800">
                  <li className="flex gap-2">
                    <span className="text-mint-500">✓</span> Interactive lessons
                  </li>
                  <li className="flex gap-2">
                    <span className="text-mint-500">✓</span> Practice exercises
                  </li>
                  <li className="flex gap-2">
                    <span className="text-mint-500">✓</span> Rewards and celebrations
                  </li>
                </ul>
              </div>
              <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                <p className="text-sm font-semibold text-purple-900 mb-3">You'll earn:</p>
                <ul className="space-y-2 text-gray-800">
                  <li className="flex gap-2">
                    <span className="text-mint-500">⭐</span> Avatar decorations
                  </li>
                  <li className="flex gap-2">
                    <span className="text-mint-500">🏆</span> Achievement badges
                  </li>
                  <li className="flex gap-2">
                    <span className="text-mint-500">🔓</span> Unlock next level
                  </li>
                </ul>
              </div>
            </div>

            <Button
              onClick={handleStartLevel}
              className="w-full py-6 rounded-xl bg-gradient-to-r from-mint-400 to-blue-400 hover:from-mint-500 hover:to-blue-500 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105 active:scale-95"
            >
              Start Level {selectedLevel}
            </Button>
          </Card>
        )}
      </div>
    </div>
  )
}
