import { db } from "../utils/prisma";

export const testimonialRepository = {
  async findMany() {
    return db.testimonial.findMany({
      orderBy: { id: "asc" },
    });
  },

  async findById(id: number) {
    return db.testimonial.findUnique({
      where: { id },
    });
  },

  async create(data: { name: string; role: string; quote: string }) {
    return db.testimonial.create({
      data,
    });
  },

  async update(id: number, data: { name?: string; role?: string; quote?: string }) {
    return db.testimonial.update({
      where: { id },
      data,
    });
  },

  async delete(id: number) {
    return db.testimonial.delete({
      where: { id },
    });
  },
};
export type TestimonialRepository = typeof testimonialRepository;
