import { db } from "../utils/prisma";

export const adminRepository = {
  async getByEmail(email: string) {
    return db.admin.findUnique({
      where: { email },
    });
  },

  async getById(id: string) {
    return db.admin.findUnique({
      where: { id },
    });
  },
};
export type AdminRepository = typeof adminRepository;
