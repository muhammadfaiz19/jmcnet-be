import { db } from "../utils/prisma";

export const serviceCategoryRepository = {
  async findMany() {
    return db.serviceCategory.findMany({
      orderBy: { id: "asc" },
      include: {
        _count: {
          select: { packages: true, voucherPlans: true, faqs: true },
        },
      },
    });
  },

  async findById(id: number) {
    return db.serviceCategory.findUnique({
      where: { id },
      include: {
        packages: true,
        voucherPlans: true,
        faqs: true,
      },
    });
  },

  async findBySlug(slug: string) {
    return db.serviceCategory.findUnique({
      where: { slug },
    });
  },

  async create(data: { name: string; slug: string; description?: string | null }) {
    return db.serviceCategory.create({
      data,
    });
  },

  async update(id: number, data: { name?: string; slug?: string; description?: string | null }) {
    return db.serviceCategory.update({
      where: { id },
      data,
    });
  },

  async delete(id: number) {
    return db.serviceCategory.delete({
      where: { id },
    });
  },
};
export type ServiceCategoryRepository = typeof serviceCategoryRepository;
