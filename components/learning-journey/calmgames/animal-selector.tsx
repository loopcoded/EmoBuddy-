"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface AnimalSelectorProps {
  onComplete: () => void;
  onBack: () => void;
  durationSeconds?: number;
}

export function AnimalSelector({
  onComplete,
  onBack,
  durationSeconds = 60,
}: AnimalSelectorProps) {
  const [interactingWith, setInteractingWith] = useState<string | null>(null);
  const [totalTimeRemaining, setTotalTimeRemaining] = useState(durationSeconds);
  const completedRef = useRef(false);

  // Store audio objects
  const audioRefs = useRef<Record<string, HTMLAudioElement>>({});

  // YOUR ANIMALS + YOUR FILES
  const animals = [
    {
      id: "puppy",
      name: "Friendly Puppy",
      icon: "🐶",
      soundLabel: "Woof! Woof!",
      action: "wagging tail happily",
      url: "/puppy-bark.flac",
    },
    {
      id: "kitten",
      name: "Cuddly Kitten",
      icon: "🐱",
      soundLabel: "Meow~",
      action: "purring softly",
      url: "/cat-purring.wav",
    },
    {
      id: "bunny",
      name: "Soft Bunny",
      icon: "🐰",
      soundLabel: "Nibble nibble",
      action: "twitching nose",
      url: "/bunny-food.wav",
    },
    {
      id: "duck",
      name: "Happy Duck",
      icon: "🦆",
      soundLabel: "Quack! Quack!",
      action: "splashing gently",
      url: "/duck-quack.wav",
    },
    {
      id: "hamster",
      name: "Tiny Hamster",
      icon: "🐹",
      soundLabel: "Squeak!",
      action: "running on wheel",
      url: "/hamster.mp3",
    },
    {
      id: "bird",
      name: "Singing Bird",
      icon: "🐦",
      soundLabel: "Tweet! Tweet!",
      action: "flapping wings",
      url: "/birds-chirping.wav",
    },
  ];

  // ▶️ When pressing the card
  const handlePressStart = (animal: any) => {
    if (!audioRefs.current[animal.id]) {
      const audio = new Audio(animal.url);
      audio.loop = true; // play continuously while holding
      audio.volume = 0.9;
      audioRefs.current[animal.id] = audio;
    }

    const audio = audioRefs.current[animal.id];
    audio.currentTime = 0;
    audio.play();

    setInteractingWith(animal.id);
  };

  // ⏹ When releasing the card
  const handlePressEnd = (animal: any) => {
    const audio = audioRefs.current[animal.id];
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    setInteractingWith(null);
  };

  // Timer logic remains same
  useEffect(() => {
    const interval = setInterval(() => {
      setTotalTimeRemaining((prev) => {
        const newValue = prev - 1;
        if (newValue <= 0 && !completedRef.current) {
          completedRef.current = true;

          // Stop all audio
          Object.values(audioRefs.current).forEach((audio) => {
            audio.pause();
            audio.currentTime = 0;
          });

          setTimeout(() => onComplete(), 0);
        }
        return Math.max(0, newValue);
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-pink-50 p-6">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Button variant="outline" onClick={onBack} className="rounded-xl bg-white/80">
            ← Back
          </Button>

          <Card className="p-3 bg-white/80">
            <div className="text-sm font-medium">{totalTimeRemaining}s</div>
          </Card>

          <Card className="p-3 bg-white/80">
            <div className="text-sm font-medium">Hold an animal</div>
          </Card>
        </div>

        {/* Instructions */}
        <Card className="p-6 mb-8 bg-white/90 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Meet Your Animal Friends
          </h2>
          <p className="text-muted-foreground">
            Press and hold an animal to hear its real sound!
          </p>
        </Card>

        {/* Animal Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {animals.map((animal) => (
            <Card
              key={animal.id}
              className={`p-6 cursor-pointer transition-all duration-300 hover:shadow-lg border-4 
                ${
                  interactingWith === animal.id
                    ? "border-primary shadow-lg scale-105 animate-gentle-bounce"
                    : "border-transparent"
                }
              `}

              // Desktop events
              onMouseDown={() => handlePressStart(animal)}
              onMouseUp={() => handlePressEnd(animal)}
              onMouseLeave={() => handlePressEnd(animal)}

              // Mobile events
              onTouchStart={() => handlePressStart(animal)}
              onTouchEnd={() => handlePressEnd(animal)}
            >
              <div className="text-center space-y-4">
                <div className="text-6xl">{animal.icon}</div>
                <h3 className="text-lg font-semibold text-foreground">
                  {animal.name}
                </h3>

                {interactingWith === animal.id && (
                  <div className="space-y-2">
                    <div className="text-lg font-bold text-primary">
                      {animal.soundLabel}
                    </div>
                    <div className="text-sm text-muted-foreground italic">
                      {animal.action}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button onClick={onComplete} size="lg" className="rounded-xl animate-gentle-bounce">
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
