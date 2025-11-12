import { Request, Response } from "express"
import * as emotionService from "../services/emotion.service.js"
import { ok, fail } from "../utils/response.js"

export async function saveEmotion(req: Request, res: Response) {
  try {
    const savedEmotion = await emotionService.saveEmotion(req.body)
    return ok(res, "Emotion saved", savedEmotion)
  } catch (e: any) {
    return fail(res, e.message || "Emotion save failed", 400)
  }
}
