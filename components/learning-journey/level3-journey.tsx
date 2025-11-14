"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import GameEmotionRecognition from "./games/game-emotion-recognition"
import GameRoutineBuilder from "./games/game-routine-builder"
import GameGestureGuessing from "./games/game-gesture-guessing"
import GameToneOfVoice from "./games/game-tone-of-voice"
import GameGreetingsBasics from "./games/game-greetings-basics"
import GamePersonalSpace from "./games/game-personal-space"
import GameTreePath from "./game-tree-path"
import RewardPopup from "./reward-popup"
import AvatarCustomizer from "./avatar-customizer"
import LevelCompletionCelebration from "./level-completion-celebration"

interface GameProgress {
  game1Completed: boolean
  game2Completed: boolean
  game3Completed: boolean
  game4Completed: boolean
  game5Completed: boolean
  game6Completed: boolean
  lastPlayedGame?: number | null
}

const DEFAULT_PROGRESS: GameProgress = {
  game1Completed: false,
  game2Completed: false,
  game3Completed: false,
  game4Completed: false,
  game5Completed: false,
  game6Completed: false,
  lastPlayedGame: null,
}

const LEVEL_NUMBER = 3

interface Level3JourneyProps {
  childID?: string
  onProgressClick?: () => void
  initialProgress?: GameProgress
  onProgressUpdated?: () => void
  onModuleChange?: (moduleId: number) => void
}

