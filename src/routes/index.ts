import { Router } from "express";
import { authRouter } from "./auth.route";
import { packageRouter } from "./package.route";
import { voucherPlanRouter } from "./voucherPlan.route";
import { faqRouter } from "./faq.route";
import { testimonialRouter } from "./testimonial.route";
import { siteSettingsRouter } from "./siteSettings.route";
import { chatbotRouter } from "./chatbot.route";
import { serviceCategoryRouter } from "./serviceCategory.route";

const router = Router();

router.use("/auth", authRouter);
router.use("/packages", packageRouter);
router.use("/voucher-plans", voucherPlanRouter);
router.use("/faqs", faqRouter);
router.use("/testimonials", testimonialRouter);
router.use("/settings", siteSettingsRouter);
router.use("/chatbot", chatbotRouter);
router.use("/service-categories", serviceCategoryRouter);

export default router;
