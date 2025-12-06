import { apiWrapper } from "@/lib/apiWrapper";
import { createDiscountApi, deleteDiscountApi, editDiscountApi, getAllDiscountApi } from "../api/discountApi";
import { CreateDiscountDTO, DISCOUNT_API_KEY, UpdateDiscountDTO } from "../types/discountTypes";

export const fetchDiscounts = async () => {
    return apiWrapper(DISCOUNT_API_KEY, getAllDiscountApi);
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