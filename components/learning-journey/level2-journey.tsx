"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import GameFacialBodyLanguage from "./games/game-facial-body-language"
import GameVoiceVolume from "./games/game-voice-volume"
import GameFriendOrNot from "./games/game-friend-or-not"
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

const LEVEL_NUMBER = 2

interface Level2JourneyProps {
  childID?: string
  onProgressClick?: () => void
  initialProgress?: GameProgress
  onProgressUpdated?: () => void
  onModuleChange?: (moduleId: number) => void
}

export default function Level2Journey(props: Level2JourneyProps) {
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

  if (currentGame) {
    const gameProps = {
      onBack: () => setCurrentGame(null),
      onComplete: (score: number, total: number) =>
        handleGameComplete(
          currentGame,
          score,
          total,
          [
            "Facial & Body Language",
            "Voice Volume Helper",
            "Friend or Not Friend",
            "Tone of Voice",
            "Greetings 101",
            "Personal Space",
          ][currentGame - 1]
        ),
    }

    const games = [
      GameFacialBodyLanguage,
      GameVoiceVolume,
      GameFriendOrNot,
      GameToneOfVoice,
      GameGreetingsBasics,
      GamePersonalSpace,
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
            "url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/level2-Ch0TkYHV4M15nZFDjBXl5nlZXpW4FH.jpg')",
          backgroundSize: "140%",
          backgroundPosition: "center",
        }}
      >
        <GameComponent {...gameProps} />
      </motion.div>
    )
  }

  const gameNodes = [
    {
      id: 1,
      title: "Facial & Body Language",
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
      title: "Voice Volume Helper",
      icon: "📊",
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
      title: "Friend or Not Friend",
      icon: "❤️",
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
          "url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/level2-Ch0TkYHV4M15nZFDjBXl5nlZXpW4FH.jpg')",
        backgroundSize: "140%",
        backgroundPosition: "center",
        backgroundColor: "rgba(255, 255, 255, 0.3)",
        backgroundBlendMode: "lighten",
      }}
    >
      {/* ... header, stats, GameTreePath, popups (left as in your original, simplified here for brevity) */}
      <GameTreePath games={gameNodes} />

      <RewardPopup isOpen={showReward} score={lastGameScore.score} totalScenarios={lastGameScore.total} gameTitle={lastGameScore.gameTitle} onDecorate={() => { setShowReward(false); setShowCustomizer(true) }} onSkip={() => setShowReward(false)} />
      <AvatarCustomizer isOpen={showCustomizer} childID={childID} onSave={handleAvatarSaved} />
      <LevelCompletionCelebration isOpen={showCelebration} levelNumber={2} avatarConfig={childProfile?.avatarConfig || {}} childID={childID} onNavigateToMap={handleNavigateBack} />
    </div>
  )
}
