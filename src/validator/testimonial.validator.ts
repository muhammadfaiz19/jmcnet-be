import z from "zod";

export const CreateTestimonialSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required"),
    role: z.string().min(1, "Role is required"),
    quote: z.string().min(1, "Quote is required"),
  }),
});

export const UpdateTestimonialSchema = z.object({
  body: CreateTestimonialSchema.shape.body.partial(),
});

export type CreateTestimonialInput = z.infer<typeof CreateTestimonialSchema>["body"];
export type UpdateTestimonialInput = z.infer<typeof UpdateTestimonialSchema>["body"];
