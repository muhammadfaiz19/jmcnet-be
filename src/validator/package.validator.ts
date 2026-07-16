import z from "zod";

export const CreatePackageSchema = z.object({
  body: z.object({
    categoryId: z.coerce.number().int().positive().optional().nullable(),
    name: z.string().min(1, "Name is required"),
    tierLabel: z.string().min(1, "Tier label is required"),
    tierNumber: z.string().min(1, "Tier number is required"),
    description: z.string().min(1, "Description is required"),
    speedMbps: z.coerce.number().int().positive("Speed must be a positive integer"),
    priceMonthly: z.coerce.number().int().positive("Price must be a positive integer"),
    activationFee: z.coerce.number().int().default(150000),
    features: z.union([
      z.string(),
      z.array(
        z.object({
          text: z.string(),
          included: z.boolean(),
        })
      ),
    ]),
    isFeatured: z.preprocess((val) => val === "true" || val === true, z.boolean()).default(false),
  }),
});

export const UpdatePackageSchema = z.object({
  body: CreatePackageSchema.shape.body.partial(),
});

export type CreatePackageInput = z.infer<typeof CreatePackageSchema>["body"];
export type UpdatePackageInput = z.infer<typeof UpdatePackageSchema>["body"];
