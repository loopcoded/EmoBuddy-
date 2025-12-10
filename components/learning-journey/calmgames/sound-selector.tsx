"use client";

import { useRef, useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface SoundSelectorProps {
  onComplete: () => void;
  onBack: () => void;
  durationSeconds?: number;
}

export function SoundSelector({
  onComplete,
  onBack,
  durationSeconds = 60,
}: SoundSelectorProps) {
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [totalTimeRemaining, setTotalTimeRemaining] = useState(durationSeconds);

  const audioRefs = useRef<Record<string, HTMLAudioElement>>({});
  const completedRef = useRef(false);

  // 🎵 YOUR REAL SOUND FILES from /public
  const sounds = [
    {
      id: "birds2",
      name: "Forest Birds",
      icon: "🕊️",
      description: "Light birds & nature",
      url: "/birds-crickets-and-crow-in-nature-ambience-432030.mp3",
    },
    {
      id: "water",
      name: "Water Stream",
      icon: "💧",
      description: "Relaxing bubbling water",
      url: "/bubbling-water-noise-395767.mp3",
    },
    {
      id: "wind",
      name: "Soft Wind",
      icon: "🍃",
      description: "Peaceful breeze",
      url: "/soft-wind-318856.mp3",
    },
    {
      id: "chimes",
      name: "Wind Chimes",
      icon: "🎐",
      description: "Gentle melodic chimes",
      url: "/wind-chimes-37762.mp3",
    },
    {
      id: "rain",
      name: "Light Rain",
      icon: "🌧️",
      description: "Calming spring rain",
      url: "/light-spring-rain-nature-sounds-31710.mp3",
    },
    {
      id: "ocean",
      name: "Ocean Waves",
      icon: "🌊",
      description: "Beach waves & seagulls",
      url: "/maldives-beach-381097.mp3",
    },
  ];

  // ▶️ Play sound on press
  const handlePressStart = (sound: any) => {
    if (!audioRefs.current[sound.id]) {
      const audio = new Audio(sound.url);
      audio.loop = true;
      audio.volume = 0.7;
      audioRefs.current[sound.id] = audio;
    }

    const audio = audioRefs.current[sound.id];
    audio.currentTime = 0;
    audio.play();

    setCurrentlyPlaying(sound.id);
  };

  // ⏹ Stop sound on release
  const handlePressEnd = (sound: any) => {
    const audio = audioRefs.current[sound.id];
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    setCurrentlyPlaying(null);
  };

  // Timer logic (unchanged)
  useEffect(() => {
    const interval = setInterval(() => {
      setTotalTimeRemaining((prev) => {
        const newVal = prev - 1;
        if (newVal <= 0 && !completedRef.current) {
          completedRef.current = true;

          Object.values(audioRefs.current).forEach((a) => {
            a.pause();
            a.currentTime = 0;
          });

          setTimeout(() => onComplete(), 0);
        }

        return Math.max(0, newVal);
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Card className="p-3 bg-white/80">
            <div className="text-sm font-medium">{totalTimeRemaining}s</div>
          </Card>

          <Card className="p-3 bg-white/80">
            <div className="text-sm font-medium">
              Hold to Listen 🎧
            </div>
          </Card>
        </div>

        {/* Instructions */}
        <Card className="p-6 mb-8 bg-white/90 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Enjoy Peaceful Sounds
          </h2>
          <p className="text-muted-foreground">
            Press and hold any sound to listen. Release to stop.
          </p>
        </Card>

        {/* Sound Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {sounds.map((sound) => (
            <Card
              key={sound.id}
              className={`p-6 cursor-pointer transition-all duration-300 hover:shadow-lg border-4 
                ${
                  currentlyPlaying === sound.id
                    ? "border-primary shadow-lg scale-105 animate-pulse-gentle"
                    : "border-transparent"
                }`}
              
              // MOUSE events
              onMouseDown={() => handlePressStart(sound)}
              onMouseUp={() => handlePressEnd(sound)}
              onMouseLeave={() => handlePressEnd(sound)}

              // TOUCH events
              onTouchStart={() => handlePressStart(sound)}
              onTouchEnd={() => handlePressEnd(sound)}
            >
              <div className="text-center space-y-4">
                <div className="text-6xl">{sound.icon}</div>
                <h3 className="text-lg font-semibold">{sound.name}</h3>
                <p className="text-sm text-muted-foreground">{sound.description}</p>

                {currentlyPlaying === sound.id && (
                  <div className="text-primary font-medium flex items-center justify-center gap-2">
                    🎵 <span>Playing...</span>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* Next Button */}
        <div className="flex justify-center">
          <Button
            onClick={() => {
              Object.values(audioRefs.current).forEach((a) => {
                a.pause();
                a.currentTime = 0;
              });
              onComplete();
            }}
            size="lg"
            className="rounded-xl bg-blue-500 hover:bg-blue-600 text-white px-8 py-6 text-lg font-semibold"
          >
            I feel calmer now
          </Button>
        </div>

      </div>
    </div>
  );
}
