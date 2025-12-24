import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import logger from "./helpers/logger";
import { JwtPayload } from "./types";
import { NextFunction, Request, Response } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

const secret = process.env.JWT_SECRET;
if (!secret) throw new Error("JWT_SECRET not defined");

export const comparePasswords = (password: string, hash: string) => {
  return bcrypt.compare(password, hash);
};

export const hashPassword = (password: string) => {
  return bcrypt.hash(password, 10);
};

export const createJWT = (user: JwtPayload) => {
  const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
      role: user.role,
    },
    secret,
    { expiresIn: "7d" }
  );
  return token;
};

export const protect = (req: Request, res: Response, next: NextFunction) => {
  const bearer = req.headers.authorization;

  if (!bearer) {
    res.status(401);
    res.json({ message: "not authorized" });
    return;
  }

  const [, token] = bearer.split(" ");

  if (!token) {
    res.status(401);
    res.json({ message: "not valid token" });
    return;
  }

  try {
    const user = jwt.verify(token, secret) as JwtPayload;
    req.user = user;
    next();
  } catch (e) {
    logger.error(e);
    res.status(401);
    res.json({ message: "not valid token" });
    return;
  }
};
