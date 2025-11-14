"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LevelMapNode } from "./level-map-node"
import { motion } from "framer-motion"

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
    icon: "🌱",
    color: "from-green-400 to-emerald-500"
  },
  {
    id: 2,
    title: "Level 2 - Intermediate Support",
    description: "Develop intermediate social understanding with balanced guidance",
    rewards: ["⭐", "🎭"],
    icon: "🌿",
    color: "from-blue-400 to-cyan-500"
  },
  {
    id: 3,
    title: "Level 3 - High Support",
    description: "Master advanced social skills with structured learning",
    rewards: ["⭐", "🎤"],
    icon: "🌳",
    color: "from-purple-400 to-pink-500"
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
  const [showConfetti, setShowConfetti] = useState(false)

  const handleStartLevel = () => {
    setShowConfetti(true)
    setTimeout(() => {
      router.push(`/learning-journey/${selectedLevel}`)
    }, 800)
  }

  const displayedLevels = LEVELS.filter((level) => level.id <= autismSupportLevel)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pb-12 px-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 30 + 20}px`,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 360],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          >
            {['⭐', '✨', '🌟', '💫', '🎯'][Math.floor(Math.random() * 5)]}
          </motion.div>
        ))}
      </div>

      <div className="max-w-6xl mx-auto pt-12 relative z-10">
        <motion.h1 
          className="text-6xl font-black bg-gradient-to-r from-mint-500 via-blue-500 to-purple-500 bg-clip-text text-transparent mb-12 text-center"
          initial={{ opacity: 0, y: -50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
        >
          <motion.span
            animate={{ 
              textShadow: [
                "0 0 20px rgba(0,191,165,0.3)",
                "0 0 40px rgba(66,165,245,0.5)",
                "0 0 20px rgba(0,191,165,0.3)"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Your Learning Journey Awaits
          </motion.span>
          <motion.span
            className="block text-3xl mt-4"
            animate={{ 
              y: [0, -10, 0],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🚀✨
          </motion.span>
        </motion.h1>

        <motion.div 
          className="mb-20 bg-gradient-to-br from-white/90 to-white/60 backdrop-blur-lg p-12 rounded-3xl border-4 border-white/70 shadow-2xl relative overflow-hidden"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          {/* Animated corner decorations */}
          <motion.div
            className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-mint-300/30 to-transparent rounded-br-full"
            animate={{ rotate: [0, 90, 0] }}
            transition={{ duration: 10, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-blue-300/30 to-transparent rounded-tl-full"
            animate={{ rotate: [0, -90, 0] }}
            transition={{ duration: 10, repeat: Infinity }}
          />

          {/* Enhanced SVG Path */}
          <svg className="w-full h-96 mb-8" viewBox="0 0 1200 400" preserveAspectRatio="none">
            <defs>
              <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#a3e4d7" stopOpacity="0.5">
                  <animate attributeName="stop-color" values="#a3e4d7; #60d5f0; #a3e4d7" dur="3s" repeatCount="indefinite" />
                </stop>
                <stop offset="50%" stopColor="#60d5f0" stopOpacity="0.8">
                  <animate attributeName="stop-color" values="#60d5f0; #a855f7; #60d5f0" dur="3s" repeatCount="indefinite" />
                </stop>
                <stop offset="100%" stopColor="#a3e4d7" stopOpacity="0.5">
                  <animate attributeName="stop-color" values="#a3e4d7; #60d5f0; #a3e4d7" dur="3s" repeatCount="indefinite" />
                </stop>
              </linearGradient>
              
              <filter id="glow">
                <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
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
                      <path
                        d={`M ${x} ${y} Q ${(x + nextX) / 2} ${(y + nextY) / 2 + 50} ${nextX} ${nextY}`}
                        stroke="url(#pathGradient)"
                        strokeWidth="6"
                        fill="none"
                        strokeLinecap="round"
                        filter="url(#glow)"
                        strokeDasharray="10,5"
                      >
                        <animate
                          attributeName="stroke-dashoffset"
                          from="0"
                          to="30"
                          dur="2s"
                          repeatCount="indefinite"
                        />
                      </path>
                    </>
                  )}

                  <circle
                    cx={x}
                    cy={y}
                    r="8"
                    fill={level.id <= currentLevel ? "#a3e4d7" : "#d1d5db"}
                    filter="url(#glow)"
                  >
                    <animate
                      attributeName="r"
                      values="8;12;8"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                  </circle>
                </g>
              )
            })}
          </svg>

          <div className="flex flex-col gap-20 relative">
            {displayedLevels.map((level, idx) => {
              const isLeftSide = idx % 2 === 0
              return (
                <motion.div
                  key={level.id}
                  className={`flex ${isLeftSide ? "justify-start pl-8" : "justify-end pr-8"}`}
                  initial={{ opacity: 0, x: isLeftSide ? -100 : 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.2, type: "spring" }}
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
                    <motion.div
                      className="mt-6 text-center"
                      whileHover={{ scale: 1.05 }}
                    >
                      <motion.p 
                        className="text-2xl mb-2"
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, delay: idx * 0.3 }}
                      >
                        {level.icon}
                      </motion.p>
                      <p className="text-base text-gray-800 font-bold w-56">{level.title}</p>
                    </motion.div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {selectedLevel <= autismSupportLevel && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring" }}
          >
            <Card className="p-10 bg-gradient-to-br from-white/95 to-white/85 backdrop-blur-lg border-4 border-mint-200 shadow-2xl mb-8 relative overflow-hidden">
              {/* Animated background shine */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{ x: [-500, 1000] }}
                transition={{ duration: 3, repeat: Infinity, repeatDelay: 1 }}
              />

              <div className="relative z-10">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-4 mb-6"
                >
                  <motion.span
                    className="text-5xl"
                    animate={{ 
                      rotate: [0, 15, -15, 0],
                      scale: [1, 1.2, 1]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {LEVELS[selectedLevel - 1].icon}
                  </motion.span>
                  <h2 className={`text-4xl font-black bg-gradient-to-r ${LEVELS[selectedLevel - 1].color} bg-clip-text text-transparent`}>
                    {LEVELS[selectedLevel - 1].title}
                  </h2>
                </motion.div>

                <p className="text-gray-700 mb-8 leading-relaxed text-xl font-medium">
                  {LEVELS[selectedLevel - 1].description}
                </p>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <motion.div 
                    className="p-6 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl border-2 border-blue-300 shadow-lg relative overflow-hidden"
                    whileHover={{ scale: 1.02, rotate: -1 }}
                  >
                    <motion.div
                      className="absolute top-0 right-0 text-6xl opacity-10"
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 20, repeat: Infinity }}
                    >
                      📚
                    </motion.div>
                    <p className="text-base font-black text-blue-900 mb-4 flex items-center gap-2">
                      <span className="text-2xl">🎯</span> Activities in this level:
                    </p>
                    <ul className="space-y-3 text-gray-800 relative z-10">
                      {["Interactive lessons", "Practice exercises", "Rewards and celebrations"].map((item, i) => (
                        <motion.li 
                          key={i}
                          className="flex gap-3 items-center font-semibold"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                        >
                          <motion.span 
                            className="text-mint-500 text-xl"
                            animate={{ scale: [1, 1.3, 1] }}
                            transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                          >
                            ✓
                          </motion.span>
                          {item}
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>

                  <motion.div 
                    className="p-6 bg-gradient-to-br from-purple-100 to-pink-200 rounded-2xl border-2 border-purple-300 shadow-lg relative overflow-hidden"
                    whileHover={{ scale: 1.02, rotate: 1 }}
                  >
                    <motion.div
                      className="absolute top-0 right-0 text-6xl opacity-10"
                      animate={{ rotate: [0, -360] }}
                      transition={{ duration: 20, repeat: Infinity }}
                    >
                      🏆
                    </motion.div>
                    <p className="text-base font-black text-purple-900 mb-4 flex items-center gap-2">
                      <span className="text-2xl">🎁</span> You'll earn:
                    </p>
                    <ul className="space-y-3 text-gray-800 relative z-10">
                      {[
                        { icon: "⭐", text: "Avatar decorations" },
                        { icon: "🏆", text: "Achievement badges" },
                        { icon: "🔓", text: "Unlock next level" }
                      ].map((item, i) => (
                        <motion.li 
                          key={i}
                          className="flex gap-3 items-center font-semibold"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 + 0.2 }}
                        >
                          <motion.span 
                            className="text-xl"
                            animate={{ 
                              rotate: [0, 20, -20, 0],
                              scale: [1, 1.2, 1]
                            }}
                            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
                          >
                            {item.icon}
                          </motion.span>
                          {item.text}
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                </div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={handleStartLevel}
                    className="w-full py-8 rounded-2xl bg-gradient-to-r from-mint-400 via-blue-400 to-purple-400 hover:from-mint-500 hover:via-blue-500 hover:to-purple-500 text-white font-black text-2xl shadow-2xl relative overflow-hidden group"
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                      animate={{ x: [-200, 400] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 0.5 }}
                    />
                    <span className="relative z-10 flex items-center justify-center gap-3">
                      Start Level {selectedLevel}
                      <motion.span
                        animate={{ x: [0, 10, 0] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        🚀
                      </motion.span>
                    </span>
                  </Button>
                </motion.div>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  )
}