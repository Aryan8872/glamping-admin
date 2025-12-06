import { HttpGet, HttpPost, HttpPut, HttpDelete } from "@/lib/http/http"
import { Discount, CreateDiscountDTO, UpdateDiscountDTO } from "../types/discountTypes"

export const getAllDiscountApi = async (): Promise<Discount[]> => {
    const result = await HttpGet(`discount/all`)
    return result.data
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