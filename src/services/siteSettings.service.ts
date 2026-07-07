import { siteSettingsRepository } from "../repositories/siteSettings.repository";
import { NotFoundException } from "../exceptions/NotFoundException";
import { saveUploadedFile, deleteUploadedFile } from "../utils/file";
import { UpdateSiteSettingsInput } from "../validator/siteSettings.validator";

export const siteSettingsService = {
  async get() {
    const settings = await siteSettingsRepository.findFirst();
    if (!settings) {
      throw new NotFoundException("Site Settings not initialized. Please run seeds first.");
    }
    return settings;
  },

  async update(
    input: UpdateSiteSettingsInput,
    logoFile?: Express.Multer.File,
    registrationFormFile?: Express.Multer.File,
    serviceContractFile?: Express.Multer.File
  ) {
    const settings = await siteSettingsRepository.findFirst();
    if (!settings) {
      throw new NotFoundException("Site Settings not found");
    }

    const dataToUpdate: any = { ...input };

    if (logoFile) {
      // Simpan file logo baru
      const uploaded = await saveUploadedFile(logoFile);
      dataToUpdate.logo = uploaded.url;

      // Hapus file logo lama jika ada
      if (settings.logo && !settings.logo.startsWith("/logo")) {
        deleteUploadedFile(settings.logo);
      }
    }

    if (registrationFormFile) {
      // Simpan file formulir pendaftaran baru
      const uploaded = await saveUploadedFile(registrationFormFile);
      dataToUpdate.registrationForm = uploaded.url;

      // Hapus file formulir lama jika ada
      if (settings.registrationForm) {
        deleteUploadedFile(settings.registrationForm);
      }
    }

    if (serviceContractFile) {
      // Simpan file kontrak berlangganan baru
      const uploaded = await saveUploadedFile(serviceContractFile);
      dataToUpdate.serviceContract = uploaded.url;

      // Hapus file kontrak lama jika ada
      if (settings.serviceContract) {
        deleteUploadedFile(settings.serviceContract);
      }
    }

    return siteSettingsRepository.update(settings.id, dataToUpdate);
  },
};
export type SiteSettingsService = typeof siteSettingsService;
