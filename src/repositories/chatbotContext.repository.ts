import { db } from "../utils/prisma";

export const chatbotContextRepository = {
  async getByName(name: string) {
    return db.chatbotContext.findUnique({
      where: { name },
    });
  },

  async upsertByName(name: string, context: string) {
    return await db.chatbotContext.upsert({
      where: { name },
      update: { context },
      create: { name, context },
    });
  },

  async update(id: number, context: string) {
    return db.chatbotContext.update({
      where: { id },
      data: { context },
    });
  },

  async getAll() {
    return db.chatbotContext.findMany({
      orderBy: { id: "asc" },
    });
  },

  async getPublicDatabaseSnapshot() {
    const [packages, voucherPlans, siteSettings, faqs] = await Promise.all([
      db.package.findMany({
        select: {
          name: true,
          tierLabel: true,
          description: true,
          speedMbps: true,
          priceMonthly: true,
          activationFee: true,
          features: true,
          isFeatured: true,
        },
        orderBy: { tierNumber: "asc" },
      }),
      db.voucherPlan.findMany({
        select: {
          name: true,
          type: true,
          tagLabel: true,
          price: true,
          priceUnit: true,
          duration: true,
          minPurchase: true,
          features: true,
        },
      }),
      db.siteSettings.findFirst(),
      db.faq.findMany({
        select: {
          question: true,
          answer: true,
        },
      }),
    ]);

    // --- Format paket internet sebagai teks ringkas ---
    const packageLines = packages.map((p, i) => {
      let featuresText = "";
      try {
        const feats = typeof p.features === "string" ? JSON.parse(p.features) : p.features;
        if (Array.isArray(feats)) {
          featuresText = feats
            .map((f: any) => `  ${f.included ? "✅" : "❌"} ${f.text || f}`)
            .join("\n");
        }
      } catch { featuresText = ""; }

      return `${i + 1}. ${p.name} (${p.tierLabel})
  - Kecepatan: ${p.speedMbps} Mbps
  - Harga Bulanan: Rp ${p.priceMonthly.toLocaleString("id-ID")}
  - Biaya Aktivasi: Rp ${p.activationFee.toLocaleString("id-ID")}
  - Deskripsi: ${p.description}
  - Unggulan: ${p.isFeatured ? "Ya (Paket Favorit)" : "Tidak"}
${featuresText ? `  - Fitur:\n${featuresText}` : ""}`;
    }).join("\n\n");

    // --- Format voucher sebagai teks ringkas ---
    const voucherLines = voucherPlans.map((v, i) => {
      let featuresText = "";
      try {
        const feats = typeof v.features === "string" ? JSON.parse(v.features) : v.features;
        if (Array.isArray(feats)) {
          featuresText = feats.map((f: any) => `  - ${typeof f === "string" ? f : f.text || f}`).join("\n");
        }
      } catch { featuresText = ""; }

      return `${i + 1}. ${v.name} (${v.tagLabel})
  - Tipe: ${v.type}
  - Harga: Rp ${v.price.toLocaleString("id-ID")}${v.priceUnit}
  - Durasi: ${v.duration}${v.minPurchase ? `\n  - Pembelian Minimal: ${v.minPurchase}` : ""}
${featuresText ? `  - Keuntungan:\n${featuresText}` : ""}`;
    }).join("\n\n");

    // --- Format site settings ---
    let siteInfo = "Tidak tersedia.";
    if (siteSettings) {
      const s = siteSettings;
      siteInfo = `- Perusahaan: ${s.companyName} (${s.brandName})
- Tagline: ${s.tagline}
- Alamat: ${s.address}
- Email: ${s.email}
- Jam Operasional: ${s.operationalHours}
- WhatsApp CS 1: ${s.whatsappCs1}
- WhatsApp CS 2: ${s.whatsappCs2}
- Tentang Kami: ${s.aboutDescription}`;
    }

    // --- Format FAQ ---
    const faqLines = faqs.map((f, i) => 
      `${i + 1}. T: ${f.question}\n   J: ${f.answer}`
    ).join("\n\n");

    // --- Gabungkan semua ---
    const sections = [
      `DAFTAR PAKET INTERNET (Total: ${packages.length} paket — WAJIB SEBUTKAN SEMUA):\n${packageLines}`,
      `DAFTAR VOUCHER (Total: ${voucherPlans.length} voucher — WAJIB SEBUTKAN SEMUA):\n${voucherLines}`,
      `INFORMASI PERUSAHAAN & KONTAK:\n${siteInfo}`,
      `FAQ (Total: ${faqs.length} pertanyaan):\n${faqLines}`,
    ];

    return sections.join("\n\n---\n\n");
  },
};
export type ChatbotContextRepository = typeof chatbotContextRepository;

