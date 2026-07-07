import { Router } from "express";
import { faqController } from "../controllers/faq.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validation.middleware";
import { CreateFaqSchema, UpdateFaqSchema } from "../validator/faq.validator";

export const faqRouter = Router();

faqRouter.get("/", faqController.getAll);
faqRouter.get("/:id", faqController.getById);

faqRouter.post("/", requireAuth, validate(CreateFaqSchema), faqController.create);
faqRouter.put("/:id", requireAuth, validate(UpdateFaqSchema), faqController.update);
faqRouter.delete("/:id", requireAuth, faqController.delete);
