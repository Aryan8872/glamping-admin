import { HttpGet, HttpPatch } from "@/lib/http/http"
import { Discount } from "../types/discountTypes"

export const getAllDiscountApi = async (): Promise<Discount[]> => {
    const result = await HttpGet(`discount/all`)
    return result.data
}


export const editDiscountApi = async (id: number) => {
    const data = await HttpPatch(`discount/${id}`)
    return data
}

export const deleteDiscountApi = async (id: number) => {
    const data = await HttpPatch(`discount/${id}`)
    return data
}

export const createDiscountApi = async (payload: Discount) => {
    const data = await HttpPatch(`discount/new`, payload)
    return data
}