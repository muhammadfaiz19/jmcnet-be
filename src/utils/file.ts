import fs from "fs";
import path from "path";
import sharp from "sharp";
import { env } from "../config/env";
import { UPLOADS_PATH } from "../config/path.config";

if (!fs.existsSync(UPLOADS_PATH)) {
  fs.mkdirSync(UPLOADS_PATH, { recursive: true });
}

export const saveUploadedFile = async (file: Express.Multer.File) => {
  if (!file) throw new Error("No file provided");

  const isImage = file.mimetype.startsWith("image/");
  const baseUrlClean = env.BASE_URL.replace(/\/$/, "");

  if (isImage) {
    const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}.webp`;
    const targetPath = path.join(UPLOADS_PATH, fileName);

    // Convert to webp using sharp
    await sharp(file.path)
      .webp({ quality: 80 })
      .toFile(targetPath);

    // Remove the temporary file left by multer
    try {
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
    } catch (err) {
      console.error("Failed to delete temp file:", err);
    }

    return {
      fileName,
      path: targetPath,
      url: `${baseUrlClean}/uploads/${fileName}`,
    };
  } else {
    // For non-image files (like PDFs, Excel, etc.)
    const ext = path.extname(file.originalname);
    const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    const targetPath = path.join(UPLOADS_PATH, fileName);

    // Move the file from temp directory to the uploads path
    fs.renameSync(file.path, targetPath);

    return {
      fileName,
      path: targetPath,
      url: `${baseUrlClean}/uploads/${fileName}`,
    };
  }
};

export const deleteUploadedFile = (fileUrl: string) => {
  try {
    const parsed = new URL(fileUrl);
    const filename = path.basename(parsed.pathname);
    const filePath = path.join(UPLOADS_PATH, filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  } catch (err) {
    // If it's not a valid URL or local file, try checking if it's just a filename
    try {
      const filePath = path.join(UPLOADS_PATH, path.basename(fileUrl));
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        return true;
      }
    } catch (_) {}
    console.error("Error deleting file:", err);
    return false;
  }
};

export const deleteMultipleUploadedFiles = (fileUrls: string[]) => {
  fileUrls.forEach((url) => deleteUploadedFile(url));
};

export const parseJsonField = <T = any>(field: string | any, defaultValue: T): T => {
  if (!field) return defaultValue;
  if (typeof field === "string") {
    try {
      return JSON.parse(field) as T;
    } catch (_) {
      return defaultValue;
    }
  }
  return field as T;
};

export const stringifyJsonField = (field: any): string => {
  if (typeof field === "string") return field;
  return JSON.stringify(field);
};

export const getPagination = (query: any) => {
  const page = Math.max(1, parseInt(query.page as string) || 1);
  const limit = Math.max(1, Math.min(100, parseInt(query.limit as string) || 10));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};
