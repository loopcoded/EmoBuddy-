import { Request, Response } from "express";
import * as avatarService from "../services/avatar.service.js";
import { ok, fail } from "../utils/response.js";

export async function getAvatar(req: Request, res: Response) {
  try {
    const data = await avatarService.getAvatar(req.params.childID);
    return ok(res, "Avatar fetched", data);
  } catch (e: any) {
    return fail(res, e.message || "Avatar fetch failed", 400);
  }
}

export async function updateAvatar(req: Request, res: Response) {
  try {
    const data = await avatarService.upsertAvatar(req.params.childID, req.body);
    return ok(res, "Avatar updated", data);
  } catch (e: any) {
    return fail(res, e.message || "Avatar update failed", 400);
  }
}
