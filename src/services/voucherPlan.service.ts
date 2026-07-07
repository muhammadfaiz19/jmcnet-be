import { voucherPlanRepository } from "../repositories/voucherPlan.repository";
import { NotFoundException } from "../exceptions/NotFoundException";
import { parseJsonField, stringifyJsonField } from "../utils/file";
import { CreateVoucherPlanInput, UpdateVoucherPlanInput } from "../validator/voucherPlan.validator";

const formatVoucherPlanResponse = (plan: any) => {
  if (!plan) return null;
  return {
    id: plan.id,
    name: plan.name,
    type: plan.type,
    tagLabel: plan.tagLabel,
    price: plan.price,
    priceUnit: plan.priceUnit,
    duration: plan.duration,
    minPurchase: plan.minPurchase || null,
    features: parseJsonField<string[]>(plan.features, []),
    createdAt: plan.createdAt,
    updatedAt: plan.updatedAt,
  };
};

export const voucherPlanService = {
  async getAll(filters?: { type?: string }) {
    const plans = await voucherPlanRepository.findMany(filters);
    return plans.map(formatVoucherPlanResponse);
  },

  async getById(id: number) {
    const plan = await voucherPlanRepository.findById(id);
    if (!plan) {
      throw new NotFoundException(`Voucher plan with ID ${id} not found`);
    }
    return formatVoucherPlanResponse(plan);
  },

  async create(input: CreateVoucherPlanInput) {
    const featuresStr = stringifyJsonField(input.features);
    const plan = await voucherPlanRepository.create({
      ...input,
      features: featuresStr,
    });
    return formatVoucherPlanResponse(plan);
  },

  async update(id: number, input: UpdateVoucherPlanInput) {
    const existing = await voucherPlanRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Voucher plan with ID ${id} not found`);
    }

    const data: any = { ...input };
    if (input.features !== undefined) {
      data.features = stringifyJsonField(input.features);
    }

    const updated = await voucherPlanRepository.update(id, data);
    return formatVoucherPlanResponse(updated);
  },

  async delete(id: number) {
    const existing = await voucherPlanRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Voucher plan with ID ${id} not found`);
    }
    await voucherPlanRepository.delete(id);
    return null;
  },
};
export type VoucherPlanService = typeof voucherPlanService;
