import z from "zod";

export const CreateVoucherPlanSchema = z.object({
  body: z.object({
    categoryId: z.coerce.number().int().positive().optional().nullable(),
    name: z.string().min(1, "Name is required"),
    type: z.enum(["retail", "reseller"]),
    tagLabel: z.string().min(1, "Tag label is required"),
    price: z.coerce.number().int().positive("Price must be a positive integer"),
    priceUnit: z.string().min(1, "Price unit is required"),
    duration: z.string().min(1, "Duration is required"),
    minPurchase: z.string().nullable().optional(),
    features: z.union([z.string(), z.array(z.string())]),
  }),
});

export const UpdateVoucherPlanSchema = z.object({
  body: CreateVoucherPlanSchema.shape.body.partial(),
});

export type CreateVoucherPlanInput = z.infer<typeof CreateVoucherPlanSchema>["body"];
export type UpdateVoucherPlanInput = z.infer<typeof UpdateVoucherPlanSchema>["body"];
