import { Request, Response, NextFunction } from "express";
import { chatbotService } from "../services/chatbot.service";
import { ResponseHTTP } from "../utils/response";

export const chatbotController = {
  async chat(req: Request, res: Response, next: NextFunction) {
    try {
      const { message } = req.body;
      const response = await chatbotService.getResponse(message);
      return res
        .status(200)
        .json(ResponseHTTP.ok(response, "Chatbot response generated"));
    } catch (err) {
      next(err);
    }
  },
};
