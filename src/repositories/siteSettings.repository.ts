import { db } from "../utils/prisma";

export const siteSettingsRepository = {
  async findFirst() {
    return db.siteSettings.findFirst();
  },

  async update(id: number, data: {
    companyName?: string;
    brandName?: string;
    logo?: string | null;
    tagline?: string;
    whatsappCs1?: string;
    whatsappCs2?: string;
    email?: string;
    address?: string;
    operationalHours?: string;
    heroHeadline?: string;
    heroSubtext?: string;
    aboutTitle?: string;
    aboutDescription?: string;
  }) {
    return db.siteSettings.update({
      where: { id },
      data,
    });
  },
};
export type SiteSettingsRepository = typeof siteSettingsRepository;
