import { Router } from "express";
import { chatbotController } from "../controllers/chatbot.controller";
import { chatbotFileController } from "../controllers/chatbotFile.controller";
import { chatbotContextController } from "../controllers/chatbotContext.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validation.middleware";
import { AskChatbotSchema } from "../validator/chatbot.validator";
import { uploadChatbotFile } from "../middlewares/upload.middleware";

export const chatbotRouter = Router();

// Chat response (Public)
chatbotRouter.post(
  "/",
  validate(AskChatbotSchema),
  chatbotController.chat
);

// File Context Management (Protected)
chatbotRouter.get(
  "/files",
  requireAuth,
  chatbotFileController.listFiles
);

chatbotRouter.post(
  "/files",
  requireAuth,
  uploadChatbotFile.single("file"),
  chatbotFileController.uploadFile
);

chatbotRouter.delete(
  "/files/:id",
  requireAuth,
  chatbotFileController.deleteFile
);

// Text-based Context Management (Protected)
chatbotRouter.get(
  "/contexts/:name",
  requireAuth,
  chatbotContextController.getContext
);

chatbotRouter.put(
  "/contexts/:name",
  requireAuth,
  chatbotContextController.upsertContext
);
