import z from "zod";

export const CreateServiceCategorySchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required").max(100),
    slug: z.string().min(1, "Slug is required").max(100),
    description: z.string().max(255).optional().nullable(),
  }),
});

export const UpdateServiceCategorySchema = z.object({
  body: CreateServiceCategorySchema.shape.body.partial(),
});

export type CreateServiceCategoryInput = z.infer<typeof CreateServiceCategorySchema>["body"];
export type UpdateServiceCategoryInput = z.infer<typeof UpdateServiceCategorySchema>["body"];
