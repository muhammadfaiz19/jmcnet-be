import { Request, Response, NextFunction } from "express";
import { chatbotContextRepository } from "../repositories/chatbotContext.repository";
import { ResponseHTTP } from "../utils/response";
import { BadRequestException } from "../exceptions/BadRequestException";

export const chatbotContextController = {
  async getContext(req: Request, res: Response, next: NextFunction) {
    try {
      const { name } = req.params;
      if (!name) {
        throw new BadRequestException("Context name is required.");
      }

      const context = await chatbotContextRepository.getByName(name);
      return res
        .status(200)
        .json(ResponseHTTP.ok(context, "Chatbot context fetched."));
    } catch (err) {
      next(err);
    }
  },

  async upsertContext(req: Request, res: Response, next: NextFunction) {
    try {
      const { name } = req.params;
      const { context } = req.body;

      if (!name) {
        throw new BadRequestException("Context name is required.");
      }
      if (context === undefined || context === null) {
        throw new BadRequestException("Context content is required.");
      }

      const result = await chatbotContextRepository.upsertByName(name, context);
      return res
        .status(200)
        .json(ResponseHTTP.ok(result, "Chatbot context saved successfully."));
    } catch (err) {
      next(err);
    }
  },
};
