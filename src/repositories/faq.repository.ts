import { db } from "../utils/prisma";

export const faqRepository = {
  async findMany() {
    return db.faq.findMany({
      orderBy: { id: "asc" },
    });
  },

  async findById(id: number) {
    return db.faq.findUnique({
      where: { id },
    });
  },

  async create(data: { question: string; answer: string }) {
    return db.faq.create({
      data,
    });
  },

  async update(id: number, data: { question?: string; answer?: string }) {
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
