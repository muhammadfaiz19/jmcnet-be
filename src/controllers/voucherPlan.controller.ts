import { Request, Response, NextFunction } from "express";
import { voucherPlanService } from "../services/voucherPlan.service";
import { ResponseHTTP } from "../utils/response";

export const voucherPlanController = {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const type = req.query.type as string | undefined;
      const result = await voucherPlanService.getAll(type ? { type } : undefined);
      return res.status(200).json(ResponseHTTP.ok(result, "Voucher plans retrieved successfully"));
    } catch (err) {
      next(err);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      const result = await voucherPlanService.getById(id);
      return res.status(200).json(ResponseHTTP.ok(result, `Voucher plan with ID ${id} retrieved`));
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await voucherPlanService.create(req.body);
      return res.status(201).json(ResponseHTTP.created(result, "Voucher plan created successfully"));
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      const result = await voucherPlanService.update(id, req.body);
      return res.status(200).json(ResponseHTTP.ok(result, "Voucher plan updated successfully"));
    } catch (err) {
      next(err);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      await voucherPlanService.delete(id);
      return res.status(200).json(ResponseHTTP.ok(null, "Voucher plan deleted successfully"));
    } catch (err) {
      next(err);
    }
  },
};
