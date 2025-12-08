"use server";

import { revalidateTag } from "next/cache";
import * as experienceApi from "../api/experienceApi";

const EXPERIENCE_TAG = "experiences";

export async function getAllExperiences() {
    return await experienceApi.apiGetAllExperiences();
}

export async function getExperienceById(id: number) {
    return await experienceApi.apiGetExperienceById(id);
}

export async function createExperience(data: FormData) {
    const res = await experienceApi.apiCreateExperience(data);
    revalidateTag(EXPERIENCE_TAG, "max");
    return res;
}

export async function updateExperience(id: number, data: FormData) {
    const res = await experienceApi.apiUpdateExperience(id, data);
    revalidateTag(EXPERIENCE_TAG, "max");
    return res;
}

export async function deleteExperience(id: number) {
    const res = await experienceApi.apiDeleteExperience(id);
    revalidateTag(EXPERIENCE_TAG, "max");
    return res;
}
