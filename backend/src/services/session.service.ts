import GameSession from "../models/GameSession.model.js";
import ChildProfile from "../models/ChildProfile.model.js";

export async function saveSession(data: any) {
  const session = await GameSession.create(data);

  // Optional: update child progress & scores
  if (data.sessionStatus === "completed") {
    await ChildProfile.findByIdAndUpdate(data.childID, {
      $push: {
        gameScores: {
          gameId: data.gameId,
          score: data.score,
          completedAt: data.endTime,
          stars: data.stars
        }
      }
    });
  }

  return session;
}
