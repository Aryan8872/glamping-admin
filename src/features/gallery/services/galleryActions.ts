"use server"
import { revalidateTag } from "next/cache";
import { apiCreateGallery, apiDeleteGallery, apiUpdateGallery } from "../api/galleryApi";
import { GALLERY_BY_SLUG, GALLERY_KEY } from "../types/galleryTypes";

export async function createGallery(data: FormData) {
    const result = await apiCreateGallery(data);
    revalidateTag(GALLERY_KEY, "max");
    return result;
}

export async function updateGallery(slug: string, data: FormData) {
    const result = await apiUpdateGallery(slug, data);
    revalidateTag(GALLERY_BY_SLUG(slug), "max");
    revalidateTag(GALLERY_KEY, "max");
    return result;
}

export async function deleteGallery(galleryId: number) {
    const result = await apiDeleteGallery(galleryId);
    revalidateTag(GALLERY_KEY, "max");
    return result;
}
