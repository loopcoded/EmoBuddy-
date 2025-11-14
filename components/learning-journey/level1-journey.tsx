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

  // Calculate total progress
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

  useEffect(() => {
    if (childID) {
      setIsLoading(true)
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/progress/get-state/${childID}/${LEVEL_NUMBER}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.state) {
            const parsed = data.state as GameProgress
            setProgress(parsed)
            const last = parsed.lastPlayedGame
            if (last && !(parsed as any)[`game${last}Completed`]) {
              setCurrentGame(last as 1 | 2 | 3 | 4 | 5 | 6)
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
  
  // Auto-resume last game after calming
  // Auto-resume last game after calming (paste into level1/2/3 journey components)
useEffect(() => {
  if (typeof window === "undefined") return;

  const hash = window.location.hash;
  if (!hash || !hash.startsWith("#module-")) return;

  const moduleIdRaw = hash.replace("#module-", "");
  const moduleId = Number(moduleIdRaw);

  // Validate moduleId is an integer between 1 and 6
  if (!Number.isInteger(moduleId) || moduleId < 1 || moduleId > 6) {
    // invalid or out-of-range id — ignore
    return;
  }

  // TypeScript: cast to the union type that setCurrentGame expects
  setCurrentGame(moduleId as 1 | 2 | 3 | 4 | 5 | 6);

  // Clear the hash so it doesn't trigger again on refresh/navigation
  window.location.hash = "";
}, []);

  
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

  // If playing a specific game
  if (currentGame) {
    const gameProps = {
      onBack: () => setCurrentGame(null),
      onComplete: (score: number, total: number) =>
        handleGameComplete(
          currentGame,
          score,
          total,
          [
            "Social Detective",
            "Conversation Builder",
            "Role-Play Chat",
            "Time Sequencing",
            "Context Understanding",
            "Perspective Taking",
          ][currentGame - 1]
        ),
    }

    const games = [
      GameSocialDetective,
      GameConversationBuilder,
      GameRolePlayChatbot,
      GameTimeSequencing,
      GameContextUnderstanding,
      GamePerspectiveTaking,
    ]
    const GameComponent = games[currentGame - 1]

    // notify parent about module change (so LearningPage can save lastModuleID)
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
        <GameComponent {...gameProps} />
      </motion.div>
    )
  }

  // Build the game nodes list (menu)
  const gameNodes = [
    {
      id: 1,
      title: "Social Detective",
      icon: "🔍",
      isCompleted: progress.game1Completed,
      isLocked: false,
      onClick: () => {
        setProgress((prev) => ({ ...prev, lastPlayedGame: 1 }))
        setCurrentGame(1)
      },
    },
    {
      id: 2,
      title: "Conversation Builder",
      icon: "💬",
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
      title: "Role-Play Chat",
      icon: "🎭",
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
      title: "Time Sequencing",
      icon: "⏰",
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
      title: "Context Understanding",
      icon: "🛍️",
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
      title: "Perspective Taking",
      icon: "🤔",
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
          "url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/level1-XUUiuqLXdrFN3BtpvLSpLtUe5SsQZb.jpg')",
        backgroundSize: "140%",
        backgroundPosition: "center",
        backgroundColor: "rgba(255, 255, 255, 0.3)",
        backgroundBlendMode: "lighten",
      }}
    >
      {/* Animated floating elements */}
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
            {["🔍", "💬", "🎭", "⏰", "🛍️", "🤔", "⭐", "✨"][Math.floor(Math.random() * 8)]}
          </motion.div>
        ))}
      </div>

      {/* Header and other UI (kept intentionally compact here for clarity) */}
      <motion.div className="flex items-center justify-between mb-8 relative z-10" initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: "spring" }}>
        <div className="flex-1" />
        <motion.h1 className="text-4xl font-black text-center">Level 1: Minimal Support</motion.h1>
        <motion.button onClick={onProgressClick} className="p-3 rounded-xl bg-white">Progress</motion.button>
      </motion.div>

      {/* Fun Stats Bar */}
      <motion.div className="flex justify-center gap-4 mb-8 relative z-10">
        {/* stats... small simplified version */}
        <div className="bg-gradient-to-br from-blue-400 to-cyan-400 p-4 rounded-2xl shadow-lg min-w-[100px] text-center">
          <div className="text-2xl font-black text-white">{Math.round(totalProgress)}%</div>
          <div className="text-xs font-bold text-white/90">Progress</div>
        </div>
      </motion.div>

      {/* Game Path */}
      <GameTreePath games={gameNodes} />

      {/* Level Complete with Celebration */}
      <AnimatePresence>
        {allGamesCompleted && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ type: "spring" }} className="mt-16 text-center relative z-10">
            <motion.button onClick={handleLevelComplete} className="bg-yellow-400 rounded-3xl p-6">LEVEL COMPLETE</motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Popups and Modals */}
      <RewardPopup isOpen={showReward} score={lastGameScore.score} totalScenarios={lastGameScore.total} gameTitle={lastGameScore.gameTitle} onDecorate={() => { setShowReward(false); setShowCustomizer(true) }} onSkip={() => setShowReward(false)} />
      <AvatarCustomizer isOpen={showCustomizer} childID={childID} onSave={handleAvatarSaved} />
      <LevelCompletionCelebration isOpen={showCelebration} levelNumber={1} avatarConfig={childProfile?.avatarConfig || {}} childID={childID} onNavigateToMap={handleNavigateBack} />
    </div>
  )
}
