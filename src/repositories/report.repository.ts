import { db } from "../utils/prisma";
import { ReportStatus } from "@prisma/client";

export const reportRepository = {
  // Generate nomor laporan unik: LPR-YYYYMMDD-XXXX
  async generateReportNumber(): Promise<string> {
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, ""); // "20260913"
    const prefix = `LPR-${dateStr}-`;

    // Cari laporan terakhir hari ini untuk auto-increment
    const lastReport = await db.report.findFirst({
      where: { reportNumber: { startsWith: prefix } },
      orderBy: { reportNumber: "desc" },
    });

    let nextNum = 1;
    if (lastReport) {
      const lastNum = parseInt(lastReport.reportNumber.split("-").pop() || "0");
      nextNum = lastNum + 1;
    }

    return `${prefix}${String(nextNum).padStart(4, "0")}`;
  },

  // Buat laporan baru
  async create(data: {
    reportNumber: string;
    customerName: string;
    customerPhone: string;
    customerAddress: string;
    customerId?: string;
    category: string;
    description: string;
    photoUrl?: string;
  }) {
    return db.report.create({
      data: data as any,
      include: { statusLogs: true },
    });
  },

  // Cari laporan berdasarkan nomor laporan (untuk pelanggan cek status)
  async findByReportNumber(reportNumber: string) {
    return db.report.findUnique({
      where: { reportNumber },
      include: {
        statusLogs: {
          orderBy: { createdAt: "asc" },
        },
      },
    });
  },

  // Ambil semua laporan (untuk admin) — terbaru di atas
  async findMany(filters?: { status?: ReportStatus }) {
    return db.report.findMany({
      where: filters?.status ? { status: filters.status } : undefined,
      include: {
        statusLogs: {
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  // Cari laporan berdasarkan ID (untuk admin)
  async findById(id: number) {
    return db.report.findUnique({
      where: { id },
      include: {
        statusLogs: {
          orderBy: { createdAt: "asc" },
        },
      },
    });
  },

  // Update status laporan
  async updateStatus(id: number, status: ReportStatus) {
    return db.report.update({
      where: { id },
      data: { status },
      include: {
        statusLogs: {
          orderBy: { createdAt: "asc" },
        },
      },
    });
  },

  // Tambah log status
  async createStatusLog(data: {
    reportId: number;
    status: ReportStatus;
    message?: string;
    photoUrl?: string;
    createdBy?: string;
  }) {
    return db.reportStatusLog.create({
      data: data as any,
    });
  },

  // Hapus laporan (admin only)
  async delete(id: number) {
    return db.report.delete({
      where: { id },
    });
  },
};

export type ReportRepository = typeof reportRepository;
