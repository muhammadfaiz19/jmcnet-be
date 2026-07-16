import { db } from "../utils/prisma";

export const voucherPlanRepository = {
  async findMany(filters?: { type?: string }) {
    const where: any = {};
    if (filters?.type) {
      where.type = filters.type;
    }
    return db.voucherPlan.findMany({
      where,
      orderBy: { id: "asc" },
      include: { category: true },
    });
  },

  async findById(id: number) {
    return db.voucherPlan.findUnique({
      where: { id },
      include: { category: true },
    });
  },

  async create(data: {
    categoryId?: number | null;
    name: string;
    type: string;
    tagLabel: string;
    price: number;
    priceUnit: string;
    duration: string;
    minPurchase?: string | null;
    features: string;
  }) {
    return db.voucherPlan.create({
      data,
    });
  },

  async update(id: number, data: {
    categoryId?: number | null;
    name?: string;
    type?: string;
    tagLabel?: string;
    price?: number;
    priceUnit?: string;
    duration?: string;
    minPurchase?: string | null;
    features?: string;
  }) {
    return db.voucherPlan.update({
      where: { id },
      data,
    });
  },

  async delete(id: number) {
    return db.voucherPlan.delete({
      where: { id },
    });
  },
};
export type VoucherPlanRepository = typeof voucherPlanRepository;
