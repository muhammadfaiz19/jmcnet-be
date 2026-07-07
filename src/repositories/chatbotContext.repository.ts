import { db } from "../utils/prisma";

function formatSection(title: string, data: unknown) {
  return `${title}:\n${JSON.stringify(data, null, 2)}`;
}

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
          id: true,
          name: true,
          tierLabel: true,
          tierNumber: true,
          description: true,
          speedMbps: true,
          priceMonthly: true,
          activationFee: true,
          features: true,
          isFeatured: true,
        },
      }),
      db.voucherPlan.findMany({
        select: {
          id: true,
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

    const sections = [
      formatSection("PACKAGES", packages),
      formatSection("VOUCHER PLANS", voucherPlans),
      formatSection("SITE CONFIGURATION & CONTACT INFO", siteSettings),
      formatSection("FREQUENTLY ASKED QUESTIONS (FAQ)", faqs),
    ];

    return sections.join("\n\n");
  },
};
export type ChatbotContextRepository = typeof chatbotContextRepository;
