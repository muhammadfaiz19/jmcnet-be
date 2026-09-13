import { Request, Response, NextFunction } from "express";
import { reportService } from "../services/report.service";
import { ResponseHTTP } from "../utils/response";
import { AuthenticatedRequest } from "../types";
import fs from "fs";
import path from "path";
import { UPLOADS_PATH } from "../config/path.config";

const REPORTS_DIR = path.join(UPLOADS_PATH, "reports");
if (!fs.existsSync(REPORTS_DIR)) {
  fs.mkdirSync(REPORTS_DIR, { recursive: true });
}

export const reportController = {
  // ==================== ENDPOINT PUBLIK (PELANGGAN) ====================

  // POST /api/reports — Pelanggan buat laporan baru
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      // photoUrl dari multer (jika ada upload foto)
      let photoUrl = undefined;
      
      if (req.file) {
        const tempPath = req.file.path;
        const targetPath = path.join(REPORTS_DIR, req.file.filename);
        fs.renameSync(tempPath, targetPath);
        photoUrl = `/uploads/reports/${req.file.filename}`;
      }

      const result = await reportService.create(req.body, photoUrl);
      return res.status(201).json(
        ResponseHTTP.created(result, "Laporan berhasil dikirim! Simpan nomor laporan Anda.")
      );
    } catch (err) {
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      next(err);
    }
  },

  // GET /api/reports/check/:reportNumber — Pelanggan cek status
  async checkStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { reportNumber } = req.params;
      const result = await reportService.findByReportNumber(reportNumber);
      return res.status(200).json(
        ResponseHTTP.ok(result, "Status laporan berhasil diambil")
      );
    } catch (err) {
      next(err);
    }
  },

  // ==================== ENDPOINT ADMIN (PERLU LOGIN) ====================

  // GET /api/reports — Admin ambil semua laporan
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const status = req.query.status as string | undefined;
      const result = await reportService.getAll(status);
      return res.status(200).json(
        ResponseHTTP.ok(result, "Daftar laporan berhasil diambil")
      );
    } catch (err) {
      next(err);
    }
  },

  // GET /api/reports/:id — Admin ambil detail laporan
  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      const result = await reportService.getById(id);
      return res.status(200).json(
        ResponseHTTP.ok(result, `Detail laporan ID ${id}`)
      );
    } catch (err) {
      next(err);
    }
  },

  // PATCH /api/reports/:id/status — Admin ubah status + pesan
  async updateStatus(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      const adminName = req.admin?.email || "Admin";

      // photoUrl dari multer (admin upload foto bukti, opsional)
      let photoUrl = undefined;
      
      if (req.file) {
        const tempPath = req.file.path;
        const targetPath = path.join(REPORTS_DIR, req.file.filename);
        fs.renameSync(tempPath, targetPath);
        photoUrl = `/uploads/reports/${req.file.filename}`;
      }

      const result = await reportService.updateStatus(
        id,
        req.body,
        adminName,
        photoUrl
      );
      return res.status(200).json(
        ResponseHTTP.ok(result, "Status laporan berhasil diperbarui")
      );
    } catch (err) {
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      next(err);
    }
  },

  // DELETE /api/reports/:id — Admin hapus laporan
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      await reportService.delete(id);
      return res.status(200).json(
        ResponseHTTP.ok(null, "Laporan berhasil dihapus")
      );
    } catch (err) {
      next(err);
    }
  },
};
