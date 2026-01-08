import { Request, Response, NextFunction } from "express";

export function requireTeacher(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req?.user?.role !== "teacher") {
    return res.status(403).json({
      success: false,
      message: "Forbidden: Teachers only",
    });
  }
  next();
}
