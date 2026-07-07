import { env } from "./env";

export const fileConfig = {
  allowedMimeTypes: env.UPLOAD_ALLOWED_MIME.split(","),
  chatbotAllowedMimeTypes: env.CHATBOT_ALLOWED_MIME.split(","),
  maxFileSize: env.UPLOAD_MAX_FILE_SIZE,
};
