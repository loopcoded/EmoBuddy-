// @/routes/progress.routes.ts
import { Router } from "express";
import { 
  getProgressState, 
  saveProgressState, 
  logGameCompletion 
} from "../controllers/progress.controller.js";

const router = Router();

// GET /api/progress/get-state/:childID/:level
// -> Fetches the saved progress object for a specific level
router.get("/get-state/:childID/:level", getProgressState);

// POST /api/progress/save-state/:childID
// -> Saves the entire progress object (e.g., { game1Completed: true, ... })
router.post("/save-state/:childID", saveProgressState);

// POST /api/progress/log-game/:childID
// -> Logs a single game's score after completion
router.post("/log-game/:childID", logGameCompletion);

export default router;