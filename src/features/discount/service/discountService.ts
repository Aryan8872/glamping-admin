import { apiWrapper } from "@/lib/apiWrapper";
import { createDiscountApi, deleteDiscountApi, editDiscountApi, getAllDiscountApi } from "../api/discountApi";
import { Discount, CreateDiscountDTO, DISCOUNT_API_KEY, UpdateDiscountDTO } from "../types/discountTypes";

export const fetchDiscounts = async (params: any = {}): Promise<{ data: Discount[], total: number, page: number, perPage: number }> => {
    return await getAllDiscountApi(params);
};

export const createDiscount = async (data: CreateDiscountDTO) => {
    return apiWrapper(DISCOUNT_API_KEY, () => createDiscountApi(data));
};

export const updateDiscount = async (id: number, data: UpdateDiscountDTO) => {
    return apiWrapper(DISCOUNT_API_KEY, () => editDiscountApi(id, data));
};

export const deleteDiscount = async (id: number) => {
    return apiWrapper(DISCOUNT_API_KEY, () => deleteDiscountApi(id));
};