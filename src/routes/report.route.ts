import { Router } from "express";
import { reportController } from "../controllers/report.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validation.middleware";
import {
  CreateReportSchema,
  CheckReportSchema,
  UpdateReportStatusSchema,
} from "../validator/report.validator";
import { upload } from "../middlewares/upload.middleware";

export const reportRouter = Router();

// ============ ENDPOINT PUBLIK (tanpa login) ============
// Pelanggan buat laporan (dengan upload foto opsional)
reportRouter.post(
  "/",
  upload.single("photo"),
  validate(CreateReportSchema),
  reportController.create
);

// Pelanggan cek status laporan
reportRouter.get(
  "/check/:reportNumber",
  validate(CheckReportSchema),
  reportController.checkStatus
);

// ============ ENDPOINT ADMIN (perlu login) ============
// Admin lihat semua laporan (bisa filter ?status=MENUNGGU)
reportRouter.get("/", requireAuth, reportController.getAll);

// Admin lihat detail laporan
reportRouter.get("/:id", requireAuth, reportController.getById);

// Admin ubah status + pesan (dengan upload foto opsional)
reportRouter.patch(
  "/:id/status",
  requireAuth,
  upload.single("photo"),
  validate(UpdateReportStatusSchema),
  reportController.updateStatus
);

// Admin hapus laporan
reportRouter.delete("/:id", requireAuth, reportController.delete);
