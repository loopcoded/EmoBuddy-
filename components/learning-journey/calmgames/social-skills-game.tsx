"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Mascot } from "@/components/learning-journey/calmgames/mascot"
import { GameModule } from "@/components/learning-journey/calmgames/game-module"

interface SocialSkillsGameProps {
  onComfortChange: (level: "comfortable" | "uncomfortable" | "neutral") => void
  onBackToWelcome: () => void
  onCalmingMode: () => void
}

const gameModules = [
  {
    id: 1,
    title: "Sharing a Toy",
    scene: "Sara and Max both want the red ball.",
    illustration: "🏀",
    choices: [
      {
        id: 1,
        text: "Share the ball",
        isCorrect: true,
        feedback: "Great! Now both can play together. Sharing makes everyone happy!",
      },
      {
        id: 2,
        text: "Take the ball away",
        isCorrect: false,
        feedback: "That's a strong choice, but taking can make someone sad. Let's try sharing instead!",
      },
      {
        id: 3,
        text: "Ignore Sara",
        isCorrect: false,
        feedback: "Hmm, ignoring might make a friend feel left out. Want to try again?",
      },
    ],
  },
  {
    id: 2,
    title: "Greeting a Friend",
    scene: "Liam sees his friend Ava coming.",
    illustration: "👋",
    choices: [
      {
        id: 1,
        text: 'Say "Hi Ava!" and smile',
        isCorrect: true,
        feedback: "Yes! That makes Ava feel happy and welcome!",
      },
      {
        id: 2,
        text: "Look away",
        isCorrect: false,
        feedback: "Looking away might make Ava think you don't want to play. Try saying hello!",
      },
      {
        id: 3,
        text: "Walk away",
        isCorrect: false,
        feedback: "That might make Ava sad. Let's try greeting her with a friendly hello!",
      },
    ],
  },
  {
    id: 3,
    title: "Taking Turns",
    scene: "Nina and Sam both want to use the swing.",
    illustration: "🛝",
    choices: [
      {
        id: 1,
        text: "Take turns",
        isCorrect: true,
        feedback: "Perfect! Everyone gets a chance when we take turns!",
      },
      {
        id: 2,
        text: "Push Sam off",
        isCorrect: false,
        feedback: "Oops, pushing can hurt. A kind way is to wait your turn and ask nicely!",
      },
      {
        id: 3,
        text: "Cry loudly",
        isCorrect: false,
        feedback: "Crying shows you're upset, but let's try another way to solve it together!",
      },
    ],
  },
  {
    id: 4,
    title: "Asking for Help",
    scene: "Mia can't open her lunch box.",
    illustration: "🍱",
    choices: [
      {
        id: 1,
        text: "Ask a teacher politely",
        isCorrect: true,
        feedback: "Yes! Asking for help is a smart way to solve a problem.",
      },
      {
        id: 2,
        text: "Throw the lunch box",
        isCorrect: false,
        feedback: "Throwing might break it. Let's find a kinder way.",
      },
      {
        id: 3,
        text: "Sit quietly and stay hungry",
        isCorrect: false,
        feedback: "Staying hungry won't help. Let's ask for help instead!",
      },
    ],
  },
  {
    id: 5,
    title: "Saying Sorry",
    scene: "Alex bumps into his friend by accident.",
    illustration: "😅",
    choices: [
      {
        id: 1,
        text: 'Say "Sorry!"',
        isCorrect: true,
        feedback: "That's right! Saying sorry makes your friend feel better.",
      },
      {
        id: 2,
        text: "Run away quickly",
        isCorrect: false,
        feedback: "Running away doesn't fix it. Let's try saying sorry.",
      },
      {
        id: 3,
        text: "Laugh at them",
        isCorrect: false,
        feedback: "Laughing could hurt feelings. A kind sorry works best.",
      },
    ],
  },
  {
    id: 6,
    title: "Taking Turns in Conversation",
    scene: "Two kids are talking. One wants to say something.",
    illustration: "💬",
    choices: [
      {
        id: 1,
        text: "Wait for the friend to finish, then speak",
        isCorrect: true,
        feedback: "Great! Taking turns makes conversations fun.",
      },
      {
        id: 2,
        text: "Interrupt and talk loudly",
        isCorrect: false,
        feedback: "Interrupting makes it hard for others to talk.",
      },
      {
        id: 3,
        text: "Stay quiet and never speak",
        isCorrect: false,
        feedback: "It's okay to join in! Waiting your turn is the best way.",
      },
    ],
  },
  {
    id: 7,
    title: "Including Others",
    scene: "Emma and Leo are playing a game. Another child wants to join.",
    illustration: "🤝",
    choices: [
      {
        id: 1,
        text: "Invite them to play",
        isCorrect: true,
        feedback: "Wonderful! Including others makes everyone happy.",
      },
      {
        id: 2,
        text: 'Say "No, go away!"',
        isCorrect: false,
        feedback: "That could hurt feelings. Let's invite them instead.",
      },
      {
        id: 3,
        text: "Ignore the child",
        isCorrect: false,
        feedback: "Ignoring can make someone feel left out. Let's welcome them.",
      },
    ],
  },
  {
    id: 8,
    title: "Responding to Praise",
    scene: 'A teacher says, "Great drawing, Sam!"',
    illustration: "🎨",
    choices: [
      {
        id: 1,
        text: 'Say "Thank you!"',
        isCorrect: true,
        feedback: "Yes! Saying thank you shows kindness.",
      },
      {
        id: 2,
        text: 'Say "It\'s not good"',
        isCorrect: false,
        feedback: "You worked hard—let's accept compliments with a thank you.",
      },
      {
        id: 3,
        text: "Ignore the teacher",
        isCorrect: false,
        feedback: "Ignoring can seem rude. A thank you is perfect.",
      },
    ],
  },
  {
    id: 9,
    title: "Waiting Patiently",
    scene: "Kids are waiting in line for the slide.",
    illustration: "🛝",
    choices: [
      {
        id: 1,
        text: "Wait calmly for your turn",
        isCorrect: true,
        feedback: "Perfect! Everyone gets to enjoy the slide fairly.",
      },
      {
        id: 2,
        text: "Push to the front",
        isCorrect: false,
        feedback: "Pushing isn't safe. Waiting is better.",
      },
      {
        id: 3,
        text: 'Shout loudly "Let me go first!"',
        isCorrect: false,
        feedback: "Shouting can upset others. Let's wait calmly.",
      },
    ],
  },
  {
    id: 10,
    title: "Expressing Feelings",
    scene: "Noah feels sad because his toy broke.",
    illustration: "😢",
    choices: [
      {
        id: 1,
        text: 'Tell a friend or adult, "I feel sad."',
        isCorrect: true,
        feedback: "Great! Talking about feelings helps others understand.",
      },
      {
        id: 2,
        text: "Throw another toy",
        isCorrect: false,
        feedback: "Throwing doesn't show feelings safely.",
      },
      {
        id: 3,
        text: "Stay quiet and hide",
        isCorrect: false,
        feedback: "It's okay to share feelings. That way, others can help.",
      },
    ],
  },
  {
    id: 11,
    title: "Asking to Join a Game",
    scene: "Two children are playing with blocks. You want to join.",
    illustration: "🧱",
    choices: [
      {
        id: 1,
        text: 'Say "Can I play too?"',
        isCorrect: true,
        feedback: "Nice! Asking politely lets you join in.",
      },
      {
        id: 2,
        text: "Take blocks without asking",
        isCorrect: false,
        feedback: "Taking without asking may upset them. Let's try asking.",
      },
      {
        id: 3,
        text: "Walk away sadly",
        isCorrect: false,
        feedback: "It's okay to ask! Sometimes friends are happy to include you.",
      },
    ],
  },
]

