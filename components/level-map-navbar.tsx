"use client";

import { useEffect } from "react";
import { AvatarDisplay } from "./avatar-generator";
import confetti from "canvas-confetti";

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
      const duration = 2500;
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
    <div className="fixed top-0 right-0 left-0 bg-white/90 backdrop-blur border-b border-mint-200 shadow-md z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Spacer for left side */}
        <div className="flex-1" />

        <div className="flex items-center gap-6">
          {/* ✅ Progress Capsule */}
          <div className="bg-gradient-to-r from-mint-300 to-blue-300 rounded-full px-6 py-3 flex items-center gap-4 shadow-lg transition-all">
            <div className="flex-1 min-w-32">
              <div className="flex items-center justify-between text-sm font-semibold text-gray-700 mb-1">
                <span>Progress</span>
                <span>{progressPercent}%</span>
              </div>

              <div className="w-32 h-2 bg-white rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-400 to-green-500 transition-all duration-500 ease-out"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Avatar */}
            <div className="shrink-0">
              <AvatarDisplay
                config={avatarConfig as unknown as AvatarConfig}
                size="sm"
              />
            </div>

            {/* Child name */}
            <div className="text-sm font-semibold text-gray-800 whitespace-nowrap">
              {childName}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
