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
    <div className="relative w-full min-h-[1400px] flex flex-col items-center justify-center py-12 px-6">
      {/* Enhanced SVG Path with animations */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{
          filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.15))",
          zIndex: 0,
        }}
        viewBox="0 0 600 1600"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="pathGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(74, 222, 128, 0.6)" />
            <stop offset="50%" stopColor="rgba(59, 130, 246, 0.5)" />
            <stop offset="100%" stopColor="rgba(168, 85, 247, 0.4)" />
          </linearGradient>

          {/* Animated gradient */}
          <linearGradient id="animatedGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(255, 237, 213, 0.8)">
              <animate attributeName="stop-color" values="rgba(255,237,213,0.8); rgba(252,211,77,0.8); rgba(255,237,213,0.8)" dur="3s" repeatCount="indefinite" />
            </stop>
            <stop offset="100%" stopColor="rgba(254, 215, 170, 0.6)">
              <animate attributeName="stop-color" values="rgba(254,215,170,0.6); rgba(251,191,36,0.6); rgba(254,215,170,0.6)" dur="3s" repeatCount="indefinite" />
            </stop>
          </linearGradient>

          {/* Sparkling particles pattern */}
          <pattern id="sparkles" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="10" cy="10" r="2" fill="rgba(255, 255, 255, 0.6)">
              <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle cx="30" cy="30" r="1.5" fill="rgba(250, 204, 21, 0.5)">
              <animate attributeName="opacity" values="0.2;0.8;0.2" dur="3s" repeatCount="indefinite" begin="0.5s" />
            </circle>
          </pattern>

          {/* Glow filter */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Main path with enhanced styling */}
        <g filter="url(#glow)">
          {/* Node 1 to 2 */}
          <path
            d="M 300 100 L 300 200"
            stroke="url(#pathGradient)"
            strokeWidth="60"
            fill="none"
            strokeLinecap="round"
            opacity="0.8"
          />

          {/* Node 2 to 3 - curve left */}
          <path
            d="M 300 280 Q 250 330 180 380"
            stroke="url(#pathGradient)"
            strokeWidth="60"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.8"
          />

          {/* Node 3 to 4 - curve back right */}
          <path
            d="M 180 460 Q 230 510 300 560"
            stroke="url(#pathGradient)"
            strokeWidth="60"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.8"
          />

          {/* Node 4 to 5 - curve right */}
          <path
            d="M 300 640 Q 380 690 420 760"
            stroke="url(#pathGradient)"
            strokeWidth="60"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.8"
          />

          {/* Node 5 to 6 - curve back left */}
          <path
            d="M 420 840 Q 360 890 300 940"
            stroke="url(#pathGradient)"
            strokeWidth="60"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.8"
          />
        </g>

        {/* Overlay sparkle pattern */}
        <path
          d="M 300 100 L 300 200 Q 250 330 180 380 Q 230 510 300 560 Q 380 690 420 760 Q 360 890 300 940"
          stroke="url(#sparkles)"
          strokeWidth="60"
          fill="none"
          strokeLinecap="round"
          opacity="0.6"
        />

        {/* Animated traveling light */}
        <circle r="8" fill="rgba(255, 237, 213, 0.9)" filter="url(#glow)">
          <animateMotion
            dur="8s"
            repeatCount="indefinite"
            path="M 300 100 L 300 200 Q 250 330 180 380 Q 230 510 300 560 Q 380 690 420 760 Q 360 890 300 940"
          />
        </circle>
      </svg>

      {/* Game nodes with enhanced animations */}
      <div className="relative z-10 flex flex-col gap-24 items-center w-full">
        {games.map((game, index) => {
          const positions = [
            "center", // Node 1
            "center", // Node 2
            "left",   // Node 3
            "center", // Node 4
            "right",  // Node 5
            "center", // Node 6
          ]
          const position = positions[index] || "center"

          return (
            <motion.div
              key={game.id}
              initial={{ scale: 0, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{
                delay: index * 0.2,
                duration: 0.8,
                type: "spring",
                stiffness: 120,
              }}
              className={`relative flex flex-col items-center w-full ${
                position === "left"
                  ? "justify-start pl-8"
                  : position === "right"
                    ? "justify-end pr-8"
                    : "justify-center"
              }`}
            >
              {/* Enhanced node container */}
              <motion.button
                whileHover={!game.isLocked ? { 
                  scale: 1.2, 
                  y: -15,
                  rotate: [0, -5, 5, -5, 0],
                } : {
                  x: [-3, 3, -3, 3, 0],
                }}
                whileTap={!game.isLocked ? { scale: 0.9 } : {}}
                onClick={game.onClick}
                disabled={game.isLocked}
                className={`relative w-36 h-36 rounded-full flex items-center justify-center font-black text-5xl transition-all shadow-2xl shrink-0 ${
                  game.isLocked
                    ? "bg-gradient-to-br from-gray-400 to-gray-600 cursor-not-allowed opacity-60 ring-4 ring-gray-400"
                    : game.isCompleted
                      ? "bg-gradient-to-br from-yellow-300 via-amber-400 to-orange-500 text-white ring-8 ring-yellow-300 shadow-yellow-300 shadow-2xl"
                      : "bg-gradient-to-br from-blue-400 via-cyan-400 to-teal-400 text-white hover:shadow-3xl ring-8 ring-blue-300 hover:ring-cyan-400"
                }`}
              >
                {/* Rotating border for active games */}
                {!game.isLocked && !game.isCompleted && (
                  <motion.div
                    className="absolute inset-0 rounded-full border-4 border-dashed border-white/50"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  />
                )}

                {/* Multiple glow layers for completed games */}
                {game.isCompleted && (
                  <>
                    <motion.div
                      animate={{
                        scale: [1, 1.4, 1],
                        opacity: [0.6, 0.2, 0.6],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 rounded-full bg-yellow-400"
                    />
                    <motion.div
                      animate={{
                        scale: [1, 1.6, 1],
                        opacity: [0.4, 0, 0.4],
                      }}
                      transition={{ duration: 2.5, repeat: Infinity }}
                      className="absolute inset-0 rounded-full bg-orange-300"
                    />
                    
                    {/* Orbiting stars */}
                    {[0, 120, 240].map((angle, i) => (
                      <motion.div
                        key={i}
                        className="absolute text-2xl"
                        style={{
                          left: "50%",
                          top: "50%",
                        }}
                        animate={{
                          x: [
                            Math.cos((angle + 0) * Math.PI / 180) * 60,
                            Math.cos((angle + 360) * Math.PI / 180) * 60,
                          ],
                          y: [
                            Math.sin((angle + 0) * Math.PI / 180) * 60,
                            Math.sin((angle + 360) * Math.PI / 180) * 60,
                          ],
                          rotate: [0, 360],
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          ease: "linear",
                          delay: i * 0.4,
                        }}
                      >
                        ⭐
                      </motion.div>
                    ))}
                  </>
                )}

                {/* Pulse effect for active games */}
                {!game.isLocked && !game.isCompleted && (
                  <>
                    <motion.div
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.5, 0, 0.5],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 rounded-full bg-blue-400"
                    />
                    
                    {/* Floating sparkles */}
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute text-xl"
                        style={{
                          left: "50%",
                          top: "50%",
                        }}
                        animate={{
                          y: [-80, -120],
                          x: [(i - 1) * 20, (i - 1) * 30],
                          opacity: [0, 1, 0],
                          scale: [0, 1, 0],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.4,
                        }}
                      >
                        ✨
                      </motion.div>
                    ))}
                  </>
                )}

                {/* Icon display */}
                <motion.span
                  className="relative z-10"
                  animate={game.isCompleted ? {
                    rotate: [0, 360],
                    scale: [1, 1.2, 1],
                  } : !game.isLocked ? {
                    y: [0, -5, 0],
                  } : {}}
                  transition={{
                    duration: game.isCompleted ? 3 : 2,
                    repeat: Infinity,
                  }}
                >
                  {game.isLocked ? "🔒" : game.isCompleted ? "🏆" : game.icon}
                </motion.span>

                {/* Status badge */}
                {!game.isLocked && (
                  <motion.div
                    className={`absolute -top-4 -right-4 px-4 py-2 rounded-full text-xs font-black text-white shadow-lg ${
                      game.isCompleted
                        ? "bg-gradient-to-r from-green-500 to-emerald-600"
                        : "bg-gradient-to-r from-blue-500 to-purple-600"
                    }`}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ 
                      scale: 1, 
                      rotate: 0,
                      y: game.isCompleted ? [0, -5, 0] : 0,
                    }}
                    transition={{
                      type: "spring",
                      y: { duration: 1, repeat: Infinity }
                    }}
                  >
                    {game.isCompleted ? "✓ DONE" : "▶ PLAY"}
                  </motion.div>
                )}
              </motion.button>

              {/* Enhanced info section */}
              <div className="flex flex-col gap-2 mt-6 text-center">
                <motion.p 
                  className="font-black text-xl text-gray-900 drop-shadow-lg bg-white/80 backdrop-blur px-4 py-2 rounded-full"
                  whileHover={{ scale: 1.05 }}
                >
                  {game.title}
                </motion.p>

                {/* Enhanced status indicators */}
                {game.isLocked ? (
                  <motion.div
                    animate={{ x: [-3, 3, -3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="flex items-center justify-center gap-2 bg-red-100 px-4 py-2 rounded-full"
                  >
                    <span className="text-red-600 text-sm font-black">🔒 Locked</span>
                  </motion.div>
                ) : game.isCompleted ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="flex items-center justify-center gap-2 bg-green-100 px-4 py-2 rounded-full"
                  >
                    <span className="text-green-700 text-sm font-black">✓ Mastered!</span>
                    <div className="flex gap-1">
                      {[1, 2, 3].map((star) => (
                        <motion.span
                          key={star}
                          initial={{ scale: 0, rotate: 180, y: -10 }}
                          animate={{ scale: 1, rotate: 0, y: 0 }}
                          transition={{
                            delay: star * 0.15,
                            type: "spring",
                            stiffness: 250,
                          }}
                          className="text-lg"
                        >
                          ⭐
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    animate={{ 
                      y: [-2, 2, -2],
                      scale: [1, 1.05, 1],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="flex items-center justify-center gap-2 bg-blue-100 px-4 py-2 rounded-full"
                  >
                    <span className="text-blue-700 text-sm font-black">▶ Ready to Play!</span>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}