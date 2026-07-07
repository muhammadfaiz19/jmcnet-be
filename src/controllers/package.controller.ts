import { Request, Response, NextFunction } from "express";
import { packageService } from "../services/package.service";
import { ResponseHTTP } from "../utils/response";

export const packageController = {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await packageService.getAll();
      return res.status(200).json(ResponseHTTP.ok(result, "Packages retrieved successfully"));
    } catch (err) {
      next(err);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      const result = await packageService.getById(id);
      return res.status(200).json(ResponseHTTP.ok(result, `Package with ID ${id} retrieved`));
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await packageService.create(req.body);
      return res.status(201).json(ResponseHTTP.created(result, "Package created successfully"));
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      const result = await packageService.update(id, req.body);
      return res.status(200).json(ResponseHTTP.ok(result, "Package updated successfully"));
    } catch (err) {
      next(err);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      await packageService.delete(id);
      return res.status(200).json(ResponseHTTP.ok(null, "Package deleted successfully"));
    } catch (err) {
      next(err);
    }
  },
};
