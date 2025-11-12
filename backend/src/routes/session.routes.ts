import { Router } from "express";
import { saveSession } from "../controllers/session.controller.js";

const router = Router();

// POST /api/save-session
router.post("/save-session", saveSession);

export default router;
