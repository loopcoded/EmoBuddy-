"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Level1Journey from "@/components/learning-journey/level1-journey";
import Level2Journey from "@/components/learning-journey/level2-journey";
import Level3Journey from "@/components/learning-journey/level3-journey";
import { motion, AnimatePresence } from "framer-motion";

export default function LearningJourneyPage() {
  const params = useParams();
  const level = params.level as string;
  const [childID, setChildID] = useState<string | null>(null);
  const [progress, setProgress] = useState<any>(null);
  const [progressPercent, setProgressPercent] = useState(0);
  const [isReady, setIsReady] = useState(false);

  // ✅ Reusable fetch function
  const fetchProgress = useCallback(async (childId: string, levelNum: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/progress/get-state/${childId}/${levelNum}`);
      const data = await res.json();
      if (data?.success && data.state) {
        setProgress(data.state);

        const completed = [
          data.state.game1Completed,
          data.state.game2Completed,
          data.state.game3Completed,
          data.state.game4Completed,
          data.state.game5Completed,
          data.state.game6Completed,
        ].filter(Boolean).length;

        setProgressPercent(Math.round((completed / 6) * 100));
      } else {
        setProgressPercent(0);
      }
    } catch (err) {
      console.error("Failed to fetch progress:", err);
      setProgressPercent(0);
    }
  }, []);

  // ✅ Load childID and initial progress
  useEffect(() => {
    const storedChildID = localStorage.getItem("childID");
    setChildID(storedChildID);
    if (storedChildID) fetchProgress(storedChildID, level);
    setIsReady(true);
  }, [fetchProgress, level]);

  // ✅ Callback to refresh progress (called from child)
  const handleProgressUpdate = async () => {
    if (childID) await fetchProgress(childID, level);
  };

  if (!isReady) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center relative overflow-hidden">
        {/* Floating loading elements */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-4xl"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + (i % 3) * 20}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.3,
            }}
          >
            {['📚', '🎯', '⭐', '🎨', '✨', '🌟'][i]}
          </motion.div>
        ))}

        <div className="text-center relative z-10">
          <motion.div
            className="w-24 h-24 rounded-full bg-gradient-to-r from-mint-400 via-blue-400 to-purple-400 mx-auto mb-6 relative"
            animate={{
              rotate: [0, 360],
              scale: [1, 1.1, 1],
            }}
            transition={{
              rotate: { duration: 2, repeat: Infinity, ease: "linear" },
              scale: { duration: 1, repeat: Infinity },
            }}
          >
            {/* Inner rotating circle */}
            <motion.div
              className="absolute inset-2 rounded-full bg-white"
              animate={{ rotate: [0, -360] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
            {/* Center dot */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="w-8 h-8 rounded-full bg-gradient-to-r from-mint-500 to-blue-500"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            </div>
          </motion.div>

          <motion.p 
            className="text-gray-600 text-2xl font-bold"
            animate={{ 
              opacity: [0.5, 1, 0.5],
              y: [0, -5, 0]
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            Loading learning journey...
          </motion.p>

          <motion.div
            className="mt-4 flex justify-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-3 h-3 rounded-full bg-mint-400"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </motion.div>
        </div>
      </div>
    );
  }

  if (!childID) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <motion.div 
          className="text-center bg-white/90 backdrop-blur p-12 rounded-3xl shadow-2xl border-4 border-red-200"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring" }}
        >
          <motion.div
            className="text-6xl mb-6"
            animate={{ 
              rotate: [0, -10, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            😕
          </motion.div>
          <p className="text-gray-700 text-xl font-bold mb-4">Oops! No profile selected</p>
          <p className="text-gray-600">Please go back and select a profile</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 20 + 15}px`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
              opacity: [0.1, 0.3, 0.1],
              rotate: [0, 360],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          >
            {['⭐', '✨', '🌟', '💫'][Math.floor(Math.random() * 4)]}
          </motion.div>
        ))}
      </div>

      {/* 🟩 Enhanced Header with progress bar */}
      <motion.div 
        className="relative z-10 px-8 py-6"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <div className="flex items-center justify-between">
          <motion.h1 
            className="text-4xl font-black bg-gradient-to-r from-mint-500 via-blue-500 to-purple-500 bg-clip-text text-transparent drop-shadow-lg"
            animate={{
              textShadow: [
                "0 0 10px rgba(0,191,165,0.3)",
                "0 0 20px rgba(66,165,245,0.5)",
                "0 0 10px rgba(0,191,165,0.3)"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Level {level}: Learning Journey
          </motion.h1>

          <motion.div
            className="bg-white/90 backdrop-blur-lg rounded-full px-6 py-4 shadow-2xl w-72 border-4 border-mint-200 relative overflow-hidden"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            transition={{ delay: 0.3 }}
          >
            {/* Animated shine effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
              animate={{ x: [-300, 500] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
            />

            <div className="relative z-10">
              <div className="flex justify-between text-sm font-black text-gray-700 mb-2">
                <span>Progress</span>
                <motion.span
                  animate={progressPercent === 100 ? {
                    scale: [1, 1.2, 1],
                    color: ["#059669", "#10b981", "#059669"]
                  } : {}}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  {progressPercent}%
                </motion.span>
              </div>

              <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden shadow-inner border-2 border-gray-300">
                <motion.div
                  className="h-full bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 relative"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                >
                  {/* Shimmer effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                    animate={{ x: [-100, 300] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                </motion.div>
              </div>

              {/* Milestone indicators */}
              <div className="flex justify-between mt-2 px-1">
                {[0, 33, 66, 100].map((milestone) => (
                  <motion.div
                    key={milestone}
                    className={`text-xs ${progressPercent >= milestone ? "text-green-500" : "text-gray-300"}`}
                    animate={progressPercent >= milestone ? {
                      scale: [1, 1.3, 1],
                      rotate: [0, 360],
                    } : {}}
                    transition={{ duration: 0.5 }}
                  >
                    {progressPercent >= milestone ? "🎯" : "○"}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Celebration for 100% */}
            {progressPercent === 100 && (
              <motion.div
                className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full p-2 shadow-lg"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ 
                  scale: 1, 
                  rotate: 0,
                  y: [0, -5, 0]
                }}
                transition={{
                  scale: { type: "spring" },
                  y: { duration: 1, repeat: Infinity }
                }}
              >
                <span className="text-xl">🏆</span>
              </motion.div>
            )}
          </motion.div>
        </div>
      </motion.div>

      {/* 🧩 Render level journeys with fade transition */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="relative z-10"
      >
        <AnimatePresence mode="wait">
          {level === "1" && (
            <motion.div
              key="level1"
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ type: "spring" }}
            >
              <Level1Journey
                childID={childID}
                initialProgress={progress}
                onProgressUpdated={handleProgressUpdate}
              />
            </motion.div>
          )}
          {level === "2" && (
            <motion.div
              key="level2"
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ type: "spring" }}
            >
              <Level2Journey
                childID={childID}
                initialProgress={progress}
                onProgressUpdated={handleProgressUpdate}
              />
            </motion.div>
          )}
          {level === "3" && (
            <motion.div
              key="level3"
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ type: "spring" }}
            >
              <Level3Journey
                childID={childID}
                initialProgress={progress}
                onProgressUpdated={handleProgressUpdate}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}