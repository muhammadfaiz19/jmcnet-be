import { Request, Response, NextFunction } from "express";
import { testimonialService } from "../services/testimonial.service";
import { ResponseHTTP } from "../utils/response";

export const testimonialController = {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await testimonialService.getAll();
      return res.status(200).json(ResponseHTTP.ok(result, "Testimonials retrieved successfully"));
    } catch (err) {
      next(err);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      const result = await testimonialService.getById(id);
      return res.status(200).json(ResponseHTTP.ok(result, `Testimonial with ID ${id} retrieved`));
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await testimonialService.create(req.body);
      return res.status(201).json(ResponseHTTP.created(result, "Testimonial created successfully"));
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      const result = await testimonialService.update(id, req.body);
      return res.status(200).json(ResponseHTTP.ok(result, "Testimonial updated successfully"));
    } catch (err) {
      next(err);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      await testimonialService.delete(id);
      return res.status(200).json(ResponseHTTP.ok(null, "Testimonial deleted successfully"));
    } catch (err) {
      next(err);
    }
  },
};