export default function Level3Journey(props: Level3JourneyProps) {
  const { childID, onProgressClick, initialProgress, onProgressUpdated, onModuleChange } = props

  const [currentGame, setCurrentGame] = useState<1 | 2 | 3 | 4 | 5 | 6 | null>(null)
  const [progress, setProgress] = useState<GameProgress>(initialProgress || DEFAULT_PROGRESS)
  const [totalProgress, setTotalProgress] = useState(0)
  const [showReward, setShowReward] = useState(false)
  const [showCustomizer, setShowCustomizer] = useState(false)
  const [lastGameScore, setLastGameScore] = useState({ score: 0, total: 0, gameTitle: "" })
  const [showCelebration, setShowCelebration] = useState(false)
  const [childProfile, setChildProfile] = useState<{ avatarConfig: Record<string, unknown> } | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // compute progress %
  useEffect(() => {
    const completed = [
      progress.game1Completed,
      progress.game2Completed,
      progress.game3Completed,
      progress.game4Completed,
      progress.game5Completed,
      progress.game6Completed,
    ].filter(Boolean).length
    setTotalProgress((completed / 6) * 100)
  }, [progress])

  // load saved progress for level
  useEffect(() => {
    if (childID) {
      setIsLoading(true)
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/progress/get-state/${childID}/${LEVEL_NUMBER}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.state) {
            const parsed = data.state as GameProgress
            setProgress(parsed)
            // if there's a saved incomplete game, resume it
            if (parsed.lastPlayedGame && !(parsed as any)[`game${parsed.lastPlayedGame}Completed`]) {
              setCurrentGame(parsed.lastPlayedGame as 1 | 2 | 3 | 4 | 5 | 6)
            }
          } else {
            setProgress(DEFAULT_PROGRESS)
          }
        })
        .catch((err) => {
          console.error("Failed to fetch progress:", err)
          setProgress(DEFAULT_PROGRESS)
        })
        .finally(() => setIsLoading(false))
    }
  }, [childID])

  // Auto-resume last game after calming via #module-<id> hash
  useEffect(() => {
    if (typeof window === "undefined") return

    const hash = window.location.hash
    if (!hash || !hash.startsWith("#module-")) return

    const moduleIdRaw = hash.replace("#module-", "")
    const moduleId = Number(moduleIdRaw)

    // Validate moduleId is integer between 1 and 6
    if (!Number.isInteger(moduleId) || moduleId < 1 || moduleId > 6) {
      return
    }

    setCurrentGame(moduleId as 1 | 2 | 3 | 4 | 5 | 6)
    // clear hash so it doesn't retrigger
    window.location.hash = ""
  }, [])

  // save progress (debounced-style simple)
  useEffect(() => {
    if (!childID || isLoading) return
    const isNotDefault = JSON.stringify(progress) !== JSON.stringify(DEFAULT_PROGRESS)
    if (isNotDefault) {
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/progress/save-state/${childID}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          level: LEVEL_NUMBER,
          state: progress,
        }),
      }).catch((err) => console.error("Failed to save progress:", err))
    }
  }, [progress, childID, isLoading])

  // fetch profile
  useEffect(() => {
    if (childID) {
      fetch(`/api/child-profile/${childID}`)
        .then((res) => res.json())
        .then((data) => setChildProfile(data?.data || data))
        .catch((err) => console.error("Failed to fetch profile:", err))
    }
  }, [childID])

  const handleGameComplete = async (
    gameNum: 1 | 2 | 3 | 4 | 5 | 6,
    score: number,
    total: number,
    gameTitle: string
  ) => {
    const nextGame = gameNum < 6 ? (gameNum + 1) as (2 | 3 | 4 | 5 | 6) : null

    setProgress((prev) => ({
      ...prev,
      [`game${gameNum}Completed`]: true,
      lastPlayedGame: nextGame,
    } as unknown as GameProgress))

    setLastGameScore({ score, total, gameTitle })
    setShowReward(true)
    setCurrentGame(null)

    if (childID) {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/progress/log-game/${childID}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            level: LEVEL_NUMBER,
            gameId: gameNum,
            gameTitle,
            score,
            total,
            completedAt: new Date().toISOString(),
          }),
        })
      } catch (err) {
        console.error("Failed to log game score:", err)
      }
    }

    onProgressUpdated?.()
  }

  const handleAvatarSaved = () => {
    setShowCustomizer(false)
    setShowReward(false)
  }

  const handleLevelComplete = () => {
    setShowCelebration(true)
    setProgress((prev) => ({ ...prev, lastPlayedGame: null }))
  }

  const handleNavigateBack = () => {
    setShowCelebration(false)
    onProgressClick?.()
  }

  // When playing a game, render the game component
  if (currentGame) {
    const gameProps = {
      onBack: () => setCurrentGame(null),
      onComplete: (score: number, total: number) =>
        handleGameComplete(
          currentGame,
          score,
          total,
          [
            "Emotion Recognition",
            "Routine Builder",
            "Gesture Guessing",
            "Tone of Voice",
            "Greetings 101",
            "Personal Space",
          ][currentGame - 1]
        ),
    }

    const games = [
      GameEmotionRecognition,
      GameRoutineBuilder,
      GameGestureGuessing,
      GameToneOfVoice,
      GameGreetingsBasics,
      GamePersonalSpace,
    ]
    const GameComponent = games[currentGame - 1]

    // notify parent about module change (so LearningPage can store lastModuleID)
    onModuleChange?.(currentGame)

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/level3-ewDYfbxPRb6V50hinnxpxpImfMB2xr.jpg')",
          backgroundSize: "140%",
          backgroundPosition: "center",
        }}
      >
        <GameComponent {...gameProps} />
      </motion.div>
    )
  }

  // Game nodes (menu)
  const gameNodes = [
    {
      id: 1,
      title: "Emotion Recognition",
      icon: "😊",
      isCompleted: progress.game1Completed,
      isLocked: false,
      onClick: () => {
        setProgress((prev) => ({ ...prev, lastPlayedGame: 1 }))
        setCurrentGame(1)
      },
    },
    {
      id: 2,
      title: "Routine Builder",
      icon: "🕐",
      isCompleted: progress.game2Completed,
      isLocked: !progress.game1Completed,
      onClick: () => {
        if (progress.game1Completed) {
          setProgress((prev) => ({ ...prev, lastPlayedGame: 2 }))
          setCurrentGame(2)
        }
      },
    },
    {
      id: 3,
      title: "Gesture Guessing",
      icon: "👋",
      isCompleted: progress.game3Completed,
      isLocked: !progress.game2Completed,
      onClick: () => {
        if (progress.game2Completed) {
          setProgress((prev) => ({ ...prev, lastPlayedGame: 3 }))
          setCurrentGame(3)
        }
      },
    },
    {
      id: 4,
      title: "Tone of Voice",
      icon: "🎵",
      isCompleted: progress.game4Completed,
      isLocked: !progress.game3Completed,
      onClick: () => {
        if (progress.game3Completed) {
          setProgress((prev) => ({ ...prev, lastPlayedGame: 4 }))
          setCurrentGame(4)
        }
      },
    },
    {
      id: 5,
      title: "Greetings 101",
      icon: "👋",
      isCompleted: progress.game5Completed,
      isLocked: !progress.game4Completed,
      onClick: () => {
        if (progress.game4Completed) {
          setProgress((prev) => ({ ...prev, lastPlayedGame: 5 }))
          setCurrentGame(5)
        }
      },
    },
    {
      id: 6,
      title: "Personal Space",
      icon: "📏",
      isCompleted: progress.game6Completed,
      isLocked: !progress.game5Completed,
      onClick: () => {
        if (progress.game5Completed) {
          setProgress((prev) => ({ ...prev, lastPlayedGame: 6 }))
          setCurrentGame(6)
        }
      },
    },
  ]

  const allGamesCompleted =
    progress.game1Completed &&
    progress.game2Completed &&
    progress.game3Completed &&
    progress.game4Completed &&
    progress.game5Completed &&
    progress.game6Completed

  return (
    <div
      className="min-h-screen bg-cover bg-center p-6 relative overflow-hidden"
      style={{
        backgroundImage:
          "url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/level3-ewDYfbxPRb6V50hinnxpxpImfMB2xr.jpg')",
        backgroundSize: "140%",
        backgroundPosition: "center",
        backgroundColor: "rgba(255, 255, 255, 0.3)",
        backgroundBlendMode: "lighten",
      }}
    >
      {/* Animated floating elements - Level 3 themed */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-4xl"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
              opacity: [0.2, 0.5, 0.2],
              rotate: [0, 360],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          >
            {['😊', '🕐', '👋', '🎵', '📏', '🔥', '⭐', '✨'][Math.floor(Math.random() * 8)]}
          </motion.div>
        ))}
      </div>

      {/* Enhanced Header */}
      <motion.div
        className="flex items-center justify-between mb-8 relative z-10"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring" }}
      >
        <div className="flex-1" />

        <motion.h1
          className="text-5xl font-black bg-gradient-to-r from-orange-500 via-red-500 to-pink-600 bg-clip-text text-transparent drop-shadow-2xl text-center"
        >
          <motion.span
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Level 3: High Support
          </motion.span>
          <motion.div
            className="text-2xl mt-2"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            🌳🔥
          </motion.div>
        </motion.h1>

        {/* Enhanced Progress Button */}
        <motion.button
          onClick={onProgressClick}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-4 p-5 bg-white/95 backdrop-blur-lg rounded-full shadow-2xl hover:shadow-3xl transition-all cursor-pointer border-4 border-orange-200 relative overflow-hidden group"
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-orange-100/50 to-red-100/50"
            animate={{
              x: [-300, 300],
              opacity: [0, 0.5, 0],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />

          <div className="relative z-10">
            <div className="flex items-center justify-between text-sm font-black text-gray-800 mb-2">
              <span className="flex items-center gap-2">
                <motion.span
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  🎯
                </motion.span>
                Progress
              </span>
              <motion.span
                className="text-orange-600"
                animate={totalProgress === 100 ? { scale: [1, 1.3, 1] } : {}}
                transition={{ duration: 1, repeat: Infinity }}
              >
                {Math.round(totalProgress)}%
              </motion.span>
            </div>
            <div className="w-36 h-4 bg-gray-200 rounded-full overflow-hidden shadow-inner border-2 border-gray-300">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${totalProgress}%` }}
                transition={{ duration: 1 }}
                className="h-full bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 relative"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
                  animate={{ x: [-100, 200] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </motion.div>
            </div>
          </div>
        </motion.button>
      </motion.div>

      {/* Fun Stats Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex justify-center gap-4 mb-8 relative z-10"
      >
        {[
          { icon: "🎮", label: "Games", value: "6", color: "from-orange-400 to-red-400" },
          { icon: "⭐", label: "Completed", value: Object.values(progress).filter(v => v === true).length.toString(), color: "from-yellow-400 to-orange-400" },
          { icon: "🏆", label: "Remaining", value: (6 - Object.values(progress).filter(v => v === true).length).toString(), color: "from-red-400 to-pink-400" },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: i * 0.1, type: "spring" }}
            whileHover={{ scale: 1.1, y: -5 }}
            className={`bg-gradient-to-br ${stat.color} p-4 rounded-2xl shadow-lg min-w-[100px] relative overflow-hidden`}
          >
            <motion.div
              className="absolute inset-0 bg-white/20"
              animate={{ x: [-100, 200] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
            />
            <div className="relative z-10 text-center">
              <motion.div 
                className="text-3xl mb-1"
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.2, 1]
                }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
              >
                {stat.icon}
              </motion.div>
              <div className="text-2xl font-black text-white">{stat.value}</div>
              <div className="text-xs font-bold text-white/90">{stat.label}</div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Game Path */}
      <GameTreePath games={gameNodes} />

      {/* Level Complete with Epic Celebration */}
      <AnimatePresence>
        {allGamesCompleted && (
          <motion.div
            initial={{ scale: 0, opacity: 0, y: 100 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 150 }}
            className="mt-16 text-center relative z-10"
          >
            {/* Celebration fireworks */}
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-5xl"
                style={{
                  left: "50%",
                  top: "50%",
                }}
                initial={{ scale: 0, x: 0, y: 0 }}
                animate={{
                  scale: [0, 1.5, 0],
                  x: [0, (Math.random() - 0.5) * 500],
                  y: [0, (Math.random() - 0.5) * 500],
                  opacity: [0, 1, 0],
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  delay: i * 0.15,
                }}
              >
                {['🎉', '🔥', '⭐', '✨', '🌟'][i % 5]}
              </motion.div>
            ))}

            <motion.button
              onClick={handleLevelComplete}
              whileHover={{ scale: 1.08, rotate: [0, -2, 2, 0] }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 rounded-3xl p-10 shadow-2xl inline-block hover:shadow-3xl transition-all cursor-pointer relative overflow-hidden border-4 border-orange-200"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                animate={{ x: [-300, 500] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              
              <div className="relative z-10">
                <motion.div
                  animate={{
                    rotate: [0, 360],
                    scale: [1, 1.3, 1],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="text-7xl mb-4"
                >
                  🏆
                </motion.div>
                <p className="text-5xl font-black text-white drop-shadow-lg mb-3">
                  🎉 LEVEL COMPLETE! 🎉
                </p>
                <p className="text-2xl text-white font-bold drop-shadow-lg">
                  Click to claim your SUPER rewards!
                </p>
              </div>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <RewardPopup isOpen={showReward} score={lastGameScore.score} totalScenarios={lastGameScore.total} gameTitle={lastGameScore.gameTitle} onDecorate={() => { setShowReward(false); setShowCustomizer(true) }} onSkip={() => setShowReward(false)} />
      <AvatarCustomizer isOpen={showCustomizer} childID={childID} onSave={handleAvatarSaved} />
      <LevelCompletionCelebration isOpen={showCelebration} levelNumber={3} avatarConfig={childProfile?.avatarConfig || {}} childID={childID} onNavigateToMap={handleNavigateBack} />
    </div>
  )
}
