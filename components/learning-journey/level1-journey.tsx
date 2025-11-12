"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
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
};

const LEVEL_NUMBER = 1;

interface Level1JourneyProps {
  childID?: string
  onProgressClick?: () => void
  initialProgress?: GameProgress
  onProgressUpdated?: () => void;
}


export default function Level1Journey({ childID, onProgressClick, initialProgress, onProgressUpdated }: Level1JourneyProps = {}) {
  const [currentGame, setCurrentGame] = useState<1 | 2 | 3 | 4 | 5 | 6 | null>(null)
  const [progress, setProgress] = useState<GameProgress>(initialProgress || DEFAULT_PROGRESS);
  const [totalProgress, setTotalProgress] = useState(0)
  const [showReward, setShowReward] = useState(false)
  const [showCustomizer, setShowCustomizer] = useState(false)
  const [lastGameScore, setLastGameScore] = useState({ score: 0, total: 0, gameTitle: "" })
  const [showCelebration, setShowCelebration] = useState(false)
  const [childProfile, setChildProfile] = useState<{ avatarConfig: Record<string, unknown> } | null>(null)
  const [isLoading, setIsLoading] = useState(true); // ✅ Added loading state

  // ✅ CHANGED: Load progress from DATABASE instead of localStorage
  useEffect(() => {
    if (childID) {
      setIsLoading(true);
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/progress/get-state/${childID}/${LEVEL_NUMBER}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.state) {
            const parsed = data.state as GameProgress;
            setProgress(parsed);
            // ✅ Resume logic: if lastPlayedGame is set and that game is not complete, resume it
            const last = parsed.lastPlayedGame;
            if (last) {
              const isCompleted =
                last === 1 ? parsed.game1Completed
                : last === 2 ? parsed.game2Completed
                : last === 3 ? parsed.game3Completed
                : last === 4 ? parsed.game4Completed
                : last === 5 ? parsed.game5Completed
                : last === 6 ? parsed.game6Completed
                : true;
              if (!isCompleted) {
                setCurrentGame(last as 1 | 2 | 3 | 4 | 5 | 6);
              }
            }
          } else {
            // No progress saved yet, use default
            setProgress(DEFAULT_PROGRESS);
          }
        })
        .catch((err) => {
          console.error("Failed to fetch progress:", err);
          setProgress(DEFAULT_PROGRESS);
        })
        .finally(() => setIsLoading(false));
    }
  }, [childID]);

  // ✅ CHANGED: Save progress to DATABASE instead of localStorage
useEffect(() => {
  if (!childID || isLoading) return;

  const isNotDefault = JSON.stringify(progress) !== JSON.stringify(DEFAULT_PROGRESS);
  if (isNotDefault) {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/progress/save-state/${childID}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        level: LEVEL_NUMBER,
        state: progress,
      }),
    }).catch(err => console.error("Failed to save progress:", err));
  }
}, [progress, childID, isLoading]);


  // ✅ Fetch child profile for avatar config (No changes)
  useEffect(() => {
    if (childID) {
      fetch(`/api/child-profile/${childID}`)
        .then((res) => res.json())
        .then((data) => setChildProfile(data?.data || data))
        .catch((err) => console.error("Failed to fetch profile:", err))
    }
  }, [childID]);

  // ✅ Handle game completion
const handleGameComplete = async (
  gameNum: 1 | 2 | 3 | 4 | 5 | 6,
  score: number,
  total: number,
  gameTitle: string
) => {
  const nextGame = gameNum < 6 ? (gameNum + 1) as (2 | 3 | 4 | 5 | 6) : null;

  // ✅ Update local progress (triggers save to DB)
  setProgress((prev) => ({
    ...prev,
    [`game${gameNum}Completed`]: true,
    lastPlayedGame: nextGame,
  }));

  setLastGameScore({ score, total, gameTitle });
  setShowReward(true);
  setCurrentGame(null);

  // ✅ Send game completion to backend
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
      });
    } catch (err) {
      console.error("Failed to log game score:", err);
    }
  }

  // ✅ Auto-refresh the parent progress bar after save
  if (onProgressUpdated) {
    onProgressUpdated(); // 🚀 calls parent’s fetchProgress() in LearningJourneyPage
  }
};


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

  // ✅ Dynamic Game Rendering
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
    return (
      <div
        className="min-h-screen bg-cover bg-center"
        style={{
          backgroundImage: `url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/level1-XUUiuqLXdrFN3BtpvLSpLtUe5SsQZb.jpg')`,
          backgroundSize: "140%",
          backgroundPosition: "center",
        }}
      >
        <GameComponent {...gameProps} />
      </div>
    )
  }

  // ✅ Game Map Nodes
  const gameNodes: Array<{
    id: number
    title: string
    icon: string
    isCompleted: boolean
    isLocked: boolean
    onClick: () => void
  }> = [
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
      icon: "🏛️",
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

  return (
    <div
      className="min-h-screen bg-cover bg-center p-6"
      style={{
        backgroundImage: `url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/level1-XUUiuqLXdrFN3BtpvLSpLtUe5SsQZb.jpg')`,
        backgroundSize: "140%",
        backgroundPosition: "center",
        backgroundColor: "rgba(255, 255, 255, 0.3)",
        backgroundBlendMode: "lighten",
      }}
    >
      {/* Header with progress bar */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-gray-900 drop-shadow-lg flex-1 text-center">
          Level 1: Minimal Support
        </h1>
        <motion.button
          onClick={onProgressClick}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-4 p-4 bg-white/90 rounded-full shadow-lg hover:bg-white transition-all cursor-pointer"
        >
          <div>
            <div className="flex items-center justify-between text-sm font-semibold text-gray-700 mb-1">
              <span>Progress</span>
              <span>{Math.round(totalProgress)}%</span>
            </div>
            <div className="w-32 h-3 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${totalProgress}%` }}
                transition={{ duration: 0.5 }}
                className="h-full bg-gradient-to-r from-green-400 to-blue-500"
              />
            </div>
          </div>
        </motion.button>
      </div>

      {/* Game Path */}
      <GameTreePath games={gameNodes} />

      {/* Level Complete */}
      {progress.game1Completed &&
        progress.game2Completed &&
        progress.game3Completed &&
        progress.game4Completed &&
        progress.game5Completed &&
        progress.game6Completed && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mt-16 text-center"
          >
            <motion.button
              onClick={handleLevelComplete}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-yellow-300 to-orange-400 rounded-3xl p-8 shadow-2xl inline-block hover:shadow-3xl transition-all cursor-pointer"
            >
              <p className="text-4xl font-bold text-white drop-shadow-lg">🎉 Level Complete! 🎉</p>
              <p className="text-xl text-white mt-2 drop-shadow-lg">Click to see your rewards</p>
            </motion.button>
          </motion.div>
        )}

      {/* Popups */}
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