import { HttpGet, HttpPost, HttpPut, HttpDelete } from "@/lib/http/http"
import { Discount, CreateDiscountDTO, UpdateDiscountDTO } from "../types/discountTypes"

export const getAllDiscountApi = async (params: any = {}): Promise<{ data: Discount[], total: number, page: number, perPage: number }> => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            query.append(key, String(value));
        }
    });

    const result = await HttpGet(`discount/all?${query.toString()}`);
    return result;
}

export const editDiscountApi = async (id: number, payload: UpdateDiscountDTO) => {
    const data = await HttpPut(`discount/${id}`, payload)
    return data
}

export const deleteDiscountApi = async (id: number) => {
    const data = await HttpDelete(`discount/${id}`)
    return data
}

export const createDiscountApi = async (payload: CreateDiscountDTO) => {
    const data = await HttpPost(`discount/new`, payload)
    return data
}