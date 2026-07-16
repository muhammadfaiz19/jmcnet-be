import z from "zod";

export const CreateFaqSchema = z.object({
  body: z.object({
    categoryId: z.coerce.number().int().positive().optional().nullable(),
    question: z.string().min(1, "Question is required"),
    answer: z.string().min(1, "Answer is required"),
  }),
});

export const UpdateFaqSchema = z.object({
  body: CreateFaqSchema.shape.body.partial(),
});

export type CreateFaqInput = z.infer<typeof CreateFaqSchema>["body"];
export type UpdateFaqInput = z.infer<typeof UpdateFaqSchema>["body"];
