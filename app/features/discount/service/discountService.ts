"use server"

import { createDiscountApi, deleteDiscountApi, editDiscountApi, getAllDiscountApi } from "../api/discountApi"
import { Discount, DISCOUNT_API_KEY } from "../types/discountTypes"
import { apiWrapper } from "@/lib/apiWrapper"

export const getAllDiscount = async () => {
    const data = await apiWrapper(DISCOUNT_API_KEY,()=>getAllDiscountApi())    
    return data
}

export const editDiscount = async (id: number) => {
    const data = await editDiscountApi(id)
    return data
}

export const deleteDiscount = async (id: number) => {
    const data = await deleteDiscountApi(id)
    return data
}

export const createDiscount = async (payload: Discount) => {
    const data = await createDiscountApi(payload)
    return data
}