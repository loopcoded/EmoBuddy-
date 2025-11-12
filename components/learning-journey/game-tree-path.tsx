"use client"

import { motion } from "framer-motion"

interface GameNode {
  id: number
  title: string
  icon: string
  isCompleted: boolean
  isLocked: boolean
  onClick: () => void
}

interface GameTreePathProps {
  games: GameNode[]
}

export default function GameTreePath({ games }: GameTreePathProps) {
  return (
    <div className="relative w-full min-h-[1200px] flex flex-col items-center justify-center py-12 px-6">
      {/* SVG Path - enhanced for 6-node tree structure */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{
          filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.1))",
          zIndex: 0,
        }}
        viewBox="0 0 600 1600"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="pathGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,200,100,0.5)" />
            <stop offset="50%" stopColor="rgba(200,180,100,0.4)" />
            <stop offset="100%" stopColor="rgba(150,150,100,0.3)" />
          </linearGradient>

          {/* Sand/path texture */}
          <pattern id="pathTexture" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="5" cy="5" r="2" fill="rgba(100,80,40,0.1)" />
            <circle cx="15" cy="15" r="1.5" fill="rgba(100,80,40,0.08)" />
          </pattern>
        </defs>

        {/* Node 1 to 2 */}
        <path
          d="M 300 100 L 300 200"
          stroke="url(#pathGradient)"
          strokeWidth="50"
          fill="none"
          strokeLinecap="round"
          opacity="0.7"
        />

        {/* Node 2 to 3 - curve left */}
        <path
          d="M 300 280 Q 250 330 180 380"
          stroke="url(#pathGradient)"
          strokeWidth="50"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.7"
        />

        {/* Node 3 to 4 - curve back right */}
        <path
          d="M 180 460 Q 230 510 300 560"
          stroke="url(#pathGradient)"
          strokeWidth="50"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.7"
        />

        {/* Node 4 to 5 - curve right */}
        <path
          d="M 300 640 Q 380 690 420 760"
          stroke="url(#pathGradient)"
          strokeWidth="50"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.7"
        />

        {/* Node 5 to 6 - curve back left */}
        <path
          d="M 420 840 Q 360 890 300 940"
          stroke="url(#pathGradient)"
          strokeWidth="50"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.7"
        />

        {/* Texture overlay */}
        <path
          d="M 300 100 L 300 200 Q 300 280 180 380 Q 230 510 300 560 Q 380 690 420 760 Q 360 890 300 940"
          stroke="url(#pathTexture)"
          strokeWidth="50"
          fill="none"
          strokeLinecap="round"
          opacity="0.5"
        />
      </svg>

      {/* Game nodes positioned for 6-node tree structure */}
      <div className="relative z-10 flex flex-col gap-24 items-center w-full">
        {games.map((game, index) => {
          const positions = [
            "center", // Node 1 - center
            "center", // Node 2 - center
            "left", // Node 3 - left
            "center", // Node 4 - center
            "right", // Node 5 - right
            "center", // Node 6 - center
          ]
          const position = positions[index] || "center"

          return (
            <motion.div
              key={game.id}
              initial={{ scale: 0, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{
                delay: index * 0.15,
                duration: 0.6,
                type: "spring",
                stiffness: 100,
              }}
              className={`relative flex flex-col items-center w-full ${
                position === "left"
                  ? "justify-start pl-8"
                  : position === "right"
                    ? "justify-end pr-8"
                    : "justify-center"
              }`}
            >
              {/* Node container with enhanced styling */}
              <motion.button
                whileHover={!game.isLocked ? { scale: 1.15, y: -12 } : {}}
                whileTap={!game.isLocked ? { scale: 0.9 } : {}}
                onClick={game.onClick}
                disabled={game.isLocked}
                className={`relative w-32 h-32 rounded-full flex items-center justify-center font-bold text-4xl transition-all shadow-2xl shrink-0 ${
                  game.isLocked
                    ? "bg-gradient-to-br from-gray-400 to-gray-500 cursor-not-allowed opacity-50 ring-4 ring-gray-300"
                    : game.isCompleted
                      ? "bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-500 text-white ring-4 ring-yellow-200 shadow-amber-200 shadow-lg"
                      : "bg-gradient-to-br from-blue-400 to-cyan-500 text-white hover:shadow-2xl ring-4 ring-blue-300 hover:ring-blue-400"
                }`}
              >
                {game.isLocked ? "🔒" : game.isCompleted ? "⭐" : game.icon}

                {/* Enhanced glow effects for completed games */}
                {game.isCompleted && (
                  <>
                    <motion.div
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.5, 0.3, 0.5],
                      }}
                      transition={{ duration: 2.5, repeat: Number.POSITIVE_INFINITY }}
                      className="absolute inset-0 rounded-full bg-yellow-300"
                    />
                    <motion.div
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.3, 0, 0.3],
                      }}
                      transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                      className="absolute inset-0 rounded-full bg-amber-200"
                    />
                  </>
                )}

                {/* Pulse effect for active games */}
                {!game.isLocked && !game.isCompleted && (
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                    }}
                    transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                    className="absolute inset-0 rounded-full border-4 border-blue-300"
                  />
                )}
              </motion.button>

              {/* Info section with game title and status */}
              <div className="flex flex-col gap-2 mt-4 text-center">
                <p className="font-bold text-lg text-gray-900 drop-shadow-lg">{game.title}</p>

                {/* Status indicators */}
                {game.isLocked ? (
                  <motion.p
                    animate={{ x: [-2, 2, -2] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                    className="text-red-600 text-sm font-semibold"
                  >
                    Complete previous
                  </motion.p>
                ) : game.isCompleted ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="flex items-center justify-center gap-2"
                  >
                    <span className="text-green-600 text-sm font-semibold">Mastered</span>
                    <div className="flex gap-1">
                      {[1, 2, 3].map((star) => (
                        <motion.span
                          key={star}
                          initial={{ scale: 0, rotate: 180, y: -10 }}
                          animate={{ scale: 1, rotate: 0, y: 0 }}
                          transition={{
                            delay: star * 0.12,
                            type: "spring",
                            stiffness: 220,
                          }}
                          className="text-base"
                        >
                          ⭐
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <motion.p
                    animate={{ y: [-1, 1, -1] }}
                    transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                    className="text-blue-600 text-sm font-semibold"
                  >
                    Ready
                  </motion.p>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
