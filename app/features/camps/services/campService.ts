"use server"
import { revalidateTag } from "next/cache";
import {
    apiCreateCamp,
    apiDeleteCamp,
    apiGetAllCamps,
    apiGetCampById,
    apiUpdateCamp,
} from "../api/campApi";
import { CAMPS_KEY } from "../types/campTypes";


export async function getAllCamps() {
    return await apiGetAllCamps();
}

export async function getCampById(id: number) {
    return await apiGetCampById(id);
}

export async function createCamp(data: FormData) {
    const res = await apiCreateCamp(data);
    revalidateTag(CAMPS_KEY,"max");
    return res;
}

export async function updateCamp(id: number, data: FormData) {
    const res = await apiUpdateCamp(id, data);
    revalidateTag(CAMPS_KEY,"max");
    return res;
}

export async function deleteCamp(id: number) {
    const res = await apiDeleteCamp(id);
    revalidateTag(CAMPS_KEY,"max");
    return res;
}
