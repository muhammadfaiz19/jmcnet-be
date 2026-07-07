import multer from "multer";
import path from "path";
import fs from "fs";
import { env } from "../config/env";
import { fileConfig } from "../config/file.config";
import { UPLOADS_PATH } from "../config/path.config";
import { BadRequestException } from "../exceptions/BadRequestException";

const TEMP_DIR = path.join(UPLOADS_PATH, "temp");

if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, TEMP_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (fileConfig.allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new BadRequestException(`Invalid file type. Allowed: ${fileConfig.allowedMimeTypes.join(", ")}`));
  }
};

const chatbotFileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowed = fileConfig.chatbotAllowedMimeTypes;
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new BadRequestException(`Invalid file type. Allowed: ${allowed.join(", ")}`));
  }
};

// Filter khusus untuk pengaturan situs (Site Settings)
const settingsFileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.fieldname === "logo") {
    // Logo hanya boleh berupa gambar (jpeg, png, webp)
    if (fileConfig.allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new BadRequestException("Tipe file logo tidak valid. Hanya diperbolehkan: jpeg, png, webp"));
    }
  } else if (file.fieldname === "registrationForm" || file.fieldname === "serviceContract") {
    // Formulir dan kontrak boleh berupa PDF atau Word (DOC/DOCX)
    const allowedDocs = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword"
    ];
    if (allowedDocs.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new BadRequestException("Tipe file dokumen tidak valid. Hanya diperbolehkan: PDF, DOC, DOCX"));
    }
  } else {
    cb(new BadRequestException("Nama field tidak dikenal"));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: fileConfig.maxFileSize,
  },
});

export const uploadChatbotFile = multer({
  storage,
  fileFilter: chatbotFileFilter,
  limits: {
    fileSize: env.UPLOAD_MAX_FILE_SIZE,
  },
});

// Konfigurasi upload khusus untuk pengaturan situs
export const uploadSettings = multer({
  storage,
  fileFilter: settingsFileFilter,
  limits: {
    fileSize: fileConfig.maxFileSize,
  },
});

export type MulterFile = Express.Multer.File;
