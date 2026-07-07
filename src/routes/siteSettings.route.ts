import { Router } from "express";
import { siteSettingsController } from "../controllers/siteSettings.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validation.middleware";
import { UpdateSiteSettingsSchema } from "../validator/siteSettings.validator";
import { uploadSettings } from "../middlewares/upload.middleware";

export const siteSettingsRouter = Router();

siteSettingsRouter.get("/", siteSettingsController.get);
siteSettingsRouter.put(
  "/",
  requireAuth,
  uploadSettings.fields([
    { name: "logo", maxCount: 1 },
    { name: "registrationForm", maxCount: 1 },
    { name: "serviceContract", maxCount: 1 },
  ]),
  validate(UpdateSiteSettingsSchema),
  siteSettingsController.update
);
