import { Request, Response, NextFunction } from "express";
import { chatbotService } from "../services/chatbot.service";
import { ResponseHTTP } from "../utils/response";
import { BadRequestException } from "../exceptions/BadRequestException";

export const chatbotFileController = {
  async uploadFile(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        throw new BadRequestException("Please upload a PDF or Excel file.");
      }

      const result = await chatbotService.uploadFile(req.file);
      return res
        .status(201)
        .json(ResponseHTTP.created(result, "File uploaded and parsed successfully."));
    } catch (err) {
      next(err);
    }
  },

  async listFiles(req: Request, res: Response, next: NextFunction) {
    try {
      const files = await chatbotService.getAllFiles();
      return res
        .status(200)
        .json(ResponseHTTP.ok(files, "Chatbot files fetched."));
    } catch (err) {
      next(err);
    }
  },

  async deleteFile(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      if (Number.isNaN(id)) {
        throw new BadRequestException("ID param must be a number");
      }

      await chatbotService.deleteFile(id);
      return res
        .status(200)
        .json(ResponseHTTP.success(200, null, "Chatbot file deleted successfully."));
    } catch (err) {
      next(err);
    }
  },
};
