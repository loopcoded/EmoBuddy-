import EmotionData from "../models/EmotionData.model.js"

export async function saveEmotion(payload: any) {
  const { childID, emotion, confidence, timestamp } = payload

  if (!childID) throw new Error("Missing childID")

  const record = await EmotionData.create({
    childID,
    emotion,
    confidence,
    timestamp: timestamp || new Date().toISOString(),
  })

  return record
}
