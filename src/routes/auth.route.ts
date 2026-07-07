import { Router } from "express";
import { authController } from "../controllers/auth.controller";
import { validate } from "../middlewares/validation.middleware";
import { LoginSchema } from "../validator/auth.validator";
import { requireAuth } from "../middlewares/auth.middleware";

export const authRouter = Router();

authRouter.post("/", validate(LoginSchema), authController.login);
authRouter.get("/me", requireAuth, authController.me);
authRouter.post("/logout", authController.logout);
