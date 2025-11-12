"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface RewardCelebrationProps {
  childID: string
  levelCompleted: number
  rewards: string[]
  avatarUpgrades: string[]
  onClose: () => void
}

export default function RewardCelebration({
  childID,
  levelCompleted,
  rewards,
  avatarUpgrades,
  onClose,
}: RewardCelebrationProps) {
  const [isAnimating, setIsAnimating] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsAnimating(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <Card
        className={`p-12 bg-gradient-to-br from-yellow-100 via-pink-100 to-blue-100 border-0 shadow-2xl max-w-2xl transform transition-all ${isAnimating ? "scale-95 opacity-0" : "scale-100 opacity-100"}`}
      >
        <div className="text-center">
          <div className="text-6xl mb-8 animate-bounce">🎉</div>

          <h1 className="text-4xl font-bold text-gray-800 mb-2">Level {levelCompleted} Completed!</h1>
          <p className="text-lg text-gray-600 mb-8">Amazing work! You've earned fantastic rewards!</p>

          {/* Rewards Display */}
          <div className="mb-8 p-6 bg-white/80 rounded-2xl">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Your Rewards</h3>
            <div className="grid grid-cols-2 gap-4">
              {rewards.map((reward, idx) => (
                <div key={idx} className="p-4 bg-gradient-to-br from-mint-200 to-blue-200 rounded-xl">
                  <p className="text-2xl">{reward}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Avatar Upgrades */}
          <div className="mb-8 p-6 bg-white/80 rounded-2xl">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Avatar Enhancements Unlocked!</h3>
            <div className="flex flex-wrap gap-3 justify-center">
              {avatarUpgrades.map((upgrade, idx) => (
                <span
                  key={idx}
                  className="px-4 py-2 bg-gradient-to-r from-purple-300 to-pink-300 rounded-full text-sm font-semibold text-gray-800"
                >
                  {upgrade}
                </span>
              ))}
            </div>
          </div>

          <Button
            onClick={onClose}
            className="px-12 py-4 text-lg font-bold rounded-full bg-gradient-to-r from-mint-400 to-blue-400 hover:from-mint-500 hover:to-blue-500 text-white shadow-lg"
          >
            Continue
          </Button>
        </div>
      </Card>
    </div>
  )
}
