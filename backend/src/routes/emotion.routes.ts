// backend/src/routes/emotion.routes.ts
import { Router } from "express";
import { detectEmotionController } from "../controllers/emotion.controller.js";

const router = Router();

console.log("🎭 Registering emotion routes...");

// This will be mounted at /api, so full path is /api/emotion/detect
router.post("/emotion/detect", detectEmotionController);

console.log("✅ Emotion route registered: POST /emotion/detect");

export default router;