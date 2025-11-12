// @/services/progress.service.ts
import ChildProfile from "../models/ChildProfile.model.js";

export async function getProgressState(childID: string, level: string) {
  const child = await ChildProfile.findById(childID).select("levelProgress");
  return child?.levelProgress?.get(level) || null;
}

export async function saveProgressState(childID: string, level: string, state: any) {
  const child = await ChildProfile.findById(childID);
  if (!child) throw new Error("Child not found");

  if (!child.levelProgress) child.levelProgress = new Map();
  child.levelProgress.set(level.toString(), state);

  // Mark the map as modified so Mongoose saves it properly
  child.markModified("levelProgress");
  await child.save();

  return child;
}

export async function logGameCompletion(childID: string, payload: {
  level: number;
  gameId: number;
  gameTitle: string;
  score: number;
  total: number;
  completedAt: string;
}) {
  const percentage = payload.total > 0 ? payload.score / payload.total : 0;
  const stars = percentage >= 0.9 ? 3 : percentage >= 0.6 ? 2 : percentage > 0 ? 1 : 0;

  const scoreData = {
    level: payload.level,
    gameId: `${payload.level}-${payload.gameId}`,
    gameTitle: payload.gameTitle,
    score: payload.score,
    total: payload.total,
    stars,
    completedAt: payload.completedAt,
  };

  await ChildProfile.findByIdAndUpdate(childID, {
    $push: { gameScores: scoreData }
  });

  return scoreData;
}
