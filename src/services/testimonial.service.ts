import { testimonialRepository } from "../repositories/testimonial.repository";
import { NotFoundException } from "../exceptions/NotFoundException";
import { CreateTestimonialInput, UpdateTestimonialInput } from "../validator/testimonial.validator";

export const testimonialService = {
  async getAll() {
    return testimonialRepository.findMany();
  },

  async getById(id: number) {
    const testimonial = await testimonialRepository.findById(id);
    if (!testimonial) {
      throw new NotFoundException(`Testimonial with ID ${id} not found`);
    }
    return testimonial;
  },

  async create(input: CreateTestimonialInput) {
    return testimonialRepository.create(input);
  },

  async update(id: number, input: UpdateTestimonialInput) {
    const existing = await testimonialRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Testimonial with ID ${id} not found`);
    }
    return testimonialRepository.update(id, input);
  },

  async delete(id: number) {
    const existing = await testimonialRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Testimonial with ID ${id} not found`);
    }
    await testimonialRepository.delete(id);
    return null;
  },
};
export type TestimonialService = typeof testimonialService;
