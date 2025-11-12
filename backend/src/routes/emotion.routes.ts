import { Router } from "express"
import { saveEmotion } from "../controllers/emotion.controller.js"

const router = Router()

// ✅ POST /api/save-emotion
router.post("/save-emotion", saveEmotion)

export default router
