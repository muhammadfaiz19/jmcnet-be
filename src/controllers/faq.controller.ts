import { Request, Response, NextFunction } from "express";
import { faqService } from "../services/faq.service";
import { ResponseHTTP } from "../utils/response";

export const faqController = {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await faqService.getAll();
      return res.status(200).json(ResponseHTTP.ok(result, "FAQs retrieved successfully"));
    } catch (err) {
      next(err);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      const result = await faqService.getById(id);
      return res.status(200).json(ResponseHTTP.ok(result, `FAQ with ID ${id} retrieved`));
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await faqService.create(req.body);
      return res.status(201).json(ResponseHTTP.created(result, "FAQ created successfully"));
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      const result = await faqService.update(id, req.body);
      return res.status(200).json(ResponseHTTP.ok(result, "FAQ updated successfully"));
    } catch (err) {
      next(err);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      await faqService.delete(id);
      return res.status(200).json(ResponseHTTP.ok(null, "FAQ deleted successfully"));
    } catch (err) {
      next(err);
    }
  },
};
