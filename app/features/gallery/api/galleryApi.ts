import { HttpGet, HttpPatch, HttpPost, HttpPut, HttpDelete } from "@/lib/http/http"
import { Gallery, GALLERY_BY_SLUG, GALLERY_KEY } from "../types/galleryTypes"


export async function apiGetAllGallery(): Promise<Gallery[]> {
    const res = await HttpGet(`gallery/all`, {
        next: {
            tags: [GALLERY_KEY]
        }
    })
    return res.data
}

export async function apiGetGalleryBySlug(slug: string): Promise<Gallery> {
    const tag = GALLERY_BY_SLUG(slug)
    const res = await HttpGet(`gallery/${slug}`, { next: { tags: [tag] } });
    return res.data;
}

export async function apiCreateGallery(payload: FormData) {
    const res = await HttpPost("gallery/new", payload);
    return res.data;
}

export async function apiUpdateGallery(slug: string, payload: FormData) {
    console.log("update gallery", slug, payload)
    const res = await HttpPut(`gallery/${slug}`, payload);
    return res.data;
}

export async function apiDeleteGallery(galleryId: number) {
    const res = await HttpDelete(`gallery/${galleryId}`);
    return res.data;
}
