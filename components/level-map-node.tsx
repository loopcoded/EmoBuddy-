"use client"

interface LevelNode {
  id: number
  title: string
  description: string
  isUnlocked: boolean
  isCurrentLevel: boolean
  isCompleted: boolean
  rewards: string[]
}

export function LevelMapNode({
  level,
  onClick,
}: {
  level: LevelNode
  onClick: () => void
}) {
  return (
    <div className="relative group">
      <button
        onClick={onClick}
        disabled={!level.isUnlocked}
        className={`relative w-32 h-32 rounded-full flex items-center justify-center font-bold text-2xl transition-all duration-300 transform ${
          !level.isUnlocked
            ? "bg-gray-300 text-gray-500 cursor-not-allowed opacity-50"
            : level.isCurrentLevel
              ? "bg-gradient-to-br from-mint-400 via-blue-400 to-cyan-400 text-white shadow-2xl scale-110 hover:scale-125 animate-pulse-glow"
              : level.isCompleted
                ? "bg-gradient-to-br from-green-400 to-emerald-400 text-white shadow-xl scale-105 hover:scale-110 animate-bounce-subtle"
                : "bg-white border-4 border-mint-300 text-mint-600 hover:shadow-2xl hover:scale-105 hover:border-mint-400 animate-float-slow"
        }`}
      >
        {/* Outer glow ring */}
        {level.isUnlocked && (
          <div
            className={`absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
              level.isCurrentLevel
                ? "bg-gradient-to-br from-mint-400 to-blue-400 blur-xl"
                : level.isCompleted
                  ? "bg-gradient-to-br from-green-400 to-emerald-400 blur-xl"
                  : "bg-gradient-to-br from-mint-300 to-blue-300 blur-xl"
            }`}
          />
        )}

        {/* Inner content wrapper */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full gap-1">
          <span className="text-3xl font-black">{level.id}</span>
          {level.isCompleted && <span className="text-xl">✓</span>}
          {level.isCurrentLevel && <span className="text-lg animate-spin">★</span>}
        </div>

        {/* Decorative rings for completed levels */}
        {level.isCompleted && (
          <div className="absolute inset-0 rounded-full border-2 border-green-300 opacity-30 animate-pulse" />
        )}

        {/* Status badge */}
        {level.isUnlocked && (
          <div
            className={`absolute -top-3 -right-3 px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg ${
              level.isCurrentLevel
                ? "bg-gradient-to-r from-mint-500 to-blue-500 animate-bounce"
                : level.isCompleted
                  ? "bg-gradient-to-r from-green-500 to-emerald-500"
                  : "bg-gradient-to-r from-gray-400 to-gray-500"
            }`}
          >
            {level.isCurrentLevel ? "Active" : level.isCompleted ? "Done" : "Ready"}
          </div>
        )}
      </button>

      {/* Reward indicators with enhanced animation */}
      {level.isUnlocked && (
        <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 text-center whitespace-nowrap">
          <div className="flex gap-2 justify-center animate-fade-in-delayed">
            {level.rewards.map((reward, idx) => (
              <div key={idx} className="text-xl animate-float-up" style={{ animationDelay: `${idx * 100}ms` }}>
                {reward}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Locked state indicator */}
      {!level.isUnlocked && (
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs font-semibold text-gray-500 whitespace-nowrap">
          Complete Previous Level
        </div>
      )}
    </div>
  )
}
