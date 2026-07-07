import { Router } from "express";
import { packageController } from "../controllers/package.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validation.middleware";
import { CreatePackageSchema, UpdatePackageSchema } from "../validator/package.validator";

export const packageRouter = Router();

packageRouter.get("/", packageController.getAll);
packageRouter.get("/:id", packageController.getById);

packageRouter.post("/", requireAuth, validate(CreatePackageSchema), packageController.create);
packageRouter.put("/:id", requireAuth, validate(UpdatePackageSchema), packageController.update);
packageRouter.delete("/:id", requireAuth, packageController.delete);
