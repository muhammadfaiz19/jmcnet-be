import { adminRepository } from "../repositories/admin.repository";
import { NotFoundException } from "../exceptions/NotFoundException";

export const adminService = {
  async getById(id: string) {
    const admin = await adminRepository.getById(id);
    if (!admin) {
      throw new NotFoundException("Admin not found");
    }
    const { password, ...adminInfo } = admin;
    return adminInfo;
  },
};
