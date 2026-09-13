import z from "zod";

// Validasi untuk pelanggan membuat laporan baru
export const CreateReportSchema = z.object({
  body: z.object({
    customerName: z.string().min(1, "Nama wajib diisi").max(100),
    customerPhone: z.string().min(8, "No HP minimal 8 digit").max(20),
    customerAddress: z.string().min(1, "Alamat wajib diisi").max(500),
    customerId: z.string().max(50).optional(), // ID Pelanggan opsional
    category: z.enum([
      "GANGGUAN_INTERNET",
      "INTERNET_LAMBAT",
      "GANGGUAN_ROUTER",
      "TAGIHAN",
      "LAINNYA",
    ]),
    description: z.string().min(10, "Deskripsi minimal 10 karakter"),
  }),
});

// Validasi untuk cek status laporan (pakai nomor laporan)
export const CheckReportSchema = z.object({
  params: z.object({
    reportNumber: z.string().min(1, "Nomor laporan wajib diisi"),
  }),
});

// Validasi untuk admin mengubah status
export const UpdateReportStatusSchema = z.object({
  body: z.object({
    status: z.enum(["MENUNGGU", "DIPROSES", "SELESAI", "DITOLAK"]),
    message: z.string().optional(), // Pesan admin (opsional)
  }),
});

export type CreateReportInput = z.infer<typeof CreateReportSchema>["body"];
export type UpdateReportStatusInput = z.infer<typeof UpdateReportStatusSchema>["body"];
