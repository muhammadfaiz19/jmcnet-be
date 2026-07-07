import { Request, Response, NextFunction } from "express";
import { authService } from "../services/auth.service";
import { adminService } from "../services/admin.service";
import { ResponseHTTP } from "../utils/response";
import { cookieOptions } from "../config/cookies";
import { AuthenticatedRequest } from "../types";

export const authController = {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { admin, token } = await authService.loginWithEmail(req.body);

      res.cookie("access_token", token, cookieOptions);

      return res
        .status(200)
        .json(ResponseHTTP.ok({ admin, token }, "Login successful"));
    } catch (err) {
      next(err);
    }
  },

  async me(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const adminId = req.admin?.id;
      if (!adminId) {
        return res.status(401).json(ResponseHTTP.error(401, "Unauthorized"));
      }

      const admin = await adminService.getById(adminId);
      return res
        .status(200)
        .json(ResponseHTTP.ok({ admin }, "Session retrieved"));
    } catch (err) {
      next(err);
    }
  },

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      res.clearCookie("access_token", cookieOptions);
      return res
        .status(200)
        .json(ResponseHTTP.ok(null, "Logged out successfully"));
    } catch (err) {
      next(err);
    }
  },
};
