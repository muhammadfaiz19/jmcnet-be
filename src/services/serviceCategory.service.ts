import { serviceCategoryRepository } from "../repositories/serviceCategory.repository";
import { NotFoundException } from "../exceptions/NotFoundException";
import { BadRequestException } from "../exceptions/BadRequestException";
import { CreateServiceCategoryInput, UpdateServiceCategoryInput } from "../validator/serviceCategory.validator";

export const serviceCategoryService = {
  async getAll() {
    return serviceCategoryRepository.findMany();
  },

  async getById(id: number) {
    const category = await serviceCategoryRepository.findById(id);
    if (!category) {
      throw new NotFoundException(`Service Category with ID ${id} not found`);
    }
    return category;
  },

  async create(input: CreateServiceCategoryInput) {
    const existing = await serviceCategoryRepository.findBySlug(input.slug);
    if (existing) {
      throw new BadRequestException(`Category with slug '${input.slug}' already exists`);
    }
    return serviceCategoryRepository.create(input);
  },

  async update(id: number, input: UpdateServiceCategoryInput) {
    const existing = await serviceCategoryRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Service Category with ID ${id} not found`);
    }

    if (input.slug) {
      const duplicate = await serviceCategoryRepository.findBySlug(input.slug);
      if (duplicate && duplicate.id !== id) {
        throw new BadRequestException(`Category with slug '${input.slug}' already exists`);
      }
    }

    return serviceCategoryRepository.update(id, input);
  },

  async delete(id: number) {
    const existing = await serviceCategoryRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Service Category with ID ${id} not found`);
    }
    await serviceCategoryRepository.delete(id);
    return null;
  },
};
export type ServiceCategoryService = typeof serviceCategoryService;
