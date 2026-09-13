import { reportRepository } from "../repositories/report.repository";
import { NotFoundException } from "../exceptions/NotFoundException";
import { CreateReportInput, UpdateReportStatusInput } from "../validator/report.validator";
import { ReportStatus } from "@prisma/client";

export const reportService = {
  // Pelanggan: buat laporan baru
  async create(input: CreateReportInput, photoUrl?: string) {
    const reportNumber = await reportRepository.generateReportNumber();

    const report = await reportRepository.create({
      reportNumber,
      customerName: input.customerName,
      customerPhone: input.customerPhone,
      customerAddress: input.customerAddress,
      customerId: input.customerId,
      category: input.category,
      description: input.description,
      photoUrl,
    });

    // Buat log status awal otomatis
    await reportRepository.createStatusLog({
      reportId: report.id,
      status: ReportStatus.MENUNGGU,
      message: "Laporan berhasil diterima. Mohon menunggu, tim kami akan segera menindaklanjuti.",
    });

    // Ambil ulang dengan status log
    return reportRepository.findById(report.id);
  },

  // Pelanggan: cek status laporan dengan nomor laporan
  async findByReportNumber(reportNumber: string) {
    const report = await reportRepository.findByReportNumber(reportNumber.toUpperCase());
    if (!report) {
      throw new NotFoundException(`Laporan dengan nomor ${reportNumber} tidak ditemukan`);
    }
    return report;
  },

  // Admin: ambil semua laporan (bisa filter by status)
  async getAll(status?: string) {
    const filter = status ? { status: status as ReportStatus } : undefined;
    return reportRepository.findMany(filter);
  },

  // Admin: ambil detail laporan by ID
  async getById(id: number) {
    const report = await reportRepository.findById(id);
    if (!report) {
      throw new NotFoundException(`Laporan dengan ID ${id} tidak ditemukan`);
    }
    return report;
  },

  // Admin: ubah status + beri pesan
  async updateStatus(
    id: number,
    input: UpdateReportStatusInput,
    adminName?: string,
    photoUrl?: string
  ) {
    const report = await reportRepository.findById(id);
    if (!report) {
      throw new NotFoundException(`Laporan dengan ID ${id} tidak ditemukan`);
    }

    // Update status di tabel Report
    await reportRepository.updateStatus(id, input.status as ReportStatus);

    // Tambah log status (riwayat)
    await reportRepository.createStatusLog({
      reportId: id,
      status: input.status as ReportStatus,
      message: input.message,
      photoUrl,
      createdBy: adminName,
    });

    // Return data terbaru
    return reportRepository.findById(id);
  },

  // Admin: hapus laporan
  async delete(id: number) {
    const report = await reportRepository.findById(id);
    if (!report) {
      throw new NotFoundException(`Laporan dengan ID ${id} tidak ditemukan`);
    }
    await reportRepository.delete(id);
    return null;
  },
};

export type ReportService = typeof reportService;
