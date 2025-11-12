"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Level1Journey from "@/components/learning-journey/level1-journey";
import Level2Journey from "@/components/learning-journey/level2-journey";
import Level3Journey from "@/components/learning-journey/level3-journey";
import { motion } from "framer-motion";

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
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-mint-400 animate-pulse mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading learning journey...</p>
        </div>
      </div>
    );
  }

  if (!childID) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg">Please go back and select a profile</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* 🟩 Header with progress bar */}
      <div className="flex items-center justify-between px-8 py-6">
        <h1 className="text-3xl font-bold text-gray-900 drop-shadow-lg">
          Level {level}: Learning Journey
        </h1>
        <motion.div
          className="bg-white/80 rounded-full px-4 py-3 shadow-lg w-64"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="flex justify-between text-sm font-semibold text-gray-700 mb-1">
            <span>Progress</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-linear-to-r from-green-400 to-blue-500"
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </motion.div>
      </div>

      {/* 🧩 Render level journeys */}
      {level === "1" && (
        <Level1Journey
          childID={childID}
          initialProgress={progress}
          onProgressUpdated={handleProgressUpdate} // ✅ added
        />
      )}
      {level === "2" && (
        <Level2Journey
          childID={childID}
          initialProgress={progress}
          onProgressUpdated={handleProgressUpdate} // ✅ added
        />
      )}
      {level === "3" && (
        <Level3Journey
          childID={childID}
          initialProgress={progress}
          onProgressUpdated={handleProgressUpdate} // ✅ added
        />
      )}
    </div>
  );
}
