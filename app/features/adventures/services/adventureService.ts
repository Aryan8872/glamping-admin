"use server";

import { revalidateTag } from "next/cache";
import * as adventureApi from "../api/adventureApi";
import { CreateAdventureValues, UpdateAdventureValues } from "../types/adventureTypes";

const ADVENTURE_TAG = "adventures";

export async function getAllAdventures(includeInactive = false) {
    return await adventureApi.apiGetAllAdventures(includeInactive);
}

export async function getAdventureById(id: number) {
    return await adventureApi.apiGetAdventureById(id);
}

export async function getAdventureBySlug(slug: string) {
    return await adventureApi.apiGetAdventureBySlug(slug);
}

export async function createAdventure(data: FormData) {
    const res = await adventureApi.apiCreateAdventure(data);
    revalidateTag(ADVENTURE_TAG, "max");
    return res;
}

export async function updateAdventure(id: number, data: FormData) {
    const res = await adventureApi.apiUpdateAdventure(id, data);
    revalidateTag(ADVENTURE_TAG, "max");
    return res;
}

export async function deleteAdventure(id: number) {
    const res = await adventureApi.apiDeleteAdventure(id);
    revalidateTag(ADVENTURE_TAG, "max");
    return res;
}

export async function assignAdventuresToCamp(campId: number, adventureIds: number[]) {
    const res = await adventureApi.apiAssignAdventuresToCamp(campId, adventureIds);
    revalidateTag(ADVENTURE_TAG, "max");
    revalidateTag("camps", "max");
    return res;
}
