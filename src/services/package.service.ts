import { packageRepository } from "../repositories/package.repository";
import { NotFoundException } from "../exceptions/NotFoundException";
import { parseJsonField, stringifyJsonField } from "../utils/file";
import { CreatePackageInput, UpdatePackageInput } from "../validator/package.validator";

const formatPackageResponse = (pkg: any) => {
  if (!pkg) return null;
  return {
    id: pkg.id,
    name: pkg.name,
    tierLabel: pkg.tierLabel,
    tierNumber: pkg.tierNumber,
    description: pkg.description,
    speedMbps: pkg.speedMbps,
    priceMonthly: pkg.priceMonthly,
    activationFee: pkg.activationFee,
    features: parseJsonField<Array<{ text: string; included: boolean }>>(pkg.features, []),
    isFeatured: pkg.isFeatured,
    createdAt: pkg.createdAt,
    updatedAt: pkg.updatedAt,
  };
};

export const packageService = {
  async getAll() {
    const packages = await packageRepository.findMany();
    return packages.map(formatPackageResponse);
  },

  async getById(id: number) {
    const pkg = await packageRepository.findById(id);
    if (!pkg) {
      throw new NotFoundException(`Package with ID ${id} not found`);
    }
    return formatPackageResponse(pkg);
  },

  async create(input: CreatePackageInput) {
    const featuresStr = stringifyJsonField(input.features);
    const pkg = await packageRepository.create({
      ...input,
      features: featuresStr,
    });
    return formatPackageResponse(pkg);
  },

  async update(id: number, input: UpdatePackageInput) {
    const existing = await packageRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Package with ID ${id} not found`);
    }

    const data: any = { ...input };
    if (input.features !== undefined) {
      data.features = stringifyJsonField(input.features);
    }

    const updated = await packageRepository.update(id, data);
    return formatPackageResponse(updated);
  },

  async delete(id: number) {
    const existing = await packageRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Package with ID ${id} not found`);
    }
    await packageRepository.delete(id);
    return null;
  },
};
export type PackageService = typeof packageService;
