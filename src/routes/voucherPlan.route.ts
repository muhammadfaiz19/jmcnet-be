import { Router } from "express";
import { voucherPlanController } from "../controllers/voucherPlan.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validation.middleware";
import { CreateVoucherPlanSchema, UpdateVoucherPlanSchema } from "../validator/voucherPlan.validator";

export const voucherPlanRouter = Router();

voucherPlanRouter.get("/", voucherPlanController.getAll);
voucherPlanRouter.get("/:id", voucherPlanController.getById);

voucherPlanRouter.post("/", requireAuth, validate(CreateVoucherPlanSchema), voucherPlanController.create);
voucherPlanRouter.put("/:id", requireAuth, validate(UpdateVoucherPlanSchema), voucherPlanController.update);
voucherPlanRouter.delete("/:id", requireAuth, voucherPlanController.delete);
