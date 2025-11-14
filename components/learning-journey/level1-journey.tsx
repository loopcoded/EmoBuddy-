"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import GameSocialDetective from "./games/game-social-detective"
import GameConversationBuilder from "./games/game-conversation-builder"
import GameRolePlayChatbot from "./games/game-role-play-chatbot"
import GameTimeSequencing from "./games/game-time-sequencing"
import GameContextUnderstanding from "./games/game-context-understanding"
import GamePerspectiveTaking from "./games/game-perspective-taking"
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

const LEVEL_NUMBER = 1

interface Level1JourneyProps {
  childID?: string
  onProgressClick?: () => void
  initialProgress?: GameProgress
  onProgressUpdated?: () => void
  onModuleChange?: (moduleId: number) => void
}

export default function Level1Journey(props: Level1JourneyProps) {
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

  // Calculate % completed
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

  // Load progress
  useEffect(() => {
    if (!childID) return
    setIsLoading(true)

    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/progress/get-state/${childID}/${LEVEL_NUMBER}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.state) {
          const parsed = data.state as GameProgress
          setProgress(parsed)

          if (parsed.lastPlayedGame && !(parsed as any)[`game${parsed.lastPlayedGame}Completed`]) {
            setCurrentGame(parsed.lastPlayedGame as 1 | 2 | 3 | 4 | 5 | 6)
          }
        } else {
          setProgress(DEFAULT_PROGRESS)
        }
      })
      .catch(() => setProgress(DEFAULT_PROGRESS))
      .finally(() => setIsLoading(false))
  }, [childID])

  // Auto-resume after calming game
  useEffect(() => {
    if (typeof window === "undefined") return

    const hash = window.location.hash
    if (hash && hash.startsWith("#module-")) {
      const id = Number(hash.replace("#module-", ""))

      if (Number.isInteger(id) && id >= 1 && id <= 6) {
        setCurrentGame(id as 1 | 2 | 3 | 4 | 5 | 6)
      }
      window.location.hash = ""
    }
  }, [])

  // Save progress
  useEffect(() => {
    if (!childID || isLoading) return

    const changed = JSON.stringify(progress) !== JSON.stringify(DEFAULT_PROGRESS)
    if (!changed) return

    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/progress/save-state/${childID}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        level: LEVEL_NUMBER,
        state: progress,
      }),
    }).catch((err) => console.error("Failed saving progress", err))
  }, [progress, childID, isLoading])

  // Load profile
  useEffect(() => {
    if (!childID) return

    fetch(`/api/child-profile/${childID}`)
      .then((res) => res.json())
      .then((data) => setChildProfile(data?.data || data))
      .catch(() => null)
  }, [childID])

  // Handle game completion
  const handleGameComplete = async (
    gameNum: 1 | 2 | 3 | 4 | 5 | 6,
    score: number,
    total: number,
    gameTitle: string
  ) => {
    const next = gameNum < 6 ? ((gameNum + 1) as 2 | 3 | 4 | 5 | 6) : null

    setProgress((prev) => ({
      ...prev,
      [`game${gameNum}Completed`]: true,
      lastPlayedGame: next,
    } as GameProgress))

    setLastGameScore({ score, total, gameTitle })
    setShowReward(true)
    setCurrentGame(null)

    // Log score
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
      } catch {}
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

  // Render active game
  if (currentGame) {
    const titles = [
      "Social Detective",
      "Conversation Builder",
      "Role-Play Chat",
      "Time Sequencing",
      "Context Understanding",
      "Perspective Taking",
    ]

    const games = [
      GameSocialDetective,
      GameConversationBuilder,
      GameRolePlayChatbot,
      GameTimeSequencing,
      GameContextUnderstanding,
      GamePerspectiveTaking,
    ]

    const GameComponent = games[currentGame - 1]

    onModuleChange?.(currentGame)

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/level1-XUUiuqLXdrFN3BtpvLSpLtUe5SsQZb.jpg')",
          backgroundSize: "140%",
          backgroundPosition: "center",
        }}
      >
        <GameComponent
          onBack={() => setCurrentGame(null)}
          onComplete={(score, total) =>
            handleGameComplete(currentGame, score, total, titles[currentGame - 1])
          }
        />
      </motion.div>
    )
  }

  // Game nodes (menu)
  const gameNodes = [
    {
      id: 1,
      title: "Social Detective",
      icon: "🔍",
      isLocked: false,
      isCompleted: progress.game1Completed,
      onClick: () => {
        setProgress((prev) => ({ ...prev, lastPlayedGame: 1 }))
        setCurrentGame(1)
      },
    },
    {
      id: 2,
      title: "Conversation Builder",
      icon: "💬",
      isLocked: !progress.game1Completed,
      isCompleted: progress.game2Completed,
      onClick: () => {
        if (!progress.game1Completed) return
        setProgress((prev) => ({ ...prev, lastPlayedGame: 2 }))
        setCurrentGame(2)
      },
    },
    {
      id: 3,
      title: "Role-Play Chat",
      icon: "🎭",
      isLocked: !progress.game2Completed,
      isCompleted: progress.game3Completed,
      onClick: () => {
        if (!progress.game2Completed) return
        setProgress((prev) => ({ ...prev, lastPlayedGame: 3 }))
        setCurrentGame(3)
      },
    },
    {
      id: 4,
      title: "Time Sequencing",
      icon: "⏰",
      isLocked: !progress.game3Completed,
      isCompleted: progress.game4Completed,
      onClick: () => {
        if (!progress.game3Completed) return
        setProgress((prev) => ({ ...prev, lastPlayedGame: 4 }))
        setCurrentGame(4)
      },
    },
    {
      id: 5,
      title: "Context Understanding",
      icon: "🛍️",
      isLocked: !progress.game4Completed,
      isCompleted: progress.game5Completed,
      onClick: () => {
        if (!progress.game4Completed) return
        setProgress((prev) => ({ ...prev, lastPlayedGame: 5 }))
        setCurrentGame(5)
      },
    },
    {
      id: 6,
      title: "Perspective Taking",
      icon: "🤔",
      isLocked: !progress.game5Completed,
      isCompleted: progress.game6Completed,
      onClick: () => {
        if (!progress.game5Completed) return
        setProgress((prev) => ({ ...prev, lastPlayedGame: 6 }))
        setCurrentGame(6)
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
          "url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/level1-XUUiuqLXdrFN3BtpvLSpLtUe5SsQZb.jpg')",
        backgroundSize: "140%",
        backgroundPosition: "center",
        backgroundColor: "rgba(255,255,255,0.3)",
        backgroundBlendMode: "lighten",
      }}
    >
      {/* ⭐ Floating Emojis ⭐ */}
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
            {["🔍", "💬", "🎭", "⏰", "🛍️", "🤔", "⭐", "✨"][i % 8]}
          </motion.div>
        ))}
      </div>

      {/* ⭐ HEADER ⭐ */}
      <motion.div
        className="flex items-center justify-between mb-8 relative z-10"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring" }}
      >
        <div className="flex-1" />

        <motion.h1
          className="text-5xl font-black bg-gradient-to-r from-green-500 via-blue-500 to-cyan-500 bg-clip-text text-transparent drop-shadow-2xl text-center"
        >
          <motion.span
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Level 1: Minimal Support
          </motion.span>
          <motion.div
            className="text-2xl mt-2"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            🌱✨
          </motion.div>
        </motion.h1>

        {/* ⭐ PROGRESS BUTTON ⭐ */}
        <motion.button
          onClick={onProgressClick}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-4 p-5 bg-white/95 backdrop-blur-lg rounded-full shadow-2xl hover:shadow-3xl transition-all cursor-pointer border-4 border-green-200 relative overflow-hidden group"
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-green-100/50 to-blue-100/50"
            animate={{
              x: [-300, 300],
              opacity: [0, 0.5, 0],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />

          <div className="relative z-10">
            <div className="flex items-center justify-between text-sm font-black text-gray-800 mb-2">
              <span className="flex items-center gap-2">🎯 Progress</span>
              <span className="text-green-600">{Math.round(totalProgress)}%</span>
            </div>
            <div className="w-36 h-4 bg-gray-200 rounded-full overflow-hidden shadow-inner border-2 border-gray-300">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${totalProgress}%` }}
                transition={{ duration: 1 }}
                className="h-full bg-gradient-to-r from-green-400 via-emerald-500 to-blue-500"
              />
            </div>
          </div>
        </motion.button>
      </motion.div>

       {/* STATS BAR */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex justify-center gap-4 mb-8 relative z-10"
            >
              {[
                { icon: "🎮", label: "Games", value: "6", color: "from-purple-400 to-pink-400" },
                { icon: "⭐", label: "Completed", value: Object.values(progress).filter(Boolean).length.toString(), color: "from-yellow-400 to-orange-400" },
                { icon: "🏆", label: "Remaining", value: (6 - Object.values(progress).filter(Boolean).length).toString(), color: "from-red-400 to-pink-400" },
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
                    <motion.div className="text-3xl mb-1">
                      {stat.icon}
                    </motion.div>
                    <div className="text-2xl font-black text-white">{stat.value}</div>
                    <div className="text-xs font-bold text-white/90">{stat.label}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

      {/* ⭐ GAME TREE ⭐ */}
      <GameTreePath games={gameNodes} />

      {/* ⭐ LEVEL COMPLETE ⭐ */}
      <AnimatePresence>
        {allGamesCompleted && (
          <motion.div
            initial={{ scale: 0, opacity: 0, y: 100 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 150 }}
            className="mt-16 text-center relative z-10"
          >
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-4xl"
                style={{ left: "50%", top: "50%" }}
                initial={{ scale: 0, x: 0, y: 0 }}
                animate={{
                  scale: [0, 1, 0],
                  x: [0, (Math.random() - 0.5) * 400],
                  y: [0, (Math.random() - 0.5) * 400],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              >
                {["🎉", "⭐", "✨", "🌟"][i % 4]}
              </motion.div>
            ))}

            <motion.button
              onClick={handleLevelComplete}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 rounded-3xl p-10 shadow-2xl inline-block"
            >
              🎉 LEVEL COMPLETE! 🎉
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ⭐ MODALS ⭐ */}
      <RewardPopup
        isOpen={showReward}
        score={lastGameScore.score}
        totalScenarios={lastGameScore.total}
        gameTitle={lastGameScore.gameTitle}
        onDecorate={() => {
          setShowReward(false)
          setShowCustomizer(true)
        }}
        onSkip={() => setShowReward(false)}
      />

      <AvatarCustomizer isOpen={showCustomizer} childID={childID} onSave={handleAvatarSaved} />

      <LevelCompletionCelebration
        isOpen={showCelebration}
        levelNumber={1}
        avatarConfig={childProfile?.avatarConfig || {}}
        childID={childID}
        onNavigateToMap={handleNavigateBack}
      />
    </div>
  )
}
