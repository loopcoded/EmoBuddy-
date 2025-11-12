"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
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
};

const LEVEL_NUMBER = 2;

interface Level2JourneyProps {
  childID?: string
  onProgressClick?: () => void
  initialProgress?: GameProgress
  onProgressUpdated?: () => void;
}


export default function Level2Journey({ childID, onProgressClick, initialProgress , onProgressUpdated}: Level2JourneyProps = {}) {
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
            const parsed = data.state;
            setProgress(parsed);
            // ✅ Resume logic: if lastPlayedGame is set and that game is not complete, resume it
            if (parsed.lastPlayedGame && !parsed[`game${parsed.lastPlayedGame}Completed`]) {
              setCurrentGame(parsed.lastPlayedGame);
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

    return (
      <div
        className="min-h-screen bg-cover bg-center"
        style={{
          backgroundImage: `url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/level2-Ch0TkYHV4M15nZFDjBXl5nlZXpW4FH.jpg')`,
          backgroundSize: "140%",
          backgroundPosition: "center",
        }}
      >
        <GameComponent {...gameProps} />
      </div>
    )
  }

  // ✅ Game map setup
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
      icon: "🔊",
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

  return (
    <div
      className="min-h-screen bg-cover bg-center p-6"
      style={{
        backgroundImage: `url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/level2-Ch0TkYHV4M15nZFDjBXl5nlZXpW4FH.jpg')`,
        backgroundSize: "140%",
        backgroundPosition: "center",
        backgroundColor: "rgba(255, 255, 255, 0.3)",
        backgroundBlendMode: "lighten",
      }}
    >
      {/* Header and Progress */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-gray-900 drop-shadow-lg flex-1 text-center">
          Level 2: Intermediate Support
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
                className="h-full bg-lienar-to-r from-purple-400 to-pink-500"
              />
            </div>
          </div>
        </motion.button>
      </div>

      <GameTreePath games={gameNodes} />

      {/* Level Completion Celebration */}
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
              className="bg-gradient-to-r from-purple-400 to-pink-500 rounded-3xl p-8 shadow-2xl inline-block hover:shadow-3xl transition-all cursor-pointer"
            >
              <p className="text-4xl font-bold text-white drop-shadow-lg">🎉 Level Complete! 🎉</p>
              <p className="text-xl text-white mt-2 drop-shadow-lg">Click to see your rewards</p>
            </motion.button>
          </motion.div>
        )}

      {/* Reward & Avatar */}
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
        levelNumber={2}
        avatarConfig={childProfile?.avatarConfig || {}}
        childID={childID}
        onNavigateToMap={handleNavigateBack}
      />
    </div>
  )
}