"use client";

import { useEffect } from "react";
import { AvatarDisplay } from "./avatar-generator";
import confetti from "canvas-confetti";
import { motion } from "framer-motion";

interface NavbarProps {
  childName: string;
  avatarConfig: Record<string, unknown>;
  completedLevels: number;
  totalLevels: number;
}

interface AvatarConfig {
  seed: string;
  style: string;
}

export function LevelMapNavbar({
  childName,
  avatarConfig,
  completedLevels,
  totalLevels,
}: NavbarProps) {
  const progressPercent =
    totalLevels > 0 ? Math.round((completedLevels / totalLevels) * 100) : 0;

  // 🎊 Trigger confetti when progress hits 100%
  useEffect(() => {
    if (progressPercent === 100) {
      const duration = 3000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

      const randomInRange = (min: number, max: number) =>
        Math.random() * (max - min) + min;

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.2, 0.8), y: randomInRange(0.2, 0.6) },
          colors: ["#00BFA5", "#4CAF50", "#FFD700", "#42A5F5", "#FF7043"],
        });
      }, 200);

      return () => clearInterval(interval);
    }
  }, [progressPercent]);

  return (
    <motion.div 
      className="fixed top-0 right-0 left-0 bg-gradient-to-r from-white/95 via-mint-50/95 to-blue-50/95 backdrop-blur-xl border-b-4 border-mint-200 shadow-lg z-50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
    >
      {/* Animated top border */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-mint-400 via-blue-400 to-purple-400"
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{
          backgroundSize: "200% 100%"
        }}
      />

      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Spacer for left side */}
        <div className="flex-1" />

        <motion.div 
          className="flex items-center gap-6"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          {/* ✅ Enhanced Progress Capsule */}
          <motion.div 
            className="bg-gradient-to-r from-mint-200 via-blue-200 to-purple-200 rounded-full px-8 py-4 flex items-center gap-5 shadow-xl relative overflow-hidden"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {/* Animated shine effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
              animate={{ x: [-200, 400] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
            />

            {/* Progress section */}
            <div className="flex-1 min-w-36 relative z-10">
              <div className="flex items-center justify-between text-sm font-black text-gray-800 mb-2">
                <motion.span
                  animate={{ 
                    scale: progressPercent === 100 ? [1, 1.2, 1] : 1 
                  }}
                  transition={{ duration: 0.5, repeat: progressPercent === 100 ? Infinity : 0 }}
                >
                  Progress
                </motion.span>
                <motion.span
                  className={progressPercent === 100 ? "text-green-600" : ""}
                  animate={progressPercent === 100 ? {
                    scale: [1, 1.3, 1],
                    color: ["#059669", "#10b981", "#059669"]
                  } : {}}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  {progressPercent}%
                </motion.span>
              </div>

              <div className="w-36 h-3 bg-white rounded-full overflow-hidden shadow-inner border-2 border-gray-200">
                <motion.div
                  className="h-full bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 relative overflow-hidden"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                >
                  {/* Shimmer effect on progress bar */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                    animate={{ x: [-100, 200] }}
                    transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 0.5 }}
                  />
                </motion.div>
              </div>

              {/* Milestone stars */}
              <div className="absolute -bottom-2 left-0 right-0 flex justify-between px-1">
                {[25, 50, 75, 100].map((milestone) => (
                  <motion.span
                    key={milestone}
                    className={`text-xs ${progressPercent >= milestone ? "text-yellow-500" : "text-gray-300"}`}
                    animate={progressPercent >= milestone ? {
                      scale: [1, 1.5, 1],
                      rotate: [0, 360],
                    } : {}}
                    transition={{ 
                      duration: 0.5,
                      delay: milestone / 400 
                    }}
                  >
                    ⭐
                  </motion.span>
                ))}
              </div>
            </div>

            {/* Avatar with pulse effect */}
            <motion.div 
              className="shrink-0 relative"
              animate={{
                y: [0, -5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <motion.div
                className="absolute inset-0 rounded-full bg-mint-400/30"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.5, 0, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              />
              <AvatarDisplay
                config={avatarConfig as unknown as AvatarConfig}
                size="sm"
              />
            </motion.div>

            {/* Child name with greeting */}
            <motion.div 
              className="text-sm font-black text-gray-800 whitespace-nowrap relative z-10"
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2"
              >
                <motion.span
                  animate={{ rotate: [0, 14, -8, 14, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
                >
                  👋
                </motion.span>
                {childName}
              </motion.div>
            </motion.div>

            {/* Achievement badge for 100% */}
            {progressPercent === 100 && (
              <motion.div
                className="absolute -right-3 -top-3 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full p-2 shadow-lg"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ 
                  scale: 1, 
                  rotate: 0,
                  y: [0, -5, 0]
                }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  y: { duration: 1, repeat: Infinity }
                }}
              >
                <span className="text-xl">🏆</span>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </div>

      {/* Celebration message for 100% */}
      {progressPercent === 100 && (
        <motion.div
          className="absolute left-1/2 transform -translate-x-1/2 -bottom-12 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 text-white px-6 py-2 rounded-full font-black text-sm shadow-lg"
          initial={{ opacity: 0, y: -20, scale: 0.8 }}
          animate={{ 
            opacity: 1, 
            y: 0, 
            scale: 1,
          }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <motion.span
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            🎉 AMAZING! ALL LEVELS COMPLETE! 🎉
          </motion.span>
        </motion.div>
      )}
    </motion.div>
  );
}