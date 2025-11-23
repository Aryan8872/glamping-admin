"use server"
import { revalidateTag } from "next/cache";
import { ABOUT_US_TAG, AboutUs, AboutUsSchema, Stat } from "../types/AboutUsTypes";
import { apiCreateAboutUs, apiDeleteStats, apiGetAboutUs, apiUpdateAboutUs, apiUpdateStats } from "../api/aboutUsApi";

export async function getAboutUsContent(): Promise<AboutUs> {
    const items = await apiGetAboutUs();
    const parsed = AboutUsSchema.safeParse(items);
    if (!parsed.success) {
        console.log(parsed.error)
        throw new Error("failed to parse")
    }
    return parsed.data
}

export async function updateStats(id: number, data: Partial<Stat>) {
    return await apiUpdateStats(id, data)
}
export async function deleteStats(id: number) {
    await apiDeleteStats(id)
    revalidateTag(ABOUT_US_TAG, "max")

}
export async function createAboutUs(data: Partial<AboutUs>) {
    const parsed = AboutUsSchema.safeParse(data);
    if (!parsed.success) {
        console.log(parsed.error)
        throw new Error("failed to parse")
    }
    return await apiCreateAboutUs(parsed.data);
}

export async function updateUser(data: Partial<AboutUs>) {
    const parsed = AboutUsSchema.safeParse(data);
    if (!parsed.success) {
        console.log(parsed.error)
        throw new Error("failed to parse")
    }
    const result = await apiUpdateAboutUs(parsed.data);
    revalidateTag(ABOUT_US_TAG, "max")
    return result
}

// export async function deleteUser(id: number) {
//   return await apiDeletEu(id);
// }
