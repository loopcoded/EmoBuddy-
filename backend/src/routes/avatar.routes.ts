import { Router } from "express";
import { getAvatar, updateAvatar } from "../controllers/avatar.controller.js";

const router = Router();

// GET /api/child-avatar/:childID
router.get("/child-avatar/:childID", getAvatar);

// POST /api/child-avatar/:childID
router.post("/child-avatar/:childID", updateAvatar);

export default router;
