import { db } from "../utils/prisma";

export const faqRepository = {
  async findMany() {
    return db.faq.findMany({
      orderBy: { id: "asc" },
      include: { category: true },
    });
  },

  async findById(id: number) {
    return db.faq.findUnique({
      where: { id },
      include: { category: true },
    });
  },

  async create(data: { categoryId?: number | null; question: string; answer: string }) {
    return db.faq.create({
      data,
    });
  },

  async update(id: number, data: { categoryId?: number | null; question?: string; answer?: string }) {
    return db.faq.update({
      where: { id },
      data,
    });
  },

  async delete(id: number) {
    return db.faq.delete({
      where: { id },
    });
  },
};
export type FaqRepository = typeof faqRepository;
