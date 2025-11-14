"use client"

import { motion } from "framer-motion"
import React from "react"

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
  // Layout positions for wide zig-zag
  const positions = [
    "center",    // 1
    "far-left",  // 2
    "far-right", // 3
    "center",    // 4
    "far-left",  // 5
    "far-right", // 6
  ]

  // Helper: convert layout into an x offset for manual decorations
  const xOffset = (pos: string) => {
    if (pos === "far-left") return 120
    if (pos === "far-right") return -120
    return 0
  }

  // We'll build an array of path segments (d strings) to map motion paths / particles.
  // These correlate roughly with node positions (1->2, 2->3, etc.)
  // Coordinates chosen to match zig-zag layout for a tall map.
  const pathSegments = [
    // 1 -> 2 (center down to far-left)
    "M450 80 C450 180 330 220 330 320",
    // 2 -> 3 (far-left curve to far-right)
    "M330 360 C330 420 600 420 600 520",
    // 3 -> 4 (far-right down to center)
    "M600 560 C600 660 450 700 450 800",
    // 4 -> 5 (center down to far-left)
    "M450 840 C450 940 330 980 330 1080",
    // 5 -> 6 (far-left curve to far-right)
    "M330 1120 C330 1180 600 1180 600 1280",
    // 6 -> end (far-right down)
    "M600 1320 C600 1400 450 1460 450 1520",
  ]

  return (
    <div className="relative w-full min-h-[1600px] flex flex-col items-center justify-center py-8 px-6 overflow-hidden">
      {/* PARALLAX BACKGROUND DECORATIONS */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        {/* Soft ambient gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-50 via-white to-indigo-100 opacity-90" />

        {/* Floating clouds / bubbles (parallax) */}
        <motion.div
          className="absolute top-8 left-8 text-5xl opacity-30"
          animate={{ x: [0, 40, 0] }}
          transition={{ duration: 12, repeat: Infinity }}
        >
          ☁️
        </motion.div>
        <motion.div
          className="absolute top-32 right-12 text-5xl opacity-20"
          animate={{ x: [0, -60, 0], y: [0, 10, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
        >
          🫧
        </motion.div>

        {/* Parallax floating critters */}
        <motion.div
          className="absolute -bottom-10 left-12 text-4xl opacity-30"
          animate={{ x: [0, 30, 0], y: [0, -10, 0] }}
          transition={{ duration: 14, repeat: Infinity }}
        >
          🐛
        </motion.div>
        <motion.div
          className="absolute -bottom-6 right-20 text-4xl opacity-25"
          animate={{ x: [0, -40, 0], y: [0, -8, 0] }}
          transition={{ duration: 16, repeat: Infinity }}
        >
          🐝
        </motion.div>
      </div>

      {/* SVG Adventure Path */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 900 1600"
        preserveAspectRatio="xMidYMid slice"
        style={{ zIndex: 0 }}
      >
        <defs>
          <linearGradient id="routeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4ade80" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#60a5fa" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.75" />
          </linearGradient>

          <radialGradient id="glowGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fff7ed" stopOpacity="1" />
            <stop offset="100%" stopColor="#fff7ed" stopOpacity="0" />
          </radialGradient>

          <filter id="softBlur">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Sparkle pattern for overlay */}
          <pattern id="tinySpark" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="10" cy="10" r="1.2" fill="rgba(255,255,255,0.7)">
              <animate attributeName="opacity" values="0.2;1;0.2" dur="2.5s" repeatCount="indefinite" />
            </circle>
            <circle cx="28" cy="28" r="0.9" fill="rgba(250,204,21,0.5)">
              <animate attributeName="opacity" values="0.1;0.8;0.1" dur="3s" repeatCount="indefinite" begin="0.5s" />
            </circle>
          </pattern>
        </defs>

        {/* Big soft ambient glow behind entire path */}
        <ellipse cx="450" cy="800" rx="420" ry="760" fill="url(#glowGrad)" opacity="0.25" filter="url(#softBlur)" />

        {/* Draw the major route in one continuous path (stroke dash animation) */}
        <path
          id="mainRoute"
          d={`
            M450 80
            C450 180 330 220 330 320
            C330 380 600 380 600 480
            C600 540 450 580 450 680
            C450 760 330 800 330 900
            C330 960 600 960 600 1060
            C600 1120 450 1160 450 1240
          `}
          fill="none"
          stroke="url(#routeGradient)"
          strokeWidth="44"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.95"
        />
        {/* Animated stroke overlay to create motion along the path */}
        <path
          d={`
            M450 80
            C450 180 330 220 330 320
            C330 380 600 380 600 480
            C600 540 450 580 450 680
            C450 760 330 800 330 900
            C330 960 600 960 600 1060
            C600 1120 450 1160 450 1240
          `}
          fill="none"
          stroke="#fff6e0"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="30 20"
          strokeDashoffset="0"
        >
          <animate attributeName="stroke-dashoffset" from="0" to="-500" dur="8s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.8;0.4;0.8" dur="5s" repeatCount="indefinite" />
        </path>

        {/* Decorative sparkle overlay */}
        <path
          d={`
            M450 80
            C450 180 330 220 330 320
            C330 380 600 380 600 480
            C600 540 450 580 450 680
            C450 760 330 800 330 900
            C330 960 600 960 600 1060
            C600 1120 450 1160 450 1240
          `}
          stroke="url(#tinySpark)"
          strokeWidth="16"
          fill="none"
          strokeLinecap="round"
          opacity="0.35"
        />

        {/* Traveling particles that follow the path (multiple lights) */}
        <g>
          <circle r="8" fill="#fff8e1" opacity="0.95" filter="url(#softBlur)">
            <animateMotion dur="9s" repeatCount="indefinite">
              <mpath href="#mainRoute" />
            </animateMotion>
          </circle>

          <circle r="6" fill="#ffedd5" opacity="0.75" filter="url(#softBlur)">
            <animateMotion dur="12s" repeatCount="indefinite" begin="1.5s">
              <mpath href="#mainRoute" />
            </animateMotion>
          </circle>

          <circle r="5" fill="#fee2b3" opacity="0.6" filter="url(#softBlur)">
            <animateMotion dur="10.5s" repeatCount="indefinite" begin="0.7s">
              <mpath href="#mainRoute" />
            </animateMotion>
          </circle>
        </g>

        {/* Connectors between node anchor points - small arcs */}
        {pathSegments.map((d, idx) => (
          <path
            key={`seg-${idx}`}
            d={d}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={10}
            strokeLinecap="round"
            opacity={0.6}
          />
        ))}

        {/* Small drifting spark particles emitted at specific anchor points (nodes) */}
        {[80, 320, 520, 680, 900, 1060].map((cy, i) => (
          <g key={`emit-${i}`}>
            <circle cx={i % 2 === 0 ? 450 : i % 3 === 0 ? 600 : 330} cy={cy} r="4" fill="#fff7ed" opacity="0.85">
              <animate attributeName="r" values="3;6;3" dur={`${3 + (i % 3)}s`} repeatCount="indefinite" />
            </circle>
            {/* a few drifting sparkles around the node */}
            <circle cx={i % 2 === 0 ? 420 : 630} cy={cy - 20} r="2" fill="#fef3c7" opacity="0.7">
              <animate attributeName="cy" values={`${cy - 20};${cy - 60};${cy - 20}`} dur={`${2 + (i % 2)}s`} repeatCount="indefinite" />
            </circle>
            <circle cx={i % 2 === 0 ? 480 : 570} cy={cy + 10} r="2" fill="#fff3b0" opacity="0.6">
              <animate attributeName="cy" values={`${cy + 10};${cy + 40};${cy + 10}`} dur={`${2.2 + (i % 3)}s`} repeatCount="indefinite" />
            </circle>
          </g>
        ))}
      </svg>

      {/* Nodes area: large vertical spacing with wide zig-zag positions */}
      <div className="relative z-10 flex flex-col gap-36 items-center w-full max-w-[900px]">
        {games.map((game, index) => {
          const layout = positions[index] || "center"
          const pushClass =
            layout === "far-left"
              ? "justify-start pl-[160px] xl:pl-[220px]"
              : layout === "far-right"
              ? "justify-end pr-[160px] xl:pr-[220px]"
              : "justify-center"

          // compute node anchor for minor linking (for aria/polish)
          const anchorX = layout === "far-left" ? 120 : layout === "far-right" ? 780 : 450

          return (
            <motion.div
              key={game.id}
              initial={{ scale: 0, opacity: 0, y: 60 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{
                delay: index * 0.18,
                duration: 0.9,
                type: "spring",
                stiffness: 110,
              }}
              className={`relative flex flex-col items-center w-full ${pushClass}`}
              aria-label={`Node ${game.id} anchorX ${anchorX}`}
            >
              {/* Material-style floating node container */}
              <motion.button
                whileHover={
                  !game.isLocked
                    ? {
                        scale: 1.18,
                        y: -12,
                        rotate: [0, -4, 4, -4, 0],
                        boxShadow: "0px 30px 60px rgba(0,0,0,0.18)",
                      }
                    : { x: [-3, 3, -3, 3, 0] }
                }
                whileTap={!game.isLocked ? { scale: 0.94 } : {}}
                onClick={game.onClick}
                disabled={game.isLocked}
                className={`relative w-36 h-36 rounded-full flex items-center justify-center font-black text-5xl transition-all shadow-2xl shrink-0
                    ${
                      game.isLocked
                        ? "bg-gradient-to-br from-gray-400 to-gray-600 cursor-not-allowed opacity-70 ring-4 ring-gray-400"
                        : game.isCompleted
                        ? "bg-gradient-to-br from-yellow-300 via-amber-400 to-orange-500 text-white ring-8 ring-yellow-300 shadow-yellow-300"
                        : "bg-gradient-to-br from-blue-400 via-cyan-400 to-teal-400 text-white hover:shadow-3xl ring-8 ring-blue-300 hover:ring-cyan-400"
                    }`}
              >
                {/* rotating dashed ring */}
                {!game.isLocked && !game.isCompleted && (
                  <motion.div
                    className="absolute inset-0 rounded-full border-4 border-dashed border-white/40"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  />
                )}

                {/* completed multi-layer glow */}
                {game.isCompleted && (
                  <>
                    <motion.div
                      animate={{ scale: [1, 1.45, 1], opacity: [0.6, 0.12, 0.6] }}
                      transition={{ duration: 2.2, repeat: Infinity }}
                      className="absolute inset-0 rounded-full bg-yellow-400"
                    />
                    <motion.div
                      animate={{ scale: [1, 1.7, 1], opacity: [0.35, 0.0, 0.35] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="absolute inset-0 rounded-full bg-orange-300"
                    />
                    {[0, 120, 240].map((angle, i) => (
                      <motion.div
                        key={i}
                        className="absolute text-2xl"
                        style={{ left: "50%", top: "50%" }}
                        animate={{
                          x: [
                            Math.cos((angle * Math.PI) / 180) * 62,
                            Math.cos(((angle + 360) * Math.PI) / 180) * 62,
                          ],
                          y: [
                            Math.sin((angle * Math.PI) / 180) * 62,
                            Math.sin(((angle + 360) * Math.PI) / 180) * 62,
                          ],
                          rotate: [0, 360],
                        }}
                        transition={{
                          duration: 4.2,
                          repeat: Infinity,
                          ease: "linear",
                          delay: i * 0.35,
                        }}
                      >
                        ⭐
                      </motion.div>
                    ))}
                  </>
                )}

                {/* active pulse + sparkles */}
                {!game.isLocked && !game.isCompleted && (
                  <>
                    <motion.div
                      animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0, 0.4] }}
                      transition={{ duration: 2.2, repeat: Infinity }}
                      className="absolute inset-0 rounded-full bg-blue-400/60"
                    />
                    {[...Array(4)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute text-xl"
                        style={{ left: "50%", top: "50%" }}
                        animate={{
                          y: [-70, -120 - i * 8],
                          x: [(i - 1.5) * 18, (i - 1.5) * 30],
                          opacity: [0, 1, 0],
                          scale: [0, 1, 0],
                        }}
                        transition={{
                          duration: 2.2,
                          repeat: Infinity,
                          delay: i * 0.3,
                        }}
                      >
                        ✨
                      </motion.div>
                    ))}
                  </>
                )}

                {/* icon */}
                <motion.span
                  className="relative z-10"
                  animate={
                    game.isCompleted
                      ? { rotate: [0, 360], scale: [1, 1.18, 1] }
                      : !game.isLocked
                      ? { y: [0, -6, 0] }
                      : {}
                  }
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  {game.isLocked ? "🔒" : game.isCompleted ? "🏆" : game.icon}
                </motion.span>

                {/* status badge */}
                {!game.isLocked && (
                  <motion.div
                    className={`absolute -top-4 -right-4 px-4 py-2 rounded-full text-xs font-black text-white shadow-lg ${
                      game.isCompleted ? "bg-gradient-to-r from-green-500 to-emerald-600" : "bg-gradient-to-r from-blue-500 to-purple-600"
                    }`}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    {game.isCompleted ? "✓ DONE" : "▶ PLAY"}
                  </motion.div>
                )}
              </motion.button>

              {/* title + status */}
              <div className="flex flex-col gap-2 mt-6 text-center">
                <motion.p className="font-black text-xl text-gray-900 drop-shadow-lg bg-white/80 backdrop-blur px-4 py-2 rounded-full" whileHover={{ scale: 1.03 }}>
                  {game.title}
                </motion.p>

                {game.isLocked ? (
                  <motion.div animate={{ x: [-3, 3, -3] }} transition={{ duration: 2, repeat: Infinity }} className="flex items-center justify-center gap-2 bg-red-100 px-4 py-2 rounded-full">
                    <span className="text-red-600 text-sm font-black">🔒 Locked</span>
                  </motion.div>
                ) : game.isCompleted ? (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300 }} className="flex items-center justify-center gap-2 bg-green-100 px-4 py-2 rounded-full">
                    <span className="text-green-700 text-sm font-black">✓ Mastered!</span>
                    <div className="flex gap-1">
                      {[1, 2, 3].map((star) => (
                        <motion.span key={star} initial={{ scale: 0, rotate: 180, y: -10 }} animate={{ scale: 1, rotate: 0, y: 0 }} transition={{ delay: star * 0.12, type: "spring", stiffness: 220 }} className="text-lg">
                          ⭐
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div animate={{ y: [-2, 2, -2], scale: [1, 1.04, 1] }} transition={{ duration: 2, repeat: Infinity }} className="flex items-center justify-center gap-2 bg-blue-100 px-4 py-2 rounded-full">
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
