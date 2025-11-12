import { Request, Response } from "express";
import * as sessionService from "../services/session.service.js";
import { ok, fail } from "../utils/response.js";

export async function saveSession(req: Request, res: Response) {
  try {
    const saved = await sessionService.saveSession(req.body);
    return ok(res, "Session saved", { success: true, id: saved._id });
  } catch (e: any) {
    return fail(res, e.message || "Session save failed", 400);
  }
}
