// @/routes/child.routes.ts
import { Router } from "express";
import { 
  registerChild, 
  getChildProfile, 
  deleteChild,
  updateChildProfile // ✅ Import the new controller
} from "../controllers/child.controller.js";

const router = Router();

// POST /api/register-child
router.post("/register-child", registerChild);

// GET /api/child-profile/:childID
router.get("/child-profile/:childID", getChildProfile);

// ✅ ADDED: This route is needed for the level completion celebration
// POST /api/child-profile/:childID
router.post("/child-profile/:childID", updateChildProfile);

// DELETE /api/delete-child/:childID
router.delete("/delete-child/:childID", deleteChild);

export default router;