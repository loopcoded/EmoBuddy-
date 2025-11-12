// @/controllers/progress.controller.ts
import { Request, Response } from "express";
import * as progressService from "../services/progress.service.js";

// Fetches the progress state for a single level
export async function getProgressState(req: Request, res: Response) {
  try {
    const { childID, level } = req.params;
    const state = await progressService.getProgressState(childID, level);
    return res.status(200).json({ success: true, state });
  } catch (e: any) {
    return res.status(400).json({ success: false, message: e.message });
  }
}

// Saves the entire progress state object for a level
export async function saveProgressState(req: Request, res: Response) {
  try {
    const { childID } = req.params;
    const { level, state } = req.body; // state is the { game1Completed: ... } object
    await progressService.saveProgressState(childID, level.toString(), state);
    return res.status(200).json({ success: true });
  } catch (e: any) {
    return res.status(400).json({ success: false, message: e.message });
  }
}

// Logs a score for a completed game
export async function logGameCompletion(req: Request, res: Response) {
  try {
    const { childID } = req.params;
    await progressService.logGameCompletion(childID, req.body);
    return res.status(200).json({ success: true });
  } catch (e: any) {
    return res.status(400).json({ success: false, message: e.message });
  }
}