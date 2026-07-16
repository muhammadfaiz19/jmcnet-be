import { Request, Response, NextFunction } from "express";
import { serviceCategoryService } from "../services/serviceCategory.service";
import { ResponseHTTP } from "../utils/response";

export const serviceCategoryController = {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await serviceCategoryService.getAll();
      return res.status(200).json(ResponseHTTP.ok(result, "Service categories retrieved successfully"));
    } catch (err) {
      next(err);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      const result = await serviceCategoryService.getById(id);
      return res.status(200).json(ResponseHTTP.ok(result, `Service category with ID ${id} retrieved`));
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await serviceCategoryService.create(req.body);
      return res.status(201).json(ResponseHTTP.created(result, "Service category created successfully"));
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      const result = await serviceCategoryService.update(id, req.body);
      return res.status(200).json(ResponseHTTP.ok(result, "Service category updated successfully"));
    } catch (err) {
      next(err);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      await serviceCategoryService.delete(id);
      return res.status(200).json(ResponseHTTP.ok(null, "Service category deleted successfully"));
    } catch (err) {
      next(err);
    }
  },
};
