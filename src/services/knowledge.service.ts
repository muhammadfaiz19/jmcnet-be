import { db } from "../utils/prisma";

export const knowledgeService = {
  /**
   * Cari informasi di seluruh tabel database.
   * Pendekatan RAG berbasis kata kunci yang efisien dan hemat token.
   */
  async searchKnowledge(query: string): Promise<string> {
    const searchTerms = this.extractKeywords(query);
    if (!searchTerms) return "";

    // Kueri secara paralel untuk efisiensi
    const [packages, voucherPlans, faqs, settings] = await Promise.allSettled([
      db.package.findMany({
        where: {
          OR: [
            { name: { contains: searchTerms } },
            { description: { contains: searchTerms } },
            { features: { contains: searchTerms } },
          ],
        },
        take: 4,
      }),
      db.voucherPlan.findMany({
        where: {
          OR: [
            { name: { contains: searchTerms } },
            { tagLabel: { contains: searchTerms } },
            { features: { contains: searchTerms } },
          ],
        },
        take: 4,
      }),
      db.faq.findMany({
        where: {
          OR: [
            { question: { contains: searchTerms } },
            { answer: { contains: searchTerms } },
          ],
        },
        take: 5,
      }),
      db.siteSettings.findFirst(),
    ] as const);

    const contextParts: string[] = [];

    // Paket
    if (packages.status === "fulfilled" && packages.value?.length) {
      contextParts.push(
        "PAKET INTERNET BULANAN:\n" +
          packages.value
            .map(
              (p) =>
                `- ${p.name} (${p.speedMbps} Mbps): ${p.description}. Harga Bulanan: Rp ${p.priceMonthly.toLocaleString("id-ID")}, Biaya Aktivasi Awal: Rp ${p.activationFee.toLocaleString("id-ID")}.`
            )
            .join("\n")
      );
    }

    // Paket Voucher
    if (voucherPlans.status === "fulfilled" && voucherPlans.value?.length) {
      contextParts.push(
        "VOUCHER HOTSPOT & RESELLER:\n" +
          voucherPlans.value
            .map(
              (v) =>
                `- ${v.name} (Tipe: ${v.type}, Label: ${v.tagLabel}): Harga Rp ${v.price.toLocaleString("id-ID")}${v.priceUnit}. Durasi: ${v.duration}.${v.minPurchase ? ` Pembelian minimal: ${v.minPurchase}.` : ""}`
            )
            .join("\n")
      );
    }

    // FAQ
    if (faqs.status === "fulfilled" && faqs.value?.length) {
      contextParts.push(
        "FAQ (PERTANYAAN & JAWABAN):\n" +
          faqs.value.map((f) => `Q: ${f.question}\nA: ${f.answer}`).join("\n\n")
      );
    }

    // Logika pengaturan situs (jika cocok dengan kueri alamat, CS, profil umum, formulir, kontrak, atau dokumen)
    if (
      settings.status === "fulfilled" &&
      settings.value &&
      query.toLowerCase().match(/kontak|alamat|lokasi|cs|nomor|bantuan|email|jam|operasional|profil|tentang|perusahaan|kantor|formulir|pendaftaran|kontrak|dokumen|syarat/)
    ) {
      const s = settings.value;
      contextParts.push(
        `INFORMASI KONTAK & KANTOR JMCNET:\n` +
          `- Perusahaan: ${s.companyName} (${s.brandName})\n` +
          `- Tagline: ${s.tagline}\n` +
          `- Alamat: ${s.address}\n` +
          `- Email: ${s.email}\n` +
          `- Jam Operasional: ${s.operationalHours}\n` +
          `- WhatsApp CS 1: ${s.whatsappCs1}\n` +
          `- WhatsApp CS 2: ${s.whatsappCs2}\n` +
          `- Hero Headline: ${s.heroHeadline}\n` +
          `- Tentang Kami: ${s.aboutDescription}` +
          (s.registrationForm ? `\n- URL Unduh Formulir Pendaftaran (PDF): ${s.registrationForm}` : "") +
          (s.serviceContract ? `\n- URL Unduh Kontrak Berlangganan (DOCX): ${s.serviceContract}` : "")
      );
    }

    return contextParts.join("\n\n");
  },

  /**
   * Ekstraksi kata kunci yang sederhana
   */
  extractKeywords(query: string): string {
    const fillers = [
      "siapa",
      "apa",
      "bagaimana",
      "dimana",
      "kapan",
      "adalah",
      "yang",
      "di",
      "ke",
      "dari",
      "ada",
      "itu",
      "tahu",
      "kasih",
      "tolong",
      "tampilkan",
      "jelaskan",
      "sebutkan",
      "info",
      "saya",
      "mau",
      "ingin",
      "tanya",
    ];
    let keywords = query.toLowerCase();
    fillers.forEach((f) => {
      keywords = keywords.replace(new RegExp(`\\b${f}\\b`, "g"), "");
    });
    return keywords.trim() || query;
  },
};
