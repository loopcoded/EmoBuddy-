
import * as childService from "../services/child.service.js";
import { Request, Response } from "express";
// ✅ Return direct, clean JSON to frontend
export async function registerChild(req: Request, res: Response) {
  try {
    const child = await childService.registerChild(req.body);

    // ✅ Send childID directly at top-level (frontend expects this)
    return res.status(201).json({
      success: true,
      childID: child._id, 
      message: "Child registered successfully",
    });
  } catch (e: any) {
    console.error("❌ Register child failed:", e.message);
    return res.status(400).json({
      success: false,
      message: e.message || "Registration failed",
    });
  }
}

export async function getChildProfile(req: Request, res: Response) {
  try {
    const { childID } = req.params;
    const child = await childService.getChildProfile(childID);
    if (!child) {
      return res.status(404).json({ success: false, message: "Child not found" });
    }
    return res.status(200).json({ success: true, data: child });
  } catch (e: any) {
    console.error("❌ Fetch child failed:", e.message);
    return res.status(400).json({ success: false, message: e.message });
  }
}

export async function updateChildProfile(req: Request, res: Response) {
  try {
    const { childID } = req.params;
    const updatedChild = await childService.updateChildProfile(childID, req.body);
    return res.status(200).json({
      success: true,
      data: updatedChild,
      message: "Profile updated successfully",
    });
  } catch (e: any) {
    console.error("❌ Update child failed:", e.message);
    return res.status(400).json({ success: false, message: e.message });
  }
}

export async function deleteChild(req: Request, res: Response) {
  try {
    const { childID } = req.params;
    await childService.deleteChild(childID);
    return res.status(200).json({
      success: true,
      message: "Child deleted successfully",
    });
  } catch (e: any) {
    console.error("❌ Delete child failed:", e.message);
    return res.status(400).json({
      success: false,
      message: e.message || "Delete failed",
    });
  }
}
