import { Router } from "express";
import { serviceCategoryController } from "../controllers/serviceCategory.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validation.middleware";
import { CreateServiceCategorySchema, UpdateServiceCategorySchema } from "../validator/serviceCategory.validator";

export const serviceCategoryRouter = Router();

serviceCategoryRouter.get("/", serviceCategoryController.getAll);
serviceCategoryRouter.get("/:id", serviceCategoryController.getById);

serviceCategoryRouter.post("/", requireAuth, validate(CreateServiceCategorySchema), serviceCategoryController.create);
serviceCategoryRouter.put("/:id", requireAuth, validate(UpdateServiceCategorySchema), serviceCategoryController.update);
serviceCategoryRouter.delete("/:id", requireAuth, serviceCategoryController.delete);
