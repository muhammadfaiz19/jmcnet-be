import { db } from "../utils/prisma";

export const packageRepository = {
  async findMany() {
    return db.package.findMany({
      orderBy: { id: "asc" },
    });
  },

  async findById(id: number) {
    return db.package.findUnique({
      where: { id },
    });
  },

  async create(data: {
    name: string;
    tierLabel: string;
    tierNumber: string;
    description: string;
    speedMbps: number;
    priceMonthly: number;
    activationFee: number;
    features: string;
    isFeatured: boolean;
  }) {
    return db.package.create({
      data,
    });
  },

  async update(id: number, data: {
    name?: string;
    tierLabel?: string;
    tierNumber?: string;
    description?: string;
    speedMbps?: number;
    priceMonthly?: number;
    activationFee?: number;
    features?: string;
    isFeatured?: boolean;
  }) {
    return db.package.update({
      where: { id },
      data,
    });
  },

  async delete(id: number) {
    return db.package.delete({
      where: { id },
    });
  },
};
export type PackageRepository = typeof packageRepository;
