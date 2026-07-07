import { adminRepository } from "../repositories/admin.repository";
import { BadRequestException } from "../exceptions/BadRequestException";
import { comparePassword } from "../utils/password";
import { generateToken } from "../utils/jwt";
import { LoginInput } from "../validator/auth.validator";

export const authService = {
  async loginWithEmail(input: LoginInput) {
    const admin = await adminRepository.getByEmail(input.email);
    if (!admin) {
      throw new BadRequestException("Invalid email or password");
    }

    const isMatch = await comparePassword(input.password, admin.password);
    if (!isMatch) {
      throw new BadRequestException("Invalid email or password");
    }

    const token = generateToken({ id: admin.id, email: admin.email });
    const { password, ...adminInfo } = admin;

    return { admin: adminInfo, token };
  },
};
