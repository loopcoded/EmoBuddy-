"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";

interface GameProps {
  onComplete: (score: number, total: number) => void;
  onBack: () => void;
}

const emotions = [
  { emotion: "Nervous", emoji: "😰", description: "Worried, anxious" },
  { emotion: "Proud", emoji: "😊🎉", description: "Happy about doing something good" },
  { emotion: "Excited", emoji: "🤩", description: "Very happy and energetic" },
  { emotion: "Embarrassed", emoji: "😳", description: "Shy, uncomfortable" },
  { emotion: "Angry", emoji: "😠", description: "Very upset" },
  { emotion: "Sad", emoji: "😢", description: "Unhappy, upset" },
  { emotion: "Relaxed", emoji: "😌", description: "Calm and peaceful" },
  { emotion: "Scared", emoji: "😨", description: "Afraid, frightened" },
];

export default function GameFacialBodyLanguage({ onComplete, onBack }: GameProps) {
  const [currentEmotionIndex, setCurrentEmotionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [allComplete, setAllComplete] = useState(false);

  const currentEmotion = emotions[currentEmotionIndex];

  // FIXED: Options stay FIXED for each question
  const options = useMemo(() => {
    const others = emotions
      .filter((_, idx) => idx !== currentEmotionIndex)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    return [...others, currentEmotion].sort(() => Math.random() - 0.5);
  }, [currentEmotionIndex]);

  const handleAnswerClick = (selectedIndex: number) => {
    if (isAnswered) return;

    setSelectedOptionIndex(selectedIndex);
    setIsAnswered(true);

    const selectedEmotion = options[selectedIndex];

    if (selectedEmotion.emotion === currentEmotion.emotion) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentEmotionIndex < emotions.length - 1) {
      setCurrentEmotionIndex((prev) => prev + 1);
      setSelectedOptionIndex(null);
      setIsAnswered(false);
    } else {
      setAllComplete(true);
    }
  };

  if (allComplete) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="bg-white shadow-2xl rounded-3xl p-12 text-center max-w-lg"
        >
          <div className="text-8xl mb-6 animate-bounce">🎉</div>
          <h2 className="text-3xl font-bold text-indigo-600 mb-4">Emotion Expert!</h2>
          <p className="text-xl text-gray-700 mb-2">
            You scored {score}/{emotions.length}
          </p>
          <p className="text-gray-600 mb-8">
            You recognized all the facial & body expressions!
          </p>
          <button
            onClick={() => onComplete(score, emotions.length)}
            className="px-6 py-3 w-full bg-gradient-to-r from-indigo-400 to-indigo-600 text-white rounded-xl font-bold hover:shadow-lg text-lg"
          >
            Return to Journey
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-2xl w-full">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={onBack}
            className="px-4 py-2 bg-gray-200 rounded-lg text-gray-800 font-bold hover:bg-gray-300 transition-all"
          >
            ← Back
          </button>

          <h2 className="text-2xl font-bold text-indigo-600">
            Facial & Body Language
          </h2>

          <div className="text-2xl font-bold text-indigo-600">
            😊 {score}/{emotions.length}
          </div>
        </div>

        {/* Progress */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${((currentEmotionIndex + 1) / emotions.length) * 100}%` }}
            className="h-full bg-gradient-to-r from-indigo-400 to-indigo-600 rounded-full"
          />
        </div>

        {/* Emotion Card */}
        <div className="bg-gradient-to-br from-indigo-100 to-indigo-50 rounded-2xl p-8 mb-8 text-center">
          <p className="text-lg font-semibold text-indigo-700 mb-4">How is this person feeling?</p>
          <div className="text-9xl mb-4 animate-bounce">{currentEmotion.emoji}</div>
          <p className="text-gray-600 italic">{currentEmotion.description}</p>
        </div>

        <p className="text-lg font-bold text-center mb-4 text-gray-800">Choose the emotion:</p>

        {/* Answer Options */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {options.map((opt, idx) => {
            const correct = opt.emotion === currentEmotion.emotion;
            const selected = selectedOptionIndex === idx;

            let className =
              "p-4 rounded-xl text-center font-bold transition-all cursor-pointer";

            if (!isAnswered) {
              className +=
                " bg-gradient-to-r from-indigo-400 to-indigo-500 text-white hover:shadow-lg";
            } else {
              if (selected && correct)
                className +=
                  " bg-gradient-to-r from-green-400 to-green-500 text-white ring-4 ring-green-300";
              else if (selected && !correct)
                className +=
                  " bg-gradient-to-r from-red-400 to-red-500 text-white ring-4 ring-red-300";
              else className += " bg-gray-200 text-gray-500";
            }

            return (
              <motion.button
                key={idx}
                whileHover={!isAnswered ? { scale: 1.05 } : {}}
                className={className}
                disabled={isAnswered}
                onClick={() => handleAnswerClick(idx)}
              >
                <div className="text-3xl mb-1">{opt.emoji}</div>
                <div className="text-sm">{opt.emotion}</div>
              </motion.button>
            );
          })}
        </div>

        {/* Feedback */}
        {isAnswered && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`text-center p-4 rounded-xl mb-6 font-bold text-lg ${
              options[selectedOptionIndex!].emotion === currentEmotion.emotion
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {options[selectedOptionIndex!].emotion === currentEmotion.emotion
              ? `✅ Correct! They feel ${currentEmotion.emotion}.`
              : `❌ Not quite. This is actually ${currentEmotion.emotion}.`}
          </motion.div>
        )}

        {/* Buttons */}
        {isAnswered && (
          <>
            {options[selectedOptionIndex!].emotion !== currentEmotion.emotion ? (
              <button
                onClick={() => {
                  setSelectedOptionIndex(null);
                  setIsAnswered(false);
                }}
                className="w-full py-3 bg-yellow-500 text-white rounded-xl font-bold hover:shadow-lg text-lg"
              >
                Try Again
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="w-full py-3 bg-green-500 text-white rounded-xl font-bold hover:shadow-lg text-lg"
              >
                {currentEmotionIndex < emotions.length - 1
                  ? "Next Emotion →"
                  : "Finish Game"}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