export function SocialSkillsGame({ onComfortChange, onBackToWelcome, onCalmingMode }: SocialSkillsGameProps) {
  const [currentModule, setCurrentModule] = useState(0)
  const [gameState, setGameState] = useState<"menu" | "playing" | "completed">("menu")
  const [completedModules, setCompletedModules] = useState<number[]>([])

  const handleModuleComplete = (moduleId: number) => {
    setCompletedModules((prev) => [...prev, moduleId])
    setGameState("menu")
    onComfortChange("comfortable")
  }

  const handleModuleStart = (index: number) => {
    setCurrentModule(index)
    setGameState("playing")
  }

  const handleNeedCalming = () => {
    onComfortChange("uncomfortable")
    onCalmingMode()
  }

  if (gameState === "playing") {
    return (
      <GameModule
        module={gameModules[currentModule]}
        onComplete={() => handleModuleComplete(gameModules[currentModule].id)}
        onNeedCalming={handleNeedCalming}
        onBackToMenu={() => setGameState("menu")}
      />
    )
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header with mascot */}
        <div className="flex flex-col items-center mb-8">
          <Mascot message="Choose a story to learn about friendship and kindness!" emotion="excited" size="medium" />
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mb-8">
          <Button variant="outline" onClick={onBackToWelcome} className="rounded-xl bg-transparent">
            ← Back to Home
          </Button>
          <Button variant="secondary" onClick={onCalmingMode} className="rounded-xl">
            🫧 Need to Calm Down?
          </Button>
        </div>

        {/* Game Modules Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gameModules.map((module, index) => (
            <Card
              key={module.id}
              className="p-6 hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-primary/50"
              onClick={() => handleModuleStart(index)}
            >
              <div className="text-center space-y-4">
                {/* Module illustration */}
                <div className="text-6xl mb-4">{module.illustration}</div>

                {/* Module title */}
                <h3 className="text-xl font-bold text-foreground">{module.title}</h3>

                {/* Module description */}
                <p className="text-sm text-muted-foreground text-pretty">{module.scene}</p>

                {/* Completion status */}
                {completedModules.includes(module.id) ? (
                  <div className="flex items-center justify-center gap-2 text-primary font-medium">
                    <span>✅</span>
                    <span>Completed!</span>
                  </div>
                ) : (
                  <Button className="w-full rounded-xl">Start Story</Button>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* Progress indicator */}
        <div className="mt-8 text-center">
          <div className="text-sm text-muted-foreground mb-2">
            Progress: {completedModules.length} of {gameModules.length} stories completed
          </div>
          <div className="w-full bg-secondary rounded-full h-3 max-w-md mx-auto">
            <div
              className="bg-primary h-3 rounded-full transition-all duration-500"
              style={{ width: `${(completedModules.length / gameModules.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Completion celebration */}
        {completedModules.length === gameModules.length && (
          <Card className="mt-8 p-6 bg-primary/10 border-primary/20">
            <div className="text-center space-y-4">
              <div className="text-4xl">🎉</div>
              <h3 className="text-xl font-bold text-primary">Amazing Work!</h3>
              <p className="text-muted-foreground">
                You've completed all the friendship stories! You're becoming great at social skills!
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
