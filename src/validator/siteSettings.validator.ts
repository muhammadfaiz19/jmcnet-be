import z from "zod";

export const UpdateSiteSettingsSchema = z.object({
  body: z.object({
    companyName: z.string().optional(),
    brandName: z.string().optional(),
    tagline: z.string().optional(),
    whatsappCs1: z.string().optional(),
    whatsappCs2: z.string().optional(),
    email: z.string().email("Invalid email format").optional(),
    address: z.string().optional(),
    operationalHours: z.string().optional(),
    heroHeadline: z.string().optional(),
    heroSubtext: z.string().optional(),
    aboutTitle: z.string().optional(),
    aboutDescription: z.string().optional(),
    registrationForm: z.string().optional(),
    serviceContract: z.string().optional(),
  }),
});

export type UpdateSiteSettingsInput = z.infer<typeof UpdateSiteSettingsSchema>["body"];
