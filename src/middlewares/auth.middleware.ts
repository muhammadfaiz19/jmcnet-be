import { Response, NextFunction } from "express";
import { UnauthorizedException } from "../exceptions/UnauthorizedException";
import { verifyToken } from "../utils/jwt";
import { AuthenticatedRequest } from "../types";

export const requireAuth = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    let token = req.cookies?.access_token;

    if (!token && req.headers.authorization) {
      const parts = req.headers.authorization.split(" ");
      if (parts[0] === "Bearer") {
        token = parts[1];
      }
    }

    if (!token) {
      throw new UnauthorizedException("Access token is missing or expired");
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      throw new UnauthorizedException("Invalid access token");
    }

    req.admin = {
      id: decoded.id,
      email: decoded.email,
    };

    next();
  } catch (err) {
    next(err);
  }
};
