"use client"

import { motion } from "framer-motion"

interface RewardPopupProps {
  isOpen: boolean
  score: number
  totalScenarios: number
  gameTitle: string
  onDecorate: () => void
  onSkip: () => void
}

export default function RewardPopup({
  isOpen,
  score,
  totalScenarios,
  gameTitle,
  onDecorate,
  onSkip,
}: RewardPopupProps) {
  const calculateReward = () => {
    const percentage = (score / totalScenarios) * 100
    if (percentage === 100) return { stars: 3, coins: 50, badge: "Master" }
    if (percentage >= 80) return { stars: 2, coins: 30, badge: "Great" }
    if (percentage >= 60) return { stars: 1, coins: 10, badge: "Good" }
    return { stars: 0, coins: 5, badge: "Try Again" }
  }

  const reward = calculateReward()

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
    >
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="bg-linear-to-br from-yellow-300 via-orange-300 to-pink-300 rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl"
      >
        {/* Celebration Emojis */}
        <div className="text-center mb-6">
          <motion.div
            animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
            className="text-8xl mb-4"
          >
            🎉
          </motion.div>
          <p className="text-3xl font-bold text-white drop-shadow-lg">You Won!</p>
        </div>

        {/* Game Title */}
        <p className="text-center text-xl font-bold text-white drop-shadow-lg mb-6">Completed: {gameTitle}</p>

        {/* Score Display */}
        <div className="bg-white/90 rounded-2xl p-6 mb-6">
          <p className="text-center text-gray-800 font-bold mb-4">Your Reward</p>
          <div className="flex justify-around items-center">
            <div className="text-center">
              <div className="text-5xl mb-2">⭐</div>
              <p className="font-bold text-lg text-yellow-600">{reward.stars} Stars</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-2">🪙</div>
              <p className="font-bold text-lg text-yellow-600">{reward.coins} Coins</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-2">🏅</div>
              <p className="font-bold text-lg text-yellow-600">{reward.badge}</p>
            </div>
          </div>
        </div>

        {/* Score Details */}
        <div className="text-center mb-6 bg-white/70 rounded-xl p-4">
          <p className="text-gray-800 font-bold">
            Score: {score}/{totalScenarios}
          </p>
        </div>

        {/* Decorate Avatar Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            e.preventDefault()
            onDecorate()
          }}
          className="w-full py-4 bg-linear-to-r from-purple-500 to-pink-500 text-white font-bold text-xl rounded-2xl shadow-lg mb-3 hover:shadow-xl transition-all"
        >
          ✨ Decorate Avatar ✨
        </motion.button>

        {/* Skip Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={(e) => {
            e.preventDefault()
            onSkip()
          }}
          className="w-full py-3 bg-white/80 text-gray-800 font-bold rounded-xl hover:bg-white transition-all"
        >
          Play Next Game
        </motion.button>
      </motion.div>
    </motion.div>
  )
}
