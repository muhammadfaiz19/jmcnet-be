import jwt from "jsonwebtoken";
import { env } from "../config/env";

export const generateToken = (payload: { id: string; email: string }): string => {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: "7d" });
};

export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, env.JWT_SECRET);
  } catch (err) {
    return null;
  }
};
