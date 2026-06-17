import logger from "../helpers/logger.js";
import { Request, Response, NextFunction } from "express";

export default function handleError(
  err: Error & { status?: number },
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  logger.error(err.stack);
  if (err.status) {
    res.status(err.status).json({
      success: false,
      message: err.message,
    });
  } else {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}
