"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

interface EnhancementNotificationProps {
  enhancements: string[]
  onDismiss: () => void
}

export function EnhancementNotification({ enhancements, onDismiss }: EnhancementNotificationProps) {
  const [isVisible, setIsVisible] = useState(true)

  const handleDismiss = () => {
    setIsVisible(false)
    setTimeout(() => onDismiss(), 300)
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          className="fixed right-6 top-24 z-50 max-w-sm"
          initial={{ x: 400, opacity: 0, scale: 0.8 }}
          animate={{ x: 0, opacity: 1, scale: 1 }}
          exit={{ x: 400, opacity: 0, scale: 0.8 }}
          transition={{ type: "spring", stiffness: 150, damping: 20 }}
        >
          <Card className="p-6 bg-gradient-to-br from-purple-200 via-pink-200 to-orange-200 border-0 shadow-2xl relative overflow-hidden">
            {/* Animated background shine */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
              animate={{ x: [-300, 500] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
            />

            {/* Floating sparkles */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-xl"
                style={{
                  left: `${20 + i * 15}%`,
                  top: `${10 + (i % 2) * 60}%`,
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.3, 1, 0.3],
                  scale: [0.8, 1.2, 0.8],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              >
                ✨
              </motion.div>
            ))}

            <div className="flex items-start gap-4 relative z-10">
              {/* Animated icon */}
              <motion.div 
                className="text-5xl"
                animate={{
                  rotate: [0, 15, -15, 0],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              >
                🎁
              </motion.div>

              <div className="flex-1">
                <motion.h3 
                  className="font-black text-xl text-gray-800 mb-2"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  🎉 New Enhancements!
                </motion.h3>

                <motion.p 
                  className="text-sm font-semibold text-gray-700 mb-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  You've unlocked awesome new avatar enhancements!
                </motion.p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {enhancements.map((enhancement, idx) => (
                    <motion.span
                      key={idx}
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ 
                        delay: 0.4 + idx * 0.1,
                        type: "spring",
                        stiffness: 200
                      }}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="px-4 py-2 bg-white/90 backdrop-blur rounded-full text-xs font-black text-gray-800 shadow-lg border-2 border-purple-300"
                    >
                      {enhancement}
                    </motion.span>
                  ))}
                </div>

                <motion.div 
                  className="flex gap-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button 
                      onClick={handleDismiss} 
                      variant="outline" 
                      size="sm" 
                      className="text-xs font-bold bg-white/80 hover:bg-white border-2 border-gray-300"
                    >
                      Later
                    </Button>
                  </motion.div>

                  <motion.div 
                    whileHover={{ scale: 1.05 }} 
                    whileTap={{ scale: 0.95 }}
                    className="relative"
                  >
                    <Button
                      onClick={handleDismiss}
                      size="sm"
                      className="text-xs font-black bg-gradient-to-r from-mint-400 via-blue-400 to-purple-400 hover:from-mint-500 hover:via-blue-500 hover:to-purple-500 text-white relative overflow-hidden"
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                        animate={{ x: [-100, 200] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                      <span className="relative z-10">Apply Now ✨</span>
                    </Button>
                  </motion.div>
                </motion.div>
              </div>
            </div>

            {/* Close button */}
            <motion.button
              onClick={handleDismiss}
              whileHover={{ scale: 1.2, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur flex items-center justify-center text-gray-600 hover:bg-white shadow-lg z-20"
            >
              ✕
            </motion.button>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  )
}