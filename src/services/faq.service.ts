import { faqRepository } from "../repositories/faq.repository";
import { NotFoundException } from "../exceptions/NotFoundException";
import { CreateFaqInput, UpdateFaqInput } from "../validator/faq.validator";

export const faqService = {
  async getAll() {
    return faqRepository.findMany();
  },

  async getById(id: number) {
    const faq = await faqRepository.findById(id);
    if (!faq) {
      throw new NotFoundException(`FAQ with ID ${id} not found`);
    }
    return faq;
  },

  async create(input: CreateFaqInput) {
    return faqRepository.create(input);
  },

  async update(id: number, input: UpdateFaqInput) {
    const existing = await faqRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`FAQ with ID ${id} not found`);
    }
    return faqRepository.update(id, input);
  },

  async delete(id: number) {
    const existing = await faqRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`FAQ with ID ${id} not found`);
    }
    await faqRepository.delete(id);
    return null;
  },
};
export type FaqService = typeof faqService;
