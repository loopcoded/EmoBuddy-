import { Response } from "express";

export function ok(res: Response, message: string, data?: any) {
  return res.status(200).json({ success: true, message, data });
}

export function fail(res: Response, message: string, code = 400, details?: any) {
  return res.status(code).json({ success: false, message, details });
}
