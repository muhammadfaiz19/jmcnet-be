import { Request, Response, NextFunction } from "express";
import { siteSettingsService } from "../services/siteSettings.service";
import { ResponseHTTP } from "../utils/response";

export const siteSettingsController = {
  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await siteSettingsService.get();
      return res.status(200).json(ResponseHTTP.ok(result, "Site Settings retrieved"));
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
      const logoFile = files?.logo?.[0];
      const registrationFormFile = files?.registrationForm?.[0];
      const serviceContractFile = files?.serviceContract?.[0];

      const result = await siteSettingsService.update(
        req.body,
        logoFile,
        registrationFormFile,
        serviceContractFile
      );
      return res.status(200).json(ResponseHTTP.ok(result, "Site Settings updated successfully"));
    } catch (err) {
      next(err);
    }
  },
};
