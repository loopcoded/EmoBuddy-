"use client"

import { motion } from "framer-motion"

interface LevelNode {
  id: number
  title: string
  description: string
  isUnlocked: boolean
  isCurrentLevel: boolean
  isCompleted: boolean
  rewards: string[]
}

export function LevelMapNode({
  level,
  onClick,
}: {
  level: LevelNode
  onClick: () => void
}) {
  return (
    <div className="relative group">
      <motion.button
        onClick={onClick}
        disabled={!level.isUnlocked}
        className={`relative w-36 h-36 rounded-full flex items-center justify-center font-black text-3xl transition-all duration-300 ${
          !level.isUnlocked
            ? "bg-gray-300 text-gray-500 cursor-not-allowed opacity-50"
            : level.isCurrentLevel
              ? "bg-gradient-to-br from-mint-400 via-blue-400 to-purple-400 text-white shadow-2xl"
              : level.isCompleted
                ? "bg-gradient-to-br from-green-400 via-emerald-400 to-teal-400 text-white shadow-xl"
                : "bg-white border-4 border-mint-300 text-mint-600 hover:shadow-2xl"
        }`}
        whileHover={level.isUnlocked ? { 
          scale: 1.15,
          rotate: [0, -5, 5, 0],
        } : {}}
        whileTap={level.isUnlocked ? { scale: 0.95 } : {}}
        animate={level.isCurrentLevel ? {
          boxShadow: [
            "0 0 20px rgba(0,191,165,0.4)",
            "0 0 40px rgba(66,165,245,0.6)",
            "0 0 20px rgba(0,191,165,0.4)"
          ]
        } : {}}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {/* Outer rotating ring for current level */}
        {level.isCurrentLevel && (
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-dashed border-white/50"
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />
        )}

        {/* Pulsing glow ring */}
        {level.isUnlocked && (
          <motion.div
            className={`absolute inset-0 rounded-full ${
              level.isCurrentLevel
                ? "bg-gradient-to-br from-mint-400/30 via-blue-400/30 to-purple-400/30"
                : level.isCompleted
                  ? "bg-gradient-to-br from-green-400/30 to-emerald-400/30"
                  : "bg-gradient-to-br from-mint-300/20 to-blue-300/20"
            }`}
            animate={{
              scale: [1, 1.4, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}

        {/* Inner content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full gap-2">
          <motion.span 
            className="text-4xl font-black"
            animate={level.isCurrentLevel ? {
              scale: [1, 1.1, 1],
            } : {}}
            transition={{ duration: 1, repeat: Infinity }}
          >
            {level.id}
          </motion.span>
          
          {level.isCompleted && (
            <motion.span 
              className="text-2xl"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              ✓
            </motion.span>
          )}
          
          {level.isCurrentLevel && (
            <motion.span 
              className="text-xl"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              ☆
            </motion.span>
          )}
        </div>

        {/* Orbiting particles for completed levels */}
        {level.isCompleted && (
          <>
            {[0, 120, 240].map((angle, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 bg-white rounded-full"
                style={{
                  left: "50%",
                  top: "50%",
                }}
                animate={{
                  x: [
                    Math.cos((angle + 0) * Math.PI / 180) * 50,
                    Math.cos((angle + 360) * Math.PI / 180) * 50,
                  ],
                  y: [
                    Math.sin((angle + 0) * Math.PI / 180) * 50,
                    Math.sin((angle + 360) * Math.PI / 180) * 50,
                  ],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear",
                  delay: i * 0.3,
                }}
              />
            ))}
          </>
        )}

        {/* Status badge with bounce */}
        {level.isUnlocked && (
          <motion.div
            className={`absolute -top-4 -right-4 px-4 py-2 rounded-full text-xs font-black text-white shadow-lg ${
              level.isCurrentLevel
                ? "bg-gradient-to-r from-mint-500 to-blue-500"
                : level.isCompleted
                  ? "bg-gradient-to-r from-green-500 to-emerald-500"
                  : "bg-gradient-to-r from-gray-400 to-gray-500"
            }`}
            initial={{ scale: 0, y: -10 }}
            animate={{ 
              scale: 1, 
              y: 0,
              ...(level.isCurrentLevel ? {
                y: [0, -5, 0]
              } : {})
            }}
            transition={level.isCurrentLevel ? {
              y: { duration: 1, repeat: Infinity }
            } : {}}
          >
            {level.isCurrentLevel ? "ACTIVE" : level.isCompleted ? "DONE" : "READY"}
          </motion.div>
        )}
      </motion.button>

      {/* Reward indicators with staggered float animation */}
      {level.isUnlocked && (
        <motion.div 
          className="absolute -bottom-14 left-1/2 transform -translate-x-1/2 text-center whitespace-nowrap"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex gap-3 justify-center">
            {level.rewards.map((reward, idx) => (
              <motion.div 
                key={idx} 
                className="text-3xl"
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: idx * 0.2,
                  ease: "easeInOut"
                }}
                whileHover={{ scale: 1.5, rotate: 20 }}
              >
                {reward}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Locked state with shake animation on hover */}
      {!level.isUnlocked && (
        <motion.div 
          className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 text-xs font-bold text-gray-500 whitespace-nowrap bg-gray-200 px-4 py-2 rounded-full"
          whileHover={{
            x: [-2, 2, -2, 2, 0],
          }}
          transition={{ duration: 0.5 }}
        >
          🔒 Complete Previous Level
        </motion.div>
      )}

      {/* Hover tooltip */}
      {level.isUnlocked && (
        <motion.div
          className="absolute bottom-full mb-4 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50"
          initial={{ y: 10 }}
          whileHover={{ y: 0 }}
        >
          {level.title}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
        </motion.div>
      )}
    </div>
  )
}