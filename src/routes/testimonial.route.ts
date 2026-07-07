import { Router } from "express";
import { testimonialController } from "../controllers/testimonial.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validation.middleware";
import { CreateTestimonialSchema, UpdateTestimonialSchema } from "../validator/testimonial.validator";

export const testimonialRouter = Router();

testimonialRouter.get("/", testimonialController.getAll);
testimonialRouter.get("/:id", testimonialController.getById);

testimonialRouter.post("/", requireAuth, validate(CreateTestimonialSchema), testimonialController.create);
testimonialRouter.put("/:id", requireAuth, validate(UpdateTestimonialSchema), testimonialController.update);
testimonialRouter.delete("/:id", requireAuth, testimonialController.delete);
