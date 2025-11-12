"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { AvatarDisplay } from "@/components/avatar-generator"

interface LevelCompletionCelebrationProps {
  isOpen: boolean
  levelNumber: number
  avatarConfig: Record<string, unknown>
  childID?: string
  onNavigateToMap: () => void
}

export default function LevelCompletionCelebration({
  isOpen,
  levelNumber,
  avatarConfig,
  childID,
  onNavigateToMap,
}: LevelCompletionCelebrationProps) {
  const [isAnimating, setIsAnimating] = useState(true)

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true)
      const timer = setTimeout(() => setIsAnimating(false), 500)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  // Determine rewards based on level
  const getLevelRewards = () => {
    const rewards: Record<
      number,
      { enhancements: Array<{ icon: string; label: string }>; description: string; badge: string }
    > = {
      1: {
        enhancements: [
          { icon: "😎", label: "Cool Sunglasses" },
          { icon: "✨", label: "Celebratory Confetti" },
        ],
        description: "You've mastered the foundations of social interaction!",
        badge: "Social Starter",
      },
      2: {
        enhancements: [
          { icon: "🎩", label: "Party Hat" },
          { icon: "🌟", label: "Golden Glow Effect" },
        ],
        description: "You've reached intermediate social skills mastery!",
        badge: "Social Star",
      },
      3: {
        enhancements: [
          { icon: "👑", label: "Crown" },
          { icon: "🌈", label: "Rainbow Sparkles" },
        ],
        description: "You're a master of social interaction!",
        badge: "Social Legend",
      },
    }
    return rewards[levelNumber] || rewards[1]
  }

  const levelRewards = getLevelRewards()

  // Update level progression in database
  const handleContinueToMap = async () => {
    if (childID) {
      try {
        await fetch(`/api/child-profile/${childID}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            currentLevel: levelNumber + 1,
          }),
        })
      } catch (error) {
        console.error("Failed to update level progress:", error)
      }
    }
    onNavigateToMap()
  }

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
        className="bg-linear-to-br from-yellow-100 via-pink-100 to-blue-100 rounded-3xl p-12 max-w-2xl w-full shadow-2xl"
      >
        {/* Celebration Header */}
        <div className="text-center mb-8">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
            className="text-7xl mb-4 inline-block"
          >
            🎉
          </motion.div>
          <h1 className="text-5xl font-bold text-gray-900 mb-2">Level {levelNumber} Complete!</h1>
          <p className="text-xl text-gray-700 drop-shadow">{levelRewards.description}</p>
        </div>

        {/* Avatar with Enhancement */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
          className="flex justify-center mb-12"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-linear-to-r from-purple-400 to-pink-400 rounded-full blur-xl opacity-50" />
              <div className="relative bg-white rounded-full p-8 shadow-2xl">
              <AvatarDisplay config={avatarConfig as unknown as AvatarConfig} size="lg" />
            </div>
          </div>
        </motion.div>

        {/* Enhancements Unlocked */}
        <div className="bg-white/80 rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Avatar Enhancements Unlocked!</h2>
          <div className="grid grid-cols-2 gap-4 mb-6">
            {levelRewards.enhancements.map((enhancement, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + idx * 0.1 }}
                className="bg-linear-to-br from-purple-300 to-pink-300 rounded-xl p-4 text-center shadow-lg"
              >
                <p className="text-3xl mb-2">{enhancement.icon}</p>
                <p className="font-semibold text-gray-800 text-sm">{enhancement.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Achievement Badge */}
          <motion.div
            initial={{ rotate: -180, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ delay: 0.5, type: "spring" }}
            className="text-center p-4 bg-linear-to-r from-yellow-300 to-orange-300 rounded-xl"
          >
            <p className="text-5xl mb-2">🏆</p>
            <p className="font-bold text-lg text-gray-900">{levelRewards.badge}</p>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex gap-4"
        >
          <Button
            onClick={handleContinueToMap}
            className="flex-1 py-4 bg-linear-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-bold text-lg rounded-2xl shadow-lg"
          >
            Back to Learning Journey
          </Button>
        </motion.div>

        {/* Level Up Message */}
        {levelNumber < 3 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-6 text-center p-4 bg-white/60 rounded-xl"
          >
            <p className="text-sm font-semibold text-gray-700">
              Level {levelNumber + 1} is now unlocked! Keep going to become a Social Master!
            </p>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  )
}

interface AvatarConfig {
  seed: string
  style: string
}
