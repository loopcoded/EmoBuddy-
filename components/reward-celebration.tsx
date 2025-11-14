"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

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
  const [showRewards, setShowRewards] = useState(false)
  const [showUpgrades, setShowUpgrades] = useState(false)

  useEffect(() => {
    const timer1 = setTimeout(() => setIsAnimating(false), 1000)
    const timer2 = setTimeout(() => setShowRewards(true), 1500)
    const timer3 = setTimeout(() => setShowUpgrades(true), 2500)
    
    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
    }
  }, [])

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 bg-gradient-to-br from-black/60 via-purple-900/40 to-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Floating celebration elements */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-4xl"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
              y: [-100, -300],
              rotate: [0, 360],
            }}
            transition={{
              duration: 3,
              delay: Math.random() * 2,
              repeat: Infinity,
              repeatDelay: Math.random() * 3,
            }}
          >
            {['🎉', '⭐', '🌟', '✨', '🎊', '🏆'][Math.floor(Math.random() * 6)]}
          </motion.div>
        ))}

        <motion.div
          initial={{ scale: 0.5, opacity: 0, rotateY: -180 }}
          animate={{ 
            scale: isAnimating ? [0.5, 1.1, 1] : 1, 
            opacity: 1,
            rotateY: 0
          }}
          transition={{ 
            type: "spring", 
            stiffness: 150, 
            damping: 20,
            duration: 1
          }}
          className="relative"
        >
          <Card className="p-12 bg-gradient-to-br from-yellow-50 via-pink-50 to-blue-50 border-4 border-yellow-300 shadow-2xl max-w-3xl transform relative overflow-hidden">
            {/* Animated border glow */}
            <motion.div
              className="absolute inset-0 rounded-lg"
              animate={{
                boxShadow: [
                  "0 0 20px rgba(250, 204, 21, 0.5)",
                  "0 0 60px rgba(236, 72, 153, 0.6)",
                  "0 0 20px rgba(59, 130, 246, 0.5)",
                  "0 0 20px rgba(250, 204, 21, 0.5)",
                ],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            />

            {/* Sparkle overlay */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{ x: [-500, 1000] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
            />

            <div className="text-center relative z-10">
              {/* Trophy animation */}
              <motion.div 
                className="mb-6"
                animate={{
                  y: [0, -20, 0],
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <span className="text-8xl">🏆</span>
              </motion.div>

              {/* Orbiting celebration icons */}
              {['🎉', '⭐', '✨', '🎊'].map((icon, i) => (
                <motion.div
                  key={i}
                  className="absolute text-4xl"
                  style={{
                    left: "50%",
                    top: "20%",
                  }}
                  animate={{
                    x: [
                      Math.cos((i * 90) * Math.PI / 180) * 100,
                      Math.cos((i * 90 + 360) * Math.PI / 180) * 100,
                    ],
                    y: [
                      Math.sin((i * 90) * Math.PI / 180) * 100,
                      Math.sin((i * 90 + 360) * Math.PI / 180) * 100,
                    ],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  {icon}
                </motion.div>
              ))}

              <motion.h1 
                className="text-5xl font-black bg-gradient-to-r from-yellow-500 via-pink-500 to-purple-500 bg-clip-text text-transparent mb-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Level {levelCompleted} Completed!
              </motion.h1>

              <motion.p 
                className="text-2xl text-gray-700 mb-10 font-bold"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <motion.span
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  Amazing work! 
                </motion.span>
                {" "}You've earned fantastic rewards!
              </motion.p>

              {/* Rewards Display with staggered entrance */}
              <AnimatePresence>
                {showRewards && (
                  <motion.div 
                    className="mb-8 p-8 bg-white/90 rounded-3xl shadow-xl border-4 border-mint-300 relative overflow-hidden"
                    initial={{ opacity: 0, scale: 0.8, y: 50 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ type: "spring", stiffness: 150 }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-mint-100/50 to-blue-100/50"
                      animate={{
                        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                      }}
                      transition={{ duration: 5, repeat: Infinity }}
                      style={{ backgroundSize: "200% 200%" }}
                    />

                    <motion.h3 
                      className="text-2xl font-black text-gray-800 mb-6 flex items-center justify-center gap-3"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <span className="text-3xl">🎁</span>
                      Your Rewards
                      <span className="text-3xl">🎁</span>
                    </motion.h3>

                    <div className="grid grid-cols-2 gap-5 relative z-10">
                      {rewards.map((reward, idx) => (
                        <motion.div
                          key={idx}
                          className="p-6 bg-gradient-to-br from-mint-300 via-blue-300 to-purple-300 rounded-2xl shadow-lg relative overflow-hidden"
                          initial={{ opacity: 0, scale: 0, rotate: -180 }}
                          animate={{ 
                            opacity: 1, 
                            scale: 1, 
                            rotate: 0,
                          }}
                          transition={{ 
                            delay: idx * 0.2,
                            type: "spring",
                            stiffness: 200
                          }}
                          whileHover={{ 
                            scale: 1.1, 
                            rotate: [0, -5, 5, 0],
                            boxShadow: "0 10px 40px rgba(0,0,0,0.2)"
                          }}
                        >
                          <motion.div
                            className="absolute inset-0 bg-white/20"
                            animate={{
                              x: [-100, 300],
                              opacity: [0, 0.5, 0],
                            }}
                            transition={{
                              duration: 2,
                              delay: idx * 0.3,
                              repeat: Infinity,
                              repeatDelay: 3,
                            }}
                          />
                          <motion.p 
                            className="text-4xl relative z-10"
                            animate={{ 
                              rotate: [0, 10, -10, 0],
                              scale: [1, 1.2, 1]
                            }}
                            transition={{ 
                              duration: 2, 
                              repeat: Infinity,
                              delay: idx * 0.1 
                            }}
                          >
                            {reward}
                          </motion.p>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Avatar Upgrades with slide-in effect */}
              <AnimatePresence>
                {showUpgrades && (
                  <motion.div 
                    className="mb-10 p-8 bg-white/90 rounded-3xl shadow-xl border-4 border-purple-300 relative overflow-hidden"
                    initial={{ opacity: 0, x: -100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 100 }}
                    transition={{ type: "spring", stiffness: 100 }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-purple-100/50 to-pink-100/50"
                      animate={{
                        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                      }}
                      transition={{ duration: 5, repeat: Infinity }}
                      style={{ backgroundSize: "200% 200%" }}
                    />

                    <motion.h3 
                      className="text-2xl font-black text-gray-800 mb-6 flex items-center justify-center gap-3"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                    >
                      <span className="text-3xl">✨</span>
                      Avatar Enhancements Unlocked!
                      <span className="text-3xl">✨</span>
                    </motion.h3>

                    <div className="flex flex-wrap gap-4 justify-center relative z-10">
                      {avatarUpgrades.map((upgrade, idx) => (
                        <motion.span
                          key={idx}
                          className="px-6 py-3 bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 rounded-full text-base font-black text-white shadow-lg"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.15 }}
                          whileHover={{ 
                            scale: 1.15,
                            rotate: [0, -10, 10, 0],
                            boxShadow: "0 10px 30px rgba(0,0,0,0.3)"
                          }}
                        >
                          <motion.span
                            animate={{
                              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                            }}
                            transition={{ duration: 3, repeat: Infinity }}
                          >
                            {upgrade}
                          </motion.span>
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Continue button with pulsing effect */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 3 }}
              >
                <Button
                  onClick={onClose}
                  className="px-16 py-6 text-2xl font-black rounded-full bg-gradient-to-r from-mint-400 via-blue-400 to-purple-400 hover:from-mint-500 hover:via-blue-500 hover:to-purple-500 text-white shadow-2xl relative overflow-hidden group"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    animate={{ x: [-200, 400] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <motion.span
                    className="relative z-10 flex items-center gap-3"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Continue
                    <motion.span
                      animate={{ x: [0, 10, 0] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      →
                    </motion.span>
                  </motion.span>
                </Button>
              </motion.div>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}